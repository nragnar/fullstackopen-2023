import React from 'react'
import { useState } from 'react'

const BlogForm = ({ handleSubmitBlog }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (e) => {
    e.preventDefault()
    handleSubmitBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      id: Date.now()
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (

    <form onSubmit={addBlog}>
      <div>
        Title
        <input
          id='title'
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          placeholder='Title'
        />
      </div>
      <div>
        Author
        <input
          id='author'
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          placeholder='Author'
        />
      </div>
      <div>
        Url
        <input
          id='url'
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          placeholder='Url'
        />
      </div>
      <button type="submit">Create a Blog</button>
    </form>

  )
}

export default BlogForm
