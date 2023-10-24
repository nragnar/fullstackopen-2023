const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs)
  })


  blogsRouter.post('/', userExtractor, async (request, response, next) => {
    const body = request.body
    if(!request.token){
      return response.status(401).json({error: 'invalid token'})
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({error: 'token invalid'})
    }
    if (!request.user){
      return response.status(401).json({error: 'invalid user'})
    }
    const user = request.user
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user.id,
      likes: body.likes
    })
    try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.status(201).json(savedBlog)

    } catch(exception) {
      next(exception)
    }
  })

  blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
    if(!request.token){
      return response.status(401).json({error: 'invalid token'})
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({error: 'token is invalid'})
    }

    try {
      const blog = await Blog.findById(request.params.id)

      if (blog.user.toString() === decodedToken.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
      } else {
        response.status(400).json({error: "This is not your blog"})
      }
    } catch (exception) {
      next(exception)
    }


    
  })

  blogsRouter.get('/:id', async (request, response, next) => {
    
    try{
      const blog = await Blog.findById(request.params.id)
      response.json(blog)
    } catch(exception){
      next(exception)
    }

  })

  blogsRouter.put('/:id', async (request, response, next) => {
    const {title, url, author, likes } = request.body

    const blog = {
      title, url, author, likes
    }


    try {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.status(201).json(updatedBlog)
    } catch(error) {
      response.status(400).end()
    }


  })



  module.exports = blogsRouter