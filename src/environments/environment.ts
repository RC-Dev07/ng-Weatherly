export const environment = {
  production: false,
  ApiUrl: 'https://api.openweathermap.org/data/2.5',
  ApiKey: process.env['NG_APP_API_KEY'] || ''
};