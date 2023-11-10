/* eslint-disable */

describe('Blog app', function() {

  beforeEach(function(){
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {username: 'naikou',name: 'nico',password: 'salainen'}
    const otherUser = {username: 'testUser',name: 'user',password: 'salainen'}

    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', otherUser)
    cy.visit('http://localhost:5173/')
  })

  it('Login form is shown by default at start', function(){
    cy.contains("Login")
  })

  describe('Login', function(){

    it('Login succeeds with correct credentials', function(){
      cy.get('#username').type('naikou')
      cy.get('#password').type('salainen') 
      cy.get("#login-button").click()
      cy.contains("nico logged in")
      cy.contains("Add a new blog")
    })

    it('Login fails with incorrect credentials', function(){
      cy.get('#username').type('naikou')
      cy.get('#password').type('password123')
      cy.get("#login-button").click()
      cy.get('.error').contains('Wrong username or password')
      cy.get('html').should('not.contain', 'nico logged in')
    })

    it('Failed login is shown in red', function(){
      cy.get('#username').type('naikou')
      cy.get('#password').type('password123')
      cy.get("#login-button").click()
      cy.get(".error").should('have.css', 'color','rgb(255, 0, 0)')
    })
  })

  describe("When logged in ", function(){
    beforeEach(function(){
      cy.get('#username').type('naikou')
      cy.get('#password').type('salainen') 
      cy.get("#login-button").click()
    })

    it('A blog can be created (and is added to list of all blogs)', function(){
      cy.contains('Add a new Blog').click()
      cy.get('#title').type('New blog from Cypress')
      cy.get('#author').type("Cypress author")
      cy.get('#url').type("cypresstesting")
      cy.contains('Create a Blog').click()
      cy.contains('New blog from Cypress')
      cy.get('.allBlogs').find('.blog-style').its('length').should('eq', 1)
      cy.get('#title').type('New blog from Cypress2')
      cy.get('#author').type("Cypress author2")
      cy.get('#url').type("cypresstesting2")
      cy.contains('Create a Blog').click()
      cy.get('.allBlogs').find('.blog-style').its('length').should('eq', 2)
    })

    it('Liking a blog works', function(){
      cy.contains('Add a new Blog').click()
      cy.get('#title').type('Likable Blog')
      cy.get('#author').type("Like")
      cy.get('#url').type("Like")
      cy.contains('Create a Blog').click()
    
      cy.contains('view').click()
      cy.contains('Likes: 0')
      cy.contains('like').click()
      cy.contains('Likes: 1')
    })

    it('Person who added a blog can delete it', function(){
      cy.contains('Add a new Blog').click()
      cy.get('#title').type('Deletable blog 2')
      cy.get('#author').type("delete")
      cy.get('#url').type("delete")
      cy.contains('Create a Blog').click()

      cy.contains('Deletable blog')

      cy.contains('view').click()
      cy.contains('Delete blog').click()

      cy.get('.allBlogs').should('not.contain', 'Title: Deletable blog 2')
      cy.get('html').should('not.contain', 'Title: Deletable blog 2')
    })

    it('Ensuring that only the creator can see the delete button of a blog, not anyone else', function(){

      cy.contains('Add a new Blog').click()
      cy.get('#title').type('New blog from Cypress')
      cy.get('#author').type("Cypress author")
      cy.get('#url').type("cypresstesting")
      cy.contains('Create a Blog').click()
      cy.contains('New blog from Cypress')
      
      cy.contains('logout').click()

      // no delete blog when not logged in
      cy.get('html').should('not.contain', 'Delete Blog')

      // no delete button when viewing other users' blogs
      cy.get('#username').type('testUser')
      cy.get('#password').type('salainen')
      cy.get("#login-button").click()

      cy.contains('view').click()
      cy.get('html').should('not.contain', 'Delete Blog')
    }) 

    it('blogs are ordered according to likes with the blog with the most likes being first', function(){
      // create 3 blogs


      cy.contains('Add a new Blog').click()
      cy.get('#title').type('Blog 1')
      cy.get('#author').type("Blog 1")
      cy.get('#url').type("Blog 1")
      cy.contains('Create a Blog').click()

      cy.get('#title').type('Blog 2')
      cy.get('#author').type("Blog 2")
      cy.get('#url').type("Blog 2")
      cy.contains('Create a Blog').click()

      cy.get('#title').type('Blog 3')
      cy.get('#author').type("Blog 3")
      cy.get('#url').type("Blog 3")
      cy.contains('Create a Blog').click()

      cy.contains('Blog 1').contains('view').click()
      cy.contains('Blog 2').contains('view').click()
      cy.contains('Title: Blog 3 | Author: Blog 3').contains('view').click()

      cy.wait(1000).get('.blog-style').eq(0).contains('like').click()
      cy.wait(1000).get('.blog-style').eq(0).contains('like').click()
      cy.wait(1000).get('.blog-style').eq(0).contains('like').click()
      cy.wait(1000).get('.blog-style').eq(0).contains('like').click()
      cy.wait(1000).get('.blog-style').eq(0).contains('like').click()

      cy.wait(1000).get('.blog-style').eq(1).contains('like').click()
      cy.wait(1000).get('.blog-style').eq(1).contains('like').click()
      cy.wait(1000).get('.blog-style').eq(1).contains('like').click()

      cy.wait(1000).get('.blog-style').eq(2).contains('like').click()

      cy.get('.blog-style').eq(0).should('contain', 'Blog 1')
      cy.get('.blog-style').eq(1).should('contain', 'Blog 2')
      cy.get('.blog-style').eq(2).should('contain', 'Blog 3')     
    })
  })
})