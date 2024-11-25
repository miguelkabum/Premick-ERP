import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const ProdutosGrafico = ({ dataInicial, dataFinal }) => {
  const [produtosVendidos, setProdutosVendidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroMaisVendidos, setFiltroMaisVendidos] = useState(true);

  const fetchProdutosVendidos = async () => {
    try {
      const res = await fetch("http://localhost:5000/produtosVendidos");
      const data = await res.json();
      setProdutosVendidos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos vendidos:", error);
    }
  };

  const fetchProdutos = async () => {
    try {
      const res = await fetch("http://localhost:5000/produtos");
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:5000/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchProdutosVendidos();
    fetchProdutos();
    fetchCategorias();
  }, []);

  // Função para filtrar dados com base nas datas
  const filterDataByDate = (data) => {
    return data.filter((item) => {
      // Verifique se item.data existe e é válida
      const itemDate = dayjs(item.data);
      
      if (!itemDate.isValid()) return false; // Ignorar se a data não for válida

      const afterStartDate = !dataInicial || itemDate.isSameOrAfter(dayjs(dataInicial));
      const beforeEndDate = !dataFinal || itemDate.isBefore(dayjs(dataFinal).add(1, "day"));
      return afterStartDate && beforeEndDate;
    });
  };

  // Relacionar dados de produtos vendidos com informações dos produtos e categorias
  const enhancedProdutos = produtosVendidos.map((vendido) => {
    const produto = produtos.find((p) => p.id_produto === vendido.id_produto) || {};
    const categoria = categorias.find(
      (cat) => cat.id_categoria === produto.id_categoria
    ) || { nome_categoria: "Sem Categoria" };

    return {
      ...vendido,
      nome_produto: produto.nome_produto || "Desconhecido",
      unidade_medida: produto.unidade_medida || "N/A",
      categoria: categoria.nome_categoria,
    };
  });

  // Filtrando os produtos com base nas datas
  const filteredProdutos = filterDataByDate(enhancedProdutos)
    .filter((produto) => {
      return (
        (!categoriaSelecionada || produto.categoria === categoriaSelecionada) &&
        produto.nome_produto
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      return filtroMaisVendidos
        ? b.qtde_produto - a.qtde_produto
        : a.qtde_produto - b.qtde_produto;
    });

  // Configuração das colunas do DataGrid
  const columns = [
    { field: "id_produto", headerName: "ID Produto", width: 100 },
    { field: "nome_produto", headerName: "Nome Produto", width: 200 },
    { field: "qtde_produto", headerName: "Quantidade Vendida", width: 150 },
    { field: "unidade_medida", headerName: "Unidade Medida", width: 150 },
    { field: "categoria", headerName: "Categoria", width: 200 },
  ];

  return (
    <div>
      <Container>
        <Typography variant="h6" gutterBottom>
          Produtos Vendidos
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            variant="outlined"
            placeholder="Pesquisar produto..."
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "100%", height: 55 }}
          />
          <Select
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            displayEmpty
            sx={{ width: "100%", height: 55 }}
          >
            <MenuItem value="">
              <em>Todas as Categorias</em>
            </MenuItem>
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id_categoria} value={categoria.nome_categoria}>
                {categoria.nome_categoria}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "100%", height: 55 }}
            onClick={() => setFiltroMaisVendidos(!filtroMaisVendidos)}
          >
            {filtroMaisVendidos ? "Menos Vendidos" : "Mais Vendidos"}
          </Button>
        </Box>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={filteredProdutos}
            columns={columns}
            getRowId={(row) => row.id_produto}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      </Container>
    </div>
  );
};

export default ProdutosGrafico;
