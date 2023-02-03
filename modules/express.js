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
app.get("/", async (req, res) =>{
    try{
        // Criando condições de busca (usando exemplos)
        if(req.query.busca == null){
            const posts = await Posts.find({})
            const notice = (posts.reverse())[0]
            const mostViews = await Posts.find({}).sort({"views": -1}).limit(4)
            res.render("home", {notice, posts, mostViews})
        } else {
            Posts.find({title: {$regex: req.query.busca, $options: "i"}},(error, result) => {
                if(error) res.send(error.message)
                const contentBusca = req.query.busca
                res.render("busca", {result, contentBusca}) // Link para acessar: http://localhost:8080/?busca=jornal
            })
        }
    } catch(error){
        res.send(error.message)
    }
})

// Notícia
app.get("/:slug", async (req, res) =>{
    const slug = req.params.slug
    const posts = await Posts.find({})
    const mostViews = await Posts.find({}).sort({"views": -1}).limit(4)
    const notice = posts.find(item => item.slug == slug)
    Posts.findOneAndUpdate({slug: slug}, {$inc: {views: 1}}, {new: true}, (error) => {
        if(error) res.send(error.message)
        res.render("single", {posts, notice, mostViews})
    })
})

app.listen(port, () => console.log("Server On!"))