import React from 'react';
import { Box, Grid, Paper, Typography, Button, IconButton, Divider, LinearProgress, Chip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { BarChart as BarChartComponent } from '@mui/x-charts/BarChart';
import { useSelector } from 'react-redux';
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Cabeçalho com boas-vindas e informações */}
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Paper sx={{ padding: 2 }}>
            <Box display="flex" alignItems="center">
              <AccountCircleIcon fontSize="large" />
              <Typography variant="h6" sx={{ ml: 2 }}>
                Bem-vindo, {user.nome_usuario}!
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Restam 30 dias de teste grátis
            </Typography>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Ative sua conta agora
            </Button>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">Atalhos favoritos</Typography>
            <Box mt={2}>
              <Button fullWidth>Clientes e fornecedores</Button>
              <Button fullWidth>Produtos</Button>
              <Button fullWidth>Estoque</Button>
              <Button fullWidth>Pedidos de Venda</Button>
              <Button fullWidth>Financeiro</Button>
              <Button fullWidth>Relatórios</Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">Conheça a plataforma</Typography>
            <LinearProgress variant="determinate" value={22} sx={{ mt: 1 }} />
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              22%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={9}>
          <Grid container spacing={2}>
            {/* Caixas de informação */}
            <Grid item xs={6}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Feche com nossos parceiros para aproveitar todos os descontos.</Typography>
                <Button fullWidth variant="contained" sx={{ mt: 2 }}>Conheça nossos parceiros</Button>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Em breve um novo app será lançado.</Typography>
                <Typography variant="body2">Praticidade na palma da mão.</Typography>
                <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                  <IconButton>
                    <img src="/android-logo.png" alt="Android" />
                  </IconButton>
                  <IconButton>
                    <img src="/ios-logo.png" alt="iOS" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>

            {/* Resumo */}
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
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
                      <Typography variant="body2">Total de vendas: 7</Typography>
                      <Typography variant="body2">Novos: 9</Typography>
                      <Typography variant="body2">Em andamento: 5</Typography>
                      <Typography variant="body2">Cancelados: 0</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ padding: 2 }}>
                      <Typography variant="h6">Contas a Receber</Typography>
                      <Typography variant="body2">Total: R$ 69</Typography>
                      <Typography variant="body2">Taxas: R$ 10</Typography>
                      <Typography variant="body2">Líquido: R$ 59</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ padding: 2 }}>
                      <Typography variant="h6">Contas a Pagar</Typography>
                      <Typography variant="body2">Total a pagar: R$ 10</Typography>
                      <Typography variant="body2">Notas fiscais: 9</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Gráfico */}
                <Box mt={4}>
                  <BarChartComponent
                    series={[
                      { data: [30, 60, 10], label: 'Fluxo' }
                    ]}
                    xAxis={[
                      { scaleType: 'band', data: ['30', '60', '10'] }
                    ]}
                    height={200}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
