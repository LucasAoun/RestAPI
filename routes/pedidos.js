module.exports = (app) => {
    const mysql = require('../mysql').pool
    let route = app.route('/pedidos')
    let routeId = app.route('/pedidos/:id_pedido')

    //GET DE TODOS OS PEDIDOS
    route.get((req,res) =>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                'SELECT * FROM pedido',
                (error, result, field)=>{
                    if(error){return res.status(500).send({error:error})}
                    const response = {
                        quantidade: result.length,
                        pedidos: result.map(pedido=>{
                            return{
                                id_pedido: pedido.id_pedido,
                                id_produto: pedido.id_produto,
                                quantidade: pedido.quantidade,
                                request:{
                                    tipo: 'GET',
                                    descricao: 'Retornar detalhes do pedido',
                                    url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
                                }
                            }
                        })
                    }
                    return res.status(200).send({response})
                }
            )
        })
    })
      
     //GET DE PEDIDO POR ID  
    routeId.get((req, res)=>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                'SELECT * FROM pedido WHERE id_pedido = ?',
                [req.params.id_pedido],
                (error, result, field)=>{
                    if(error){return res.status(500).send({error:error})}
                    if (result.length == 0) {
                        return res.status(404).send({
                            mensagem: 'Pedido não encontrado'
                        })
                    }
                    const response = {
                        pedido: {
                            id_pedido: result[0].id_pedido,
                            id_produto: result[0].id_produto,
                            quantidade: result[0].quantidade,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna detalhes de um pedido',
                                url: 'http://localhost:3000/pedidos/'
                            }
                        }
                    }
                    return res.status(200).send({response})
                }
            )
        })
    })
    
    //POST DE PEDIDOS
    route.post((req, res)=>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                'SELECT * FROM produto WHERE id_produto = ?',
                 [req.body.id_produto], 
                 (error, result, field)=>{
                    if(error){return res.status(500).send({error:error})}
                    if (result.length == 0) {
                        return res.status(404).send({
                            mensagem: 'Produto não encontrado'
                        })
                    }
                    conn.query(
                        'INSERT INTO pedido (id_produto, quantidade) VALUES (?,?)',
                        [req.body.id_produto, req.body.quantidade],
                        (error, result, field)=>{
                            conn.release();
                            
                            if(error){return res.status(500).send({error:error})}
                            const response = {
                                mensagem: 'Pedido feito com sucesso!',
                                pedidoCriado: {
                                    id_pedido: result.id_pedido,
                                    id_produto: req.body.id_produto,
                                    quantidade: req.body.quantidade,
                                    request:{
                                        tipo: 'GET',
                                        descricao: 'Todos os pedidos',
                                        url: 'http://localhost:3000/pedidos/'
                                    }
                                }
                            }
                                res.status(202).send({response})
                        }
                    )

                })
        })
    })

    //DELETE DE REGISTRO 
    route.delete((req, res)=>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                `DELETE FROM pedido WHERE id_pedido = ?`,
                    [req.body.id_pedido],
                    (error, result, field)=>{
                    conn.release();
                    if(error){return res.status(500).send({error:error})}
                    const response = {
                        mensagem: 'Pedido removido com sucesso!',
                        request:{
                            tipo: 'POST',
                            descricao: 'Insere um pedido',
                            url: 'http://localhost:3000/produtos',
                            body:{
                                id_produto: 'Number',
                                quantidade: 'Number'
                            }
                        }
                    }
                    return res.status(202).send({response})
                }
            )
        })
    })


}