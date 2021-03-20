//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// for data base 
const mongoose = require("mongoose");

// for capital and small words 
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// connecting mongoose with the server
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

// declaring the global array for storing the data 
// let posts=[];


    app.get("/",function(req,res){

      Post.find({},function(err,posts){

        res.render("home", {
          // passing the key value pair to the ejs file 
          // passing the global array to the ejs to print that array 
          startingContent: homeStartingContent,
          posts:posts
  
        });

      })
    });


    // creating the /about route page
    app.get("/about",function(req,res){
      res.render("about",{contentAbout: aboutContent});
    });

    // creating the /contact page 
    app.get("/contact",function(req,res){
      res.render("contact",{contentContact: contactContent});
    });

    // creating the /compose route page 
    app.get("/compose",function(req,res){
      res.render("compose");
    });

    // the post request we made when we clicks the submit button 
    app.post("/compose",function(req,res){
      // console.log(req.body.postTitle);

      // creating an Object so that we can store in the global array
      const post = new Post ({
        title: req.body.postTitle,
        content: req.body.postBody
      });
    
      // // pushing the object "post" as above to the global array "posts"
      // posts.push(post);

      // instead of sharing in the global variable we store in the databse
      post.save(function(err){
        if(!err){

          // redirecting to the home page when user clicks the submit button 
          res.redirect("/");
        }
      });
    });

    // making get request for every single article or blog
    app.get("/posts/:postId",function(req,res){

      const requestedPostId = req.params.postId;

      Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("post", {
          title: post.title,
          content: post.content
        });
      });

    });

    // checking in the hyper is server is running or not 
    app.listen(3000, function() {
      console.log("Server started on port 3000");
    });