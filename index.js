const express = require('express')
const app = express()
const consign = require('consign')
const bodyParser = require('body-parser')
const cors = require('cors')


app.use(bodyParser.urlencoded({extended: false})) //dados simples
app.use(bodyParser.json()) //dados json pelo body
app.use(cors())


consign().include('routes').include('utils').into(app)


app.listen(3000, ()=>{
    console.log('Ok! Servidor rodando')
})