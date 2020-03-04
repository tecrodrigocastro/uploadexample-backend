//configurando o servidor
const express = require("express")
const server = express()


// configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({ extended: true }))


// Configurar a conexão de banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'docker',
    port: 5433,
    database: 'doacao'
})


//Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
})

// LISTA DE DOADORES    



// Configurar a apresentação da página
server.get("/", function(req, res){
    db.query("select * from donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows

        return res.render("index.html", { donors })

    })

    
})


server.post("/", function(req, res){
        //pegar dados do formulario
        const name = req.body.name
        const email = req.body.email
        const blood = req.body.blood
        const message = req.body.message

        if (name == "" || email == "" || blood == "") {
            return res.send("Todos os campos sao obrigatorios")
        } 

        // coloco valores dentro do banco de dados
        const query = `INSERT INTO donors ("name", "email", "blood", "message") 
        VALUES ($1, $2, $3, $4)`

        const values = [name, email, blood, message]
        db.query(query, values, function(err) {
            if (err) return res.send("erro no banco de dados.")

            return res.redirect("/")
        })
       
         

})


// iniciando o servidor na porta 3000
server.listen(3000, function(){
    console.log("Iniciei o servidor.")
})