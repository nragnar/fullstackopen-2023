import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {

  const [viewMore, setViewMore] = useState(false)

  const toggleMore = () => {
    setViewMore(!viewMore)
  }

  const updatedBlogToSend = {
    ...blog,
    likes: blog.likes + 1
  }

  const addLike = () => {
    updateBlog(updatedBlogToSend)
  }

  const deleteSelectedBlog = () => {
    if (window.confirm(`Are you sure you want to delete blog:  '${blog.title}'?`)) {
      deleteBlog(blog.id)
    }
  }


  const hideWhenVisible = { display: viewMore ? 'none' : '' }
  const showWhenVisible = { display: viewMore ? '' : 'none' }

  return (
    <div className="blog-style">
      <div className="blog-title">
        Title: {blog.title} | Author: {blog.author}
        <button style={hideWhenVisible} onClick={toggleMore}>view</button>
        <button style={showWhenVisible} onClick={toggleMore}>hide</button>
      </div>
      <div style={showWhenVisible}>
        <div className="blog-content">
          <p>Url: {blog.url}</p>
          <p>Likes: {blog.likes} {user && <button id='likeButton' onClick={addLike}>like</button>}</p>
          <p>Blog created by: {blog.user.username}</p>
          {user && user.username === blog.user.username &&
          <button onClick={deleteSelectedBlog}>Delete blog</button>} {/* username is unique */}
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog