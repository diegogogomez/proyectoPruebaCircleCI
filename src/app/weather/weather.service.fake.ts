import {ICurrentWeather} from "../interfaces";
import {IWeatherService} from "./weather.service";
import {Observable, of} from "rxjs";


export const fakeWeather: ICurrentWeather = {
  city: 'Bethesda',
  country: 'US',
  date: 1485789600,
  image: '',
  temperature: 280.32,
  description: 'Light intensity drizzle'
}

export class WeatherServiceFake implements IWeatherService {
  public getCurrentWeather(
    city: string,
    country: string
  ): Observable<ICurrentWeather> {
    return of(fakeWeather)
  }
}
