const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const Posts = require("../src/models/new.model")
const User = require("../src/models/user.model")
const session = require("express-session")
const upload = multer({storage: multer.memoryStorage()})
const app = express()

// Config
app.set("view engine", "ejs")
app.set("views", "src/views")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use("/public", express.static("public"))
app.set('trust proxy', 1) // trust first proxy
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// Página principal
app.get("/", async (req, res) =>{
    try{
        const checkSession = req.session.login == null ? false : true
        // Criando condições de busca (usando exemplos)
        if(req.query.busca == null){
            const posts = await Posts.find({})
            const notice = (posts.reverse())[0]
            const mostViews = await Posts.find({}).sort({"views": -1}).limit(4)
            res.render("home", {notice, posts, mostViews, checkSession})
        } else {
            Posts.find({title: {$regex: req.query.busca, $options: "i"}},(error, result) => {
                if(error) res.send(error.message)
                const contentBusca = req.query.busca
                res.render("busca", {result, contentBusca, checkSession})
            })
        }
    } catch(error){
        res.send(error.message)
    }
})

// Notícia single
app.get("/:slug", async (req, res) =>{
    const checkSession = req.session.login == null ? false : true
    const slug = req.params.slug
    const mostViews = await Posts.find({}).sort({"views": -1}).limit(4)
    let notice = await Posts.find({slug})
    notice = notice[0]
    Posts.findOneAndUpdate({slug: slug}, {$inc: {views: 1}}, {new: true}, (error) => {
        if(error) return res.send(error.message)
        res.render("single", {notice, mostViews, checkSession})
    })
})

// Adicionando notícia
app.get("/add/adicionar-noticia", (req, res) => {
    const checkSession = req.session.login == null ? false : true
    try {
        res.render("add-new.ejs", {checkSession})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.post("/add/adicionar-noticia", upload.single("image"), async (req, res) => {

    try{
        let slug = (req.body.title).toLowerCase().split(" ").join("-")
        let user = req.session.login
        const base64File = Buffer.from(req.file.buffer).toString("base64") // Convertendo para base64

        await Posts.create({
            title: req.body.title, 
            image: base64File, 
            category: req.body.category, 
            content: req.body.content, 
            slug: slug,
            creator: user
        })

        res.render("add-new.ejs", {})

    } catch(error){
        res.status(400).send(error.message)
    }
})

// Login
app.post("/admin/login", async (req, res) => {
    try {
        // Verificando usuário existente no Database
        let email = req.body.login
        let user = await User.find({email})

        if(user != false){
            req.session.login = {
                username: user[0].username,
                email: user[0].email
            }
            res.redirect("/admin/login")
        } else{
            res.send("Nome ou senha incorretos")
        }

    } catch (error) {
        if(error) res.send(error.message)
    }
})

// Verificando se há sessão ativa ou não
app.get("/admin/login", (req, res) => {
    const checkSession = req.session.login == null ? false : true
    if(req.session.login == null){
        res.render("admin-login", {})
    } else {
        let user = req.session.login
        res.render("admin-painel", {user, checkSession})
    }
})

// Cadastro
app.get("/admin/cadastro", (req, res) => {
    try{
        let pass = true
        res.render("admin-register", {pass})
    } catch(error){
        res.send(error.message)
    }
})

app.post("/admin/cadastro", async (req, res) => {
    try {
        let email = req.body.login
        let check = await User.find({email})

        if(check != false){
            let pass = false
            res.render("admin-register", {pass})
        } else{
            await User.create({
                username: req.body.username,
                name: req.body.fullName,
                date: req.body.date,
                email: req.body.login,
                password: req.body.senha
            })
            res.render("admin-login", {})
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
    
})
app.listen(process.env.PORT, () => console.log("Server On!"))