import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ForecastResponse } from '../interfaces/forecast.interface';
import { WeatherResponse } from '../interfaces/weather.interface';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrl = environment.ApiUrl;
  private apiKey = environment.ApiKey;

  getWeatherByCity(city: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(
      `${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=es`
    );
  }
  

  getForecastByCity(city: string): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(
      `${this.apiUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric&lang=es`
    );
  }
}
