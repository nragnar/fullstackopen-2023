import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteOnAnecdote } from '../reducers/anecdoteReducer'
import Notification from './Notification'
import { clearNotification, setNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => {
      if (state.filter === ""){
        return state.anecdotes
      }
      return state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
      })
    

    const vote = async (id, anecdote) => {
        dispatch(voteOnAnecdote(id, anecdote))
        dispatch(setNotification(`you voted for "${anecdote.content}"`, 5))
      }
      
  return (
    <div>
      { <Notification/> }
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote)}>vote</button>
          </div>
        </div>
      )}      
    </div>
  )
}

export default AnecdoteList
