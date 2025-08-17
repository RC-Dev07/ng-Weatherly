import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { WeatherResponse } from '../../../core/interfaces/weather.interface';

@Component({
  selector: 'weather-card',
  imports: [CommonModule, CardModule],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.css',
})
export class WeatherCard {
  weather = input.required<WeatherResponse>();

  headerText = computed(
    () =>
      `${this.weather()?.name || 'Ubicación'},  ${
        this.weather()?.sys?.country || ''
      }`
  );

  weatherIcon = computed(() =>
    this.weather()?.weather?.[0]?.icon
      ? `https://openweathermap.org/img/wn/${
          this.weather()!.weather[0].icon
        }@4x.png`
      : ''
  );

  weatherDescription = computed(
    () => this.weather()?.weather?.[0]?.description?.toLowerCase() || ''
  );

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
}
