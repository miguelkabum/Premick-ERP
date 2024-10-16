import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/usuarios";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [usuarios, setUsuarios] = useState([]);
  const [alerta, setAlerta] = useState({ mensagem: '', variant: '', exibir: false });
  const navigate = useNavigate();

  // Fetch de usuários da API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);
        const users = await res.json();
        setUsuarios(users);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLogin = (e) => {
    e.preventDefault();

    const userToFind = usuarios.find((user) => user.email === email);

    if (!email) {
      setAlerta({ mensagem: "O campo email não pode ser vazio", variant: "warning", exibir: true });
    } else if (!senha) {
      setAlerta({ mensagem: "O campo senha não pode ser vazio", variant: "warning", exibir: true });
    } else if (userToFind && userToFind.senha === senha) {
      // localStorage.setItem("userName", userToFind.nome);
      // localStorage.setItem("userEmail", userToFind.email);
      setAlerta({ mensagem: "Login efetuado com sucesso", variant: "success", exibir: true });
      navigate('/cadastro');
    } else {
      setAlerta({ mensagem: "Usuário ou senha inválidos", variant: "error", exibir: true });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          backgroundColor: '#fff',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>Login</Typography>

        <TextField
          label="Usuário ou e-mail"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          sx={{ mb: 2 }}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText="Digite 8 ou mais caracteres"
        />

        {alerta.exibir && (
          <Alert severity={alerta.variant} sx={{ mb: 2 }}>
            {alerta.mensagem}
          </Alert>
        )}

        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Link href="#" variant="body2">Esqueceu sua senha?</Link>
        </Box>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>Entrar</Button>

        <Typography variant="body2" align="center">
          Não possui uma conta? <Link href="#">Cadastre-se</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
