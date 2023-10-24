const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if(!password){
        return response.status(400).json({
          error: 'A password is required'
        })
    } 

     else if(password.length < 3){
        return response.status(400).json({
          error: 'Password is too short - minimum length is 3'
        })
    }


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    // prevents it from crashing if requirements are not met
    try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
    }
    catch (error) {
        response.status(400).json({error: error.message})
    }
    
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

module.exports = usersRouter