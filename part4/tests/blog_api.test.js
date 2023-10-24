const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/users')
const jwt = require('jsonwebtoken')

const api = supertest(app)
const Blog = require('../models/blog')
const { application } = require('express')

const initialBlogs = [
    { 
        title: "test blog 1",
        url: "test url 1",
        likes: 1
    },
    {
        title: "test blog 2",
        url: "test url 2",
        likes: 2
    }
]

let token

beforeEach(async () => {

    await Blog.deleteMany({})
    await User.deleteMany({})

    // set up test user
    const saltRounds = 10
    const testPassword = await bcrypt.hash('password123', saltRounds)

    const user = new User({
        username: "Jouni",
        name: "test name",
        passwordHash: testPassword
    })
    await user.save()

    // login the user
    const userForToken = {
        username: user.username,
        id: user.id
    }
    token = jwt.sign(userForToken, process.env.SECRET)

    // create blogs with the correct token
    //await Blog.deleteMany({})
    // await User.deleteMany({})
    blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)


test('All blogs returned', async ()  => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is withing the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)
    expect(contents).toContain('test blog 1')
})
test('id is defined', async() => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.id)
    expect(contents).toBeDefined()
})
test('adding a valid blog', async () => {
    const newBlog = {
        title: "new test blog 1",
        url: "new test url 1",
        likes: 3
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(contents).toContain("new test blog 1")
})
test('missing a likes property will default the property to 0', async () => {
    const newBlog = {
        title: "blog with likes missing",
        url: "new test url 2"
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.likes)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(contents).toContain(0)
})
test('title is missing from the request results in 400 bad request', async () => {
    const newBlog = {
        url: "new test url 3 without title",
        likes: 5
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
    .expect('Content-Type', /application\/json/)

}, 100000)

test('url is missing from the request results in 400 bad request', async () => {
    const newBlog = {
        title: "new test blog without url",
        likes: 5
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
    .expect('Content-Type', /application\/json/)

}, 100000)

test('deleting a post', async () => {

    // add blog
    const blogToDelete = {
        title: "Blog that will be deleted",
        url: "blog that will be deleted",
        likes: 3
    }
    await api
    .post('/api/blogs')
    .send(blogToDelete)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contentsBefore = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(contentsBefore).toContain("Blog that will be deleted")

    // get id of added blog
    deleteThisBlog = response.body.filter(blog => blog.title === "Blog that will be deleted")
    
    
    // delete the newly added blog
    await api
    .delete(`/api/blogs/${deleteThisBlog[0].id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

    blogsAtEnd = await Blog.find({})
    const responseAfter = await api.get('/api/blogs')
    const contents = blogsAtEnd.map(b => b.title)
    expect(responseAfter.body).toHaveLength(initialBlogs.length)
    expect(contents).not.toContain(blogToDelete.title)

})

test('editing a posts likes with HTTP put', async () => {
    const newBlog = {
        title: "blog to edit",
        author: "123",
        url: "whatever.com",
        likes: 10
    }

    const originalBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)



    newBlog.likes += 100

    await api
    .put(`/api/blogs/${originalBlog.body.id}`)
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(contents).toContain('blog to edit')

    const updatedBlog = await api.get(`/api/blogs/${originalBlog.body.id}`)
    expect(updatedBlog.body.likes).toBe(newBlog.likes)
})


describe('where there is initally one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const newUser = {
            username: 'naikou',
            name: 'naikou ragu',
            password: 'salane'
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAfterCreation = await User.find({})
        const usersAtEnd = usersAfterCreation.map(u => u.toJSON())
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)

    })

    test('creation fails with correct status code if username is already taken', async () => {
        const usersBefore = await User.find({})
        const usersAtStart = usersBefore.map(u => u.toJSON())

        const newUser = {
            username: "root",
            name: "super123suer",
            password: "sall123123ane"
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')
        
        const usersAfter = await User.find({})
        const usersAtEnd = usersAfter.map(u => u.toJSON())
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test("Creation fails with correct status code if password is less than 3 characters", async () => {
        const usersBefore = await User.find({})
        const usersAtStart = usersBefore.map(u => u.toJSON())

        // user with password too short
        const newUser = {
            username: "passtooshort",
            name: "passshort",
            password: "12"
        }
        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Password is too short - minimum length is 3')

        const usersAfter = await User.find({})
        const usersAtEnd = usersAfter.map(u => u.toJSON())

        expect(usersAtEnd).toEqual(usersAtStart)
    })


    test("Creation fails with correct status code if username is less than 3 characters", async () => {
        const usersBefore = await User.find({})
        const usersAtStart = usersBefore.map(u => u.toJSON())

        // user with username too short
        const newUser = {
            username: "12",
            name: "username too short",
            password: "12123123"
        }
        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username` (`12`) is shorter than the minimum allowed length (3)')

        const usersAfter = await User.find({})
        const usersAtEnd = usersAfter.map(u => u.toJSON())

        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test("Creation fails with correct status code if username is not given", async () => {
        const usersBefore = await User.find({})
        const usersAtStart = usersBefore.map(u => u.toJSON())

        // user with no username
        const newUser = {
            name: "username too short",
            password: "12123123"
        }
        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username: Path `username` is required')

        const usersAfter = await User.find({})
        const usersAtEnd = usersAfter.map(u => u.toJSON())

        expect(usersAtEnd).toEqual(usersAtStart)
    })
    test("Creation fails with correct status code if password is not given", async () => {
        const usersBefore = await User.find({})
        const usersAtStart = usersBefore.map(u => u.toJSON())

        // user with no password
        const newUser = {
            username: "21731237y",
            name: "username too short",
        }
        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('A password is required')

        const usersAfter = await User.find({})
        const usersAtEnd = usersAfter.map(u => u.toJSON())

        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test("Blog creation fails with proper status code 401 unauthorized if token is not provided", async () => {

        const newBlog = {
            title: "Unauthorized Blog",
            author: "unauthorized",
            url: "whatever.com",
            likes: 11
        }

        const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

        expect(result.body.error).toContain('unauthorized, no token')

    })


})



afterAll(async () => {
    await mongoose.connection.close()
})