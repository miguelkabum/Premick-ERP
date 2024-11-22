import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { BarChart } from "@mui/x-charts/BarChart";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from "@mui/x-data-grid";
import { LineChart } from "@mui/x-charts/LineChart";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const urlVendasCanceladas = "http://localhost:5000/vendasCanceladas"; // API de vendas canceladas
const urlRelatorioVendas = "http://localhost:5000/vendas";

const RelatorioVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [periodo, setPeriodo] = useState("mensal");
  const [filtroProduto, setFiltroProduto] = useState("");
  const [graficoData, setGraficoData] = useState([]);
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [graficoPizzaData, setGraficoPizzaData] = useState([]);
  const [graficoLinhaBarrasData, setGraficoLinhaBarrasData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vendasCanceladas, setVendasCanceladas] = useState([]);
  const [dataInicialCanceladas, setDataInicialCanceladas] = useState(null);
  const [dataFinalCanceladas, setDataFinalCanceladas] = useState(null);
  const [loadingCanceladas, setLoadingCanceladas] = useState(false);

  dayjs.extend(utc);
  
  const handleDataInicialCanceladasChange = (newDate) => {
    setDataInicialCanceladas(newDate);
  };

  const handleDataFinalCanceladasChange = (newDate) => {
    if (newDate.isBefore(dataInicial, "day")) {
      alert("A data final não pode ser anterior à data inicial.");
    } else {
      setDataFinalCanceladas(newDate);
    }
  };

  const fetchVendasCanceladas = async () => {
    setLoadingCanceladas(true);
    try {
      const res = await fetch(urlVendasCanceladas);
      const data = await res.json();

      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.data_venda_cancelada);
        return (
          (!dataInicial || itemDate >= new Date(dataInicial)) &&
          (!dataFinal || itemDate <= new Date(dataFinal))
        );
      });

      setVendasCanceladas(filteredData);
    } catch (error) {
      console.error("Erro ao buscar vendas canceladas:", error);
    } finally {
      setLoadingCanceladas(false);
    }
  };

  useEffect(() => {
    fetchVendasCanceladas();
  }, [dataInicial, dataFinal]);

  const columnsCanceladas = [
    { field: "id_venda_cancelada", headerName: "ID", width: 90 },
    { field: "data_venda_cancelada", headerName: "Data", width: 180 },
    { field: "valor_total", headerName: "Total", width: 150 },
    { field: "metodo_pagamento", headerName: "Tipo de Pagamento", width: 150 },
    { field: "obs_vendas_canceladas", headerName: "Observação", width: 200 },
  ];

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleDataInicialChange = (newDate) => {
    setDataInicial(newDate);
  };

  const handleDataFinalChange = (newDate) => {
    if (newDate.isBefore(dataInicial, "day")) {
      alert("A data final não pode ser anterior à data inicial.");
    } else {
      setDataFinal(newDate);
    }
  };

  useEffect(() => {
    handleGerarRelatorio();
  }, [periodo, dataInicial, dataFinal]);

  const formatDate = (date) => {
    if (!date) return "";

    const adjustedDate = new Date(date);
    adjustedDate.setHours(adjustedDate.getHours() + 3);

    const formattedDate = adjustedDate.toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return formattedDate.replace(",", "");
  };

  const fetchVendas = async () => {
    try {
      const res = await fetch(urlRelatorioVendas);
      const data = await res.json();
      setVendas(data);
      calcularPorcentagens(data);
    } catch (error) {
      console.error("Erro ao buscar os dados de vendas:", error);
    }
  };

  const calcularPorcentagens = (vendas) => {
    const totalVendas = vendas.reduce(
      (acc, venda) => acc + venda.valor_total,
      0
    );

    const vendasPorPagamento = vendas.reduce((acc, venda) => {
      if (!acc[venda.metodo_pagamento]) {
        acc[venda.metodo_pagamento] = 0;
      }
      acc[venda.metodo_pagamento] += venda.valor_total;
      return acc;
    }, {});

    const graficoData = Object.keys(vendasPorPagamento).map((metodo) => {
      const valorTotal = vendasPorPagamento[metodo];
      const porcentagem = ((valorTotal / totalVendas) * 100).toFixed(2);
      return {
        id: metodo,
        value: parseFloat(porcentagem),
        label: metodo,
      };
    });

    if (graficoData && graficoData.length > 0) {
      setGraficoPizzaData(graficoData);
    } else {
      console.warn("Nenhum dado de gráfico de pizza encontrado.");
    }
  };

  const groupByDate = (vendas) => {
    const grouped = vendas.reduce((acc, item) => {
      const date = dayjs(item.dataGrafico).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += item.total;
      return acc;
    }, {});

    const groupedData = Object.keys(grouped).map((date) => ({
      date,
      total: grouped[date],
    }));

    if (groupedData && groupedData.length > 0) {
      return groupedData;
    } else {
      console.warn("Nenhum dado de gráfico de barras encontrado.");
      return [];
    }
  };

  const handleGerarRelatorio = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${urlRelatorioVendas}`);
      const relData = await res.json();
      console.log(relData)
      const combinedData = relData.map((item) => ({
        ...item,
        id: item.id_venda,
        data: formatDate(item.data_compra),
        dataGrafico: item.data_compra,
        total: item.valor_total,
      }));

      const filteredData = combinedData.filter((item) => {
        const itemDate = new Date(item.dataGrafico);
        console.log(itemDate)
        return (
          (!dataInicial || itemDate >= new Date(dataInicial)) &&
          (!dataFinal || itemDate <= new Date(dataFinal))
        );
      });

      if (filteredData.length > 0) {
        calcularPorcentagens(filteredData);
      }

      const groupedData = groupByDate(filteredData);

      setVendas(filteredData);
      setGraficoLinhaBarrasData(groupedData);
      setGraficoData(groupedData); // Certifique-se de que graficoData seja preenchido aqui
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "data", headerName: "Data", width: 180 },
    { field: "valor_total", headerName: "Total", width: 150 },
    { field: "metodo_pagamento", headerName: "Tipo de Pagamento", width: 150 },
    { field: "obs_vendas", headerName: "Observação", width: 200 },
  ];

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 3
      }}
    >
      <Typography variant="h3">
        Relatório de Vendas
      </Typography>

      <Paper sx={{ borderRadius: "12px", p: 1}}>
        <p style={{ paddingLeft: 33, paddingTop: 15 }}>Escolha uma data</p>
        <div
          className="datas"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
              <DesktopDatePicker
                label="Data Inicial"
                value={dataInicial}
                onChange={handleDataInicialChange}
                renderInput={(params) => <TextField {...params} />}
                sx={{ margin: 4 }}
              />
            </div>
            <div>
              <DesktopDatePicker
                label="Data Final"
                value={dataFinal}
                onChange={handleDataFinalChange}
                renderInput={(params) => <TextField {...params} />}
                sx={{ margin: 4 }}
              />
            </div>
          </LocalizationProvider>
        </div>
      </Paper>

      <Paper sx={{ borderRadius: "12px", p: 1 }}>
      <p style={{ paddingLeft: 33, paddingTop: 15, paddingBottom: 15}}>Gráfico de Porcentagens por Forma de Pagamento</p>
          
    

        {graficoPizzaData.length > 0 ? (
          <PieChart
            series={[{ data: graficoPizzaData }]}
            width={400}
            height={200}
          />
        ) : (
          <Typography variant="body2">
            Nenhum dado para exibir no gráfico de pizza.
          </Typography>
        )}
      </Paper>
      <Paper sx={{ borderRadius: "12px", p: 4 }}>
        {graficoLinhaBarrasData.length > 0 ? (
          <BarChart
            series={[
              {
                data: graficoLinhaBarrasData.map((item) => item.total),
                title: "Vendas",
              },
            ]}
            height={290}
            xAxis={[
              {
                scaleType: "band",
                data: graficoLinhaBarrasData.map((item) => item.date),
                valueFormatter: (value) => dayjs(value).toDate().toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }),
                title: "Data",
              },
            ]}
            yAxis={[{ title: "Total de Vendas" }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        ) : (
          <Typography variant="body2">
            Nenhum dado para exibir no gráfico de barras.
          </Typography>
        )}
      </Paper>
      <Paper sx={{ borderRadius: "12px", p: 2 }}>
        {graficoData.length > 0 ? (
          <LineChart
            data={graficoData}
            height={300}
            xAxis={[
              {
                scaleType: "time",
                data: graficoData.map((item) => dayjs(item.date).toDate()), // Converte para objeto Date após usar o Day.js
                // valueFormatter: (value) => dayjs(value).toDate().toLocaleString("pt-BR", {
                //   day: "2-digit",
                //   month: "2-digit",
                //   year: "numeric",
                //   hour: "2-digit",
                //   minute: "2-digit",
                //   hour12: false,
                // }),
                valueFormatter: (value) => dayjs(value).format("DD-MM-YYYY HH:mm:ss"),
                title: "Data",
              },
              // {
              //   scaleType: "time",
              //   data: graficoData.map((item) => dayjs.utc(item.date).local().toDate()), // Interpreta como UTC e converte para local
              //   valueFormatter: (value) =>
              //     dayjs.utc(value).local().format("DD-MM-YYYY HH:mm:ss"), // Converte para o horário local e formata
              //   title: "Data",
              // },
            ]}
            yAxis={[{ title: "Total de Vendas" }]}
            series={[
              { data: graficoData.map((item) => item.total), title: "Vendas" },
            ]}
          />
        ) : (
          <Typography variant="body2">
            Nenhum dado para exibir no gráfico de linha.
          </Typography>
        )}
      </Paper>
      <Paper sx={{ borderRadius: "12px", p: 3 }}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Vendas
          </Typography>
          <DataGrid
            rows={vendas}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            loading={loading}
            sx={{
              maxHeight: 600,
              borderRadius: "12px"
            }}
          />
        </Box>
      </Paper>
      <Paper sx={{ borderRadius: "12px", p: 2 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Vendas Canceladas
            </Typography>
            <DataGrid
              rows={vendasCanceladas}
              columns={columnsCanceladas}
              pageSize={5}
              rowsPerPageOptions={[5]}
              loading={loadingCanceladas}
              getRowId={(row) => row.id_venda_cancelada} // Define um identificador personalizado
              sx={{
                maxHeight: 600,
                borderRadius: "12px"
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RelatorioVendas;
