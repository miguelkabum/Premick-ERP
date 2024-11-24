import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Search,
  Refresh,
  Add,
  MoreVert,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:5000/clientes";

const ClientesPage = () => {


  const [clientes, setClientes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [clienteIdToDelete, setClienteIdToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchClientes = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleDeleteCliente = async () => {
    try {
      await fetch(`${url}/${clienteIdToDelete}`, { method: "DELETE" });
      setClientes((prev) =>
        prev.filter((cliente) => cliente.id_cliente !== clienteIdToDelete)
      );
      setOpenDialog(false);
      setClienteIdToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  const handleOpenDialog = (id) => {
    setClienteIdToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setClienteIdToDelete(null);
  };

  const columns = [
    { field: "id_cliente", headerName: "ID", width: 100 },
    { field: "nome_cliente", headerName: "Nome", width: 150 },
    { field: "CPF_cliente", headerName: "CPF", width: 150 },
    { field: "cidade", headerName: "Cidade", width: 150 },
    { field: "telefone_cliente", headerName: "Telefone", width: 150 },
    {
      field: "actions",
      headerName: "Ações",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            size="large"
            onClick={(event) => handleOpenMenu(event, params.row.id_cliente)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && menuRowId === params.row.id_cliente}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={() => {
                navigate(`/clientes/cadastro/${params.row.id_cliente}`);
                handleCloseMenu();
              }}
            >
              <Edit fontSize="small" /> Editar
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleOpenDialog(params.row.id_cliente);
                handleCloseMenu();
              }}
            >
              <Delete fontSize="small" /> Excluir
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  const filteredClientes = Array.isArray(clientes)
    ? clientes.filter((cliente) =>
      cliente.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.CPF_cliente.includes(searchTerm)
    )
    : [];

  return (
    <div
      style={{
        backgroundColor: "#E9EFEC",
        height: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >

      <Container sx={{ p: 1 }}>
        <Container sx={{ p: 2 }}>
          <div
            className="header"
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "3px",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                marginBottom: "0",
                fontSize: 60,
                color: "#213635",
                fontWeight: "bold",
              }}
            >
              Clientes
            </Typography>
          </div>
        </Container>

        <Paper elevation={1} sx={{ p: 2, borderRadius: "12px" }}>
          <Container maxWidth="lg" sx={{ padding: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={2}
              gap={3}
            >
              <TextField
                variant="outlined"
                placeholder="Pesquisar por nome, CPF ..."
                InputProps={{
                  startAdornment: <Search />,
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: "100%", maxWidth: "300px", height: "auto" }}
              />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    height: "56px",
                    width: "100%",
                    backgroundColor: "black",
                  }}
                  startIcon={<Add />}
                  onClick={() => navigate("/clientes/cadastro")}
                >
                  Incluir cliente
                </Button>
              </Box>
            </Box>
          </Container>

          {/* Dialog de confirmação Delete */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Excluir Cliente</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Tem certeza que deseja excluir este cliente?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleDeleteCliente} color="error" autoFocus>
                Excluir
              </Button>
            </DialogActions>
          </Dialog>

          <Container maxWidth="lg" sx={{ padding: 2 }}>
            <Box
              sx={{
                height: "auto",
                width: "100%",
                backgroundColor: "#F2F2F2",
                borderRadius: "12px",
              }}
            >
              <DataGrid
                rows={filteredClientes}
                columns={columns}
                getRowId={(row) => row.id_cliente}
                pageSize={5}
                sx={{
                  boxShadow: 0,
                  border: 0,
                  borderColor: "primary.light",
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
              />
            </Box>
          </Container>
        </Paper>
      </Container>
    </div>
  );
};

export default ClientesPage;
