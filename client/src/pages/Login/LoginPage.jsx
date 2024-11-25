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
  CircularProgress,
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
  const [loadingButton, setLoadingButton] = useState(false);

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

      setLoadingButton(true); // Ativa o loading do botão

      // Simula um delay com setTimeout
      setTimeout(() => {
        // Usar Redux para login
        dispatch(login({ email, senha }))
          .unwrap()
          .then((data) => {
            // Redirecionar ou fazer algo com a resposta
            navigate("/dashboard");
          })
          .catch((error) => {
            setAlerta(error.message);  // Exibe o erro na UI
          })
          .finally(() => {
            setLoadingButton(false); // Desativa o loading após a resposta
          });
      }, 1300); // Simula 1,3 segundos de espera
    }
  };
  localStorage.clear();

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" sx={{
        marginBottom: "0",
        fontSize: 60,
        color: "#213635",
        fontWeight: "bold",
        mb: 5
      }}>
        Login
      </Typography>
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

        <TextField
          label="E-mail"
          variant="outlined"
          fullWidth
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mb: 2,
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

        <TextField
          label="Senha"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          fullWidth
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          sx={{
            mb: 2,
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
          disabled={loading || loadingButton} // Desabilita o botão durante o carregamento
          sx={{ mb: 2, background: "#213635", height: 45 }}
        >

          {loadingButton ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={24} sx={{ color: "#fff", mr: 1 }} />
              Entrando...
            </div>
          ) : (
            "Entrar"
          )}
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
