import React, { useState, useEffect } from "react";
import {
Box,
TextField,
Typography,
Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from "@mui/x-data-grid";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";

const urlVendasCanceladas = "http://localhost:5000/vendasCanceladas"; // API de vendas canceladas

const RelatorioVendasCanceladas = () => {
const [vendasCanceladas, setVendasCanceladas] = useState([]);
const [dataInicialCanceladas, setDataInicialCanceladas] = useState(null);
const [dataFinalCanceladas, setDataFinalCanceladas] = useState(null);
const [loadingCanceladas, setLoadingCanceladas] = useState(false);

const handleDataInicialCanceladasChange = (newDate) => {
setDataInicialCanceladas(newDate);
};

const handleDataFinalCanceladasChange = (newDate) => {
if (newDate.isBefore(dataInicialCanceladas, "day")) {
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
        (!dataInicialCanceladas || itemDate >= new Date(dataInicialCanceladas)) &&
        (!dataFinalCanceladas || itemDate <= new Date(dataFinalCanceladas))
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
}, [dataInicialCanceladas, dataFinalCanceladas]);

const columnsCanceladas = [
{ field: "id_venda_cancelada", headerName: "ID", width: 90 },
{ field: "data_venda_cancelada", headerName: "Data", width: 150 },
{ field: "valor_total", headerName: "Total", width: 150 },
{ field: "metodo_pagamento", headerName: "Tipo de Pagamento", width: 150 },
{ field: "obs_vendas_canceladas", headerName: "Observação", width: 200 },
];

return (
<Box
    sx={{
    p: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    }}
>
    <Typography variant="h4" sx={{ mb: 2 }}>
    Relatório de Vendas Canceladas
    </Typography>

    <Paper sx={{ borderRadius: "12px", mb: 4 }}>
    <p style={{ paddingLeft: 33, paddingTop: 15 }}>Escolha uma data</p>
    <div
        className="datas"
        style={{ display: "flex", justifyContent: "space-between" }}
    >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
            <DesktopDatePicker
            label="Data Inicial"
            value={dataInicialCanceladas}
            onChange={handleDataInicialCanceladasChange}
            renderInput={(params) => <TextField {...params} />}
            sx={{ margin: 4 }}
            />
        </div>
        <div>
            <DesktopDatePicker
            label="Data Final"
            value={dataFinalCanceladas}
            onChange={handleDataFinalCanceladasChange}
            renderInput={(params) => <TextField {...params} />}
            sx={{ margin: 4 }}
            />
        </div>
        </LocalizationProvider>
    </div>
    </Paper>

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
    />
    </Box>
</Box>
);
};

export default RelatorioVendasCanceladas;
