import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search, Add, MoreVert, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:5000/produtosEstoque";
const urlProdutos = "http://localhost:5000/produtos";

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await fetch(`${urlProdutos}/${id}`, { method: "DELETE" });
        setProdutos((prev) =>
          prev.filter((produto) => produto.id_produto !== id)
        );
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
      }
    }
  };

  const columns = [
    { field: "id_produto", headerName: "ID", width: 100 },
    { field: "nome_produto", headerName: "Nome", width: 200 },
    { field: "codigo_interno", headerName: "Código", width: 150 },
    { field: "unidade_medida", headerName: "Unidade", width: 100 },
    { field: "preco_venda", headerName: "Preço Venda", width: 120 },
    { field: "estoque_minimo", headerName: "Estoque Min", width: 120 },
    { field: "qtde_atual", headerName: "Estoque Atual", width: 150 },
    { field: "estoque_maximo", headerName: "Estoque Max", width: 120 },
    {
      field: "actions",
      headerName: "Ações",
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
            <MenuItem
              onClick={() => {
                navigate(`/produtos/cadastro/${params.row.id_produto}`);
                handleCloseMenu();
              }}
            >
              <Edit fontSize="small" /> Editar
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDeleteProduto(params.row.id_produto);
                handleCloseMenu();
              }}
            >
              <Delete fontSize="small" /> Excluir
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      backgroundColor: "#F1F1F1",
      height: "auto",
      display: "flex",
      justifyContent: "center",
    }}>
    <Container sx={{ p: 1 }}>
    <Container sx={{ p: 2 }}>
      <div
        className="header"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "3px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: "0",
            fontSize: 60,
            color: "#213635",
            fontWeight: "bold",
          }}
        >
          Produtos
        </Typography>
      </div>
      </Container>
      <Paper elevation={1} sx={{ p: 2, borderRadius: "12px" }}>
      <Container maxWidth="lg" sx={{ padding: 2 }}>

      
        <Box display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={2}
              gap={3}>

        
          <TextField
            variant="outlined"
            placeholder="Pesquisar por nome..."
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, width: "300px" }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Button
              variant="contained"
              sx={{ height: "56px", width: "100%", backgroundColor: "black"}}
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate("/produtos/cadastro")}
            >
              Novo Produto
            </Button>
          </Box>
        </Box>
        </Container>
        <Container maxWidth="lg" sx={{ padding: 2 }}>
        <Box sx={{
                height: "auto",
                width: "100%",
                backgroundColor: "#F2F2F2",
                borderRadius: "12px",
              }}>
          <DataGrid
            rows={filteredProdutos}
            columns={columns}
            getRowId={(row) => row.id_produto}
            pageSize={5}
            sx={{
              boxShadow: 0,
              border: 0,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            disableSelectionOnClick
          />
        </Box>
        </Container>
      </Paper>
    </Container>
    </div>
  );
};

export default ProdutosPage;
