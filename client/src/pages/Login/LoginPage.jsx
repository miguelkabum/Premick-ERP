import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../hooks/authSlice"; // Importa a ação de login

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alerta, setAlerta] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Redireciona para o dashboard se o usuário já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Caminho para o painel de controle do usuário
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email) {
      setAlerta("O campo email não pode ser vazio");
    } else if (!emailRegex.test(email)) {
      setAlerta("Insira um e-mail válido");
    } else if (!senha) {
      setAlerta("O campo senha não pode ser vazio");
    } else {
      // Usar Redux para login
      dispatch(login({ email, senha }))
        .unwrap()
        .then((data) => {
          // Redirecionar ou fazer algo com a resposta
          navigate("/dashboard");
        })
        .catch((error) => {
          setAlerta(error.message);  // Exibe o erro na UI
        });
    }
  };
  

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          backgroundColor: "#fff",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Login
        </Typography>

        <TextField
          label="E-mail"
          variant="outlined"
          fullWidth
          autoComplete="email"
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          fullWidth
          autoComplete="current-password"
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
        />

        {/* Exibe alertas, seja de validação ou de erro do login */}
        {alerta && <Alert severity="warning" sx={{ mb: 2 }}>{alerta}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Link component={RouterLink} to="/recuperar-senha" variant="body2">
            Esqueceu sua senha?
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading} // Desabilita o botão durante o carregamento
          sx={{ mb: 2 }}
        >
          {loading ? "Entrando..." : "Entrar"} {/* Exibe mensagem de carregamento */}
        </Button>

        <Typography variant="body2" align="center">
          Não possui uma conta?{" "}
          <Link component={RouterLink} to="/cadastro">
            Cadastre-se
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
