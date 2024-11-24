const db = require('../models/db');

exports.consultarAPI = async (req, res) => {
    const pergunta = req.body.conteudo;
    const id_conversa = req.body.id_conversa;

    try {
        // Faz requisição para a API em Python (Flask) com o Vanna
        const respostaPython = await fetch('http://localhost:8000/api/mick', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pergunta })
        });

        const dadosPython = await respostaPython.json();
        console.log("respostaPython status:", respostaPython.ok)
        console.log("DadosPython:", dadosPython)

        if (!dadosPython || !dadosPython.resposta) {
            // Insere a resposta de Erro na tabela `mensagens`
            db.query(
                'INSERT INTO mensagens (id_conversa, tipo_mensagem, conteudo, data_envio) VALUES (?, "BOT", ?, NOW())',
                [id_conversa, 'Desculpe, houve um erro ao processar sua solicitação, tente novamente mais tarde.'],
            );

            res.status(500).json({ error: 'Resposta inválida da API Flask' });
        } else {
            // Insere a resposta na tabela `mensagens`
            db.query(
                'INSERT INTO mensagens (id_conversa, tipo_mensagem, conteudo, data_envio) VALUES (?, "BOT", ?, NOW())',
                [id_conversa, dadosPython.resposta],
                (err, results) => {
                    if (err) return res.status(500).send(err);
                    console.log("Resposta da API:", dadosPython.resposta)
                    res.status(200).json({ /*id_mensagem: results.insertId,*/ resposta: dadosPython.resposta });
                }
            );
        }

        // if (respostaPython.ok) {
        // } else {
        //     console.log('respostaPython.ok == false, não é "OK"');
        //     console.log('Resposta do BOT:', dadosPython.resposta);
        //     res.status(500).json({ resposta: 'Erro ao receber a resposta da API Vanna' });
        // }
    } catch (error) {
        console.error('Erro ao consultar a API Vanna:', error);
        res.status(500).json({ erro: 'Erro ao consultar a API Vanna' });
    }
};

