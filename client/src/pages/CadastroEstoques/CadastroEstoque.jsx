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
  FormHelperText,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const urlEntrada = "http://localhost:5000/entradaproduto"; // URL da API de entrada
const urlSaida = "http://localhost:5000/saidaproduto";     // URL da API de saída

function CadastroEstoque() {
  const navigate = useNavigate();
  const location = useLocation();
  const produto = location.state?.produto; // Produto recebido via navegação

  const [errors, setErrors] = useState({
    quantidade: '',
    valor_unitario: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // Para controlar a exibição do Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Mensagem do Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // Tipo de alerta do Snackbar (error, success, etc.)

  const [movimentacao, setMovimentacao] = useState({
    tipo: 'Entrada',
    quantidade: 1,
    valor_unitario: 0.0,
    // data: new Date().toISOString().slice(0, 16),
    observacao: '',
    id_produto: produto?.id_produto || '', // Associar a movimentação ao produto
    id_usuario: 1, // Usuário padrão
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovimentacao((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset errors when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: '', // Clear the error for that field
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let errorMessages = {};

    // Validating quantidade
    if (movimentacao.quantidade <= 0) {
      errorMessages.quantidade = 'Quantidade deve ser maior que 0.';
      isValid = false;
    }

    // Validating valor_unitario
    if (movimentacao.valor_unitario <= 0) {
      errorMessages.valor_unitario = 'Valor unitário deve ser maior que 0.';
      isValid = false;
    }

    setErrors(errorMessages);
    return isValid;
  };

  const handleSaveMovimentacao = async () => {
    if (!movimentacao.id_produto) {
      console.error('Erro: Produto não foi identificado.');
      return;
    }

    if (!validateForm()) {
      return; // Não salva se a validação falhar
    }

    const url = movimentacao.tipo === 'Entrada' ? urlEntrada : urlSaida;
    const body = {
      quantidade: movimentacao.quantidade,
      valor_unitario: movimentacao.valor_unitario,
      // data_entrada: movimentacao.tipo === 'Entrada' ? movimentacao.data : undefined,
      // data_saida: movimentacao.tipo === 'Saída' ? movimentacao.data : undefined,
      obs_entrada_produto: movimentacao.tipo === 'Entrada' ? movimentacao.observacao : '',
      obs_saida_produto: movimentacao.tipo === 'Saída' ? movimentacao.observacao : '',
      id_produto: movimentacao.id_produto,
      id_usuario: movimentacao.id_usuario,
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        navigate(`/estoques`, { state: { produto } });
      } else {
        console.error('Erro ao salvar movimentação de estoque.');
        // alert('Erro ao salvar movimentação de estoque.')
        setSnackbarMessage('Quantidade insuficiente no estoque para saída.');
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Erro ao salvar movimentação:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8, borderRadius: "12px" }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Nova Movimentação de Estoque
        </Typography>

        <Typography variant="h6">Produto: {produto?.nome_produto || 'Produto não encontrado'}</Typography>
        <Typography variant="body2">Código: {produto?.codigo_interno || 'Sem código'}</Typography>

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Tipo"
              variant="outlined"
              name="tipo"
              value={movimentacao.tipo}
              onChange={handleChange}
              sx={{
                backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                borderRadius: 3, // Para arredondar os cantos
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ffffff", // Cor da borda padrão
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffffff", // Cor da borda no hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffffff", // Cor da borda no foco
                  },
                },
              }}
            >
              <MenuItem value="Entrada">Entrada</MenuItem>
              <MenuItem value="Saída">Saída</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth error={!!errors.quantidade}>
              <TextField
                fullWidth
                label="Quantidade"
                variant="outlined"
                type="number"
                name="quantidade"
                value={movimentacao.quantidade}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#ffffff", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ffffff", // Cor da borda no foco
                    },
                  },
                }}
              />
              <FormHelperText>{errors.quantidade}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth error={!!errors.valor_unitario}>
              <TextField
                fullWidth
                label="Valor Unitário"
                variant="outlined"
                type="number"
                name="valor_unitario"
                value={movimentacao.valor_unitario}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#ffffff", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ffffff", // Cor da borda no foco
                    },
                  },
                }}
              />
              <FormHelperText>{errors.valor_unitario}</FormHelperText>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              fullWidth
              label="Data"
              variant="outlined"
              type="datetime-local"
              name="data"
              value={movimentacao.data}
              onChange={handleChange}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observação"
              variant="outlined"
              multiline
              rows={3}
              name="observacao"
              value={movimentacao.observacao}
              onChange={handleChange}
              sx={{
                backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                borderRadius: 3, // Para arredondar os cantos
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ffffff", // Cor da borda padrão
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffffff", // Cor da borda no hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffffff", // Cor da borda no foco
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "white", color: "black" }} 
              onClick={() => navigate(`/estoques`, { state: { produto } })}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              sx={{ backgroundColor: "black", mr: 1 }}
              variant="contained"
              color="primary"
              onClick={handleSaveMovimentacao}
            >
              Incluir
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={5000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default CadastroEstoque;
