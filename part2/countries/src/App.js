import {useEffect, useState} from 'react';
import axios from 'axios';
import Country from './components/Country';

function App() {
  const [newCountry, setNewCountry] = useState("");
  const [countries, setCountries] = useState(null);
  const [showSingleCountry, setShowSingleCountry] = useState("");


  // const api_key = process.env.REACT_APP_NOT_SECRET_CODE;

  useEffect(() => {
  axios.get(' https://studies.cs.helsinki.fi/restcountries/api/all')
  .then(response => {
    setCountries(response.data.map(({name, capital, area, languages, flags}) => ({
      name: name.common,
      capital, 
      area,
      languages,
      flags
    })))
  })


  }, [])


  const handleSingleCountry = (c) => {
    setShowSingleCountry(c)
  }



  
  if (!countries){
    return null
  }


  const filteredCountries = countries.filter(c => c.name.toLowerCase().includes(newCountry.toLowerCase()))
  const searchCheck = newCountry === "";
 
return (
    <div className="App">
      <p>
        find countries
        <input value={newCountry} onChange={(e) => {
          setNewCountry(e.target.value)
          setShowSingleCountry("")
        }}
        />
      </p>
      <div>
        <ul>
        {(!searchCheck && filteredCountries.length !== 1) && (filteredCountries.length > 10  ? 
        "Too many matches, specify another filter": filteredCountries.map(c=> <p key={c.name}>{c.name} <button onClick={() => handleSingleCountry(c)}>show</button></p> ))}
        </ul>

        {filteredCountries.length === 1 && (filteredCountries.map(countryObject => 
          <Country key={countryObject.name} country={countryObject} />
          ))}


        {(showSingleCountry && filteredCountries.length !== 1) &&
        
        <Country key={showSingleCountry.name} country={showSingleCountry} />}

      </div>

    </div>
  );
}

export default App;
