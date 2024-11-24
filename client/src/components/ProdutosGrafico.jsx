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
Select,
MenuItem as MuiMenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search, Add, MoreVert, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:5000/produtosEstoque";
const urlProdutos = "http://localhost:5000/produtos";

const ProdutosPage = () => {
const [produtos, setProdutos] = useState([]);
const [categorias, setCategorias] = useState([]);
const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [anchorEl, setAnchorEl] = useState(null);
const [menuRowId, setMenuRowId] = useState(null);
const navigate = useNavigate();


// Função para buscar produtos da API
const fetchProdutos = async () => {
try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Dados dos produtos com quantidade vendida:', data);
    setProdutos(data);

    // Gerar lista de categorias únicas
    const categoriasUnicas = [...new Set(data.map((produto) => produto.categoria))];
    setCategorias(categoriasUnicas);
} catch (error) {
    console.error("Erro ao buscar produtos:", error);
}
};
useEffect(() => {
    fetchProdutos();
}, [categoriaSelecionada, searchTerm]); // Isso vai refazer a busca sempre que o filtro mudar

const ordenarProdutosMaisVendidos = (produtos) => {
    // Verifica se há a propriedade de vendas e ordena do mais vendido para o menos vendido
    return produtos
        .filter(produto => produto.quantidade_vendida > 0)  // Opcional: filtra produtos com vendas
        .sort((a, b) => b.quantidade_vendida - a.quantidade_vendida);  // Ordena por quantidade vendida
    };
useEffect(() => {
    fetchProdutos();
}, []);

// Filtra os produtos com base no termo de pesquisa e na categoria selecionada
const filteredProdutos = produtos
    .filter((produto) => {
    return (
        produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoriaSelecionada ? produto.categoria === categoriaSelecionada : true)
    );
    })
    .sort((a, b) => b.qtde_vendida - a.qtde_vendida); // Ordena os produtos pela quantidade vendida (do mais vendido para o menos vendido)

// Filtra os 5 produtos mais vendidos, se quiser limitar a quantidade exibida
const produtosOrdenados = ordenarProdutosMaisVendidos(produtos);

const produtosMaisVendidos = filteredProdutos.slice(0, 5); // Limita aos 5 mais vendidos

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
        await fetch(`http://localhost:5000/produtos/${id}`, { method: "DELETE" });
        setProdutos((prev) => prev.filter((produto) => produto.id_produto !== id));
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
    { field: "qtde_vendida", headerName: "Qtd Vendida", width: 120 },
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

return (
    <div style={{ backgroundColor: "#E9EFEC", height: "auto", display: "flex", justifyContent: "center" }}>
    <Container sx={{ p: 1 }}>
        <Container sx={{ p: 2 }}>
        <Typography
            variant="h4"
            sx={{
            marginBottom: "0",
            fontSize: 60,
            color: "#213635",
            fontWeight: "bold",
            }}
        >
            Produtos Mais Vendidos
        </Typography>
        </Container>
        <Paper elevation={1} sx={{ p: 2, borderRadius: "12px" }}>
        <Container maxWidth="lg" sx={{ padding: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2} gap={3}>
            <TextField
                variant="outlined"
                placeholder="Pesquisar por nome..."
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2, width: "300px" }}
            />
            <Select
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                displayEmpty
                sx={{ width: "300px" }}
            >
                <MuiMenuItem value="">
                <em>Todas as Categorias</em>
                </MuiMenuItem>
                {categorias.map((categoria, index) => (
                <MuiMenuItem key={index} value={categoria}>
                    {categoria}
                </MuiMenuItem>
                ))}
            </Select>
            </Box>
        </Container>
        <Container maxWidth="lg" sx={{ padding: 2 }}>
            <Box sx={{ height: "auto", width: "100%", backgroundColor: "#F2F2F2", borderRadius: "12px" }}>
            <DataGrid
    rows={produtosMaisVendidos} // Mostra os produtos mais vendidos
    columns={columns}
    getRowId={(row) => row.id_produto}
    pageSize={5}
/>
            </Box>
        </Container>
        </Paper>
    </Container>
    </div>
);
};

export default ProdutosPage;
