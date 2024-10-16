import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const url = 'http://localhost:5000/usuarios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [alertaClass, setAlertaClass] = useState(false);
  const [alertaMensagem, setAlertaMensagem] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const { username, email, password, confirmPassword, termsAccepted } = formData;

    // Validação dos campos
    if (username === '') {
      setAlertaClass(true);
      setAlertaMensagem('O campo nome não pode ser vazio');
      return;
    }
    if (email === '') {
      setAlertaClass(true);
      setAlertaMensagem('O campo email não pode ser vazio');
      return;
    }
    if (password === '' || confirmPassword === '' || password !== confirmPassword) {
      setAlertaClass(true);
      setAlertaMensagem('As senhas não são iguais ou estão vazias');
      return;
    }
    if (!termsAccepted) {
      setAlertaClass(true);
      setAlertaMensagem('Você deve aceitar os termos de serviço');
      return;
    }

    setAlertaClass(false);

    // Enviar dados do usuário
    const user = { nome: username, email, senha: password };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert('Usuário cadastrado com sucesso');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          termsAccepted: false,
        });
        navigate('/login');
      } else {
        setAlertaClass(true);
        setAlertaMensagem('Erro ao cadastrar o usuário');
      }
    } catch (error) {
      setAlertaClass(true);
      setAlertaMensagem('Erro de conexão com o servidor');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 400,
          padding: 4,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          Cadastro
        </Typography>
        
        {alertaClass && <Alert severity="error" sx={{ mb: 2 }}>{alertaMensagem}</Alert>}
        
        <TextField
          label="Usuário"
          name="username"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={formData.username}
          required
          placeholder="Digite o nome para o seu usuário"
        />
        <TextField
          label="Seu melhor e-mail"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={formData.email}
          required
          placeholder="Digite o seu e-mail"
        />
        <TextField
          label="Senha"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={formData.password}
          required
          placeholder="8 ou mais caracteres"
        />
        <TextField
          label="Confirme a senha"
          name="confirmPassword"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
          placeholder="Repita a senha"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="termsAccepted"
              onChange={handleChange}
              checked={formData.termsAccepted}
              required
            />
          }
          label={
            <>
              Declaro ter lido e aceito os{' '}
              <a href="#terms" style={{ color: '#1976d2' }}>
                termos de serviço
              </a>{' '}
              e as{' '}
              <a href="#policies" style={{ color: '#1976d2' }}>
                políticas
              </a>
            </>
          }
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: '#000' }}
        >
          Avançar
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
