import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { Subject, switchMap } from 'rxjs';
import { ForecastResponse } from '../../core/interfaces/forecast.interface';
import { WeatherResponse } from '../../core/interfaces/weather.interface';
import { WeatherService } from '../../core/services/weather';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { WeatherCard } from '../../shared/components/weather-card/weather-card';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { ForecastList } from '../../shared/components/forecast-list/forecast-list';

@Component({
  selector: 'app-home',
  imports: [SearchBar, WeatherCard, ForecastList, CommonModule, MessageModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  animations: [
    trigger('cardAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        })
      ),
      transition(':enter', [
        animate(
          '400ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ]),
    ]),
  ],
})
export class Home implements OnInit {
  weather = signal<WeatherResponse | null>(null);
  forecast = signal<ForecastResponse | null>(null);
  mostrarError = signal<boolean>(false);
  textCity = signal<string>('');
  errorTimeout: any;

  private destroy$ = new Subject<void>();

  private weatherService = inject(WeatherService);

  @ViewChild(SearchBar) searchBar!: SearchBar;

  ngOnInit(): void {
    this.loadWeather('La Paz');
  }

  loadWeather(city: string) {
    this.textCity.set(city);
    this.mostrarError.set(false);
    this.weather.set(null);
    this.forecast.set(null);
    this.weatherService
      .getWeatherByCity(city)
      .pipe(
        switchMap((weatherData: WeatherResponse) => {
          this.weather.set(weatherData);
          this.clearErrorTimeout();
          return this.weatherService.getForecastByCity(city); //ejecuta el segundo servicio si tuvo exito el primero
        })
      )
      .subscribe({
        next: (forecastData: ForecastResponse) => {
          this.forecast.set(forecastData);
        },
        error: (error) => {
          this.handleError();
          console.error('Error en la carga:', error);
        },
      });
  }

  private handleError() {
    this.mostrarError.set(true);

    this.errorTimeout = setTimeout(() => {
      this.resetWeatherData();
    }, 4000);
  }

  private clearErrorTimeout() {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
  }

  private resetWeatherData() {
    this.weather.set(null);
    this.forecast.set(null);
    this.mostrarError.set(false);
    this.textCity.set('');
    this.searchBar.city = '';
  }

  getBackgroundClass(): string {
    if (!this.weather()) return 'bg-clear';

    const condition = this.weather()!.weather[0].main.toLowerCase();

    const map: Record<string, string> = {
      clear: 'bg-clear',
      clouds: 'bg-clouds',
      rain: 'bg-rain',
      drizzle: 'bg-rain',
      thunderstorm: 'bg-thunderstorm',
      snow: 'bg-snow',
      mist: 'bg-mist',
    };

    return map[condition] || 'bg-clear';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearErrorTimeout();
  }
}
