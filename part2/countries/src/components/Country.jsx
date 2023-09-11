import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';

const Country = ({country}) => {

    const [countryWeather, setCountryWeather] = useState(null);

    
  const api_key = process.env.REACT_APP_NOT_SECRET_CODE;


    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.name}&appid=${api_key}`)
        .then(response => {
            setCountryWeather(response.data)        
        })
    }, [])

    if (!countryWeather){
        return null
    }

    console.log('countryWeather :>> ', countryWeather);

  return (
    <div key={country.name}>
          <h1>
            {country.name}
          </h1>
          <p>
            Capital: {country.capital}
          </p>
          <p>
            Area: {country.area}
          </p>
          <h3>Languages: </h3>
          <p>
            {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
          </p>

          <div>
            <img src={country.flags.png} alt={country.name}/>

            <h3>Weather in {country.capital}</h3>
            <p>temperature: {Math.round((countryWeather.main.temp) - 273.15)} °C</p>
            <img src={`https://openweathermap.org/img/wn/${countryWeather.weather[0].icon}@2x.png`} alt='weather-icon'/>
            <p>wind: {countryWeather.wind.speed} m/s</p>
          </div>


    </div>
  )
}

export default Country
