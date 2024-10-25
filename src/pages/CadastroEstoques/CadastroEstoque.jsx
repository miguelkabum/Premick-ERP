import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const url = "http://localhost:5000/estoques"; // URL da API de estoques

function CadastroEstoque() {
  const navigate = useNavigate();
  const location = useLocation();
  const produto = location.state?.produto; // Produto recebido via navegação

  // Verificar se o produto existe, caso contrário, definir produtoId como vazio
  const [estoque, setEstoque] = useState({
    tipo: 'Entrada',
    quantidade: '1.00',
    custoUn: '0.00',
    precoUn: '0.00',
    observacao: '',
    produtoId: produto?.id || '', // Associar o estoque ao produto
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstoque((prevEstoque) => ({
      ...prevEstoque,
      [name]: value,
    }));
  };

  const handleSaveEstoque = async () => {
    // Certificar que produtoId não seja vazio
    if (!estoque.produtoId) {
      console.error('Erro: Produto não foi identificado.');
      return;
    }

    try {
      const res = await fetch(url, {
        method: 'POST', // Sempre criando novos estoques
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estoque),
      });
      if (res.ok) {
        navigate(`/estoques`, { state: { produto } }); // Voltar para a lista de estoques do produto
      } else {
        console.error('Erro ao salvar estoque.');
      }
    } catch (error) {
      console.error('Erro ao salvar estoque:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Nova Movimentação de Estoque
        </Typography>

        <Typography variant="h6">Produto: {produto?.nome || 'Produto não encontrado'}</Typography>
        <Typography variant="body2">Código: {produto?.codigo || 'Sem código'}</Typography>

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Tipo"
              variant="outlined"
              name="tipo"
              value={estoque.tipo}
              onChange={handleChange}
            >
              <MenuItem value="Entrada">Entrada</MenuItem>
              <MenuItem value="Saída">Saída</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Quantidade"
              variant="outlined"
              type="number"
              name="quantidade"
              value={estoque.quantidade}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Custo Un."
              variant="outlined"
              type="number"
              name="custoUn"
              value={estoque.custoUn}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Preço Un."
              variant="outlined"
              type="number"
              name="precoUn"
              value={estoque.precoUn}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observação"
              variant="outlined"
              multiline
              rows={3}
              name="observacao"
              value={estoque.observacao}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(`/estoques`, { state: { produto } })}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleSaveEstoque}
            >
              Incluir
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default CadastroEstoque;
