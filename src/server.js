const express = require('express')
const cors = require('cors')
const { connection } = require('./database/connection')
const routes = require('./routes/routes')

const PORT_API = process.env.PORT_API || 3000;  // Definindo uma porta padrão

class Server {
    constructor (server = express()) {
        this.server = server
        this.middlewares(server)
        this.database()
        server.use(routes)
    }

    async middlewares(app) {
        app.use(cors())
        app.use(express.json())
    }

    async database() {
        try {
            await connection.authenticate()
            console.log('Conexão bem sucedida')            
        } catch (error) {
            console.error('Não foi possível conectar ao banco de dados', error)
            throw error
        }
    }

    async start() {
        this.server.listen(PORT_API, () => console.log(`Servidor executando na porta ${PORT_API}`))
    }

    getApp() {
        return this.server; // Expondo o servidor Express para ser usado nos testes
    }
}

module.exports = { Server }
