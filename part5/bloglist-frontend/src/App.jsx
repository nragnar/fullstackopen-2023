import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Error from './components/Error'
import BlogForm from './components/BlogForm'
import Toggable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  // load blogs
  useEffect(() => {
    const loadBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs( blogs )
    }
    loadBlogs()
  }, [])

  // load local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('handle login')
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    console.log('handle logout')
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const handleSubmitBlog = async (blogObject) => {
    console.log('handleSubmitBlog')
    const newBlog = await blogService.create(blogObject)

    // ensure that data is included without reload (exercise 5.8: Blog list frontend, step8)
    newBlog.user = user

    setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added!`)
    setBlogs([...blogs, newBlog])
    setTimeout(() => {
      setNotification(null)
    }, 5000)

  }

  const updateBlog = async (blog) => {
    await blogService.updateLike(blog.id, blog)
    const blogs = await blogService.getAll()

    // sort blogs based on likes
    setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
  }

  const deleteBlog = async (id) => {
    await blogService.deleteBlog(id)
    const blogs = await blogService.getAll()

    setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
  }

  const loginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => {
    return (
      <div>
        <h2>Add a new blog</h2>
        <Toggable buttonLabel="Add a new Blog">
          <BlogForm
            handleSubmitBlog={handleSubmitBlog}
          />
        </Toggable>
      </div>

    )
  }



  return (
    <div>
      <h2>Blogs</h2>
      <Error message={errorMessage} />
      <Notification message={notification} />

      {!user && loginForm()}
      {user &&
      <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      </div>
      }
      {user && blogForm()}

      <div className='allBlogs'>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>
        )}
      </div>



    </div>
  )
}

export default App