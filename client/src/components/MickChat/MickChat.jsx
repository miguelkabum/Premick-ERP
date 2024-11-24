import { useState, useRef, useEffect, Fragment } from 'react';

// import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

import AddIcon from '@mui/icons-material/Add';

import LogoPremick from './LogoPremick.webp';

import MessageLeft from './MessageLeft';
import MessageRight from './MessageRight';

import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import CircularProgress from '@mui/material/CircularProgress';

const drawerWidth = 200;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const urlChats = "http://localhost:5000/conversas";
const urlMessages = "http://localhost:5000/mensagens";

const MickChat = () => {
    const [idConversa, setIdConversa] = useState(0);
    const [pergunta, setPergunta] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversas, setConversas] = useState([]);
    const [mensagens, setMensagens] = useState([]);

    const theme = useTheme();

    const [openDrawer, setOpenDrawer] = useState(true);
    const handleDrawerOpen = () => setOpenDrawer(true);
    const handleDrawerClose = () => setOpenDrawer(false);

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const fetchConversas = async () => {
        const id_usuario = 2;              // FALTA Puxar por Usuário
        setLoading(true); // Ativa o spinner enquanto envia a mensagem

        try {
            const res = await fetch(`${urlChats}?id=${id_usuario}`);      // FALTA Puxar por Usuário
            const data = await res.json();
            setConversas(data);
        } catch (error) {
            console.error("Erro ao buscar conversas:", error);
        } finally {
            setLoading(false); // Desativa o spinner após a operação
        }
    };

    const fetchMensagens = async (id_conversa) => {
        setLoading(true); // Ativa o spinner enquanto envia a mensagem

        try {
            const res = await fetch(`${urlMessages}?id=${id_conversa}`);
            const data = await res.json();
            setMensagens(data);
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        } finally {
            setLoading(false); // Desativa o spinner após a operação
        }
    };

    const handleUpdateLastAccess = async (id_conversa) => {
        try {
            const res = await fetch(`${urlChats}/${id_conversa}`, { method: 'PUT' });

            if (res.ok) {
                console.log('Último acesso atualizado com sucesso');
                fetchConversas();
            } else {
                console.log('Erro ao Atualizar o último acesso da Conversa');
            }

        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        }
    };

    const handleCreateChat = async () => {
        const conversa = {
            id_usuario: 2,                            // Pegar id_usuario do Navegador ####### 
            titulo: "Quinto Chat do Usuário 2"        // Adicionar título do chat onde? kkkkkkkk
        };

        try {
            const res = await fetch(urlChats, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conversa),
            });

            if (res.ok) {
                const data = await res.json();
                let newIdConversa = data.id_conversa; // Valor padrão como estado atual
                setIdConversa(newIdConversa);

                // Atualiza as mensagens com o novo ID de conversa
                await fetchMensagens(newIdConversa);

                // Atualiza a lista de conversas
                await fetchConversas();
            } else {
                console.error("Erro ao cadastrar a Conversa");
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmitMessage = async () => {
        const mensagem = {
            id_conversa: idConversa,
            tipo_mensagem: 'USER',
            conteudo: pergunta,
            id_usuario: 2, // ID fixo para teste; substitua pelo ID do usuário autenticado
        };

        setLoading(true); // Ativa o spinner enquanto envia a mensagem

        try {
            const res = await fetch(urlMessages, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mensagem),
            });

            if (res.ok) {
                const data = await res.json();
                let newIdConversa = idConversa; // Valor padrão como estado atual
                if (idConversa == 0) {
                    newIdConversa = data.id_conversa; // Atualiza com o ID retornado
                    setIdConversa(newIdConversa);
                }

                // Atualiza as mensagens com o novo ID de conversa
                await fetchMensagens(newIdConversa);

                // Atualiza a lista de conversas
                await fetchConversas();
            } else {
                console.error("Erro ao enviar a mensagem ou criar a conversa");
            }
        } catch (error) {
            console.error("Erro na requisição:", error.message);
        } finally {
            setPergunta(''); // Limpa o campo de entrada
            setLoading(false); // Desativa o spinner após a operação
        }
    };


    return (
        <Fragment>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab onClick={() => {
                    fetchConversas();
                    handleClickOpen();
                }} size="large" color="secondary" aria-label="add">
                    <AddIcon />                   {/* Usar AddIcon na criação dos novos Chats */}
                </Fab>
            </Box>


            <Dialog
                open={open}
                onClose={handleClose}
                scroll="paper"
                // aria-labelledby="scroll-dialog-title"
                // aria-describedby="scroll-dialog-description"
                sx={{
                    '& .MuiDialog-paper': {
                        height: "80%",
                        width: "600px",
                        minWidth: '300px',
                        maxWidth: '90%',
                        position: 'relative',
                    },
                }}
            >

                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={openDrawer} // Controlado pelo estado
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth, // Ajuste do tamanho do Drawer
                            position: 'absolute', // Relativo ao Dialog
                        },
                    }}
                >
                    <DrawerHeader sx={{ display: "flex", justifyContent: "space-between" }}>
                        <IconButton onClick={() => {
                            handleCreateChat();
                            setMensagens([]);
                        }}>
                            <AddIcon />
                        </IconButton>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {conversas.map((conversa) => (
                            <ListItem key={conversa.id_conversa} disablePadding>
                                <ListItemButton onClick={async () => {
                                    setIdConversa(conversa.id_conversa);
                                    await handleUpdateLastAccess(conversa.id_conversa);
                                    await fetchMensagens(conversa.id_conversa);
                                }}>
                                    <ListItemText primary={conversa.titulo} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%', // Ajusta para ocupar todo o espaço disponível verticalmente
                        overflow: 'hidden', // Impede que o conteúdo extrapole
                        transition: theme.transitions.create('transform', {
                            duration: theme.transitions.duration.short,
                            easing: theme.transitions.easing.easeInOut,
                        }),
                        transform: openDrawer ? `translateX(${drawerWidth}px)` : 'translateX(0)', // , width: "600px", minWidth: "300px", maxWidth: "90%"
                        width: openDrawer ? `calc(100% - ${drawerWidth}px)` : '100%', // Diminui a largura da Box com o Drawer aberto
                    }}
                >
                    <DialogTitle id="scroll-dialog-title" style={{ display: "flex", alignItems: "center", height: "64px" }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ ...(openDrawer && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <img src={LogoPremick} alt="Imagem de Perfil do Mick" style={{ height: "40px", width: "40px", borderRadius: "20px", marginRight: "10px" }} />
                        Mick
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={(theme) => ({
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: theme.palette.grey[500],
                            })}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            {mensagens.map((mensagem) => (
                                <div key={mensagem.id_mensagem} style={{ display: "flex", justifyContent: mensagem.tipo_mensagem === "USER" ? "flex-end" : "flex-start", marginBottom: "5px", marginTop: "5px" }}>
                                    {mensagem.tipo_mensagem === "USER" ? (
                                        <MessageRight text={mensagem.conteudo} time={mensagem.data_envio} />
                                    ) : (
                                        <MessageLeft text={mensagem.conteudo} time={mensagem.data_envio} />
                                    )}
                                </div>
                            ))}
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <TextField id="outlined-basic" label="Mensagem" variant="outlined" value={pergunta} onChange={(e) => { setPergunta(e.target.value) }} sx={{ width: "100%" }} />
                        <Button
                            sx={{ width: "56px", height: "56px" }}
                            disabled={loading}
                            onClick={async () => {
                                if (!pergunta) {
                                    alert("Campo Pergunta não pode ser vazio!")
                                } else {
                                    await handleSubmitMessage();
                                }
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <SendIcon sx={{ color: "black", width: "40px", height: "40px" }} />
                            )}
                        </Button>
                    </DialogActions>

                </Box>
            </Dialog>
        </Fragment>
    );
}

export default MickChat;
