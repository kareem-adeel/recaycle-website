import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import bootstrap from './src/bootstrap.js'
import cors from 'cors'
dotenv.config()
const app = express()




app.use(cors())

const port = +process.env.PORT
bootstrap(app,express)





app.listen(process.env.PORT||port, () => console.log(`Example app listening on port ${port}!`))