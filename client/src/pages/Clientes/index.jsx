import React from "react";
import Filtros from "../../components/Filtros/index.jsx";
import Style from "./style.module.css";
import DataGrid from "../../components/DataGridDemo/index.jsx";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
const Clientes = () => {
  return (
    <div className={Style.box}>
      <Filtros />
      <div className={Style.container}>
        <header>
          <h1>Cliente</h1>
          <div id={Style.options}>
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
              noValidate
              autoComplete="off"
              style={{display: "flex"}}
            >
              <TextField
                id="outlined-basic"
                label="Pesquise um cliente"
                variant="outlined"
                style={{backgroudColor: "red"}}
              />
              <button className={Style.pesquisarClient}>Pesquisar</button>
            </Box>
            <button className={Style.addClient}>+ Incluir Cliente</button>
          </div>
        </header>
        <main>
          <DataGrid />
        </main>
      </div>
    </div>
  );
};

export default Clientes;
