const dummy = (blogs) => {
    return 1
  }


  const totalLikes = (blogs) => {
    return blogs.length === 0 ? 0 : blogs.reduce((n, {likes}) => n + likes, 0)
  }

  const favoriteBlog = (blogs) => {

    if (blogs.length === 0){
      return 0
    }
    else {
      let bestBlog = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
      return bestBlog
    }
  }

  const mostBlogs = (blogs) => {
    const authors_dict = {}
    if (blogs.length === 0){
      return 0
    }
    else {
      blogs.forEach(blog => {
        if (authors_dict[blog.author]) {
          authors_dict[blog.author] += 1
        } else {
          authors_dict[blog.author] = 1
        }
      });
    }
    mostBlogsAuthor = Object.entries(authors_dict).reduce((a, b) => authors_dict[a] > authors_dict[b] ? a : b)
    return mostBlogsAuthor  
  }

  const mostLikes = (blogs) => {
    let authorLikes = blogs.reduce((blog, {author, likes}) => {
      blog[author] = blog[author] || 0
      blog[author] += likes
      return blog
    }, {})

    const getMostLikes = Object.keys(authorLikes).reduce((a,b) => authorLikes[a] > authorLikes[b] ? a : b)

    return {author: getMostLikes, likes: authorLikes[getMostLikes]}
  }

  
  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }