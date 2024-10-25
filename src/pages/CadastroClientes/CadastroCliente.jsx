import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Divider, Grid, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/clientes";

const CadastroCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState({
    nome: '',
    fantasia: '',
    codigo: '',
    tipoPessoa: 'Pessoa Física',
    rg: '',
    cpfCnpj: '',
    cep: '',
    numero: '',
    endereco: '',
    estado: 'SP',
    cidade: '',
    bairro: '',
    complemento: '',
    contato: '',
    celular: '',
    telefone: '',
    email: ''
  });

  useEffect(() => {
    if (id) {
      fetch(`${url}/${id}`)
        .then((res) => res.json())
        .then((data) => setCliente(data))
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
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {id ? 'Editar Cliente' : 'Cadastro de Clientes'}
        </Typography>
        
        <Box component="form">
          <Typography variant="h6" gutterBottom>
            Dados Cadastrais
          </Typography>
          <Divider />
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Nome" 
                variant="outlined" 
                name="nome"
                value={cliente.nome}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Fantasia" 
                variant="outlined" 
                name="fantasia"
                value={cliente.fantasia}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Código" 
                variant="outlined" 
                name="codigo"
                value={cliente.codigo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select 
                fullWidth 
                variant="outlined" 
                name="tipoPessoa"
                value={cliente.tipoPessoa}
                onChange={handleChange}
              >
                <MenuItem value="Pessoa Física">Pessoa Física</MenuItem>
                <MenuItem value="Pessoa Jurídica">Pessoa Jurídica</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="RG" 
                variant="outlined" 
                name="rg"
                value={cliente.rg}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="CPF/CNPJ" 
                variant="outlined" 
                name="cpfCnpj"
                value={cliente.cpfCnpj}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Endereço
          </Typography>
          <Divider />
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="CEP" 
                variant="outlined" 
                name="cep"
                value={cliente.cep}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField 
                fullWidth 
                label="Número" 
                variant="outlined" 
                name="numero"
                value={cliente.numero}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Endereço" 
                variant="outlined" 
                name="endereco"
                value={cliente.endereco}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select 
                fullWidth 
                variant="outlined" 
                name="estado"
                value={cliente.estado}
                onChange={handleChange}
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
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Contato
          </Typography>
          <Divider />
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Pessoa de Contato" 
                variant="outlined" 
                name="contato"
                value={cliente.contato}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Celular" 
                variant="outlined" 
                name="celular"
                value={cliente.celular}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Telefone" 
                variant="outlined" 
                name="telefone"
                value={cliente.telefone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="E-mail" 
                variant="outlined" 
                name="email"
                value={cliente.email}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={() => navigate('/clientes')}>
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveCliente}
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