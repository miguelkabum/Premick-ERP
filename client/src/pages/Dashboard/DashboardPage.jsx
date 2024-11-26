import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";
import { BarChart } from "@mui/x-charts/BarChart";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
        setTotalVendido(data.valor_total_vendido);
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
        setTotalInvestido(data.valor_total_investido);
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
        setTotalVendaDia(data.valor_total_vendido);
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
        setQtdeVendaDia(data.qtde_total_vendas);
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
            <Box>
              <Button>Visão Geral</Button>
              <Button>Eventos</Button>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={4}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Pedidos de Venda</Typography>
                <Typography variant="body2">Qtde de vendas: {qtdeVendaDia}</Typography>
                <Typography variant="body2">Total de vendas: {totalVendaDia}</Typography>
                <Typography variant="body2">Em andamento: 5</Typography>
                <Typography variant="body2">Cancelados: 0</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Contas a Receber</Typography>
                <Typography variant="body2">Total: R$ {totalVendido}</Typography>
                <Typography variant="body2">Taxas: R$ 10</Typography>
                <Typography variant="body2">Líquido: R$ 59</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Contas a Pagar</Typography>
                <Typography variant="body2">Total a pagar: R$ {totalInvestido}</Typography>
                <Typography variant="body2">Notas fiscais: 9</Typography>
              </Paper>
            </Grid>
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
    </>
  );
};

export default Dashboard;
