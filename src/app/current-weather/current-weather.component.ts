import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ICurrentWeather} from "../interfaces";
import {WeatherService} from "../weather/weather.service";
import {SubSink} from "subsink";
import {Observable} from "rxjs";

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent {
  // private subscriptions = new SubSink();

  current$: Observable<ICurrentWeather>

  @Input() current: ICurrentWeather;

  constructor( private weatherService: WeatherService ) {
    this.current = {
      city: '',
      country: '',
      date: 0,
      image: '',
      temperature: 0,
      description: '',
    }
    this.current$ = this.weatherService.currentWeather$;
  }

/*  ngOnInit(): void {
    /!*this.weatherService.getCurrentWeather('bogota', 'CO')
      .subscribe( (data) => {
        console.log('hola mundo');
        this.current = data;
      })*!/
    this.subscriptions.add(
      this.weatherService.currentWeather$
        .subscribe(data => (this.current = data))
    );
  }*/

/*  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }*/

  getOrdinal(date: number) {
    const n = new Date(date).getDate()
    return n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) ||
      n % 10 > 3 ? 0 : n % 10]
      : ''
  }

}
