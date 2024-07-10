import React from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const addAnec = async (e) => {
        e.preventDefault()
        const content = e.target.anec.value
        e.target.anec.value = ""
        dispatch(createAnecdote(content))
        dispatch(setNotification(`new anecdote ${content}`, 5))
      }
    



  return (
    <div>
        <h2>create new</h2>
      <form onSubmit={addAnec}>
        <div>
          <input name='anec'
        />
        
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
