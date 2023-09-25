import React from 'react'

const Persons = ({persons, isSearching, handlePersonDelete}) => {
  


  return (
    <div>
        {persons.filter(person => {
        return isSearching.toLowerCase() === "" ? person : person.name.toLowerCase().includes(isSearching.toLowerCase())
      }).map(person => {

        return (
          <div key={person.name}>
          <p>{person.name} | Number: {person.number} <button onClick={() => handlePersonDelete(person.id)}>Delete</button> </p>
          </div>
        )
        
      }
        
        
      )}
    </div>
  )
}

export default Persons
