import { CheckCircle, Error, Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CrearUsuarios() {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        user: '',
        password: '',
        rol: 'USER',
        cedulaRuc: '',
        nombre: '',
        fechaNacimiento: dayjs().format('YYYY-MM-DD'),
        ciudad: '',
        sexo: 'H'
    })

    const [error, setError] = useState({
        abierto: false,
        mensaje: '',
        titulo: ''
    });

    const [exito, setExito] = useState(false)

    const [value, setValue] = React.useState(dayjs());
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const guardarUsuario = () => {
        const url = 'http://192.168.0.88:8080/usuarios/crear'
        fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        }).then(res => {
            if (res.status != 201) {
                res.text().then(msg => {
                    setError({ abierto: true, mensaje: msg, titulo: 'Error al registrar' })
                })
            } else {
                setExito(true)
            }
        })
    }

    return (
        <div style={{ padding: '5%' }}>
            <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '5px', color: 'green' }}> Usuarios </Typography>

            <Divider sx={{ marginBottom: '30px' }} />

            <Grid container direction='column' style={{ width: '50%' }}>
                <Grid item style={{ marginBottom: '20px', marginTop: '20px' }}>
                    <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Nombre de usuario</Typography>
                    <TextField required label="Nombre de usuario" variant="outlined" style={{ width: '100%' }}
                        onChange={(e) => {
                            setUsuario({ ...usuario, user: e.target.value })
                        }}
                        value={usuario.username}
                    />
                </Grid>

                <Grid item style={{ marginBottom: '20px', marginTop: '20px' }}>
                    <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Contraseña</Typography>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Contraseña"
                            onChange={(e) => {
                                setUsuario({ ...usuario, password: e.target.value })
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item style={{ marginBottom: '20px', marginTop: '20px' }}>
                    <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Nombre</Typography>
                    <TextField required label="Nombre" variant="outlined" style={{ width: '100%' }}
                        onChange={(e) => {
                            setUsuario({ ...usuario, nombre: e.target.value })
                        }}
                        value={usuario.nombre}
                    />
                </Grid>

                <Grid item style={{ marginBottom: '20px' }}>
                    <Typography style={{ fontWeight: 'bold' }}>Sexo</Typography>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="H"
                        name="radio-buttons-group"
                        row
                        onChange={(e) => setUsuario({ ...usuario, sexo: e.target.value })}
                    >
                        <FormControlLabel value="H" control={<Radio color="success" />} label="Hombre" />
                        <FormControlLabel value="M" control={<Radio color="success" />} label="Mujer" />
                    </RadioGroup>
                </Grid>

                <Grid item style={{ marginBottom: '20px', marginTop: '20px' }}>
                    <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Cédula</Typography>
                    <TextField required label="Cédula" variant="outlined" style={{ width: '100%' }}
                        onChange={(e) => {
                            setUsuario({ ...usuario, cedulaRuc: e.target.value })
                        }}
                        value={usuario.cedulaRuc}
                    />
                </Grid>

                <Grid item style={{ marginBottom: '20px' }}>
                    <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Fecha de nacimiento</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Fecha"
                            inputFormat="YYYY-MM-DD"
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                                setUsuario({ ...usuario, fechaNacimiento: newValue.format('YYYY-MM-DD') })
                            }}
                            renderInput={(params) => <TextField {...params} required style={{ width: '100%' }} />}
                            maxDate={dayjs()}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item style={{ marginBottom: '20px', marginTop: '20px' }}>
                    <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Ciudad de procedencia</Typography>
                    <TextField required label="Ciudad" variant="outlined" style={{ width: '100%' }}
                        onChange={(e) => {
                            setUsuario({ ...usuario, ciudad: e.target.value })
                        }}
                        value={usuario.ciudad}
                    />
                </Grid>

                <Grid item style={{ marginBottom: '20px', marginTop: '20px' }}>
                    <Button style={{ background: 'green', width: '45%', marginRight: '2%' }} variant="contained" onClick={() => guardarUsuario()} sx={1}>
                        <CheckCircle style={{ marginRight: '3%' }} />
                        Listo
                    </Button>
                </Grid>

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

            <Dialog
                open={exito}
                onClose={() => {
                    setExito(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ textAlign: 'center' }}
            >
                <DialogTitle id="alert-dialog-title" >
                    {"Éxito"}
                </DialogTitle>
                <DialogContent>
                    <CheckCircle fontSize="large" color="success" />
                    <DialogContentText id="alert-dialog-description">
                        Se ha registrado un nuevo usuario correctamente
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setExito(false)
                        navigate('/content/home')
                    }} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
