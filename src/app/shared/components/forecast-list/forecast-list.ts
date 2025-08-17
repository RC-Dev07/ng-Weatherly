import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import {
  DailyForecast,
  ForecastResponse,
  List,
} from '../../../core/interfaces/forecast.interface';

@Component({
  selector: 'forecast-list',
  imports: [CommonModule, CardModule],
  templateUrl: './forecast-list.html',
  styleUrl: './forecast-list.css',
 animations: [
    // Contenedor con stagger
    trigger('listAnimation', [
      transition(':enter', [
        query('@cardAnimation', [
          stagger(200, animateChild())   // entra de a uno cada 200ms
        ], { optional: true })
      ])
    ]),

    // Animación individual de cada card
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class ForecastList {
  forecast = input.required<ForecastResponse>();
  dailyForecast = signal<any[]>([]);

  constructor() {
    effect(() => {
      const value = this.forecast();
      if (value) {
        this.processForecast(value);
      }
    });
  }
  processForecast(forecast: ForecastResponse) {
    const list = forecast.list;

    const grouped: Record<string, List[]> = {};

    list.forEach((entry) => {
      const dayKey = entry.dt_txt.split(' ')[0]; // yyyy-mm-dd
      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push(entry);
    });

    const result: DailyForecast[] = Object.entries(grouped).map(
      ([date, entries]) => {
        // Calcular min y max
        const temps = entries.map((e) => e.main.temp);
        const tempMin = Math.min(...temps);
        const tempMax = Math.max(...temps);

        const noonEntry =
          entries.find((e) => e.dt_txt.includes('12:00:00')) ||
          entries[Math.floor(entries.length / 2)];

        return {
          date,
          dt: noonEntry.dt,
          tempMin,
          tempMax,
          weather: noonEntry.weather[0],
        };
      }
    );

    this.dailyForecast.set(result.slice(0, 5)); // los 5 dias segun el servicio
  }

  getDayBackgroundClass(condition: string): string {
    const weatherBackgrounds: Record<string, string> = {
      clear: 'day-bg-clear',
      clouds: 'day-bg-clouds',
      rain: 'day-bg-rain',
      drizzle: 'day-bg-rain',
      thunderstorm: 'day-bg-thunderstorm',
      snow: 'day-bg-snow',
      mist: 'day-bg-mist',
      fog: 'day-bg-mist',
      haze: 'day-bg-mist',
    };
    return weatherBackgrounds[condition] || 'day-bg-clear';
  }
}