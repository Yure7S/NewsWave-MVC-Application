const mongoose = require("mongoose")

const connectToDatabase = () => {
    mongoose.connect(`mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@cluster0.5qhollu.mongodb.net/?retryWrites=true&w=majority`, (error) => {
        if(error){
            console.log("Encontramos um erro ao tentar se conectar com o banco de dados")
            return console.log(error.message)
        } 
        return console.log("Conexão com o banco de dados realizada com sucesso")
    })
}

module.exports = connectToDatabase
