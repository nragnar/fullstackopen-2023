/* eslint-env jest */

import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

// The propTypes complains about required functions (user, updateblog, deleteblog) here in test environment


describe('<Blog />', () => {

  let blog
  let testUser

  beforeEach(() => {
    blog = {
      title: 'Test Title',
      author: 'Test Author',
      url: 'Test Url',
      likes: 5,
      user: { username: 'Test User', user:'testuser', password:'password' }
    }
    testUser = {
      username: 'Test User',
      name: 'testuser',
      password: 'password'
    }
  })


  test('Renders blog title and blog author, but not URL and likes by default', () => {

    const updateBlog = jest.fn()
    const deleteBlog = jest.fn()

    render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={testUser}  />)

    const visibleElements = screen.getByText(`Title: ${blog.title} | Author: ${blog.author}`)
    expect(visibleElements).toBeInTheDocument()
    expect(visibleElements).toBeVisible()

    const { container } = render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={testUser}/>)
    const hiddenDiv = container.querySelector('.blog-content')
    expect(hiddenDiv).not.toBeVisible()
  })

  test('Renders the URL and likes when the \'view\' button is pressed', async () => {
    const updateBlog = jest.fn()
    const deleteBlog = jest.fn()

    render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={testUser}  />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likesVisible = screen.getByText(`Likes: ${blog.likes}`)
    expect(likesVisible).toBeVisible()
    const urlVisible = screen.getByText(`Url: ${blog.url}`)
    expect(urlVisible).toBeVisible()
  })

  test('If the like button is clicked twice, the event handler the component received as props is called twice', async () => {

    // updateBlog - updateBlog is the function that adds a like to the blog
    const updateBlog = jest.fn()
    const deleteBlog = jest.fn()

    render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={testUser} />)

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})


describe('<BlogForm />', () => {

  test('The form calls the event handler it received as props with the right details when a new blog is created', async () => {

    const handleSubmitBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm handleSubmitBlog={handleSubmitBlog}/>)

    // screen.debug()

    const submitButton = screen.getByText('Create a Blog')

    const titleInput = screen.getByPlaceholderText('Title')
    await user.type(titleInput, 'Title test')

    const authorInput = screen.getByPlaceholderText('Author')
    await user.type(authorInput, 'Author test')

    const urlInput = screen.getByPlaceholderText('Url')
    await user.type(urlInput, 'Url test')

    await user.click(submitButton)

    expect(handleSubmitBlog.mock.calls).toHaveLength(1)
    expect(handleSubmitBlog.mock.calls[0][0].title).toBe('Title test')
    expect(handleSubmitBlog.mock.calls[0][0].author).toBe('Author test')
    expect(handleSubmitBlog.mock.calls[0][0].url).toBe('Url test')


  })

})



