const db = require('../models/db');

exports.consultarAPI = async (req, res) => {
    const { pergunta } = req.body;
    try {
        console.log(pergunta)
        // Faz requisição para a API em Python (Flask) com o Vanna
        const respostaPython = await fetch('http://localhost:8000/api/mick', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pergunta })
        });

        const dadosPython = await respostaPython.json();
        console.log(dadosPython)
        // Envia a resposta de volta para o front-end
        res.json({ resposta: dadosPython.resposta });
    } catch (error) {
        console.error('Erro ao consultar a API Vanna:', error);
        res.status(500).json({ erro: 'Erro ao consultar a API Vanna' });
    }
};


// Função para consultar o Vanna usando fetch
// async function consultarVanna(pergunta) {
//     try {
//         const resposta = await fetch('http://localhost:8000/api/mick', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ pergunta })
//         });

//         // Verifica se a resposta é válida
//         if (!resposta.ok) {
//             throw new Error(`Erro: ${resposta.status}`);
//         }

//         // Converte a resposta para JSON
//         const dados = await resposta.json();
//         console.log(dados.resposta); // Exibe a resposta do Vanna no console

//     } catch (error) {
//         console.error('Erro ao consultar o Vanna:', error);
//     }
// }



// exports.createProduto = (req, res) => {
//   const { nome_produto, codigo_barras, codigo_interno, unidade_medida, preco_venda, estoque_minimo, estoque_maximo, id_categoria } = req.body;
//   const produto = { nome_produto, codigo_barras, codigo_interno, unidade_medida, preco_venda, estoque_minimo, estoque_maximo, id_categoria };
//   db.query('INSERT INTO produtos SET ?', produto, (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.status(201).json({ id_produto: results.insertId, ...produto });
//   });
// };

// exports.updateProduto = (req, res) => {
//   const  id_produto  = req.params.id;
//   const produto = req.body;
//   db.query('UPDATE produtos SET ? WHERE id_produto = ?', [produto, id_produto], (err) => {
//     if (err) return res.status(500).send(err);
//     res.sendStatus(204);
//   });
// };

// exports.deleteProduto = (req, res) => {
//   const  id_produto  = req.params.id;
//   db.query('DELETE FROM produtos WHERE id_produto = ?', [id_produto], (err) => {
//     if (err) return res.status(500).send(err);
//     res.sendStatus(204);
//   });
// };
