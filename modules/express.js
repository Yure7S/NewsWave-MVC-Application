const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = 8080

app.use(express.json())
app.set("view engine", "ejs")
app.set("views", "src/views")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Página principal
app.get("/", (req, res) =>{

    // Criando condições de busca (usando exemplos)
    if(req.query.busca == null){
        res.send("home")
    } else {
        res.send(`Você buscou: ${req.query.busca}`) // Link para acessar: http://localhost:8080/?busca=jornal
    }
})

// Notícia
app.get("/:slug", (req, res) =>{
    res.send(req.params.slug)
})

app.listen(port, () => console.log("Server On!"))