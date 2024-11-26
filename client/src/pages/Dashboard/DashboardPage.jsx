import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Grid, Divider } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";
import { BarChart } from "@mui/x-charts/BarChart";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AttachMoney, CreditCard, AccountBalanceWallet } from '@mui/icons-material';

import MickChat from "../../components/MickChat/MickChat"; // Importa o chatbot
// <MickChat />

const Dashboard = () => {
  const [totalVendido, setTotalVendido] = useState();
  const [totalInvestido, setTotalInvestido] = useState();
  const [totalVendaDia, setTotalVendaDia] = useState();
  const [qtdeVendaDia, setQtdeVendaDia] = useState();

  const [vendas, setVendas] = useState([]);
  const [vendasCanceladas, setVendasCanceladas] = useState([]);
  const [graficoPizzaData, setGraficoPizzaData] = useState([]);
  const [graficoLinhaBarrasData, setGraficoLinhaBarrasData] = useState([]);
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [loading, setLoading] = useState(false);

  dayjs.extend(utc);
  dayjs.locale("pt-br");

  const urlVendas = "http://localhost:5000/vendas";
  const urlVendasCanceladas = "http://localhost:5000/vendasCanceladas";
  const urlDashboard = "http://localhost:5000/dashboard";

  const { user } = useSelector((state) => state.auth);

  const calcularGraficoPizza = (vendas) => {
    const totalVendas = vendas.reduce(
      (acc, venda) => acc + venda.valor_total,
      0
    );
    const vendasPorPagamento = vendas.reduce((acc, venda) => {
      acc[venda.metodo_pagamento] =
        (acc[venda.metodo_pagamento] || 0) + venda.valor_total;
      return acc;
    }, {});
    const graficoData = Object.keys(vendasPorPagamento).map((metodo) => ({
      id: metodo,
      label: metodo,
      value: parseFloat(
        ((vendasPorPagamento[metodo] / totalVendas) * 100).toFixed(2)
      ),
    }));
    setGraficoPizzaData(graficoData);
  };

  const agruparPorData = (vendas) => {
    const agrupado = vendas.reduce((acc, item) => {
      const date = dayjs(item.data_compra).format("YYYY-MM-DD");
      acc[date] = (acc[date] || 0) + item.valor_total;
      return acc;
    }, {});
    return Object.keys(agrupado).map((date) => ({
      date,
      total: agrupado[date],
    }));
  };

  const buscarDados = async () => {
    setLoading(true);
    try {
      const resVendas = await fetch(urlVendas);
      const dataVendas = await resVendas.json();
      const resCanceladas = await fetch(urlVendasCanceladas);
      const dataCanceladas = await resCanceladas.json();

      const vendasFiltradas = dataVendas.filter((item) => {
        const itemDate = dayjs(item.data_compra);
        return (
          (!dataInicial || itemDate.isSameOrAfter(dayjs(dataInicial), "day")) &&
          (!dataFinal || itemDate.isSameOrBefore(dayjs(dataFinal), "day"))
        );
      });

      calcularGraficoPizza(vendasFiltradas);
      setGraficoLinhaBarrasData(agruparPorData(vendasFiltradas));
      setVendas(vendasFiltradas);
      setVendasCanceladas(dataCanceladas);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDados();
    handleGetDataDashboard();
  }, [dataInicial, dataFinal]);

  const handleGetDataDashboard = async () => {
    try {
      const res = await fetch(`${urlDashboard}/totalvendido`);

      if (res.ok) {
        const data = await res.json();
        console.log("Total Vendido:", data);  // Isso vai exibir o array no console
        if (Array.isArray(data) && data.length > 0) {
          setTotalVendido(data[0].valor_total_vendido);  // Acessa o valor do primeiro objeto do array
        } else {
          console.error("Dados inesperados para totalvendido");
        }
      } else {
        console.error("Erro ao buscar qtde_total_vendas");
      }
    } catch (error) {
      console.log(error.message);
    }

    try {
      const res = await fetch(`${urlDashboard}/totalinvestido`);

      if (res.ok) {
        const data = await res.json();
        console.log("Total Investido:", data);
        if (Array.isArray(data) && data.length > 0) {
          setTotalInvestido(data[0].valor_total_investido);  // Acessa o valor do primeiro objeto do array
        } else {
          console.error("Dados inesperados para totalinvestido");
        }
      } else {
        console.error("Erro ao buscar totalinvestido");
      }
    } catch (error) {
      console.log(error.message);
    }

    try {
      const res = await fetch(`${urlDashboard}/vendadia`);

      if (res.ok) {
        const data = await res.json();
        console.log("Vendas do dia:", data);
        if (Array.isArray(data) && data.length > 0) {
          // Verifica se o valor_total_vendido existe e não é null
          setTotalVendaDia(data[0].valor_total_vendido ?? 0);  // Usa 0 caso valor_total_vendido seja null ou undefined
        } else {
          console.error("Dados inesperados para vendadia");
          setTotalVendaDia(0); // Garante que seja 0 se não houver dados
        }
      } else {
        console.error("Erro ao buscar vendadia");
      }
    } catch (error) {
      console.log(error.message);
    }

    try {
      const res = await fetch(`${urlDashboard}/qtdevendadia`);

      if (res.ok) {
        const data = await res.json();
        console.log("Quantidade de vendas do dia:", data);
        if (Array.isArray(data) && data.length > 0) {
          setQtdeVendaDia(data[0].qtde_total_vendas);  // Acessa o valor do primeiro objeto do array
        } else {
          console.error("Dados inesperados para qtdevendadia");
        }
      } else {
        console.error("Erro ao buscar qtdevendadia");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Typography variant="h2" sx={{ textAlign: "center", mt: 3, mb: 4 }}>
        Dashboard
      </Typography>
      <Box sx={{ padding: 3, width: "100vw", display: "flexwrap", justifyContent: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          <Paper sx={{ padding: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              sx={{ paddingBottom: 3, gap: 2 }}
            >
              <AccountCircleIcon fontSize="large" />
              <Typography variant="h6">
                Bem-vindo, {user.nome_usuario}!
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Resumo</Typography>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {/* Card - Pedidos de Venda */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoney sx={{ mr: 1, color: '#3f51b5' }} />
                    Pedidos de Venda Diária
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography sx={{ fontWeight: "bold", fontSize: "20px" }} variant="body1">Quantidade do dia: {qtdeVendaDia}</Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "20px" }} variant="body1">Total do dia: R$ {totalVendaDia}</Typography>
                </Paper>
              </Grid>

              {/* Card - Contas a Receber */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CreditCard sx={{ mr: 1, color: '#3f51b5' }} />
                    Contas a Receber
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography sx={{ fontWeight: "bold", fontSize: "20px" }} variant="body1">Total a receber: R$ {totalVendido}</Typography>
                </Paper>
              </Grid>

              {/* Card - Contas a Pagar */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalanceWallet sx={{ mr: 1, color: '#3f51b5' }} />
                    Contas a Pagar
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography sx={{ fontWeight: "bold", fontSize: "20px" }} variant="body1">Total a pagar: R$ {totalInvestido}</Typography>
                </Paper>
              </Grid>

              {/* Card - MickChat */}
              {/* <Grid item xs={12} sm={6} md={4}>
    <Paper sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        MickChat
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <MickChat />
    </Paper>
  </Grid> */}
            </Grid>

          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gráfico de Pizza
            </Typography>
            {graficoPizzaData.length > 0 ? (
              <PieChart series={[{ data: graficoPizzaData }]} height={300} />
            ) : (
              <Typography>Sem dados para exibir.</Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gráfico de Barras
            </Typography>
            {graficoLinhaBarrasData.length > 0 ? (
              <BarChart
                height={300}
                xAxis={[
                  {
                    data: graficoLinhaBarrasData.map((item) => item.date),
                    scaleType: "band",
                    title: "Data",
                  },
                ]}
                series={[
                  {
                    data: graficoLinhaBarrasData.map((item) => item.total),
                    title: "Vendas",
                  },
                ]}
              />
            ) : (
              <Typography>Sem dados para exibir.</Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
