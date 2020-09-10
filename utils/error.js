module.exports = (app) =>{
    //ROTAS INEXISTENTES
app.use((req, res, next)=>{
    const error = new Error('Não encontado')
    error.status=404
    next(error)
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    return res.send({
        mensagem: error.message
    })
})
}