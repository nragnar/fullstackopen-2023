import React from 'react'

const PersonForm = ({addName, newName, handleNameAddChange, newNumber, handleNewNumberChange}) => {
  return (
    <div>
        <form onSubmit={addName}>
        <div>
          name: 
          <input value={newName} onChange={handleNameAddChange}/>
        </div>
        <div>
          number:
          <input value={newNumber} onChange={handleNewNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form> 
    </div>
  )
}

export default PersonForm
