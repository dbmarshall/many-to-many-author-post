// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/posts", function(req, res) {
    console.log('trying to get posts')
    var query = {};
    if (req.query.author_id) {
      query['id'] = req.query.author_id;
      console.log('search for a specific author only')
      // console.log(query)
    }
    // 1. Add a join here to include all of the Authors to these posts
    db.Post.findAll({
      include: [{
        where: query,
        model: db.Author,
      }]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get rotue for retrieving a single post
  app.get("/api/posts/:id", function(req, res) {
    // 2. Add a join here to include the Author who wrote the Post
    db.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Author]
    }).then(function(dbPost) {
      // console.log(dbPost);
      res.json(dbPost);
    });
  });

  // POST route for saving a new post
  app.post("/api/posts", function(req, res) {
    console.log('creating a new post!')
    // console.log(req.body)
    db.Post.create({
      title: req.body.title,
      body: req.body.body,
    }).then(function(dbPost1) {
      // console.log(dbPost1);
      db.AuthorPost.create({
        AuthorId: req.body.AuthorId,
        PostId: dbPost1.dataValues.id
      }).then(function(pair) {
        res.json(dbPost1);
      })
    });
  });

  app.post("/contribute", function(req, res){
    console.log('contributing to an existing post')
    console.log(req.body)
    db.Post.update({
       body: req.body.body 
      },{ 
        where: {
          id:  req.query.post_id
        },
        include: [db.Author]
      }
    ).then(function(num){
      //Checking to see if we need to modify AuthorPost
      db.AuthorPost.findAll({
        where: {
          PostId: req.query.post_id
        }
      }).then(function(AuthorPosts1){
        console.log("found pairs: ",AuthorPosts1)
        if (AuthorPosts1.reduce(function(acc, v){
          // console.log(`is ${v.dataValues.AuthorId} equal to ${req.body.AuthorId}?`)
          return v.dataValues.AuthorId == req.body.AuthorId || acc;
        }, false)){
          //same author, so no need to create new entry to AuthorPost
          // console.log("same author!")
          res.json({})
        } else {
          //new author, need to create new entry to AuthorPost
          db.AuthorPost.create({
            AuthorId: req.body.AuthorId,
            PostId: req.query.post_id
          }).then(function(){
            res.json({})
          })
        }
      })
    })
  })

  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function(req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating posts
  app.put("/api/posts", function(req, res) {
    db.Post.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbPost) {
        res.json(dbPost);
      });
  });


};
