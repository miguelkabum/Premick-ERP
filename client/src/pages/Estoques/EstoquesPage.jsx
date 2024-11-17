import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Paper,
  TextField,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Refresh, Add, MoreVert, Delete } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const urlEntrada = "http://localhost:5000/estoqueentrada";
const urlSaida = "http://localhost:5000/estoquesaida";
const urlProdutos = "http://localhost:5000/produtos"; // URL de produtos

const EstoquesPage = () => {
  const [estoques, setEstoques] = useState([]);
  const [produtos, setProdutos] = useState([]); // Estado para armazenar os produtos
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [menuRowId, setMenuRowId] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState(""); // Filtro de tipo: 'Entrada' ou 'Saída'
  const [produtoSelecionado, setProdutoSelecionado] = useState(""); // Produto selecionado
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

  // Função para formatar a data e hora com ajuste de +3 horas
const formatDate = (date) => {
  if (!date) return ''; // Verifica se a data existe

  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3); // Adiciona 3 horas

  const formattedDate = adjustedDate.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Para usar o formato 24h
  });

  return formattedDate.replace(',', ''); // Remove a vírgula entre data e hora
};

  // Função para buscar estoques de acordo com o produto e tipo
  const fetchEstoques = async () => {
    if (!produtoSelecionado); // Não fazer nada se não houver produto selecionado

    try {
      const [resEntrada, resSaida] = await Promise.all([
        fetch(`${urlEntrada}?id_produto=${produtoSelecionado}`),
        fetch(`${urlSaida}?id_produto=${produtoSelecionado}`),
      ]);
      const entradaData = await resEntrada.json();
      const saidaData = await resSaida.json();
      const combinedData = [
        ...entradaData.map(e => ({ ...e, tipo: 'Entrada', data: formatDate(e.data_entrada), observacao: e.obs_entrada_produto })),
        ...saidaData.map(s => ({ ...s, tipo: 'Saída', data: formatDate(s.data_saida), observacao: s.obs_saida_produto })),
      ];

      // Aplica o filtro de tipo (se houver)
      if (tipoFiltro) {
        setEstoques(combinedData.filter((item) => item.tipo === tipoFiltro));
      } else {
        setEstoques(combinedData);
      }
    } catch (error) {
      console.error("Erro ao buscar estoques:", error);
    }
  };

  useEffect(() => {
    fetchProdutos(); // Carrega os produtos ao montar o componente
  }, []);

  useEffect(() => {
    fetchEstoques(); // Recarrega os estoques sempre que o produto ou filtro mudar
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
    { field: "nome_produto", headerName: "Nome", width: 120 },
    { field: "tipo", headerName: "Tipo", width: 120 },
    { field: "quantidade", headerName: "Quantidade", width: 120 },
    { field: "valor_unitario", headerName: "Valor Unitário", width: 120 },
    { field: 'data', headerName: 'Data', width: 180 },
    { field: 'observacao', headerName: 'Observação', width: 200 },
  ];

  return (
    <div
      style={{
        backgroundColor: "#F1F1F1",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container sx={{ p: 1 }}>
        <Container sx={{ p: 2 }}>
          <div
            className="header"
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              justifyContent: "center",
              margin: "3px",
            }}
          >
            <Typography
              sx={{
                marginBottom: "0",
                fontSize: 55,
                textAlign: "center",
                color: "#213635",
                fontWeight: "bold",
              }}
            >
              Movimentações de Estoque -{" "}
              {produtoSelecionado
                ? produtos.find((p) => p.id_produto === produtoSelecionado)
                    ?.nome_produto
                : "Selecione um Produto"}
            </Typography>
          </div>
        </Container>

        <Paper elevation={1} sx={{ p: 2, borderRadius: "12px" }}>
        <Container maxWidth="lg" sx={{ padding: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1, alignItems: "center" }}>
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
                sx={{ backgroundColor:"black", }}
                onClick={() =>
                  navigate(`/estoques/cadastro`, {
                    state: {
                      produto: produtos.find(
                        (p) => p.id_produto === produtoSelecionado
                      ),
                    },
                  })
                }
                disabled={!produtoSelecionado} // Desabilita o botão se não houver produto selecionado
              >
                Nova Movimentação
              </Button>
            </Grid>
          </Grid>
          </Container>
          <Container maxWidth="lg" sx={{ padding: 2 }}>
          <Box
              sx={{
                height: "auto",
                width: "100%",
                backgroundColor: "#F2F2F2",
                borderRadius: "12px",
              }}
            >
            <DataGrid
              rows={estoques}
              columns={columns}
              getRowId={(row) =>
                `${row.id_entrada_produto || row.id_saida_produto}-${
                  row.tipo
                }-${row.id_produto}`
              }
              pageSize={5}
              sx={{
                boxShadow: 0,
                border: 0,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
            />
          </Box>
          </Container>
        </Paper>
      </Container>
    </div>
  );
};

export default EstoquesPage;
