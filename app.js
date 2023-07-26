//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _=require("lodash");
const mongoose =require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/divCode",{useNewUrlParser: true});
const posts=[];

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const userschema= new mongoose.Schema({
  name : String,
  email : String,
  password: String,
  username:String

});
const registereduser =new mongoose.Schema({
  username:String,
  password:String
});
const postSchema = new mongoose.Schema({
  title:{
    type : String,
    strength:2
    },
  content:String,
  name:String
});
var uid="";
var newdetails=[];
var sposts="";
const user = mongoose.model("user",userschema);
const post = mongoose.model("post",postSchema);
const vuser = mongoose.model("vuser",registereduser);
app.get("/resources",function(req,res){
  res.render("resources" , {homeContent:homeStartingContent,posts:posts});
})
app.get("/about",function(req,res){
  res.render("about",{abContent:aboutContent});
})
app.get("/contact",function(req,res){
  res.render("contact",{conContent:contactContent});
})
app.get("/compose",function(req,res){
  res.render("compose");
})
app.get("/jobs",function(req,res){
  res.render("jobs");
})
app.get('/', function(req, res) {
  res.render("home");
});
app.post('/',function(req,res)
{
  const newUser= new vuser({
    username:req.body.username,
    password:req.body.password
 });
 newUser.save();
 user.find({username:newUser.username,password:newUser.password}).then(function(userDetails){
     newdetails=userDetails;
     res.redirect('/dashboard');
 })
})

app.get("/dashboard",function(req,res){
  if(newdetails.length===1)
  {
      res.render("dashboard",{udetails:newdetails}); 
  }
 else{ 
  user.find({_id:uid}).then(function(userDetails)
  {
      res.render("dashboard",{udetails:userDetails}); 
  })
}
});
app.get("/signup",function(req,res){
  res.render("signup");
})
app.post("/signup",function(req,res)
{
    const newUser = new user({
        name : req.body.sname,
        email : req.body.email,
        username:req.body.username,
        password:req.body.password
    })
    newUser.save();
    user.findOne({username:newUser.username},{_id:1}).then(function(userDetails)
   {
      uid=userDetails;
      res.redirect("/dashboard");
    })
});
app.post("/dashboard",function(req,res)
{
  res.redirect("/compose")
})
app.post("/compose",function(req,res){
    const newPost = new post({
      title: req.body.postTitle,
      content:req.body.postBody,
      name:req.body.postName
    });
    newPost.save();
    res.redirect('/blogs')
})
app.get("/blogs",function(req,res){
  post.find().then(function(posts){
    res.render("blogs",{showPost:posts});
  })
})

app.get("/posts/:postName",function(req,res){
  let typed=_.lowerCase(req.params.postName);
  post.find({title:typed}).collation( { locale: 'en', strength: 2 } ).then(function(posts){
      sposts=posts
      res.render("post",{posts:sposts});
  });
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
