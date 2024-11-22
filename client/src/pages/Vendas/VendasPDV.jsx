import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Autocomplete,
  Snackbar,
  Container,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import DiscountIcon from "@mui/icons-material/Discount";
import { useBlocker } from "../../hooks/useBlocker"; // Assumindo que o hook está nesse caminho
import { useNavigate } from "react-router-dom";

const urlProdutos = "http://localhost:5000/produtos"; // API de produtos
const urlVendas = "http://localhost:5000/vendas"; // API de vendas
const urlVendasCanceladas = "http://localhost:5000/vendasCanceladas"; // API de vendas canceladas

const VendasPDV = () => {
  const [vendaEmAberto, setVendaEmAberto] = useState(false);
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [produtoDetalhado, setProdutoDetalhado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [precoUnidade, setPrecoUnidade] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [pesquisa, setPesquisa] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Controle do diálogo de finalizar venda
  const [openDescontoDialog, setOpenDescontoDialog] = useState(false); // Controle do diálogo de desconto
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [observacao, setObservacao] = useState("");
  const [descontoTemp, setDescontoTemp] = useState(0); // Estado temporário para armazenar o valor do desconto
  const [porcentagemTemp, setPorcentagemTemp] = useState(0); // Estado temporário para armazenar a porcentagem de desconto
  const [openDialogCancelamento, setOpenDialogCancelamento] = useState(false);
  const [observacaoCancelamento, setObservacaoCancelamento] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const inputRef = useRef(null)
  const [produtosVenda, setProdutosVenda] = useState(() => {
    // Carrega os produtos da venda do localStorage, se existir
    const savedProdutos = localStorage.getItem("produtosVenda");
    return savedProdutos ? JSON.parse(savedProdutos) : [];
  });

  const temVendaEmAndamento = () => produtosVenda.length > 0;
  useBlocker(
    ({ retry }) => {
      if (
        window.confirm(
          "Há uma venda em andamento. Deseja sair e cancelar esta venda?"
        )
      ) {
        localStorage.removeItem("produtosVeda"); // Limpa a venda se o usuário confirmar
        retry(); // Permite a navegação
      }
    },
    temVendaEmAndamento() // Bloqueia se há produtos na venda
  );

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (temVendaEmAndamento()) {
        e.preventDefault();
        e.returnValue = ""; // Necessário para mostrar o alerta no navegador
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [produtosVenda]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const produtosVenda =
      JSON.parse(localStorage.getItem("produtosVenda")) || [];
    setVendaEmAberto(produtosVenda.length > 0);
  }, []);

  const openSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const total = produtosVenda.reduce((sum, item) => {
      // Só inclui no total os produtos que não foram cancelados
      if (item.status !== "CANCELADO") {
        return sum + item.preco_venda * item.quantidade;
      }
      return sum;
    }, 0);
    const totalWithDiscount = Math.max(0, total - desconto); // Garante que valorTotal nunca seja menor que 1
    setValorTotal(totalWithDiscount);
    localStorage.setItem("produtosVenda", JSON.stringify(produtosVenda));
  }, [produtosVenda, desconto]);

  useEffect(() => {
    // Sempre que produtosVenda mudar, atualiza o localStorage
    localStorage.setItem("produtosVenda", JSON.stringify(produtosVenda));
  }, [produtosVenda]); // A dependência é o estado de produtosVenda

  useEffect(() => {
    const produtosVenda =
      JSON.parse(localStorage.getItem("produtosVenda")) || [];
    setVendaEmAberto(produtosVenda.length > 0);
  }, []);

  // Bloqueia a navegação
  useEffect(() => {
    // Previne a navegação ao sair da página
    const handleBeforeUnload = (event) => {
      if (vendaEmAberto) {
        const confirmationMessage =
          "Você tem uma venda em aberto. Deseja mesmo sair? Todas as alterações podem ser perdidas.";
        event.returnValue = confirmationMessage; // Padrão para navegadores modernos
        return confirmationMessage; // Para alguns navegadores mais antigos
      }
    };

    // Registra o evento antes de sair
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup (desregistra o evento)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [vendaEmAberto]);

  const handleValorDescontoChange = (e) => {
    // Captura o valor inserido no campo, usando vírgula como separador decimal
    let value = e.target.value;
    // Substitui a vírgula por ponto para facilitar a conversão para float
    value = value.replace(",", ".");
    // Remove caracteres não numéricos, exceto ponto
    value = value.replace(/[^0-9.]/g, "");
    // Verifica se há mais de uma casa decimal e limita a 2 casas decimais
    if (value.indexOf(".") !== -1) {
      const parts = value.split(".");
      if (parts[1]?.length > 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }
    }
    // Converte o valor para float, garantindo que não seja NaN
    const floatValue = parseFloat(value) || 0;
    // Limita o valor a um mínimo de 0
    const limitedValue = Math.max(0, floatValue);
    // Validação: desconto não pode ser maior que o total
    const totalSemDesconto = produtosVenda.reduce((sum, item) => {
      return sum + item.preco_venda * item.quantidade;
    }, 0);
    if (limitedValue >= totalSemDesconto) {
      openSnackbar(
        "O desconto não pode ser maior que o total da venda.",
        "error"
      );
      return;
    }
    // Atualiza o estado com o valor do desconto e a porcentagem
    setDescontoTemp(limitedValue);
    setPorcentagemTemp(((limitedValue / totalSemDesconto) * 100).toFixed(2));
  };

  const handlePorcentagemDescontoChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    // Limita a entrada a dois dígitos
    const limitedValue = Math.min(99, Math.max(0, value));
    setPorcentagemTemp(limitedValue);
    // Calcula o valor de desconto com base na porcentagem
    const totalSemDesconto = produtosVenda.reduce((sum, item) => {
      return sum + item.preco_venda * item.quantidade;
    }, 0);
    const descontoCalculado = (limitedValue / 100) * totalSemDesconto;
    if (descontoCalculado > totalSemDesconto) {
      if (descontoTemp > totalSemDesconto) {
        openSnackbar(
          "O desconto não pode ser maior que o total da venda.",
          "error"
        );
        return;
      }
      return;
    }
    setDescontoTemp(descontoCalculado.toFixed(2));
  };

  const handleConfirmarDesconto = () => {
    const totalSemDesconto = produtosVenda.reduce((sum, item) => {
      return sum + item.preco_venda * item.quantidade;
    }, 0);

    const descontoValidado = parseFloat(descontoTemp) || 0;

    if (descontoValidado >= totalSemDesconto) {
      openSnackbar(
        "O desconto não pode ser maior que o total da venda.",
        "error"
      );
    } else {
      setDesconto(descontoValidado);
      setOpenDescontoDialog(false);
    }
  };

  const handleAplicarDesconto = () => {
    setOpenDescontoDialog(true);
  };

  const handlePesquisaProduto = async (pesquisa) => {
    try {
      const res = await fetch(`${urlProdutos}?codigo_barras=${pesquisa}`);
      const data = await res.json();
      setProdutos(data); // Atualiza a lista de produtos
      console.log("Produtos retornados:", data);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  };

  const handleCancelarProduto = (id) => {
    console.log("Iniciando cancelamento do produto com ID:", id);

    // Verifique os produtos na venda antes de aplicar a mudança
    console.log("Produtos antes de cancelar:", produtosVenda);

    // Atualizar o estado de produtosVenda de forma imutável
    setProdutosVenda((prev) => {
      const novosProdutos = prev.map((prod) => {
        // Se o id do produto for igual ao id passado, altera o status e zera a quantidade
        if (prod.id_produto === id) {
          console.log(`Produto ${prod.id_produto} encontrado. Cancelando...`);
          return { ...prod, status: "CANCELADO", quantidade: 0 };
        }
        return prod; // Não altera os outros produtos
      });

      // Verifique o estado após a atualização
      console.log("Produtos após o cancelamento:", novosProdutos);
      return novosProdutos;
    });
  };

  const handleAdicionarProduto = (produto, quantidade) => {
    console.log("Produto Detalhado:", produto);
    console.log("Quantidade:", quantidade);
    console.log("Produtos na Venda (antes):", produtosVenda);
  
    if (!produto) {
      openSnackbar("Nenhum produto selecionado.", "error");
      return; // Se não houver produto detalhado, encerra a função
    }
  
    if (quantidade <= 0) {
      openSnackbar("A quantidade deve ser maior que zero.", "error");
      return; // Validação para impedir quantidade inválida
    }
  
    // Verifica se o produto já existe na lista
    const produtoExistente = produtosVenda.find(
      (prod) => prod.id_produto === produto.id_produto
    );
  
    setProdutosVenda((prev) => {
      let updatedProdutosVenda;
  
      if (produtoExistente) {
        // Se já existe, incrementa a quantidade e redefine o status para "OK"
        updatedProdutosVenda = prev.map((prod) =>
          prod.id_produto === produto.id_produto
            ? {
                ...prod,
                quantidade: prod.quantidade + quantidade,
                status: "OK", // Atualiza o status para "OK"
              }
            : prod
        );
        
      } else {
        // Adiciona o produto como novo item
        updatedProdutosVenda = [
          { ...produto, quantidade, status: "OK" },
          ...prev, // Coloca o novo produto no começo da lista
        ];
        setPesquisa("");
      }
      setPesquisa("");
      return updatedProdutosVenda;
    });
  };
  

  const handleFinalizarVenda = async () => {
    if (valorTotal <= 0) {
      openSnackbar("Escolha um produto antes de finalizar.", "error");
    } else {
      setOpenDialog(true);
    }
  };

  const handleIncluirVenda = async () => {
    try {
      const venda = {
        nf_venda: "40028922", // Número da nota fiscal (deve ser gerado dinamicamente ou vindo de algum lugar)
        valor_total: valorTotal || 0, // Valor total da venda
        metodo_pagamento: tipoPagamento || "indefinido", // Tipo de pagamento
        desconto: desconto || 0, // Desconto aplicado
        obs_vendas: observacao || "", // Observação
        id_cliente: 1 || null, // ID do cliente
        id_usuario: 1 || null, // ID do usuário
      };

      console.log("Venda:", venda);
      console.log("Produtos na venda:", produtosVenda);

      const res = await fetch(urlVendas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venda: venda,
          produtos: produtosVenda,
        }),
      });

      const data = await res.json(); // Captura a resposta da API

      if (res.ok) {
        // Se a resposta for bem-sucedida, feche o diálogo
        console.log(data.message); // Mensagem de sucesso
        openSnackbar("Venda realizada com sucesso!", "success");
        setProdutosVenda([]);
        setDesconto(0);
        setObservacao("");
        setValorTotal(0);
        localStorage.removeItem("produtosVenda");
        setOpenDialog(false); // Fecha o diálogo de finalização de venda

        // Limpa o localStorage após a venda
        localStorage.removeItem("produtosVenda");
      } else {
        console.error("Erro ao finalizar venda:", data.message);
        openSnackbar("Error ao finalizar venda.", "error");
      }
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      openSnackbar("Error ao finalizar venda.", "error");
    }
  };

  const handleConfirmarCancelamento = async () => {
    try {
      if (Number(valorTotal) === 0) {
        openSnackbar(
          "Não é possível cancelar uma venda com valor total igual a zero.",
          "warning"
        );
        return;
      }
      const venda_cancelada = {
        valor_total: Number(valorTotal || 0).toFixed(2), // Certifica que é um número com 2 casas decimais
        metodo_pagamento: tipoPagamento || "Não Selecionado", // Tipo de pagamento
        desconto: Number(desconto || 0).toFixed(4), // Certifica que é um número com 2 casas decimais
        obs_vendas_canceladas: observacao || "Venda Cancelada PDV", // Observação
        id_cliente: 1 || null, // ID do cliente
        id_usuario: 1 || null, // ID do usuário
      };

      const res = await fetch(urlVendasCanceladas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venda_cancelada: venda_cancelada,
          produtos: produtosVenda,
        }),
      });

      const data = await res.json(); // Captura a resposta da API

      if (res.ok) {
        console.log(data.message); // Mensagem de sucesso
        openSnackbar("Venda cancelada com sucesso!", "info");
        setProdutosVenda([]);
        setDesconto(0);
        setObservacaoCancelamento("");
        setValorTotal(0);
        setOpenDialogCancelamento(false); // Fecha o diálogo de finalização de venda
        localStorage.removeItem("produtosVenda"); // Limpa o localStorage após a venda
      } else {
        console.error("Erro ao finalizar venda:", data.message);
        openSnackbar("Erro ao cancelar venda.", "error");
      }
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      openSnackbar("Erro ao finalizar venda.", "error");
    }
  };

  // const columns = [
  //   { field: "nome_produto", headerName: "Descrição", flex: 8 },
  //   {
  //     field: "status",
  //     headerName: "Status",
  //     flex: 1,
  //     renderCell: (params) =>
  //       params.value === "OK" ? (
  //         <CheckCircleIcon color="success" />
  //       ) : (
  //         <CancelIcon color="error" />
  //       ),
  //   },
  //   { field: "codigo_interno", headerName: "Código", flex: 1.5 },
  //   { field: "unidade_medida", headerName: "Unidade", flex: 1.5 },
  //   { field: "preco_venda", headerName: "Preço", flex: 1 },
  //   { field: "quantidade", headerName: "Quantidade", flex: 1 },
  //   {
  //     field: "actions",
  //     headerName: "Ações",
  //     flex: 1.8,
  //     renderCell: (params) => (
  //       <Button
  //         color="error"
  //         onClick={() => handleCancelarProduto(params.row.id_produto)}
  //       >
  //         Cancelar
  //       </Button>
  //     ),
  //   },
  // ];

  return (
    <>
      <div
        className="tudo"
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: "calc(100vh - 65px)",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            "@media (max-width: 700px)": {
              flexWrap: "wrap",
            },
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 1,
              width: "70%",
              maxHeight: "75vh",
              minHeight: 720,
              minWidth: 350,
              borderRadius: "12px",
              "@media (max-width: 700px)": {
                height: "auto",
                width: "100%",
                maxHeight: "100%",
                minHeight: "100%",
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: 40,
                color: "#213635",
                fontWeight: "bold",
                display: "flex",
                gap: "12px",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "3px",
                height: "100%",
                "@media (min-width: 700px)": {
                  display: "none",
                },
              }}
            >
              PDV 1
            </Typography>
            <Container
              maxWidth="lg"
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: 2,
                justifyContent: "space-around",
                height: "100%",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
              <Autocomplete
      disablePortal
      value={produtoSelecionado} // Usa o produto selecionado
      onInputChange={(event, newInputValue) => {
        handlePesquisaProduto(newInputValue); // Chama a função de pesquisa
      }}
      options={produtos} // Exibe os produtos filtrados, altere conforme necessário
      getOptionLabel={(option) => option.nome_produto || 'Pesquise'}
      onChange={(event, newValue) => {
        if (newValue) {
          setProdutoSelecionado(newValue);
          handleAdicionarProduto(newValue, quantidade); // Passa o produto e quantidade diretamente

          // Seleciona o texto do input após selecionar um produto
          if (inputRef.current) {
            inputRef.current.select();
          }
        }
      }}
      sx={{
        flex: 5,
        mb: 2,
        "@media (max-width: 700px)": {
          flex: 3,
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Pesquisar"
          inputRef={inputRef} // Ref para o campo de entrada
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id_produto}>
          {option.nome_produto} - {option.codigo_interno}
        </li>
      )}
    />
                <TextField
                  fullWidth
                  label="Quantidade"
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
              </Box>

              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#F2F2F2",
                  borderRadius: "12px",
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
              >
                <DataGrid
                  rows={produtosVenda}
                  columns={[
                    { field: "nome_produto", headerName: "Descrição", flex: 6 },
                    { field: "status", headerName: "Status", flex: 2.5 },
                    {
                      field: "codigo_interno",
                      headerName: "Código",
                      flex: 2,
                    },
                    {
                      field: "unidade_medida",
                      headerName: "Unidade",
                      flex: 2,
                    },
                    { field: "preco_venda", headerName: "Preço", flex: 1.5 },
                    {
                      field: "quantidade",
                      headerName: "Quantidade",
                      flex: 2.3,
                    },
                    {
                      field: "actions",
                      headerName: "Ações",
                      flex: 2.7,
                      renderCell: (params) => (
                        <Button
                          color="error"
                          onClick={() =>
                            handleCancelarProduto(params.row.id_produto)
                          }
                        >
                          Cancelar
                        </Button>
                      ),
                    },
                  ]}
                  disableSelectionOnClick
                  getRowId={(row) => row.id_produto}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  sx={{
                    boxShadow: 0,
                    width: "100%",
                    height: 540,
                    border: 0,
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                    "@media (max-width: 700px)": {
                      height: 400,
                      // Ajustes para telas pequenas
                      "& .MuiDataGrid-columnHeader": {
                        fontSize: "13px", // Ajusta o tamanho da fonte do cabeçalho
                      },
                      "& .MuiDataGrid-cell": {
                        fontSize: "13px", // Ajusta o tamanho da fonte das células
                      },
                      // Ajuste de tamanho de coluna para o cabeçalho e as células
                      "& .MuiDataGrid-columnHeader:nth-child(2), & .MuiDataGrid-cell:nth-child(2)":
                        {
                          flex: 1, // Descrição
                          minWidth: 150,
                        },
                      "& .MuiDataGrid-columnHeader:nth-child(7), & .MuiDataGrid-cell:nth-child(7)":
                        {
                          flex: 3, // Quantidade
                          minWidth: 85,
                        },
                      "& .MuiDataGrid-columnHeader:nth-child(8), & .MuiDataGrid-cell:nth-child(8)":
                        {
                          flex: 1, // Ações
                          minWidth: 118,
                        },
                      // Oculta as colunas 3-6 tanto no cabeçalho quanto nas células
                      "& .MuiDataGrid-columnHeader:nth-child(n+3):not(:nth-child(7)):not(:nth-child(8)), & .MuiDataGrid-cell:nth-child(n+3):not(:nth-child(7)):not(:nth-child(8))":
                        {
                          display: "none", // Oculta cabeçalhos e células a partir da 3ª coluna (exceto as 7ª e 8ª)
                        },
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "10%",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h4"
                  align="center"
                  sx={{
                    backgroundColor: "#f1f1f1",
                    p: 2,
                    borderRadius: 2,
                    "@media (min-width: 700px)": {
                      display: "none",
                    },
                  }}
                >
                  R$ {valorTotal.toFixed(2)}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    p: 0.5,
                    "@media (max-width: 700px)": {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DiscountIcon />}
                    onClick={handleAplicarDesconto}
                    sx={{
                      "@media (max-width: 700px)": {
                        width: "100%",
                      },
                    }}
                  >
                    Desconto
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setOpenDialogCancelamento(true)}
                    sx={{
                      "@media (max-width: 700px)": {
                        width: "100%",
                      },
                    }}
                  >
                    Cancelar Venda
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<ShoppingCartCheckoutIcon />}
                    onClick={handleFinalizarVenda}
                    sx={{
                      marginLeft: "auto",
                      "@media (max-width: 700px)": {
                        width: "100%",
                      },
                    }}
                  >
                    Finalizar Venda
                  </Button>
                </Box>
              </Box>
            </Container>
          </Paper>

          <Paper
            elevation={1}
            sx={{
              p: 2.5,
              borderRadius: "12px",
              height: "75vh",
              minHeight: 720,
              width: "35%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
              gap: 1.5,
              "@media (max-width: 700px)": {
                display: "none",
              },
            }}
          >
            {/* <Typography variant="h6"></Typography> */}
            {/* <TextField
            fullWidth
            label="Pesquisar por código, descrição"
            variant="outlined"
            value={pesquisa}
            onClick={(e) =>handlePesquisaProduto()}
            // onChange={(e) => setPesquisa(e.target.value)}
            // onKeyPress={(e) => e.key === "Enter" && handlePesquisaProduto()}
            sx={{ mb: 2 }}
          /> */}

            {/* {produtos.length > 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Selecione um produto:</Typography>
            </Box>
          )} */}

            {/* {produtos.length > 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Selecione um produto:</Typography>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            {produtos.length > 1 && (
              <Typography variant="h6">Selecione um produto:</Typography>
            )}
            {produtos.map((produto) => (
              <Button
                key={produto.id_produto}
                variant="outlined"
                sx={{ display: "block", mb: 1 }}
                onClick={() => {
                  setProdutoDetalhado(produto);
                  setPrecoUnidade(produto.preco_venda);
                  setProdutos([]);
                }}
              >
                {produto.nome_produto} - {produto.codigo_interno}
              </Button>
            ))}
          </Box> */}
            <div
              className="header"
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "3px",
                height: "100%",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  marginBottom: "0",
                  fontSize: 90,
                  color: "#213635",
                  fontWeight: "bold",
                }}
              >
                PDV 1
              </Typography>
            </div>
            <TextField
              fullWidth
              label="Descrição"
              value={produtoSelecionado ? produtoSelecionado.nome_produto : ""}
              variant="filled"
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Código"
              value={
                produtoSelecionado ? produtoSelecionado.codigo_interno : ""
              }
              variant="filled"
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Unidade"
              type="text"
              value={
                produtoSelecionado ? produtoSelecionado.unidade_medida : ""
              }
              onChange={(e) => setPrecoUnidade(Number(e.target.value))}
              variant="filled"
              InputProps={{ readOnly: true }}
              sx={{ mb: 2, cursor: "pointer" }}
            />

            <TextField
              fullWidth
              label="Preço Unidade"
              type="number"
              value={produtoSelecionado ? produtoSelecionado.preco_venda : ""}
              onChange={(e) => setPrecoUnidade(Number(e.target.value))}
              variant="filled"
              InputProps={{ readOnly: true }}
              sx={{ mb: 2, cursor: "pointer" }}
            />

            <Typography
              variant="h4"
              align="center"
              sx={{ backgroundColor: "#f1f1f1", p: 2, borderRadius: 2 }}
            >
              R$ {valorTotal.toFixed(2)}
            </Typography>
            {/* <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => handleAdicionarProduto()}
          >
            Adicionar Produto
          </Button> */}
          </Paper>
        </Box>
      </div>
      {/* Dialog de Finalização de Venda */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Finalizar Venda</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Pagamento</InputLabel>
            <Select
              value={tipoPagamento}
              onChange={(e) => setTipoPagamento(e.target.value)}
              label="Tipo de Pagamento"
            >
              <MenuItem value="Débito">Débito</MenuItem>
              <MenuItem value="Crédito">Crédito</MenuItem>
              {/* <MenuItem value="Dinheiro">PIX</MenuItem> */}
              <MenuItem value="Dinheiro">Dinheiro</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Valor Total"
            type="number"
            value={valorTotal.toFixed(2)}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Observação"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleIncluirVenda} color="primary">
            Incluir
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialogCancelamento}
        onClose={() => setOpenDialogCancelamento(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Cancelar Venda</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Você tem certeza que deseja cancelar esta venda? Esta ação não pode
            ser desfeita.
          </Typography>
          <TextField
            fullWidth
            label="Observação (opcional)"
            value={observacaoCancelamento}
            onChange={(e) => setObservacaoCancelamento(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Valor Total"
            type="number"
            value={valorTotal.toFixed(2)}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Desconto Aplicado"
            type="number"
            value={desconto.toFixed(2)}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialogCancelamento(false)}
            color="secondary"
          >
            Voltar
          </Button>
          <Button
            onClick={handleConfirmarCancelamento}
            color="error"
            variant="contained"
          >
            Confirmar Cancelamento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Aplicação de Desconto */}
      <Dialog
        open={openDescontoDialog}
        onClose={() => setOpenDescontoDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Aplicar Desconto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Valor do Desconto"
            type="number"
            value={descontoTemp}
            onChange={handleValorDescontoChange} // Atualiza o estado temporário
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ), // Adiciona "R$" no início
              inputProps: { min: 0 },
            }}
          />
          <TextField
            fullWidth
            label="% de Desconto"
            type="number"
            value={porcentagemTemp}
            onChange={handlePorcentagemDescontoChange} // Atualiza o estado temporário
            margin="normal"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>, // Adiciona "%" no final
              inputProps: { min: 0, max: 99 },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDescontoDialog(false)}
            color="secondary"
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirmarDesconto} color="primary">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VendasPDV;
