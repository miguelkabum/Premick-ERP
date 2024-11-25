import React, { useEffect, useState } from "react";
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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Person as UserIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { logout } from "../../hooks/authSlice";

import logoPremick from "/src/assets/icons/logoPremick.png";


const urlNotifications = "http://localhost:5000/alertasestoque";
const ITEM_HEIGHT = 48;

import { styled } from '@mui/material/styles';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const ResponsiveAppBar = () => {
  const [selectedNotification, setSelectedNotification] = React.useState(null);
  const [openNotificationInfo, setOpenNotificationInfo] = React.useState(false);

  const handleClickOpenNotificationInfo = () => {
    setOpenNotificationInfo(true);
  };
  const handleCloseNotificationInfo = () => {
    setOpenNotificationInfo(false);
    setSelectedNotification(null); // Limpa a notificação quando fechar o Dialog
  };

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
  const [unseenNotifications, setUnseenNotifications] = React.useState(0);
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

      let qtde_unseenNotifications = 0;
      data.map((notification) => {
        if (notification.visualizado == 0) {
          qtde_unseenNotifications += 1;
        }
      })

      if (qtde_unseenNotifications > 0) {
        setUnseenNotifications(qtde_unseenNotifications)
      }

      // console.log(notifications) // Ele não entende ainda que as Notificações foram trocadas, MAS FUNCIONA :)
    } catch (error) {
      console.error("Erro ao buscar Notificações:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchUpdateUnseenNotifications = async (id_alerta) => {
    try {
      const res = await fetch(`${urlNotifications}/${id_alerta}`, { method: "PUT" });

      if (res.ok) {
        console.log("Visualização atualizada com sucesso");

        // Atualize o estado local após marcar a notificação como visualizada
        setNotifications((prev) => {
          const updatedNotifications = prev.map((notification) =>
            notification.id_alerta === id_alerta
              ? { ...notification, visualizado: 1 }
              : notification
          );

          // Recalcular as notificações não visualizadas
          const updatedUnseenCount = updatedNotifications.filter(
            (notification) => notification.visualizado === 0
          ).length;

          setUnseenNotifications(updatedUnseenCount);

          return updatedNotifications;
        });
      } else {
        console.log("Erro ao Atualizar a visualização da Notificação");
      }
    } catch (error) {
      console.error("Erro ao Atualizar Visualização das Notificações:", error);
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
              <MenuItem onClick={() => navigate("/vendas")}>
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
            <Button sx={{ my: 2, color: "white", display: "block" }} onClick={() => navigate("/vendas")}>
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
              {/* {unseenNotifications == 0 ? (
                <NotificationsIcon />
              ) : (
                <Badge badgeContent={unseenNotifications} color="error">
                  <NotificationsIcon />
                </Badge>
              )} */}
              <Badge badgeContent={unseenNotifications} color="error">
                <NotificationsIcon />
              </Badge>
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
                    minHeight: ITEM_HEIGHT * 4.5,
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                },
              }}
            >
              {notifications.map((notification) => (
                <MenuItem key={notification.id_alerta}
                  onClick={() => {
                    if (notification.visualizado == 0) {
                      fetchUpdateUnseenNotifications(notification.id_alerta);
                    }
                    setSelectedNotification(notification);
                    handleClickOpenNotificationInfo();
                  }}
                  sx={{
                    backgroundColor: notification.visualizado === 0 ? "#f9f9f9" : "white", // Fundo mais claro para não lidas
                    fontWeight: notification.visualizado === 0 ? "bold" : "normal", // Negrito para não lidas
                    borderBottom: "1px solid #e0e0e0", // Separador entre notificações
                    "&:hover": {
                      backgroundColor: notification.visualizado === 0 ? "#e0e0e0" : "#f5f5f5", // Diferencia o hover
                    },
                  }}
                >
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

      {/* Dialog para mostrar informações da Notificação */}
      <BootstrapDialog
        onClose={handleCloseNotificationInfo}
        aria-labelledby="customized-dialog-title"
        open={openNotificationInfo}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Alerta de Estoque
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseNotificationInfo}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {selectedNotification ? (
            <>
              <Typography gutterBottom>
                <strong>Data:</strong> {new Date(selectedNotification.data_alerta).toLocaleString()}
              </Typography>
              <Typography gutterBottom>
                <strong>Mensagem:</strong> {selectedNotification.mensagem}
              </Typography>
              {/* <Typography gutterBottom>
                <strong>Detalhes:</strong> {selectedNotification.detalhes || "Sem informações adicionais."}
              </Typography> */}
            </>
          ) : (
            <Typography>Carregando...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseNotificationInfo}>
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>

    </AppBar>
  );
};

export default ResponsiveAppBar;
