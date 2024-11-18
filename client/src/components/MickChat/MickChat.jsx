import * as React from 'react';

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

import PersistentDrawerLeft from '../PersistentDrawer/PersistentDrawer';

const MickChat = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);


    return (
        <React.Fragment>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab onClick={handleClickOpen} /*size="small" || "medium"*/ color="secondary" aria-label="add">
                    <AddIcon />
                </Fab>
            </Box>

            {/* <Button onClick={handleClickOpen}>Open Dialog</Button> */}

            <Dialog
                open={open}
                onClose={handleClose}
                // scroll="paper"
                // aria-labelledby="scroll-dialog-title"
                // aria-describedby="scroll-dialog-description"
                sx={{
                    '& .MuiDialog-paper': {
                        height: "80%",
                        width: "600px",
                        minWidth: '300px', // Ajuste aqui o valor desejado
                        maxWidth: '90%'
                    },
                }}
            >
                <DialogTitle id="scroll-dialog-title" style={{ display: "flex", alignItems: "center" }}>
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
                <PersistentDrawerLeft />
                {/* <DialogContent dividers>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        style={{display: "flex", flexDirection: "column"}}
                    >   
                        <div style={{ display: "flex", justifyContent: "flex-start"}}>
                            <MessageLeft text="todo bonitinho assim no fundo" time="17:13"/>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom:"10px", marginTop:"10px"}}>
                            <MessageRight text="Testandoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo pra ver se vai" time="16:33"/>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-start"}}>
                            <MessageLeft text="todo bonitinho assim no fundo" time="17:13"/>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom:"10px", marginTop:"10px"}}>
                            <MessageRight text="Testando pra ver se vai" time="16:33"/>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-start"}}>
                            <MessageLeft text="todo bonitinho assim no fundo" time="17:13"/>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom:"10px", marginTop:"10px"}}>
                            <MessageRight text="Testando pra ver se vai" time="16:33"/>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-start"}}>
                            <MessageLeft text="todo bonitinho assim no fundo" time="17:13"/>
                        </div>
                    </DialogContentText>
                    <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '400px', // Defina uma altura adequada
                            overflow: 'hidden', // Impede o overflow do conteúdo
                        }}
                    >
                    </Box>
                </DialogContent> */}
                <DialogActions>
                    <TextField id="outlined-basic" label="Mensagem" variant="outlined" sx={{ width: "100%" }} />
                    <Button onClick={handleClose} sx={{ width: "56px", height: "56px" }}> <SendIcon sx={{ color: "black", width: "40px", height: "40px" }} /> </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default MickChat;