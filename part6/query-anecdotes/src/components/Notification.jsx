import { useContext } from "react"
import AnecdoteContext from "./AnecdoteContext"

const Notification = () => {
  const [notification, notificationDispatch] = useContext(AnecdoteContext)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  

  return (
    <>
    {notification ? <div style={style}>
    {notification}
    </div> : <div></div>}
    </>
  )
}

export default Notification
