import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";
import { BarChart } from "@mui/x-charts/BarChart";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from "@mui/x-data-grid";
import { LineChart } from "@mui/x-charts/LineChart";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import ProdutosGrafico from "../../components/ProdutosGrafico/ProdutosGrafico";

// URLs das APIs
const urlVendasCanceladas = "http://localhost:5000/vendasCanceladas";
const urlRelatorioVendas = "http://localhost:5000/vendas";

dayjs.extend(utc); // Extensão para manipulação de horários UTC
dayjs.locale("pt-br"); // Define o idioma para português

const RelatorioVendas = () => {
  // Estados gerais
  const [vendas, setVendas] = useState([]);
  const [periodo, setPeriodo] = useState("mensal");
  const [filtroProduto, setFiltroProduto] = useState("");
  const [graficoData, setGraficoData] = useState([]);
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [graficoPizzaData, setGraficoPizzaData] = useState([]);
  const [graficoLinhaBarrasData, setGraficoLinhaBarrasData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vendasCanceladas, setVendasCanceladas] = useState([]);
  const [loadingCanceladas, setLoadingCanceladas] = useState(false);
  const [exibirGraficoLinha, setExibirGraficoLinha] = useState(true);
  const [exibirGraficoBarras, setExibirGraficoBarras] = useState(true);
  const [exibirGraficoPizza, setExibirGraficoPizza] = useState(true);
  const [exibirTabelaVendas, setExibirTabelaVendas] = useState(true);
  const [exibirTabelaCanceladas, setExibirTabelaCanceladas] = useState(true);

  // Manipulação da mudança na data inicial
  const handleDataInicialChange = (newDate) => {
    if (dataFinal && newDate.isAfter(dataFinal, "day")) {
      alert("A data inicial não pode ser maior que a data final.");
    } else {
      setDataInicial(newDate);
    }
  };

  // Manipulação da mudança na data final
  const handleDataFinalChange = (newDate) => {
    if (dataInicial && newDate.isBefore(dataInicial, "day")) {
      alert("A data final não pode ser menor que a data inicial.");
    } else {
      setDataFinal(newDate);
    }
  };

  // Buscar vendas canceladas
  const fetchVendasCanceladas = async () => {
    setLoadingCanceladas(true);
    try {
      const res = await fetch(urlVendasCanceladas);
      const data = await res.json();

      const combinedDataCancel = data.map((item) => ({
        ...item,
        data_venda_cancelada: dayjs(item.data_venda_cancelada).format("DD/MM/YYYY"),
      }))

      const filteredData = combinedDataCancel.filter((item) => {
        const itemDate = dayjs(item.data_venda_cancelada);
        return (
          (!dataInicial || itemDate.isSameOrAfter(dayjs(dataInicial), "day")) &&
          (!dataFinal || itemDate.isBefore(dayjs(dataFinal).add(1, "day")))
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

  // Colunas para a tabela de vendas canceladas
  const columnsCanceladas = [
    { field: "id_venda_cancelada", headerName: "ID", width: 90 },
    { field: "data_venda_cancelada", headerName: "Data", width: 180 },
    { field: "valor_total", headerName: "Total", width: 150 },
    { field: "metodo_pagamento", headerName: "Tipo de Pagamento", width: 150 },
    { field: "obs_vendas_canceladas", headerName: "Observação", width: 200 },
  ];

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

    setGraficoPizzaData(graficoData);
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

    return Object.keys(grouped).map((date) => ({
      date,
      total: grouped[date],
    }));
  };

  const handleGerarRelatorio = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${urlRelatorioVendas}`);
      const relData = await res.json();

      const combinedData = relData.map((item) => ({
        ...item,
        id: item.id_venda,
        data: dayjs(item.data_compra).format("DD/MM/YYYY"),
        dataGrafico: item.data_compra,
        total: item.valor_total,
      }));

      const filteredData = combinedData.filter((item) => {
        const itemDate = dayjs(item.dataGrafico);
        return (
          (!dataInicial ||
            itemDate.isAfter(dayjs(dataInicial).subtract(0, "day"))) &&
          (!dataFinal || itemDate.isBefore(dayjs(dataFinal).add(1, "day")))
        );
      });

      calcularPorcentagens(filteredData);
      setGraficoLinhaBarrasData(groupByDate(filteredData));
      setGraficoData(groupByDate(filteredData));
      setVendas(filteredData);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGerarRelatorio();
  }, [periodo, dataInicial, dataFinal]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "data", headerName: "Data", width: 180 },
    { field: "valor_total", headerName: "Total", width: 150 },
    { field: "metodo_pagamento", headerName: "Tipo de Pagamento", width: 150 },
    { field: "obs_vendas", headerName: "Observação", width: 200 },
  ];

  return (
    <>
      <Typography variant="h2" sx={{ textAlign: "center", mt: 3, mb: 4 }}>
        Relatório de Vendas
      </Typography>
      <Box
        sx={{
          p: 2,
          display: "grid",
          gridTemplateColumns: "minmax(400px, 30%) minmax(40%, 70%)",
          gap: 1,
          minWidth: "350px",
          "@media (max-width: 900px)": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
        }}
      >
        <Paper
          sx={{
            borderRadius: "12px",
            p: 3,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Escolha a data inicial e a data final
            </Typography>
            <div
              className="datas"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    <DesktopDatePicker
                      label="Data Inicial"
                      value={
                        dataInicial ? dayjs(dataInicial, "DD/MM/YYYY") : null
                      }
                      onChange={handleDataInicialChange}
                      renderInput={(params) => <TextField {...params} />}
                      inputFormat="DD/MM/YYYY"
                      maxDate={
                        dataFinal ? dayjs(dataFinal, "DD/MM/YYYY") : null
                      } // Limita a seleção
                      sx={{ margin: 4 }}
                    />
                  </div>
                  <div>
                    <DesktopDatePicker
                      label="Data Final"
                      value={dataFinal ? dayjs(dataFinal, "DD/MM/YYYY") : null}
                      onChange={handleDataFinalChange}
                      renderInput={(params) => <TextField {...params} />}
                      inputFormat="DD/MM/YYYY"
                      minDate={
                        dataInicial ? dayjs(dataInicial, "DD/MM/YYYY") : null
                      } // Limita a seleção
                      sx={{ margin: 4 }}
                    />
                  </div>
                </Box>
              </LocalizationProvider>
            </div>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Configurações de Exibição
            </Typography>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={exibirGraficoLinha}
                  onChange={(e) => setExibirGraficoLinha(e.target.checked)}
                />
                Exibir Gráfico de Linha
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={exibirGraficoBarras}
                  onChange={(e) => setExibirGraficoBarras(e.target.checked)}
                />
                Exibir Gráfico de Barras
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={exibirGraficoPizza}
                  onChange={(e) => setExibirGraficoPizza(e.target.checked)}
                />
                Exibir Gráfico de Pizza
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={exibirTabelaVendas}
                  onChange={(e) => setExibirTabelaVendas(e.target.checked)}
                />
                Exibir Tabela de Vendas
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={exibirTabelaCanceladas}
                  onChange={(e) => setExibirTabelaCanceladas(e.target.checked)}
                />
                Exibir Tabela de Canceladas
              </label>
            </div>
          </Box>
        </Paper>

        {exibirGraficoLinha && graficoData.length > 0 ? (
          <Paper
            sx={{
              borderRadius: "12px",
              p: 3,
              "@media (max-width: 900px)": {
                width: "100%",
              },
            }}
          >
            <LineChart
              data={graficoData}
              height={400}
              xAxis={[
                {
                  scaleType: "time",
                  data: graficoData.map((item) => dayjs(item.date).toDate()),
                  valueFormatter: (value) => dayjs(value).format("DD-MM-YYYY"),
                  title: "Data",
                },
              ]}
              yAxis={[{ title: "Total de Vendas" }]}
              series={[
                {
                  data: graficoData.map((item) => item.total),
                  title: "Vendas",
                },
              ]}
            />
          </Paper>
        ) : (
          exibirGraficoLinha && (
            <Typography variant="body2">
              Nenhum dado para exibir no gráfico de linha.
            </Typography>
          )
        )}
        {exibirGraficoPizza && graficoPizzaData.length > 0 ? (
          <Paper
            sx={{
              borderRadius: "12px",
              p: 3,
              "@media (max-width: 900px)": {},
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Gráfico de porcentagem por forma de pagamento
            </Typography>

            <PieChart
              series={[{ data: graficoPizzaData }]}
              height={400}
              width={350}
              sx={{
                "@media (max-width: 900px)": {
                  marginLeft: -1,
                },
              }}
            />
          </Paper>
        ) : (
          exibirGraficoPizza && (
            <Typography variant="body2">
              Nenhum dado para exibir no gráfico de linha.
            </Typography>
          )
        )}
        {exibirGraficoBarras && (
          <Paper>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Vendas concluídas
            </Typography>
            <BarChart
              series={[
                {
                  data: graficoLinhaBarrasData.map((item) => item.total),
                  title: "Vendas",
                },
              ]}
              height={400}
              xAxis={[
                {
                  scaleType: "band",
                  data: graficoLinhaBarrasData.map((item) => item.date),
                  valueFormatter: (value) => dayjs(value).format("DD/MM/YYYY"),
                  title: "Data",
                },
              ]}
              yAxis={[{ title: "Total de Vendas" }]}
            />
          </Paper>
        )}

        {exibirTabelaVendas && (
          <Paper
            sx={{
              borderRadius: "12px",
              p: 3,
              gridColumn: "span 2",
              "@media (max-width: 900px)": {
                width: "100%",
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Vendas concluídas
            </Typography>
            <DataGrid
              rows={vendas}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              loading={loading}
              sx={{
                height: 400,
                borderRadius: "12px",
              }}
            />
          </Paper>
        )}

        {exibirTabelaCanceladas && (
          <Paper
            sx={{
              borderRadius: "12px",
              p: 3,
              gridColumn: "span 2",
              "@media (max-width: 900px)": {
                width: "100%",
              },
            }}
          >
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
                height: 400,
                borderRadius: "12px",
              }}
            />
          </Paper>
        )}
        <Paper
            sx={{
              borderRadius: "12px",
              p: 3,
              gridColumn: "span 2",
              "@media (max-width: 900px)": {
                width: "100%",
              },
            }}
          >
        <ProdutosGrafico />
        </Paper>
      </Box>
    </>
  );
};

export default RelatorioVendas;
