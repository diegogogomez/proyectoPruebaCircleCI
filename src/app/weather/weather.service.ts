import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ICurrentWeather, ICurrentWeatherData} from "../interfaces";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {map, switchMap} from 'rxjs/operators';
import {PostalCodeService} from "../postal-code/postal-code.service";

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements IWeatherService {

  readonly currentWeather$ =
    new BehaviorSubject<ICurrentWeather>({
      city: '--',
      country: '--',
      date: Date.now(),
      image: '',
      temperature: 0,
      description: '',
    })

  constructor( private httpClient: HttpClient,
               private postalCodeService: PostalCodeService ) { }

  /*getCurrentWeather (search: string | number, country?: string): Observable<ICurrentWeather> {

    let uriParams = new HttpParams();
    // const uriParams =
    if(typeof search === 'string') {
      uriParams = uriParams.set('q', country ? `${search},${country}` : search)
    } else {
      uriParams = uriParams.set('zip', 'search');
    }

    return this.getCurrentWeatherHelper(uriParams);

  }*/

  getCurrentWeather(
    searchText: string,
    country?: string
  ): Observable<ICurrentWeather> {
    return this.postalCodeService.
    resolvePostalCode(searchText)
      .pipe(
        switchMap((postalCode) => {
          if (postalCode) {
            return this.getCurrentWeatherByCoords({
              latitude: postalCode.lat,
              longitude: postalCode.lng,
            } as GeolocationCoordinates)
          } else {
            const uriParams = new HttpParams().set(
              'q',
              country ? `${searchText},${country}` : searchText
            )
            return this.getCurrentWeatherHelper(uriParams)
          }
        })
      )
  }

  private getCurrentWeatherHelper(uriParams: HttpParams):
    Observable<ICurrentWeather> {
    uriParams = uriParams.set('appid', environment.appId)
    return this.httpClient
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}api.openweathermap.org/data/2.5/weather`,
        { params: uriParams }
      )
      .pipe(map(data => this.transformToICurrentWeather(data)))
  }

  getCurrentWeatherByCoords(coords: GeolocationCoordinates): Observable<ICurrentWeather> {
    const uriParams = new HttpParams()
      .set('lat', coords.latitude.toString())
      .set('lon', coords.longitude.toString())
    return this.getCurrentWeatherHelper(uriParams)
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

  updateCurrentWeather(search: string,
                       country?: string): void {
    this.getCurrentWeather(search, country)
      .subscribe(weather =>
        this.currentWeather$.next(weather)
      )
  }

}

export interface IWeatherService {
  readonly currentWeather$: BehaviorSubject<ICurrentWeather>
  getCurrentWeather(city: string | number, country?: string):
    Observable<ICurrentWeather>
  getCurrentWeatherByCoords(coords: GeolocationCoordinates):
    Observable<ICurrentWeather>
  updateCurrentWeather(
    search: string | number,
    country?: string
  ): void
  getCurrentWeather(search: string, country?: string):
    Observable<ICurrentWeather>
  updateCurrentWeather(search: string, country?: string):void
}
