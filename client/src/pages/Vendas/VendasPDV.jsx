import React, { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ImageIcon from "@mui/icons-material/Image";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import DiscountIcon from '@mui/icons-material/Discount';

const urlProdutos = "http://localhost:5000/produtos"; // API de produtos
const urlVendas = "http://localhost:5000/vendas"; // API de vendas
const urlVendasCanceladas = "http://localhost:5000/vendasCanceladas"; // API de vendas canceladas

const VendasPDV = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtosVenda, setProdutosVenda] = useState(() => {
    // Carrega os produtos da venda do localStorage, se existir

    const savedProdutos = localStorage.getItem("produtosVenda");
    return savedProdutos ? JSON.parse(savedProdutos) : [];
  });
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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

  const handleValorDescontoChange = (e) => {
    // Captura o valor inserido no campo, usando vírgula como separador decimal
    let value = e.target.value;
  
    // Substitui a vírgula por ponto para facilitar a conversão para float
    value = value.replace(',', '.');
  
    // Remove caracteres não numéricos, exceto ponto
    value = value.replace(/[^0-9.]/g, '');
  
    // Verifica se há mais de uma casa decimal e limita a 2 casas decimais
    if (value.indexOf('.') !== -1) {
      const parts = value.split('.');
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
  

  // Atualizar o valor de desconto quando a porcentagem for alterada
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

    if (descontoTemp >= totalSemDesconto) {
      openSnackbar(
        "O desconto não pode ser maior que o total da venda.",
        "error"
      );
    } else {
      setDesconto(descontoTemp);
      setOpenDescontoDialog(false);
    }
  };

  const handleAplicarDesconto = () => {
    setOpenDescontoDialog(true);
  };

  const handlePesquisaProduto = async () => {
    try {
      const res = await fetch(`${urlProdutos}?id=${pesquisa}`);
      const data = await res.json();
      setProdutos(data);
      if (data.length === 1) {
        setProdutoDetalhado(data[0]);
        setPrecoUnidade(data[0].preco);
      } else {
        setProdutoDetalhado(null);
      }
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
  
  const handleAdicionarProduto = () => {
    if (!produtoDetalhado) return;

    // Verifica se o produto já existe na venda
    const produtoExistente = produtosVenda.find(
      (prod) => prod.id_produto === produtoDetalhado.id_produto
    );

    if (produtoExistente) {
      if (produtoExistente.status === "CANCELADO") {
        // Se o produto estiver cancelado, altera o status para 'OK' e incrementa a quantidade
        setProdutosVenda((prev) =>
          prev.map((prod) =>
            prod.id_produto === produtoDetalhado.id_produto
              ? {
                  ...prod,
                  status: "OK",
                  quantidade: produtoExistente.quantidade + quantidade,
                }
              : prod
          )
        );
      } else {
        // Se o produto não estiver cancelado, apenas incrementa a quantidade
        setProdutosVenda((prev) =>
          prev.map((prod) =>
            prod.id_produto === produtoDetalhado.id_produto
              ? { ...prod, quantidade: prod.quantidade + quantidade }
              : prod
          )
        );
      }
    } else {
      // Se o produto não existir, adiciona ele com a quantidade e status 'OK'
      setProdutosVenda((prev) => [
        ...prev,
        { ...produtoDetalhado, quantidade, status: "OK" },
      ]);
    }

    setQuantidade(1); // Reseta a quantidade para 1 após adicionar o produto
  };

  const handleFinalizarVenda = async () => {
    if (valorTotal <= 0){
      openSnackbar(
        "Escolha um produto antes de finalizar.",
        "error"
      );
    }else{
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
        openSnackbar(
          "Venda realizada com sucesso!",
          "success")
        setProdutosVenda([]);
        setDesconto(0);
        setObservacao("");
        setValorTotal(0);
        setOpenDialog(false); // Fecha o diálogo de finalização de venda

        // Limpa o localStorage após a venda
        localStorage.removeItem("produtosVenda");
      } else {
        console.error("Erro ao finalizar venda:", data.message);
        alert("Erro ao finalizar venda");
      }
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      alert("Erro ao finalizar venda");
    }
  };

  const handleCancelarVenda = async () => {
    try {
      const venda_cancelada = {
        valor_total: valorTotal || 0, // Valor total da venda
        metodo_pagamento: tipoPagamento || "Não Selecionado", // Tipo de pagamento
        desconto: desconto || 0, // Desconto aplicado
        obs_vendas_canceladas: observacao || "Venda Cancelada PDV", // Observação
        id_cliente: 1 || null, // ID do cliente
        id_usuario: 1 || null, // ID do usuário
      };

      console.log("Venda:", venda_cancelada);
      console.log("Produtos na venda:", produtosVenda);

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
        // Se a resposta for bem-sucedida, feche o diálogo
        console.log(data.message); // Mensagem de sucesso
        openSnackbar(
          "Venda cancelada com sucesso!",
          "info")
        setProdutosVenda([]);
        setDesconto(0);
        setObservacao("");
        setValorTotal(0);
        setOpenDialog(false); // Fecha o diálogo de finalização de venda

        // Limpa o localStorage após a venda
        localStorage.removeItem("produtosVenda");
      } else {
        console.error("Erro ao finalizar venda:", data.message);
        alert("Erro ao finalizar venda");
      }
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      alert("Erro ao finalizar venda");
    }
  };

  const columns = [
    { field: "nome_produto", headerName: "Descrição", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) =>
        params.value === "OK" ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
    },
    { field: "codigo_interno", headerName: "Código", width: 150 },
    { field: "unidade_medida", headerName: "Unidade", width: 120 },
    { field: "preco_venda", headerName: "Preço", width: 100 },
    { field: "quantidade", headerName: "Quantidade", width: 100 },
    {
      field: "actions",
      headerName: "Ações",
      width: 150,
      renderCell: (params) => (
        <Button
          color="error"
          onClick={() => handleCancelarProduto(params.row.id_produto)}
        >
          Cancelar
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", p: 2, gap: 2 }}>
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
      <Paper sx={{ width: "70%" }}>
        <Box sx={{ flex: 1, p: 2 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            PDV 1
          </Typography>
          <DataGrid
            rows={produtosVenda}
            columns={columns}
            disableSelectionOnClick
            getRowId={(row) => row.id_produto}
            pageSize={5}
            rowsPerPageOptions={[5]}
            sx={{
              backgroundColor: "#F1F1F1",
              mb: 2,
              width: "100%",
              height: "580px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              startIcon={<DiscountIcon  />}
              onClick={handleAplicarDesconto}
            >
              Desconto
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancelarVenda}
            >
              Cancelar Venda
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleFinalizarVenda}
            >
              Finalizar Venda
            </Button>
          </Box>
        </Box>
      </Paper>
      <Box sx={{ flex: 1 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Pesquisar</Typography>
          <TextField
            fullWidth
            label="Pesquisar por código, descrição"
            variant="outlined"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePesquisaProduto()}
            sx={{ mb: 2 }}
          />
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
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 150,
              border: "1px solid lightgrey",
              mb: 2,
            }}
          >
            <ImageIcon sx={{ fontSize: 80, color: "lightgrey" }} />
          </Box>

          <TextField
            fullWidth
            label="Descrição"
            value={produtoDetalhado ? produtoDetalhado.nome_produto : ""}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Código"
            value={produtoDetalhado ? produtoDetalhado.codigo_interno : ""}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Preço Unidade"
            type="number"
            value={produtoDetalhado ? produtoDetalhado.preco_venda : ""}
            onChange={(e) => setPrecoUnidade(Number(e.target.value))}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <Typography
            variant="h4"
            align="center"
            sx={{ backgroundColor: "#f1f1f1", p: 2, borderRadius: 2 }}
          >
            R$ {valorTotal.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAdicionarProduto}
          >
            Adicionar Produto
          </Button>
        </Paper>
      </Box>

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
    </Box>
  );
};

export default VendasPDV;
