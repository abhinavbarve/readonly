// requirments
const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
require('dotenv').config()
// -----------------------------

// server operations
app.use(bodyParser.urlencoded({extended:true}))
 
app.use(express.static(path.join(__dirname, 'public'))) 

app.set("view engine", "ejs")


// home page
app.get("/", (req,res) => {
    res.render('home',{title:"Home"})
})


// help page
app.get("/help", (req,res)=>{
    res.render("help",{title:"Help"})
})

// why-ro
app.get("/why-ro", (req,res) => {
    res.render("why-ro", {title:"Why Read-Only?"})
})


//// js pluggins

    // navbar code
    app.get("/js/navbar.js", (req,res) =>{
        res.sendFile(__dirname + "/js/navbar.js")
    })

    //articulate.js pluggin
    app.get("/js/articulate.min.js", (req,res) =>{
        res.sendFile(__dirname + "/js/articulate.min.js")
    })


// end of js pluggins



// database connection // books RESTfull API
mongoose.connect("mongodb+srv://admin-abhinav:masadies06@abhinav-cluster.nbr4w.mongodb.net/bookDB",{useNewUrlParser : true,useUnifiedTopology: true })



// bookSchema
const bookSchema = {
    title : String,
    author : String,
    condenser:String,  
    summary : String,
    img: String,
    introLine: String,
    genre: Array
}


// collection of books
const Book = mongoose.model("Book", bookSchema)

app.get("/books", (req,res)=>{
    Book.find({},(err, foundBooks)=>{

        if(!err){
         
            if(foundBooks){
                res.render("books", {title: "Books", bookList: foundBooks, bookTitle    : req.body.bookName})  
            }else{
                console.log("we did not find the book.")
            }
        
        }else{
            res.send(err)
        }
        
    })
})


// book
app.route("/books/:bookTitle")

    // find a published book document.
    .get((req,res) => {

        Book.findOne({title : req.params.bookTitle}, (err, foundBook)=> {
            if(!err){
                if(foundBook){
                    res.render("book", {title : foundBook.title, 
                    author: foundBook.author,
                    condenser: foundBook.condenser,
                    summary: foundBook.summary,
                    img: foundBook.img
                    })
                }else{
                    // res.send("we did not find this book.")
                    res.redirect("/books")
                }                                               
            }else{
                console.log(err)
                res.send("Sorry, this book doesn't exist in out database.")
            }
        })
    
    })


    // post a book document.
    .post((req,res)=>{
        const newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            condenser: req.body.condenser,
            summary: req.body.summary,
            img : req.body.img,
            genre : req.body.genre
        })

        newBook.save((err)=> {
            if(!err){
               res.render("published",{title:req.body.title})
            }else{
                console.log(err)
                res.send("Sorry, there was some error is publishing this article.")
                
            }
        })
    })


    // replace a book document with another completely.
    .put((req,res) => {
        Book.update(
            {title: req.params.bookTitle},
            {title: req.body.bookTitle,author: req.body.author,by: req.body.by,summary: req.body.summary},
            {overwrite : true},
        (err) => {
            if(!err){
                res.send("The book " + req.title.bookTitle + "has been updated succefully.")
            }else{
                console.log(err)
                res.send("OOPS!, there was some problem in updating this article.")
            }
        })
    })


    // replace only certain things inside a book document.
    .patch( (req,res) => { 
        Book.update(
            {title : req.params.bookTitle},
            {$set : req.body},
            (err) => { 
                if(!err){
                    res.send("The book " + req.title.bookTitle + "has been updated succefully.")
                }else {
                    console.log(err)
                    res.send("Sorry, there was some problem in updating this article.")
                }
            }
        )
    })
    
    
    // delete a book document 
    .delete((req, res) => {
        Article.deleteOne({title : req.params.bookTitle},(err) => {
            if (!err) {
                res.send("The book " + req.title.bookTitle + "has been deleted succefully.")
            } else {
                console.log(err)
                res.send("Sorry there was an error in deleting this book.")
            }
        }) 
    })
// end of website server



// _____________________



// database server

app.get("/databaseLogin",(req,res)=>{
    const bookTitleURL = encodeURI(req.body.bookTitle)
    res.render("databaseLogin")
})

app.post("/publishArticle", (req,res)=>{ 
    const username= req.body.username
    const password= req.body.password
    const bookTitleURL = encodeURI(req.body.bookTitle) 
    if(username===process.env.DATABASE_USERNAME && password===process.env.DATABASE_PASSWORD){
        res.render("publishArticle",{title : "Publish Article"})
    }

})


app.post("/published", (req,res)=>{
    res.render("published",{})
})

app.listen(process.env.PORT || 8080,function(){
    console.log("Server is running on port 8080")
}) 
