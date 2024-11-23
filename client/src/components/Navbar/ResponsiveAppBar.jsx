import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Person as UserIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { logout } from "../../hooks/authSlice";

import logoPremick from "/src/assets/icons/logoPremick.png";


const urlNotifications = "http://localhost:5000/alertasestoque";
const ITEM_HEIGHT = 48;

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const openSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogout = () => {
    if (localStorage.produtosVenda && localStorage.produtosVenda.length > 2) {
      openSnackbar("Finalize ou cancele a venda antes de sair!", "error");
    } else {
      localStorage.clear();
      dispatch(logout()); // Reseta o estado de autenticação
      navigate("/login"); // Redireciona para a página de login
    }
  };

  const handleNavClick = (to) => {
    // Verifica se há uma venda em andamento antes de permitir navegação
    if (localStorage.produtosVenda && localStorage.produtosVenda.length > 2) {
      openSnackbar("Finalize ou cancele a venda antes de sair!", "error");
    } else {
      navigate(to);
    }
  };

  // NOTIFICAÇÕES DE ESTOQUE
  const [notifications, setNotifications] = React.useState([]);
  const [anchorElNotifyMenu, setAnchorElNotifyMenu] = React.useState(null);

  const open = Boolean(anchorElNotifyMenu);

  const handleClick = (event) => {
    setAnchorElNotifyMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElNotifyMenu(null);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${urlNotifications}`);
      const data = await res.json();
      setNotifications(data);
      console.log(notifications) // Ele não entende ainda que as Notificações foram trocadas, MAS FUNCIONA :)
    } catch (error) {
      console.error("Erro ao buscar Notificações:", error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#213635" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }} onClick={() => handleNavClick("/dashboard")}>
            <img
              src={logoPremick}
              alt="logo"
              style={{ height: 40, marginRight: "1rem", borderRadius: "5px" }}

            />
          </Box>

          {/* Menu para navegação */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => setAnchorElNav(event.currentTarget)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
            >
              <MenuItem onClick={() => handleNavClick("/clientes")}>
                <Typography textAlign="center">Clientes</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavClick("/produtos")}>
                <Typography textAlign="center">Produtos</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavClick("/estoques")}>
                <Typography textAlign="center">Estoques</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavClick("/vendas")}>
                <Typography textAlign="center">Vendas</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavClick("/relatorios")}>
                <Typography textAlign="center">Relatórios</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Links de navegação na tela grande */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button sx={{ my: 2, color: "white", display: "block" }} onClick={() => handleNavClick("/clientes")}>
              Clientes
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }} onClick={() => handleNavClick("/produtos")}>
              Produtos
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }} onClick={() => handleNavClick("/estoques")}>
              Estoques
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }} onClick={() => handleNavClick("/vendas")}>
              Vendas
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }} onClick={() => handleNavClick("/relatorios")}>
              Relatórios
            </Button>
          </Box>

          {/* Ícones de ações do usuário */}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton aria-label="more"
              id="long-button"
              size="large"
              color="inherit"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={(event) => {
                fetchNotifications();
                handleClick(event);
              }}
            >
              <NotificationsIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorElNotifyMenu}
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                },
              }}
            >
              {notifications.map((notification) => (
                <MenuItem key={notification.id_alerta} onClick={handleClose}>
                  {notification.mensagem}
                  {/* {notification.data_alerta} */}
                </MenuItem>
              ))}
            </Menu>
            <IconButton size="large" color="inherit">
              <UserIcon />
            </IconButton>
            <Tooltip title="Configurações">
              <IconButton onClick={() => setAnchorElUser(event.currentTarget)} color="inherit">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ajuda">
              <IconButton color="inherit">
                <HelpIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sair">
              <IconButton onClick={handleLogout} color="inherit">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>

      {/* Snackbar para mostrar mensagens de erro */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default ResponsiveAppBar;
