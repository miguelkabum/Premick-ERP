import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Divider, Grid, MenuItem, Paper, Select, TextField, Typography, Snackbar, Alert, FormHelperText, FormControlLabel, Switch, } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/clientes";

const CadastroCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false); // Para controlar a exibição do Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Mensagem do Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // Tipo de alerta do Snackbar (error, success, etc.)

  const [errors, setErrors] = useState({});

  const [cliente, setCliente] = useState({
    nome_cliente: '',
    cep: '',
    numero: '',
    logradouro: '',
    uf: 'ES',
    cidade: '',
    bairro: '',
    complemento: '',
    telefone_cliente: '',
    CPF_cliente: '',
    status: true,
  });

  useEffect(() => {
    if (id) {
      fetch(`${url}?id=${id}`)
        .then((res) => res.json())
        .then((data) => setCliente(data[0] || {})) // Pega o primeiro cliente
        .catch((error) => console.error("Erro ao buscar cliente:", error));
    }
  }, [id]);

  // Função para validar o nome
  const validarNome = (nome) => {
    const nomeRegex = /^[A-Za-z\s]+$/;
    if (!nome || !nomeRegex.test(nome)) {
      setSnackbarMessage('O nome deve conter apenas letras (maiúsculas ou minúsculas).');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  // Função para buscar o endereço com base no CEP
  const buscarEnderecoPorCEP = (cep) => {
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.erro) {
            setSnackbarMessage("CEP não encontrado!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
          }
          setCliente((prevCliente) => ({
            ...prevCliente,
            logradouro: data.logradouro,
            uf: data.uf,
            cidade: data.localidade,
            bairro: data.bairro,
            complemento: data.complemento || '',
          }));
        })
        .catch((error) => {
          console.error("Erro ao buscar CEP:", error);
          setSnackbarMessage("Erro ao buscar informações do CEP.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        });
    }
  };

  // Função para validar o CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos

    if (cpf.length !== 11) return false; // Verifica se tem 11 dígitos
    if (/^(\d)\1{10}$/.test(cpf)) return false; // Elimina CPFs conhecidos como inválidos

    // Validação do primeiro dígito verificador
    let soma = 0;
    let peso = 10;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 === 10 || digito1 === 11) digito1 = 0;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    peso = 11;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 === 10 || digito2 === 11) digito2 = 0;
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true; // CPF válido
  }

  // Função para formatar CPF
  const formatarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, ''); // Remove tudo o que não for número
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  };

  // Função para formatar CEP
  const formatarCEP = (cep) => {
    cep = cep.replace(/\D/g, ''); // Remove tudo o que não for número
    if (cep.length <= 2) return cep;
    if (cep.length <= 5) return `${cep.slice(0, 2)}.${cep.slice(2)}`;
    return `${cep.slice(0, 2)}.${cep.slice(2, 5)}-${cep.slice(5, 8)}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let novoValor = value;

    // Formatar CEP e CPF ao digitar
    if (name === "cep") {
      novoValor = formatarCEP(value);
    }

    if (name === 'CPF_cliente') {
      novoValor = formatarCPF(value);
    }

    setCliente(prevCliente => ({
      ...prevCliente,
      [name]: novoValor,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === "cep") {
      buscarEnderecoPorCEP(value.replace(/\D/g, '')); // Remove caracteres não numéricos
    }
  };

  // // Função de validação do CPF ao sair do campo (onBlur)
  // const handleCPFBlur = () => {
  //   const cpfLimpo = cliente.CPF_cliente.replace(/\D/g, ''); // Remove a formatação

  //   if (cpfLimpo && !validarCPF(cpfLimpo)) {
  //     // alert('CPF inválido');
  //     setSnackbarMessage('CPF inválido');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //   }
  // };

  const validateForm = () => {
    let formErrors = {};
    let formIsValid = true;

    if (!cliente.nome_cliente) {
      formIsValid = false;
      formErrors.nome_cliente = 'Nome do cliente é obrigatório';
    }

    if (!cliente.CPF_cliente) {
      formIsValid = false;
      formErrors.CPF_cliente = 'CPF é obrigatório';
    }

    if (!cliente.telefone_cliente) {
      formIsValid = false;
      formErrors.telefone_cliente = 'Telefone é obrigatório';
    }

    setErrors(formErrors);
    return formIsValid;
  };

  const handleSaveCliente = async () => {
    if (!validateForm() && !validarNome(cliente.nome_cliente)) {
      return;
    }

    // Remove pontos e hífens do CPF e do CEP
    const cpfLimpo = cliente.CPF_cliente.replace(/\D/g, ''); // Remove tudo que não for número
    const cepLimpo = cliente.cep.replace(/\D/g, ''); // Remove tudo que não for número

    // Atualiza os valores no estado com os dados limpos
    setCliente((prevCliente) => ({
      ...prevCliente,
      CPF_cliente: cpfLimpo,
      cep: cepLimpo
    }));

    // Valida o CPF depois de limpar
    if (!validarCPF(cpfLimpo)) {
      setSnackbarMessage('CPF inválido');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; // Impede o envio do formulário se o CPF for inválido
    }
    try {
      const res = await fetch(url);
      const data = await res.json();

      const cpfDuplicado = data.some((c) => c.CPF_cliente === cpfLimpo);

      if (cpfDuplicado) {
        setSnackbarMessage("CPF já cadastrado.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return; // Interrompe a execução se o CPF já existir
      }

    } catch (error) {
      console.error("Erro ao buscar CPF dos clientes:", error);
    }

    // Salvar ou editar cliente
    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${url}/${id}` : url;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cliente,
          CPF_cliente: cpfLimpo,  // Garante que o CPF seja enviado sem formatação
          cep: cepLimpo           // Garante que o CEP seja enviado sem formatação
        }),
      });

      if (res.ok) {
        setSnackbarMessage('Cliente salvo com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate('/clientes');
      } else {
        setSnackbarMessage('Erro ao salvar cliente.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setSnackbarMessage("Erro ao salvar cliente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
                label="Nome* (Obrigatório)"
                color='red'
                variant="outlined"
                name="nome_cliente"
                value={cliente.nome_cliente}
                onChange={handleChange}
                error={!!errors.nome_cliente}
                helperText={errors.nome_cliente}
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
                <MenuItem value="AC">AC</MenuItem>
                <MenuItem value="AL">AL</MenuItem>
                <MenuItem value="AP">AP</MenuItem>
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="BA">BA</MenuItem>
                <MenuItem value="CE">CE</MenuItem>
                <MenuItem value="DF">DF</MenuItem>
                <MenuItem value="ES">ES</MenuItem>
                <MenuItem value="GO">GO</MenuItem>
                <MenuItem value="MA">MA</MenuItem>
                <MenuItem value="MT">MT</MenuItem>
                <MenuItem value="MS">MS</MenuItem>
                <MenuItem value="MG">MG</MenuItem>
                <MenuItem value="PA">PA</MenuItem>
                <MenuItem value="PB">PB</MenuItem>
                <MenuItem value="PR">PR</MenuItem>
                <MenuItem value="PE">PE</MenuItem>
                <MenuItem value="PI">PI</MenuItem>
                <MenuItem value="RJ">RJ</MenuItem>
                <MenuItem value="RN">RN</MenuItem>
                <MenuItem value="RS">RS</MenuItem>
                <MenuItem value="RO">RO</MenuItem>
                <MenuItem value="RR">RR</MenuItem>
                <MenuItem value="SC">SC</MenuItem>
                <MenuItem value="SP">SP</MenuItem>
                <MenuItem value="SE">SE</MenuItem>
                <MenuItem value="TO">TO</MenuItem>
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
                label="Telefone* (Obrigatório)"
                variant="outlined"
                name="telefone_cliente"
                value={cliente.telefone_cliente}
                onChange={handleChange}
                error={!!errors.telefone_cliente}
                helperText={errors.telefone_cliente}
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
                label="CPF* (Obrigatório)"
                variant="outlined"
                name="CPF_cliente"
                value={cliente.CPF_cliente}
                onChange={handleChange}
                error={!!errors.CPF_cliente}
                helperText={errors.CPF_cliente}
                // onBlur={handleCPFBlur}  // Valida ao perder o foco
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
            {id && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch
                    checked={cliente.status}
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

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default CadastroCliente;
