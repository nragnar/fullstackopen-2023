import { useState } from 'react'


const Button = ({onClick, text}) => (
<button onClick={onClick}>
  {text}
  </button>
  )

const StatisticLine = ({text, value}) => (
<>

    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>

</>
)


const Statistics = (props) => {

  let good = props.good;
  let neutral = props.neutral;
  let bad = props.bad;

  // calculating the stats using good bad neutral
  let all = good + neutral + bad;
  let average = (good - bad) / all;
  let positive = (good / all) * 100;

  return (
      <>
      <table>
        <tbody>
      <StatisticLine text="good" value={good}/>
      <StatisticLine text="neutral" value={neutral}/>
      <StatisticLine text="bad" value={bad}/>
      <StatisticLine text="all" value={all}/>
      <StatisticLine text="average" value={all === 0 ? 0 : average}/>
      <StatisticLine text="positive" value={good === 0 ? 0 : positive}/>
      </tbody>
      </table>
      </>
  )
  }



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  const handleGood = () => setGood(good + 1)
  const handleBad = () => setBad(bad + 1)
  const handleNeutral = () => setNeutral(neutral + 1)

 
  
  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGood} text="good"/>
      <Button onClick={handleNeutral} text="neutral"/>
      <Button onClick={handleBad} text="bad"/>
      <h2>statistics</h2>
      {good === 0 && neutral === 0 && bad === 0 ? <p>no feedback given</p> : <Statistics good={good} neutral={neutral} bad={bad}/>}

    </div>
  )
}

export default App