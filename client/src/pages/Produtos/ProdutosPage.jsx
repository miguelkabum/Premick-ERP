import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, IconButton, Menu, MenuItem, TextField, Typography, Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Search, Add, MoreVert, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/produtosEstoque";
const urlProdutos = "http://localhost:5000/produtos";

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  const fetchProdutos = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleDeleteProduto = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await fetch(`${urlProdutos}/${id}`, { method: "DELETE" });
        setProdutos(prev => prev.filter(produto => produto.id_produto !== id));
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
      }
    }
  };

  const columns = [
    { field: "id_produto", headerName: "ID", width: 100 },
    { field: 'nome_produto', headerName: 'Nome', width: 200 },
    { field: 'codigo_interno', headerName: 'Código', width: 150 },
    { field: 'unidade_medida', headerName: 'Unidade', width: 100 },
    { field: 'preco_venda', headerName: 'Preço Venda', width: 120 },
    { field: 'estoque_minimo', headerName: 'Estoque Min', width: 120 },
    { field: 'qtde_atual', headerName: 'Estoque Atual', width: 150 },
    { field: 'estoque_maximo', headerName: 'Estoque Max', width: 120 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => handleOpenMenu(e, params.row.id_produto)}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl && menuRowId === params.row.id_produto)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => { navigate(`/produtos/cadastro/${params.row.id_produto}`); handleCloseMenu(); }}>
              <Edit fontSize="small" /> Editar
            </MenuItem>
            <MenuItem onClick={() => { handleDeleteProduto(params.row.id_produto); handleCloseMenu(); }}>
              <Delete fontSize="small" /> Excluir
            </MenuItem>
          </Menu>
        </>
      )
    }
  ];

  const filteredProdutos = produtos.filter(produto => 
    produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Produtos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/produtos/cadastro')}
        >
          Novo Produto
        </Button>
      </Box>

      <TextField
        variant="outlined"
        placeholder="Pesquisar por nome..."
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, width: '300px' }}
      />

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid 
          rows={filteredProdutos} 
          columns={columns} 
          getRowId={(row) => row.id_produto} 
          pageSize={5} 
          disableSelectionOnClick 
        />
      </Box>
    </Paper>
    </Container>
  );
};

export default ProdutosPage;
