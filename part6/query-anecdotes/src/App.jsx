import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, likeAnecdote }  from './requests'
import { useReducer, useEffect } from 'react'
import AnecdoteContext from './components/AnecdoteContext'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NOTIFICATION":
      return action.payload
    case "CLEAR":
      return ""
      default:
      return state
  }
}



const App = () => {

  
  const [notification, notificationDispatch] = useReducer(notificationReducer, "")
  const queryClient = useQueryClient()


  useEffect(() => {
    if (notification){
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR"})
    }, 5000)
    }
  })
 

  const updateLikeMutation = useMutation({
    mutationFn: likeAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 10,
  })

  if ( result.isLoading ) {
    return <div>anecdote service not available due to problems with server</div>
  }

  const handleVote = (anecdote) => {
    updateLikeMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    notificationDispatch({ type: "NOTIFICATION", payload: `you voted for '${anecdote.content}'`})
  }


  const anecdotes = result.data

  return (
    <div>
    <AnecdoteContext.Provider value={[notification, notificationDispatch]}>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => 
              handleVote(anecdote)
              }>vote</button>
          </div>
        </div>
      )}
      </AnecdoteContext.Provider>
    </div>
  )
}

export default App
