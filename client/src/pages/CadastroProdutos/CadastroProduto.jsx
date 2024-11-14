import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Button, 
  FormControlLabel, 
  Switch, 
  MenuItem, 
  Grid, 
  Divider, 
  Container, 
  Select, 
  Paper 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/produtos";
const urlCategorias = "http://localhost:5000/categorias";

const CadastroProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [produto, setProduto] = useState({
    nome_produto: '',
    unidade_medida: '',
    preco_venda: 0.0,
    codigo_barras: '',
    codigo_interno: '',
    estoque_minimo: 0,
    estoque_maximo: 0,
    status: true,
    id_categoria: ''
  });
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch(urlCategorias)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Erro ao buscar categorias:", error));

    if (id) {
      fetch(`${url}?id=${id}`)
        .then((res) => res.json())
        .then((data) => setProduto(data[0] || {})) // Ajuste para pegar o primeiro produto
        .catch((error) => console.error("Erro ao buscar produto:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduto(prevProduto => ({
      ...prevProduto,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProduto = async () => {
    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${url}/${id}` : url;
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (res.ok) {
        navigate('/produtos');
      } else {
        console.error('Erro ao salvar produto.');
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {id ? 'Editar Produto' : 'Cadastro de Produto'}
        </Typography>
        
        <Box component="form">
          <Typography variant="h6" gutterBottom>
            Dados do Produto
          </Typography>
          <Divider />
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Nome do Produto" 
                variant="outlined" 
                name="nome_produto"
                value={produto.nome_produto}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Código de Barras" 
                variant="outlined" 
                name="codigo_barras"
                value={produto.codigo_barras}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Código Interno" 
                variant="outlined" 
                name="codigo_interno"
                value={produto.codigo_interno}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Select 
                fullWidth 
                variant="outlined" 
                name="id_categoria"
                value={produto.id_categoria}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="" disabled>Categoria</MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nome_categoria}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Unidade de Medida" 
                variant="outlined" 
                name="unidade_medida"
                value={produto.unidade_medida}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                type="number"
                fullWidth 
                label="Preço de Venda" 
                variant="outlined" 
                name="preco_venda"
                value={produto.preco_venda}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                type="number"
                fullWidth 
                label="Estoque Mínimo" 
                variant="outlined" 
                name="estoque_minimo"
                value={produto.estoque_minimo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                type="number"
                fullWidth 
                label="Estoque Máximo" 
                variant="outlined" 
                name="estoque_maximo"
                value={produto.estoque_maximo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel 
                control={<Switch 
                  checked={produto.status} 
                  onChange={handleChange} 
                  name="status" 
                />} 
                label="Ativo" 
              />
            </Grid>
          </Grid>
          
          <Box mt={3}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveProduto}
            >
              Salvar
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              sx={{ ml: 2 }} 
              onClick={() => navigate('/produtos')}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CadastroProduto;
