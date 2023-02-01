const express = require("express")
const bodyParser = require("body-parser")
const Posts = require("../src/models/new.model")
const app = express()
const port = 8080

app.use(express.json())
app.set("view engine", "ejs")
app.set("views", "src/views")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use("/public", express.static("public"))

// Página principal
app.get("/", (req, res) =>{

    try{
        // Criando condições de busca (usando exemplos)
        if(req.query.busca == null){
            Posts.find({}).sort({"_id": 1}).exec((error, posts) => {
                const notice = posts[0]
                res.render("home", {notice, posts})
            })
        } else {
            res.send(`Você buscou: ${req.query.busca}`) // Link para acessar: http://localhost:8080/?busca=jornal
        }

    } catch(error){
        res.send(error.message)
    }

})

// Notícia
app.get("/:slug", (req, res) =>{
    res.render("single", {})
})

app.listen(port, () => console.log("Server On!"))