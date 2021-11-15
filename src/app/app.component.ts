import { Component } from '@angular/core';
import {ICurrentWeather} from "./interfaces";
import {WeatherService} from "./weather/weather.service";

@Component({
  selector: 'app-root',
  template: `
    <div>
      <mat-toolbar color="primary">
        <span>LocalCast Weather</span>
      </mat-toolbar>
      <div fxLayoutAlign="center"><div class="mat-caption vertical-margin">Tu ciudad, tu clima justo ahora!</div></div>
      <div fxLayoutAlign="center">
        <app-city-search></app-city-search>
      </div>
      <div fxLayout="row">
        <div fxFlex></div>
          <mat-card fxFlex="300px">
<!--            <mat-card-header>
              <mat-card-title>Clima actual</mat-card-title>
            </mat-card-header>-->
            <mat-card-title>
              <div class="mat-headline">Clima Actual</div>
            </mat-card-title>
            <mat-card-content>
              <app-current-weather [current]="currentWeather"></app-current-weather>
            </mat-card-content>
          </mat-card>
<!--        <mat-card>
          <mat-card-title>
            <div class="mat-title">Current Weather</div>
          </mat-card-title>
          <mat-card-header class="mat-typography">
            <mat-card-title><h4>Current Weather</h4></mat-card-title>
          </mat-card-header>
        </mat-card>-->
        <div fxFlex></div>
      </div>
    </div>

  `,
  styleUrls: []
})
export class AppComponent {
  // @ts-ignore
  currentWeather: ICurrentWeather;
  constructor(private weatherService: WeatherService) { }
  doSearch(searchValue: string) {
    const userInput = searchValue.split(',').map(s => s.trim())
    this.weatherService
      .getCurrentWeather(userInput[0], userInput.length > 1 ?
        userInput[1] : undefined
      )
      .subscribe(data => this.currentWeather = data)
  }
}
