import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Button, 
  Switch, 
  FormControlLabel, 
  MenuItem, 
  Grid, 
  Divider, 
  Container 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/produtos";

const CadastroProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [produto, setProduto] = useState({
    nome: '',
    codigo: 'SKUCOD1',
    formato: 'Simples',
    tipo: 'Produto',
    ativado: true,
    precoVenda: '3,50',
    unidade: 'UN',
    marca: 'Coca Cola',
    producao: 'Terceiros',
    pesoLiquido: '0,030',
    pesoBruto: '0,030',
    profundidade: '7,00',
    validade: 'Indeterminada',
    volumes: '0',
    gtin: '7896019607636',
    gtinTributario: 'SEM GTIN'
  });

  useEffect(() => {
    if (id) {
      fetch(`${url}/${id}`)
        .then((res) => res.json())
        .then((data) => setProduto(data))
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
      <Typography variant="h4" align="center" gutterBottom>
        {id ? 'Editar Produto' : 'Cadastro de Produto'}
      </Typography>
      <Box component="form">
        <Typography variant="h6" gutterBottom>
          Produtos
        </Typography>
        <Divider />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Nome" 
              variant="outlined" 
              name="nome"
              value={produto.nome}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Código (SKU)" 
              variant="outlined" 
              name="codigo"
              value={produto.codigo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              select 
              label="Formato" 
              variant="outlined" 
              name="formato"
              value={produto.formato}
              onChange={handleChange}
            >
              <MenuItem value="Simples">Simples</MenuItem>
              <MenuItem value="Variável">Variável</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              select 
              label="Tipo" 
              variant="outlined" 
              name="tipo"
              value={produto.tipo}
              onChange={handleChange}
            >
              <MenuItem value="Produto">Produto</MenuItem>
              <MenuItem value="Serviço">Serviço</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel 
              control={
                <Switch 
                  name="ativado"
                  checked={produto.ativado}
                  onChange={handleChange}
                />
              } 
              label="Ativado" 
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField 
              fullWidth 
              label="Preço venda" 
              variant="outlined" 
              name="precoVenda"
              value={produto.precoVenda}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField 
              fullWidth 
              label="Unidade" 
              variant="outlined" 
              name="unidade"
              value={produto.unidade}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        {/* Outros campos */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Características
          </Typography>
          <Divider />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Marca" 
                variant="outlined" 
                name="marca"
                value={produto.marca}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                select 
                label="Produção" 
                variant="outlined" 
                name="producao"
                value={produto.producao}
                onChange={handleChange}
              >
                <MenuItem value="Terceiros">Terceiros</MenuItem>
                <MenuItem value="Própria">Própria</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Peso Líquido" 
                variant="outlined" 
                name="pesoLiquido"
                value={produto.pesoLiquido}
                onChange={handleChange}
              />
            </Grid>
            {/* Outros campos de características */}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={() => navigate('/produtos')}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveProduto}
          >
            Salvar Produto
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CadastroProduto;
