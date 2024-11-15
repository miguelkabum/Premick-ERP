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

const urlRelatorioVendas = "http://localhost:5000/vendas"; // API de relatórios de vendas

const RelatorioVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [periodo, setPeriodo] = useState('mensal');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [graficoData, setGraficoData] = useState([]);

  useEffect(() => {
    handleGerarRelatorio();
  }, [periodo]);

  const handleGerarRelatorio = async () => {
    try {
      const res = await fetch(`${urlRelatorioVendas}?periodo=${periodo}&produto=${filtroProduto}`);
      const data = await res.json();
      setVendas(data);
      
      // Preparar dados para o gráfico
      const vendasPorDia = data.map(venda => ({
        data: venda.data,
        total: venda.total
      }));
      setGraficoData(vendasPorDia);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'data', headerName: 'Data', width: 150 },
    { field: 'total', headerName: 'Total', width: 150 },
    { field: 'tipoPagamento', headerName: 'Tipo de Pagamento', width: 150 },
    { field: 'observacao', headerName: 'Observação', width: 200 },
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
          xAxis={[{ data: graficoData.map(item => item.data) }]}
          series={[{ data: graficoData.map(item => item.total) }]}
          width={400}
          height={300}
        />
      </Paper>
      
      {/* Tabela de Relatórios */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Detalhamento das Vendas</Typography>
        <DataGrid
          getRowId={(row) => row.id_vendas}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
        />
      </Paper>
    </Box>
  );
};

export default RelatorioVendas;
