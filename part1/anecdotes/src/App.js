import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
   
  const [selected, setSelected] = useState(0)
  const max = anecdotes.length; // length = 8
  const min = 0;
  

  const [votes, setVotes] = useState(new Array(max).fill(0))

  let maxVotes = Math.max(...votes);
  var indexOfMaxValue = votes.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);


  return (
    <div>
      <h3>Anecdote of the day</h3>
      <p>{anecdotes[selected]}</p>
      <p> has {votes[selected]} votes</p>
      { /* <p>{votes}</p>  */ }
      <button onClick={(idx) => {
        let copy = [...votes]
        copy[selected] += 1;
        setVotes(copy)
      }
    }>vote</button>
      <button onClick={() => setSelected( Math.floor(Math.random() * (max - min) + min) )}>next anecdote</button>
    
    <h3>Anecdote with most votes</h3>
    <p>{anecdotes[indexOfMaxValue]}</p>
    <p>has {maxVotes} votes</p>

      
    </div>
  )
}

export default App
