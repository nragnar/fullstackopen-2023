import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useContext } from "react"
import AnecdoteContext from "./AnecdoteContext"

const AnecdoteForm = () => {

  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useContext(AnecdoteContext)


  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['anecdotes']})
    },
    onError: (error) => {
      notificationDispatch({ type: "NOTIFICATION", payload: `Error (has to be atleast 5 characters): ${error.message}`})
    }
  
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log(content)
    newAnecdoteMutation.mutate({ content, votes: 0})
    notificationDispatch({ type: "NOTIFICATION", payload: `new anecdote created: '${content}'`})
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
