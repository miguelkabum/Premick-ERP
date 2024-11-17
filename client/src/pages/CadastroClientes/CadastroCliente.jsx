import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Divider, Grid, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/clientes";

const CadastroCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState({
    nome_cliente: '',
    cep: '',
    numero: '',
    logradouro: '',
    uf: 'SP',
    cidade: '',
    bairro: '',
    complemento: '',
    telefone_cliente: '',
    CPF_cliente: ''
  });

  useEffect(() => {
    if (id) {
      fetch(`${url}?id=${id}`)
        .then((res) => res.json())
        .then((data) => setCliente(data[0] || {})) // Pega o primeiro cliente
        .catch((error) => console.error("Erro ao buscar cliente:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prevCliente => ({
      ...prevCliente,
      [name]: value
    }));
  };

  const handleSaveCliente = async () => {
    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${url}/${id}` : url;
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
      if (res.ok) {
        navigate('/clientes');
      } else {
        console.error('Erro ao salvar cliente.');
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      
        <Typography sx={{
                marginBottom: "0",
                fontSize: 60,
                color: "#213635",
                fontWeight: "bold",
                paddingBottom: "26px"
              }} variant="h4" align="center" gutterBottom>
          {id ? 'Editar Cliente' : 'Cadastro de Clientes'}
        </Typography>
      <Paper elevation={3} sx={{
              p: 3,
              width: "100%",
              borderRadius: "12px",
            }}>
        
        <Box component="form">
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Nome" 
                color='red'
                variant="outlined" 
                name="nome_cliente"
                value={cliente.nome_cliente}
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
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="CEP" 
                variant="outlined" 
                name="cep"
                value={cliente.cep}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#D9D9D9", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D1D1D1", // Cor da borda no foco
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Número" 
                variant="outlined" 
                name="numero"
                value={cliente.numero}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#D9D9D9", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D1D1D1", // Cor da borda no foco
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Logradouro" 
                variant="outlined" 
                name="logradouro"
                value={cliente.logradouro}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#D9D9D9", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D1D1D1", // Cor da borda no foco
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select 
                fullWidth 
                variant="outlined" 
                name="uf"
                value={cliente.uf}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#D9D9D9", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D1D1D1", // Cor da borda no foco
                    },
                  },
                }}
              >
                <MenuItem value="SP">SP</MenuItem>
                <MenuItem value="RJ">RJ</MenuItem>
                {/* Adicione outros estados aqui */}
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Cidade" 
                variant="outlined" 
                name="cidade"
                value={cliente.cidade}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#D9D9D9", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D1D1D1", // Cor da borda no foco
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Bairro" 
                variant="outlined" 
                name="bairro"
                value={cliente.bairro}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#D9D9D9", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D1D1D1", // Cor da borda no foco
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Complemento" 
                variant="outlined" 
                name="complemento"
                value={cliente.complemento}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#D9D9D9", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D1D1D1", // Cor da borda no foco
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Telefone" 
                variant="outlined" 
                name="telefone_cliente"
                value={cliente.telefone_cliente}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#D9D9D9", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D1D1D1", // Cor da borda no foco
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="CPF" 
                variant="outlined" 
                name="CPF_cliente"
                value={cliente.CPF_cliente}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F1F1F1", // Cor de fundo personalizada
                  borderRadius: 3, // Para arredondar os cantos
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff", // Cor da borda padrão
                    },
                    "&:hover fieldset": {
                      borderColor: "#D9D9D9", // Cor da borda no hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D1D1D1", // Cor da borda no foco
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" color="error" sx={{ mr: 2, backgroundColor: "white", color: "black" }} onClick={() => navigate('/clientes')}>
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveCliente}
              sx={{ backgroundColor: "black" }}
            >
              Salvar Cliente
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CadastroCliente;
