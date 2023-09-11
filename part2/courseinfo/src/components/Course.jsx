import React from 'react'

const Header = ({ course }) => <h1>{course}</h1>
const Total = ({ sum }) => <p>Number of exercises {sum}</p>
const Part = ({ part }) => 

  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return(
  <>
    {parts.map(part =>
      <Part key={part.id} part={part} />  
      )}
    <Total sum={total} />
    
  </>


)}
  const Course = ({course}) => {
    return(
      <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      </>
    )
  }

export default Course
