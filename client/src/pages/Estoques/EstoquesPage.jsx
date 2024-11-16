import React, { useState, useEffect } from 'react';
import { Box, Button, Container, IconButton, Menu, MenuItem, Typography, Paper, TextField, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Refresh, Add, MoreVert, Delete } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const urlEntrada = "http://localhost:5000/estoqueentrada";
const urlSaida = "http://localhost:5000/estoquesaida";
const urlProdutos = "http://localhost:5000/produtos"; // URL de produtos

const EstoquesPage = () => {
  const [estoques, setEstoques] = useState([]);
  const [produtos, setProdutos] = useState([]);  // Estado para armazenar os produtos
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [menuRowId, setMenuRowId] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState('');  // Filtro de tipo: 'Entrada' ou 'Saída'
  const [produtoSelecionado, setProdutoSelecionado] = useState(''); // Produto selecionado
  const navigate = useNavigate();
  const location = useLocation();

  // Função para buscar produtos
  const fetchProdutos = async () => {
    try {
      const response = await fetch(urlProdutos);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };
  
  // Função para buscar estoques de acordo com o produto e tipo
  const fetchEstoques = async () => {
    if (!produtoSelecionado) ;  // Não fazer nada se não houver produto selecionado
    
    try {
      const [resEntrada, resSaida] = await Promise.all([
        fetch(`${urlEntrada}?id_produto=${produtoSelecionado}`),
        fetch(`${urlSaida}?id_produto=${produtoSelecionado}`)
      ]);
      const entradaData = await resEntrada.json();
      const saidaData = await resSaida.json();
      const combinedData = [
        ...entradaData.map(e => ({ ...e, tipo: 'Entrada' })),
        ...saidaData.map(s => ({ ...s, tipo: 'Saída' }))
      ];

      // Aplica o filtro de tipo (se houver)
      if (tipoFiltro) {
        setEstoques(combinedData.filter(item => item.tipo === tipoFiltro));
      } else {
        setEstoques(combinedData);
      }
    } catch (error) {
      console.error("Erro ao buscar estoques:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();  // Carrega os produtos ao montar o componente
  }, []);

  useEffect(() => {
    fetchEstoques();  // Recarrega os estoques sempre que o produto ou filtro mudar
  }, [produtoSelecionado, tipoFiltro]);

  // const handleOpenMenu = (event, id) => {
  //   setAnchorEl(event.currentTarget);
  //   setMenuRowId(id);
  // };

  // const handleCloseMenu = () => {
  //   setAnchorEl(null);
  //   setMenuRowId(null);
  // };

  // const handleDeleteEstoque = async (id, tipo) => {
  //   const url = tipo === 'Entrada' ? `${urlEntrada}/${id}` : `${urlSaida}/${id}`;
  //   try {
  //     await fetch(url, { method: "DELETE" });
  //     setEstoques(prev => prev.filter(estoque => estoque.id_entrada_produto !== id && estoque.id_saida_produto !== id));
  //   } catch (error) {
  //     console.error("Erro ao excluir estoque:", error);
  //   }
  // };

  const columns = [
    { field: 'nome_produto', headerName: 'Nome', width: 120 },
    { field: 'tipo', headerName: 'Tipo', width: 120 },
    { field: 'quantidade', headerName: 'Quantidade', width: 120 },
    { field: 'valor_unitario', headerName: 'Valor Unitário', width: 120 },
    { field: 'data', headerName: 'Data', width: 180 },
    { field: 'obs_vendas', headerName: 'Observação', width: 200 }
  ];

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Movimentações de Estoque - {produtoSelecionado ? produtos.find(p => p.id_produto === produtoSelecionado)?.nome_produto : 'Selecione um Produto'}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
        <Grid item xs={12} sm={4}>
        {/* Selecione o Produto */}
        <TextField
          select
          fullWidth
          label="Selecione um Produto"
          value={produtoSelecionado}
          onChange={(e) => setProdutoSelecionado(e.target.value)}
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {produtos.map((produto) => (
            <MenuItem key={produto.id_produto} value={produto.id_produto}>
              {produto.nome_produto}
            </MenuItem>
          ))}
        </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
        {/* Filtro de Tipo */}
        <TextField
          select
          fullWidth
          label="Filtrar por Tipo"
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Entrada">Entrada</MenuItem>
          <MenuItem value="Saída">Saída</MenuItem>
        </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate(`/estoques/cadastro`, { state: { produto: produtos.find(p => p.id_produto === produtoSelecionado) } })}
          disabled={!produtoSelecionado}  // Desabilita o botão se não houver produto selecionado
        >
          Nova Movimentação
        </Button>
        </Grid>
        </Grid>

        <Box sx={{ height: 400, width: '100%', mt: 2 }}>
          <DataGrid rows={estoques} columns={columns} getRowId={(row) => `${row.id_entrada_produto || row.id_saida_produto}-${row.tipo}-${row.id_produto}`} pageSize={5} />
        </Box>
      </Paper>
    </Container>
  );
};

export default EstoquesPage;
