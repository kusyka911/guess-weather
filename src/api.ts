import axios from 'axios';

export interface GetCityTempResponse {
  main: {
    temp: number;
  };
}

export const getCityTemp = (city: string) => {
  return axios.get<GetCityTempResponse>(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: {
        q: city,
        units: 'metric',
        appid: process.env.REACT_APP_WEATHER_API_KEY,
      },
    }
  );
};
