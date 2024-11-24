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
  Paper, 
  FormHelperText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/produtos";
const urlCategorias = "http://localhost:5000/categorias";

const CadastroProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [produto, setProduto] = useState({
    nome_produto: '',
    unidade_medida: 'UN',
    preco_venda: 0,
    codigo_barras: '',
    codigo_interno: '',
    estoque_minimo: 0,
    estoque_maximo: 0,
    status: true,
    id_categoria: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(urlCategorias)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Erro ao buscar categorias:", error));

    if (id) {
      fetch(`${url}?id=${id}`)
        .then((res) => res.json())
        .then((data) => setProduto(data[0] || {}))
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

  const validateForm = () => {
    let formErrors = {};
    let formIsValid = true;

    if (!produto.nome_produto) {
      formIsValid = false;
      formErrors.nome_produto = 'Nome do produto é obrigatório';
    }

    if (!produto.codigo_barras) {
      formIsValid = false;
      formErrors.codigo_barras = 'Código de barras é obrigatório';
    }

    if (!produto.codigo_interno) {
      formIsValid = false;
      formErrors.codigo_interno = 'Código interno é obrigatório';
    }

    if (!produto.id_categoria) {
      formIsValid = false;
      formErrors.id_categoria = 'Categoria é obrigatória';
    }

    if (produto.preco_venda <= 0) {
      formIsValid = false;
      formErrors.preco_venda = 'Preço de venda deve ser maior que zero';
    }

    if (produto.estoque_minimo < 1) {
      formIsValid = false;
      formErrors.estoque_minimo = 'Estoque mínimo não pode ser zero ou negativo';
    }

    if (produto.estoque_maximo <= produto.estoque_minimo) {
      formIsValid = false;
      formErrors.estoque_maximo = 'Estoque máximo deve ser maior que o estoque mínimo';
    }

    setErrors(formErrors);
    return formIsValid;
  };

  const handleSaveProduto = async () => {
    if (!validateForm()) {
      return;
    }

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
      <Typography align="center" variant="h6" gutterBottom sx={{
        marginBottom: "0",
        fontSize: 60,
        color: "#213635",
        fontWeight: "bold",
        paddingBottom: "26px"
      }}>
        {id ? 'Editar Produto' : 'Cadastro de Produto'}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, width: "100%", borderRadius: "12px" }}>
        <Box component="form">
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Nome do Produto" 
                variant="outlined" 
                name="nome_produto"
                value={produto.nome_produto}
                onChange={handleChange}
                error={!!errors.nome_produto}
                helperText={errors.nome_produto}
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#ffffff" },
                    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                  },
                }}
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
                error={!!errors.codigo_barras}
                helperText={errors.codigo_barras}
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#ffffff" },
                    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                  },
                }}
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
                error={!!errors.codigo_interno}
                helperText={errors.codigo_interno}
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#ffffff" },
                    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                  },
                }}
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
                error={!!errors.id_categoria}
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#ffffff" },
                    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                  },
                }}
              >
                <MenuItem value="" disabled>Categoria</MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nome_categoria}
                  </MenuItem>
                ))}
              </Select>
              {errors.id_categoria && <FormHelperText error>{errors.id_categoria}</FormHelperText>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Unidade de Medida" 
                variant="outlined" 
                name="unidade_medida"
                value={produto.unidade_medida}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#ffffff" },
                    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                  },
                }}
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
                error={!!errors.preco_venda}
                helperText={errors.preco_venda}
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#ffffff" },
                    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                  },
                }}
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
                error={!!errors.estoque_minimo}
                helperText={errors.estoque_minimo}
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#ffffff" },
                    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                  },
                }}
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
                error={!!errors.estoque_maximo}
                helperText={errors.estoque_maximo}
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#ffffff" },
                    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                  },
                }}
              />
            </Grid>
            { id && (
            <Grid item xs={12}>
              <FormControlLabel 
  control={<Switch 
    checked={produto.status} 
    onChange={handleChange} 
    color='#213635'
    sx={{
      '& .MuiSwitch-thumb': {
        backgroundColor: '#213635', // Cor do "thumb" (bolinha)
      },
      '& .MuiSwitch-track': {
        backgroundColor: '#213635', // Cor do fundo
      },
    }}
    name="status"
  />} 
  label="Ativo" 
/>
            </Grid>
            )}
          </Grid>
          
          <Container sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <Button 
              color="secondary" 
              variant="contained"
              sx={{ backgroundColor: "white", color: "black", mr: 1 }} 
              onClick={() => navigate('/produtos')}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveProduto}
              sx={{ backgroundColor: "black" }}
            >
              Salvar produto
            </Button>
          </Container>
        </Box>
      </Paper>
    </Container>
  );
};

export default CadastroProduto;
