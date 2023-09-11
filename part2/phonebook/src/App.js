import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons2';
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [isSearching, setIsSearching] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  const Notification = ({message}) => {
    if (message === null) {
      return null
    }
    return(
      <div className='notification'>
        {message}
      </div>
    )
  }

  const Error = ({message}) => {
    if (message === null) {
      return null
    }
    return(
      <div className='error'>
        {message}
      </div>
    )
  }


  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])


  const addName = (e) => {
    e.preventDefault()
    const personObject = {
      name: newName,
      id: newName,
      number: newNumber
    }

    const exists = persons.some(person => {
      if(personObject.name === person.name) return true
      else return false
    })

    if(!exists){

      personService
      .create(personObject)
      .then(returnedPerson => {
        
        setNotification(`${personObject.name} was added`) 
        setTimeout(() => {
          setNotification(null)
        }, 2500)    

        setPersons([...persons, returnedPerson])
        setNewName("")
        setNewNumber("")
      })
    
    }
    else{

      if(window.confirm(`${personObject.name} is already in phonebook, replace old number with new one?`)) {
        const numberToChange = persons.find(p => p.name === personObject.name)
        const changedNumber = {...numberToChange, number: newNumber}
        personService
        .editNumber(numberToChange.id, changedNumber)
        .then(returnedPerson => {
          setNotification(`${personObject.name} number was changed to ${changedNumber.number}`) 
          setTimeout(() => {
          setNotification(null)
        }, 2500)    
          setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
          setNewName("")
          setNewNumber("")
        })
        .catch(error => {

          setError(`Information of ${personObject.name} has already been removed from server`)
          setTimeout(() => {
            setError(null)
          }, 3000)  
          setNewName("")
          setNewNumber("")
        })

      }
      setNewName("")
      setNewNumber("")
      
    }
  }


  const handlePersonDelete = id => {

    const person = persons.find(p => p.id === id)
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
      personService
      .remove(id)
      .then(     
        setPersons(persons.filter(p => p.id !== id))
      )

    }
  }


  const handleNameAddChange = (e) => {
    setNewName(e.target.value)
  }
  const handleNewNumberChange = (e) => {
    setNewNumber(e.target.value)
  }
  const handleisSearchingChange = (e) => {
    setIsSearching(e.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Error message={error} />
      <Filter isSearching={isSearching} handleisSearchingChange={handleisSearchingChange}/>

      <h2>Add new</h2>
      
      <PersonForm addName={addName} newName={newName} handleNameAddChange={handleNameAddChange} newNumber={newNumber} handleNewNumberChange={handleNewNumberChange}/>
      
      <h2>Numbers</h2>
      
      <Persons persons={persons} isSearching={isSearching} handlePersonDelete={handlePersonDelete}/>
    
    </div>
  )
}

export default App

// npm run server


