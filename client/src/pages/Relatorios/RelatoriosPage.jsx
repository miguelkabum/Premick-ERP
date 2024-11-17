import React, { useState, useEffect } from 'react';
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
  FormControl
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LineChart } from '@mui/x-charts/LineChart';

const urlRelatorioVendas = "http://localhost:5000/vendas";

const RelatorioVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [periodo, setPeriodo] = useState('mensal');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [graficoData, setGraficoData] = useState([]);

  useEffect(() => {
    handleGerarRelatorio();
  }, [periodo]);

  // Função para formatar a data e hora com ajuste de +3 horas
  const formatDate = (date) => {
    if (!date) return ''; // Verifica se a data existe

    const adjustedDate = new Date(date);
    adjustedDate.setHours(adjustedDate.getHours() + 3); // Adiciona 3 horas

    const formattedDate = adjustedDate.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Para usar o formato 24h
    });

    return formattedDate.replace(',', ''); // Remove a vírgula entre data e hora
  };

  // Função para gerar o relatório de vendas
  const handleGerarRelatorio = async () => {
    try {
      const res = await fetch(`${urlRelatorioVendas}`);
      const relData = await res.json();
      
      // Processa os dados, formatando as datas e mantendo o total de vendas
      const combinedData = relData.map((item) => ({
        ...item,
        id: item.id_venda,
        data: formatDate(item.data_compra),
        dataGrafico: item.data_compra,  // A data bruta que será formatada
        total: item.valor_total,  // Total de vendas
      }));

      setVendas(combinedData);
      setGraficoData(combinedData); // Dados para o gráfico
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'data', headerName: 'Data', width: 150 },
    { field: 'valor_total', headerName: 'Total', width: 150 },
    { field: 'metodo_pagamento', headerName: 'Tipo de Pagamento', width: 150 },
    { field: 'obs_vendas', headerName: 'Observação', width: 200 },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Relatório de Vendas</Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <MenuItem value="diario">Diário</MenuItem>
                <MenuItem value="mensal">Mensal</MenuItem>
                <MenuItem value="anual">Anual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Filtro por Produto"
              variant="outlined"
              value={filtroProduto}
              onChange={(e) => setFiltroProduto(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleGerarRelatorio}
            >
              Gerar Relatório
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Gráfico */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Gráfico de Vendas</Typography>
        <LineChart
          data={graficoData} // Dados do gráfico
          width={500}
          height={300}
          xAxis={[
            {
              scaleType: 'time', // Define que o eixo X é baseado em tempo
              data: graficoData.map(item => {
                // Converte a data para objeto Date
                const data = new Date(item.dataGrafico);
                
                // Adiciona 3 horas à data
                data.setHours(data.getHours() + 3);
                
                return data;
              }),
              valueFormatter: (value) => {
                const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                return value.toLocaleDateString('pt-BR', options); // Formatação para 'dd/mm/yyyy'
              },
            },
          ]}
          series={[
            {
              data: graficoData.map(item => item.total), // Dados do eixo Y (total de vendas)

            },
          ]}
        />
      </Paper>

      {/* Tabela de Relatórios */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Detalhamento das Vendas</Typography>
        <DataGrid
          rows={vendas}
          columns={columns}
          getRowId={(row) => row.id} // Corrigido
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
        />
      </Paper>
    </Box>
  );
};

export default RelatorioVendas;