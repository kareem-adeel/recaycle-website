import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import bootstrap from './src/bootstrap.js'
import cors from 'cors'
dotenv.config()
const app = express()

// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// app.use(cors(corsOptions))
// if(process.env.MOOD=='dev'){
//     app.use(cors())
// }else{
//     app.use(async (req,res,next)=>{
//         if(!whitelist.includes(req.header('orgin'))){
//             return next(new Error("Not allowed by CORS",{cause:502}))
//         }
//         await res.header('Access-Control-Allow-Origin','*')
//         await res.header('Access-Control-Allow-Header','*')
//         await res.header('Access-Control-Allow-Private-Network','true')
//         await res.header('Access-Control-Allow-Method','*')
//         next()
//     })
// }


app.use(cors())

const port = +process.env.PORT
bootstrap(app,express)





app.listen(process.env.PORT||port, () => console.log(`Example app listening on port ${port}!`))