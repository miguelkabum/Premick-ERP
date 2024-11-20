import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Alert,
  Link,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const url = 'http://localhost:5000/usuarios';

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownConfirmPassword = (event) => event.preventDefault();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };


  const [formData, setFormData] = useState({
    nome_usuario: '',
    email_usuario: '',
    senha_usuario: '',
    confirmSenha: '',
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

    const { nome_usuario, email_usuario, senha_usuario, confirmSenha, termsAccepted } = formData;

    // Validação dos campos
    if (nome_usuario === '') {
      setAlertaClass(true);
      setAlertaMensagem('O campo nome não pode ser vazio');
      return;
    }
    if (email_usuario === '') {
      setAlertaClass(true);
      setAlertaMensagem('O campo email não pode ser vazio');
      return;
    }
    if (senha_usuario === '' || confirmSenha === '' || senha_usuario !== confirmSenha) {
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
    const user = {
      nome_usuario,
      email_usuario,
      senha_usuario,
      status: 1,
      perfil_acesso: 'GERENTE'
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert('Usuário cadastrado com sucesso');
        setFormData({
          nome_usuario: '',
          email_usuario: '',
          senha_usuario: '',
          confirmSenha: '',
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

  const descriptionElementRef = React.useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

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
      <Typography variant="h4" gutterBottom textAlign="center"
        sx={{
          marginBottom: "0",
          fontSize: 60,
          color: "#213635",
          fontWeight: "bold",
          mb: 5
        }}>
        Cadastro
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          padding: 4,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >


        {alertaClass && <Alert severity="error" sx={{ mb: 2 }}>{alertaMensagem}</Alert>}

        <TextField
          label="Nome completo"
          name="nome_usuario"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={formData.nome_usuario}
          required
          placeholder="Digite o nome completo"
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
          label="Seu melhor e-mail"
          name="email_usuario"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={formData.email_usuario}
          required
          placeholder="Digite o seu e-mail"
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
          name="senha_usuario"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={formData.senha_usuario}
          required
          placeholder="8 ou mais caracteres"
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
        <TextField
          label="Confirme a senha"
          name="confirmSenha"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={formData.confirmSenha}
          required
          placeholder="Repita a senha"
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
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownConfirmPassword}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
              <a onClick={(e) => {
                e.preventDefault(); // Impede o checkbox de ser marcado
                handleClickOpen(); // Abre o modal
              }} style={{ color: '#1976d2' }}>
                termos de serviço
              </a>{' '}
              {/* e as{' '}
              <a href="#policies" style={{ color: '#1976d2' }}>
                políticas
              </a> */}
            </>
          }
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mb: 2, background: "#213635", height: 45, marginTop: 2 }}
        >
          Avançar
        </Button>
        <Typography variant="body2" align="center">
          Já possui uma conta?{" "}
          <Link component={RouterLink} to="/login">
            Entrar
          </Link>
        </Typography>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Termos de Serviço
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            CONTRATO DE LICENÇA DE USUÁRIO FINAL (EULA)
            Este Contrato de Licença de Usuário Final (“Contrato”) é celebrado entre o Usuário Final (“Usuário”) e PREMICK (“Fornecedor”).
            1. ACEITAÇÃO DOS TERMOS O Usuário declara que leu, compreendeu e concorda com os termos desta licença. O uso do software "PREMICK ERP" está condicionado à aceitação destes termos.
            2. USO PERMITIDO DO SOFTWARE O Usuário tem o direito de usar o software para as seguintes finalidades: cadastrar clientes, produtos, gerir estoques, emitir relatórios e realizar vendas. O uso do software é limitado a atividades comerciais legítimas e conforme as regras estabelecidas pelo Fornecedor.
            3. DIREITOS DE PROPRIEDADE INTELECTUAL O Usuário reconhece que todos os direitos de propriedade intelectual relacionados ao software "PREMICK ERP", incluindo, mas não se limitando a, direitos autorais e marcas registradas, pertencem exclusivamente ao Fornecedor. O Usuário não pode copiar, modificar, distribuir ou criar obras derivadas do software.
            4. DIREITOS DE ACESSO E USO O Usuário terá acesso ao software durante a vigência deste contrato, desde que cumpra todas as condições aqui estabelecidas. O acesso é pessoal e intransferível.
            5. LIMITAÇÃO DE RESPONSABILIDADE O Fornecedor não será responsável por quaisquer danos diretos, indiretos, acidentais, especiais ou consequenciais resultantes do uso ou da incapacidade de uso do software. O Usuário concorda que sua única e exclusiva reparação será a interrupção do uso do software.
            6. ACESSO ÀS INFORMAÇÕES DO USUÁRIO O Usuário concorda que o Fornecedor pode acessar e processar as informações do Usuário para fins de manutenção, suporte e atualização do software, respeitando a legislação aplicável à proteção de dados.
            7. ARBITRAGEM Qualquer disputa relacionada a este contrato, incluindo questões sobre fraudes, será resolvida por arbitragem de acordo com as regras do Centro Brasileiro de Mediação e Arbitragem, cuja decisão será final e vinculativa para ambas as partes.
            8. CUMPRIMENTO DAS LEIS APLICÁVEIS O Usuário concorda em cumprir todas as leis e regulamentos aplicáveis ao uso do software, incluindo, mas não se limitando, a leis de proteção de dados e privacidade.
            9. DISPOSIÇÕES FINAIS Este contrato constitui o entendimento completo entre as partes e substitui quaisquer acordos anteriores. Qualquer modificação deve ser feita por escrito e assinada por ambas as partes.
            Data da última atualização: 04/11/2024
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default RegistrationForm;
