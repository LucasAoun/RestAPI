module.exports = (app) => {
    const mysql = require('../mysql').pool
    let route = app.route('/produtos')
    let routeId = app.route('/produtos/:id_produto')


    //GET DE TODOS OS PRODUTOS
    route.get((req,res) =>{
            /*res.status(200).send({
                mensagem: 'Registro de todos os produtos!'
            })*/
            mysql.getConnection((error, conn)=>{
                if(error){return res.status(500).send({error:error})}
                conn.query(
                    'SELECT * FROM produto',
                    (error, result, field)=>{
                        if(error){return res.status(500).send({error:error})}
                        return res.status(200).send({response: result})
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
                    return res.status(200).send({response: result})
                }
            )
        })
    })
    
    //POST DE PRODUTO
    route.post((req, res)=>{

        const produto = {
            name: req.body.name,
            price: req.body.price
        }

        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                'INSERT INTO produto (nomeProduto, precoProduto) VALUES (?,?)',
                [req.body.name, req.body.price],
                (error, result, field)=>{
                    conn.release();
                    
                    if(error){return res.status(500).send({error:error})}

                        res.status(202).send({
                        mensagem: 'Produto inserido com sucesso!!!',
                        id_produto: result.insertId
                         })
                  
                }
            )
        })

     
    })

    //PATCH DE ATUALIZAÇÃO DE REGISTRO
    routeId.patch((req, res)=>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                `UPDATE produto SET nomeProduto = ?,
                        precoProduto = ?
                    WHERE id_produto = ?`,
                    [req.body.name, req.body.price, req.body.id_produto],
                (error, result, field)=>{
                    conn.release();
                    if(error){return res.status(500).send({error:error})}
                    return res.status(202).send({mensagem: 'Produto alterado com sucesso!!'})
                }
            )
        })
    })

    //DELETE DE REGISTRO 
    routeId.delete((req, res)=>{
        mysql.getConnection((error, conn)=>{
            if(error){return res.status(500).send({error:error})}
            conn.query(
                `DELETE FROM produto WHERE id_produto = ?`, [req.body.id_produto],
                (error, result, field)=>{
                    conn.release();
                    if(error){return res.status(500).send({error:error})}
                    return res.status(202).send({mensagem: 'Produto removido com sucesso!!'})
                }
            )
        })
    })


}