module.exports = (app) => {

    let route = app.route('/pedidos')
    let routeId = app.route('/pedidos/:id_pedido')

    //GET DE TODOS OS PEDIDOS
    route.get((req,res) =>{
            res.status(200).send({
                mensagem: 'Registro de todos os Pedidos!'
            })
        })
      
     //GET DE PEDIDO POR ID  
    routeId.get((req, res)=>{
        const id = req.params.id_pedido
        res.status(200).send({
            mensagem: 'Registro de pedido único',
            id
        })
    })
    
    //POST DE PEDIDOS

    route.post((req, res)=>{ 
        const pedido = {
            id_pedido: req.body.id_pedido,
            quantidade: req.body.quantidade

        }
        res.status(200).send({
            mensagem: 'Inserindo registro de Pedidos',
            pedidoCriado: pedido
        })
    })


    //DELETE DE REGISTRO 
    routeId.delete((req, res)=>{
        const id = req.params.id_pedido
        res.status(200).send({
            mensagem: 'Atualização de registro',
            id
        })
    })


}