import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ImageIcon from '@mui/icons-material/Image';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const urlProdutos = "http://localhost:5000/produtos"; // API de produtos
const urlVendas = "http://localhost:5000/vendas"; // API de vendas

const VendasPDV = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtosVenda, setProdutosVenda] = useState([]);
  const [produtoDetalhado, setProdutoDetalhado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [precoUnidade, setPrecoUnidade] = useState(3.5);
  const [desconto, setDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [pesquisa, setPesquisa] = useState('');
  const [openDialog, setOpenDialog] = useState(false); // Controle do diálogo de finalizar venda
  const [openDescontoDialog, setOpenDescontoDialog] = useState(false); // Controle do diálogo de desconto
  const [tipoPagamento, setTipoPagamento] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    const total = produtosVenda.reduce((sum, item) => sum + item.precoVenda * item.quantidade, 0);
    setValorTotal(total - desconto);
  }, [produtosVenda, desconto]);

  const handlePesquisaProduto = async () => {
    try {
      const res = await fetch(`${urlProdutos}?q=${pesquisa}`);
      const data = await res.json();
      setProdutos(data);
      if (data.length === 1) {
        setProdutoDetalhado(data[0]);
        setPrecoUnidade(data[0].preco);
      } else {
        setProdutoDetalhado(null);
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    }
  };

  const handleAdicionarProduto = () => {
    if (!produtoDetalhado) return;
    
    const produtoExistente = produtosVenda.find(prod => prod.id === produtoDetalhado.id);
    if (produtoExistente) {
      setProdutosVenda(prev => prev.map(prod => 
        prod.id === produtoDetalhado.id 
          ? { ...prod, quantidade: prod.quantidade + quantidade } 
          : prod
      ));
    } else {
      setProdutosVenda(prev => [
        ...prev, 
        { ...produtoDetalhado, quantidade, status: 'OK' }
      ]);
    }
    setQuantidade(1);
  };

  const handleFinalizarVenda = async () => {
    setOpenDialog(true);
  };

  const handleIncluirVenda = async () => {
    try {
      const res = await fetch(urlVendas, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produtos: produtosVenda,
          total: valorTotal,
          tipoPagamento,
          observacao,
        }),
      });
      if (res.ok) {
        alert('Venda finalizada com sucesso!');
        setProdutosVenda([]);
      } else {
        console.error('Erro ao finalizar venda');
      }
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
    }
    setOpenDialog(false);
  };

  const handleCancelarProduto = (id) => {
    setProdutosVenda(prev => prev.map(prod =>
      prod.id === id ? { ...prod, status: 'CANCELADO' } : prod
    ));
  };

  const handleAplicarDesconto = () => {
    setOpenDescontoDialog(true);
  };

  const handleConfirmarDesconto = (valorDesconto, porcentagem) => {
    if (valorDesconto) {
      setDesconto(parseFloat(valorDesconto));
    } else if (porcentagem) {
      setDesconto((valorTotal * porcentagem) / 100);
    }
    setOpenDescontoDialog(false);
  };

  const columns = [
    { field: 'nome', headerName: 'Descrição', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) =>
        params.value === 'OK' ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
    },
    { field: 'codigo', headerName: 'Código', width: 150 },
    { field: 'unidade', headerName: 'Unidade', width: 120 },
    { field: 'precoVenda', headerName: 'Preço', width: 100 },
    { field: 'quantidade', headerName: 'Quantidade', width: 100 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <Button color="error" onClick={() => handleCancelarProduto(params.row.id)}>
          Cancelar
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
      <Box sx={{ flex: 2, p: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          PDV 1
        </Typography>
        <DataGrid
          rows={produtosVenda}
          columns={columns}
          autoHeight
          disableSelectionOnClick
          pageSize={5}
          rowsPerPageOptions={[5]}
          sx={{ height: 400, backgroundColor: 'white', mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={handleAplicarDesconto}>
            Desconto
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={handleFinalizarVenda}
          >
            Finalizar Venda
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Pesquisar</Typography>
          <TextField
            fullWidth
            label="Pesquisar por código, descrição"
            variant="outlined"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePesquisaProduto()}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mt: 2 }}>
            {produtos.length > 1 && (
              <Typography variant="h6">Selecione um produto:</Typography>
            )}
            {produtos.map((produto) => (
              <Button
                key={produto.id}
                variant="outlined"
                sx={{ display: 'block', mb: 1 }}
                onClick={() => {
                  setProdutoDetalhado(produto);
                  setPrecoUnidade(produto.preco);
                  setProdutos([]);
                }}
              >
                {produto.nome} - {produto.codigo}
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 150,
              border: '1px solid lightgrey',
              mb: 2,
            }}
          >
            <ImageIcon sx={{ fontSize: 80, color: 'lightgrey' }} />
          </Box>

          <TextField
            fullWidth
            label="Descrição"
            value={produtoDetalhado ? produtoDetalhado.nome : ''}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Código"
            value={produtoDetalhado ? produtoDetalhado.codigo : ''}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Preço Unidade"
            type="number"
            value={precoUnidade}
            onChange={(e) => setPrecoUnidade(Number(e.target.value))}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography
            variant="h4"
            align="center"
            sx={{ backgroundColor: '#f1f1f1', p: 2, borderRadius: 2 }}
          >
            R$ {valorTotal.toFixed(2)}
          </Typography>
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleAdicionarProduto}>
            Adicionar Produto
          </Button>
        </Paper>
      </Box>

      {/* Dialog de Finalização de Venda */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Finalizar Venda</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Pagamento</InputLabel>
            <Select
              value={tipoPagamento}
              onChange={(e) => setTipoPagamento(e.target.value)}
              label="Tipo de Pagamento"
            >
              <MenuItem value="Débito">Débito</MenuItem>
              <MenuItem value="Crédito">Crédito</MenuItem>
              <MenuItem value="Dinheiro">Dinheiro</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Valor Total"
            type="number"
            value={valorTotal.toFixed(2)}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Observação"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleIncluirVenda} color="primary">
            Incluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Aplicação de Desconto */}
      <Dialog open={openDescontoDialog} onClose={() => setOpenDescontoDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Aplicar Desconto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Valor do Desconto"
            type="number"
            onChange={(e) => handleConfirmarDesconto(e.target.value, null)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="% de Desconto"
            type="number"
            onChange={(e) => handleConfirmarDesconto(null, e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDescontoDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={() => handleConfirmarDesconto()} color="primary">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendasPDV;
