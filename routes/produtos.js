module.exports = (app) => {
    const mysql = require('../mysql').pool
    let route = app.route('/produtos')
    let routeId = app.route('/produtos/:id_produto')


    //GET DE TODOS OS PRODUTOS
    route.get((req,res) =>{
            mysql.getConnection((error, conn)=>{
                if(error){return res.status(500).send({error:error})}
                conn.query(
                    'SELECT * FROM produto',
                    (error, result, field)=>{
                        if(error){return res.status(500).send({error:error})}
                        const response = {
                            quantidade: result.length,
                            produtos: result.map(prod=>{
                                return{
                                    id_produto: prod.id_produto,
                                    nome: prod.nomeProduto,
                                    preco: prod.precoProduto,
                                    request:{
                                        tipo: 'GET',
                                        descricao: '',
                                        url: 'http://localhost:3000/produtos/' + prod.id_produto
                                    }
                                }
                            })
                        }
                        return res.status(200).send({response})
                    }
                )
            })
        })
      
     //GET DE PRODUTO POR ID  
    routeId.get((req, res)=>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                'SELECT * FROM produto WHERE id_produto = ?',
                [req.params.id_produto],
                (error, result, field)=>{
                    if(error){return res.status(500).send({error:error})}
                    if (result.length == 0) {
                        return res.status(404).send({
                            mensagem: 'Produto não encontrado'
                        })
                    }
                    const response = {
                        produto: {
                            id_produto: result[0].id_produto,
                            nome: result[0].nomeProduto,
                            preco: result[0].precoProduto,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna detalhes de um produto',
                                url: 'http://localhost:3000/produtos/'
                            }
                        }
                    }
                    return res.status(200).send({response})
                }
            )
        })
    })
    
    //POST DE PRODUTO
    route.post((req, res)=>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                'INSERT INTO produto (nomeProduto, precoProduto) VALUES (?,?)',
                [req.body.nome, req.body.preco],
                (error, result, field)=>{
                    conn.release();
                    
                    if(error){return res.status(500).send({error:error})}
                    const response = {
                        mensagem: 'Produto criado com sucesso!',
                        produtoCriado: {
                            id_produto: result.id_produto,
                            nome: req.body.nome,
                            preco: req.body.preco,
                            request:{
                                tipo: 'GET',
                                descricao: 'Todos os produtos',
                                url: 'http://localhost:3000/produtos/'
                            }
                        }
                    }
                        res.status(202).send({response})
                  
                }
            )
        })

     
    })

    //PATCH DE ATUALIZAÇÃO DE REGISTRO
    route.patch((req, res)=>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                `UPDATE produto SET nomeProduto = ?,
                        precoProduto = ?
                    WHERE id_produto = ?`,
                    [req.body.nome, req.body.preco, req.body.id_produto],
                (error, result, field)=>{
                    conn.release();
                    if(error){return res.status(500).send({error:error})}
                    const response = {
                        mensagem: 'Produto atualizado com sucesso!',
                        produtoCriado: {
                            id_produto: req.body.id_produto,
                            nome: req.body.nome,
                            preco: req.body.preco,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna detalhes de um produto',
                                url: 'http://localhost:3000/produtos/' + req.body.id_produto
                            }
                        }
                    }
                    return res.status(202).send({response})
                }
            )
        })
    })

    //DELETE DE REGISTRO 
    route.delete((req, res)=>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                `DELETE FROM produto WHERE id_produto = ?`,
                    [req.body.id_produto],
                    (error, result, field)=>{
                    conn.release();
                    if(error){return res.status(500).send({error:error})}
                    const response = {
                        mensagem: 'Produto removido com sucesso!',
                        request:{
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: 'http://localhost:3000/produtos',
                            body:{
                                nome: 'String',
                                preco: 'Number'
                            }
                        }
                    }
                    return res.status(202).send({response})
                }
            )
        })
    })


}