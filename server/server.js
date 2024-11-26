const express = require('express');
const usuariosRouter = require('./src/routes/usuarios'); // Importando o router de usuários (login, etc)
const clientesRouter = require('./src/routes/clientes');
const categoriasRouter = require('./src/routes/categorias');
const produtosRouter = require('./src/routes/produtos');
const mysql = require('mysql2/promise'); // `mysql2` para suporte async/await
const vendasRouter = require('./src/routes/vendas');
const produtosVendidosRouter = require('./src/routes/produtosVendidos');
const entradaProdutoRouter = require('./src/routes/entradaProduto');
const saidaProdutoRouter = require('./src/routes/saidaProduto');
const estoqueRouter = require('./src/routes/estoque');
const alertasEstoqueRouter = require('./src/routes/alertasEstoque');

const produtosEstoqueRouter = require('./src/routes/produtosEstoque');

const estoqueEntradaRouter = require('./src/routes/estoqueEntrada');
const estoqueSaidaRouter = require('./src/routes/estoqueSaida');

const vendasCanceladasRouter = require('./src/routes/vendasCanceladas');
const produtosCanceladosRouter = require('./src/routes/produtosCancelados');

const conversasRouter = require('./src/routes/conversas');
const mensagensRouter = require('./src/routes/mensagens');

const dashboardRouter = require('./src/routes/dashboard');

const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config(); // Carregar variáveis de ambiente
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Usar o middleware express.json() para tratar requisições JSON

// Definir rotas para os diversos recursos
app.use('/usuarios', usuariosRouter); // Rota para login e autenticação
app.use('/clientes', clientesRouter);
app.use('/categorias', categoriasRouter);
app.use('/produtos', produtosRouter);
app.use('/vendas', vendasRouter);
app.use('/produtosVendidos', produtosVendidosRouter);
app.use('/entradaProduto', entradaProdutoRouter);
app.use('/saidaProduto', saidaProdutoRouter);
app.use('/estoque', estoqueRouter);
app.use('/alertasEstoque', alertasEstoqueRouter);
app.use('/produtosEstoque', produtosEstoqueRouter);
app.use('/estoqueEntrada', estoqueEntradaRouter);
app.use('/estoqueSaida', estoqueSaidaRouter);

app.use('/vendasCanceladas', vendasCanceladasRouter);
app.use('/produtosCancelados', produtosCanceladosRouter);

app.use('/conversas', conversasRouter);
app.use('/mensagens', mensagensRouter);

app.use('/dashboard', dashboardRouter);

// Rota inicial para testar se o servidor está funcionando corretamente
app.get("/", (req, res) => {
  res.json({ message: "Servidor está funcionando corretamente!" });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
