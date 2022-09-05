require('dotenv').config()
const express = require('express')
const sequelize = require('./database')
const models = require('./models/models')
const PORT = process.env.PORT
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const fileUpload = require('express-fileupload')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}))
app.use('/api',router)
app.use(cookieParser)



app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT,()=> console.log('Server started on port',PORT)) 
    }
    catch (err){
        console.log(err)
    }
}

start()