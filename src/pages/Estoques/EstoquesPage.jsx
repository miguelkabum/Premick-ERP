// EstoquesPage.js
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, IconButton, Menu, MenuItem, Typography, Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Refresh, Add, MoreVert, Delete } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const url = "http://localhost:5000/estoques"; // URL para a API de estoques

const EstoquesPage = () => {
  const [estoques, setEstoques] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acessar o estado enviado via navegação
  const produto = location.state?.produto; // Produto recebido do ProdutosPage

  const fetchEstoques = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      // Filtrar estoques com base no produto selecionado
      const estoquesFiltrados = data.filter(estoque => estoque.produtoId === produto.id);
      setEstoques(estoquesFiltrados);
    } catch (error) {
      console.error("Erro ao buscar estoques:", error);
    }
  };

  useEffect(() => {
    fetchEstoques();
  }, [produto]);

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleDeleteEstoque = async (id) => {
    try {
      await fetch(`${url}/${id}`, { method: "DELETE" });
      setEstoques(prev => prev.filter(estoque => estoque.id !== id));
    } catch (error) {
      console.error("Erro ao excluir estoque:", error);
    }
  };

  const columns = [
    { field: 'date', headerName: 'Data', width: 180 },
    { field: 'entrada', headerName: 'Entrada', width: 100 },
    { field: 'saida', headerName: 'Saída', width: 100 },
    { field: 'preco', headerName: 'Preço', width: 120 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={(event) => handleOpenMenu(event, params.row.id)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && menuRowId === params.row.id}
            onClose={handleCloseMenu}
          >
            {/* <MenuItem onClick={() => { / Lógica para editar estoque / }}>
              Editar
            </MenuItem> */}
            <MenuItem onClick={() => { handleDeleteEstoque(params.row.id); handleCloseMenu(); }}>
              <Delete fontSize="small" /> Excluir
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6">Produto: {produto?.nome}</Typography>
        <Typography variant="body2">Código: {produto?.codigo}</Typography>
        <Typography variant="body2">Estoque Atual: {produto?.estoque}</Typography>
      </Paper>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Movimentações de Estoque</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          onClick={() => navigate(`/estoques/cadastro/${produto.id}`, { state: { produto } })}
        >
          Nova Movimentação
        </Button>
      </Box>

      <Box height={400} sx={{ width: '100%' }}>
        <DataGrid
          rows={estoques}
          columns={columns}
          pageSize={10}
          checkboxSelection
        />
      </Box>
    </Container>
  );
};

export default EstoquesPage;
