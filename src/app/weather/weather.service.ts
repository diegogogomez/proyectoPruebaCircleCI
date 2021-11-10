import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ICurrentWeather, ICurrentWeatherData} from "../interfaces";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements IWeatherService {

  constructor( private httpClient: HttpClient ) { }

  getCurrentWeather (city: string, country: string): Observable<ICurrentWeather> {

    const uriParams = new HttpParams().set('q', `${ city }, ${ country }`).set('appid', environment.appId)

    return this.httpClient.get<ICurrentWeatherData>(
      `${ environment.baseUrl }api.openweathermap.org/data/2.5/weather`, { params: uriParams })
      .pipe(map(data => this.transformToICurrentWeather(data)))

  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather{
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.convertKelvinToFarenheit(data.main.temp),
      description: data.weather[0].description
    };
  }


  private convertKelvinToFarenheit(kelvin: number): number {
    return kelvin * 9 / 5 - 459.67;
  }
}

export interface IWeatherService {
  getCurrentWeather(
    city: string,
    country: string
  ): Observable<ICurrentWeather>
}
