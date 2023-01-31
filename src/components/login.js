import React, { useState } from "react";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Logo from '../assets/img/vaca.png'
import { useNavigate } from "react-router-dom";
import { Error } from "@mui/icons-material";
export default function Login() {

    const navigate = useNavigate();

    const paperStyle = { padding: 20, height: '70vh', width: '70%', margin: "0px auto", display: "flex", justifyContent: 'center', flexDirection: "column", borderRadius: 10 }
    const avatarStyle = { backgroundColor: 'green' }
    const btnstyle = { margin: '5% 0', backgroundColor: 'green', height: '7%' }

    const [usuario, setUsuario] = useState({
        username: '',
        password: ''
    })

    const [error, setError] = useState({
        abierto: false,
        mensaje: '',
        titulo: ''
    });

    const login = async () => {
        const url = 'http://192.168.0.88:8080/login?username=' + usuario.username + '&password=' + usuario.password
        console.log(url)
        try {
            fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
            }).then(res => {
                if (res.status != 200) {
                    console.log(res.status)
                    res.text().then(msg => {
                        setError({ abierto: true, mensaje: "No se ha podido iniciar sesión. Verifique sus credenciales", titulo: 'Error al iniciar sesión' })
                    })
                } else {
                    navigate('/content/home')
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
            className="login-grid"
        >
            <Grid item xs={3}>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center' sx={{ marginBottom: '15%' }}>
                        <img src={Logo} width="30%" />
                        <h1>CowApp</h1>
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    </Grid>
                    <TextField id="standard-basic" label='Usuario' placeholder="Ingrese el usuario" required variant="outlined" sx={{ marginBottom: '3%' }} onChange={(e) => setUsuario({ ...usuario, username: e.target.value })} />
                    <TextField id="standard-basic" label='Contraseña' placeholder="Ingrese la contraseña" type='password' required variant="outlined" onChange={(e) => setUsuario({ ...usuario, password: e.target.value })} />
                    <Button variant="contained" type='submit' color='primary' style={btnstyle} fullWidth onClick={() => login()}>Iniciar Sesión</Button>
                </Paper>
            </Grid>
            <Dialog
                open={error.abierto}
                onClose={() => setError({ ...error, abierto: false })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ textAlign: 'center' }}
            >
                <DialogTitle id="alert-dialog-title" >
                    {error.titulo}
                </DialogTitle>
                <DialogContent>
                    <Error fontSize="large" sx={{ color: 'red' }} />
                    <DialogContentText id="alert-dialog-description">
                        {error.mensaje}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setError({ ...error, abierto: false })} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid >
    )
}