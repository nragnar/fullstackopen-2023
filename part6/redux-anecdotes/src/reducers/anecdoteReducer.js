import { createActionCreatorInvariantMiddleware, createSlice, current } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
 /*   createAnecdote(state, action) {
      const content = action.payload
       state.push({
        content: content,
        id: getId(),
        votes: 0
      }) 
     state.push(content)
    },*/
/*     voteAnecdote(state, action){
      const id = action.payload
      const anecToChange = state.find(a => a.id === id)
      const ChangedAnec = {
        ...anecToChange,
        votes: anecToChange.votes + 1
      }
      const newState = state.map(a =>
        a.id !== id ? a : ChangedAnec)
      return newState.sort((a,b) => b.votes - a.votes)
    }, */
    voteAnecdote(state, action){

      state = state.map(a =>
      a.id !== action.payload.id ? a : action.payload)   
      return state.sort((a, b) => b.votes - a.votes)

    },
    setAnecdotes(state, action){
      return action.payload
    },
    appendAnecdotes(state, action){
      console.log('action.payload :>> ', action.payload);
      state.push(action.payload)
    }
  }
})




/* const anecdoteReducer = (state = initialState, action) => {

  switch(action.type) {

    case 'VOTE': {
      const id = action.payload.id
      const anecToChange = state.find(a => a.id === id)
      const ChangedAnec = {
        ...anecToChange,
        votes: anecToChange.votes + 1
      }
      const newState = state.map(a =>
        a.id !== id ? a : ChangedAnec)

      console.log('newState :>> ', newState);
      return newState.sort((a,b) => b.votes - a.votes)
    }

    case 'CREATE': {

      return [...state, action.payload]
    }

    default:

      return state.sort((a,b) => b.votes - a.votes)

  }
}
    

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    payload: {id}
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'CREATE',
    payload: {
      content: content,
      id: getId(),
      votes: 0
    }
  }
}

*/

export const {appendAnecdotes, voteAnecdote, setAnecdotes} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes.sort((a,b) => b.votes - a.votes)))
  }
}

export const createAnecdote = content => {
  return async dispatch =>  {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdotes(newAnecdote))
  }
}

export const voteOnAnecdote = (id, content) => {
  return async dispatch => {
    const changedAnec = {
      ...content,
      votes: content.votes + 1
    }
      await anecdoteService.voteAnecdote(id, changedAnec)
      dispatch(voteAnecdote(changedAnec))
    
  }
} 


export default anecdoteSlice.reducer