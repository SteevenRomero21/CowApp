import { ArrowBack, Cancel, CheckCircle, Delete, Error, Save } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditRegistroXVaca() {
    const navigate = useNavigate()
    const params = useParams()

    const [eliminar, setEliminar] = useState(false)

    const [registroLeche, setRegistroLeche] = useState({
        id: params.id,
        idCabezaGanado: '',
        idUsuario: 'admin',
        turno: '',
        total: 0
    })

    const [exito, setExito] = useState({
        exito: false,
        mensaje: ''
    })
    const [error, setError] = useState({
        abierto: false,
        mensaje: '',
        titulo: ''
    });

    useEffect(() => {
        var urlGet = 'http://192.168.0.88:8080/leche/registros/ver/' + params.id
        const fetchRegistro = async () => {
            try {
                const response = await fetch(urlGet, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                    },
                });
                const json = await response.json();
                setRegistroLeche({ idCabezaGanado: json.cabezaGanado.id, idUsuario: 'admin', turno: json.turno, total: json.total })
                console.log(json)
            } catch (error) {
                console.log(error)
            }
        }

        fetchRegistro()
    }, [])

    const guardarEdicion = () => {
        var urlPut = 'http://192.168.0.88:8080/leche/' + params.id
        fetch(urlPut, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registroLeche)
        }).then(res => {
            if (res.status != 201) {
                res.text().then(msg => {
                    error.mensaje = msg
                    setError({ abierto: true, mensaje: msg, titulo: 'Error al guardar' })
                })
            } else {
                setExito({ exito: true, mensaje: 'Se ha actualizado el registro correctamente' })
            }
        })
    }

    const eliminarRegistro = () => {
        var urlDelete = 'http://192.168.0.88:8080/leche/' + params.id
        fetch(urlDelete, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
        }).then(res => {
            if (res.status != 200) {
                res.text().then(msg => {
                    error.mensaje = msg
                    setError({ abierto: true, mensaje: msg, titulo: 'Error al eliminar' })
                })
            } else {
                setExito({ exito: true, mensaje: 'Se ha eliminado el registro correctamente' })
            }
        })
    }

    return (
        <div style={{ padding: '5%' }}>
            <Grid container direction='row'>
                <Grid item xs={10.9}>
                    <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '5px', color: 'green' }}> Leche </Typography>
                </Grid>

                <Grid item sx={1.1}>
                    <Button style={{ background: '#ebb815' }} variant="contained" onClick={() => navigate('/content/home')}>
                        <ArrowBack style={{ marginRight: '10%' }} />
                        Volver
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{ marginBottom: '30px' }} />

            <Grid container direction='column' width={'30%'}>
                <Grid item style={{ marginBottom: '20px' }}>
                    <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>ID vaca</Typography>
                    <TextField required label="ID vaca" variant="outlined" style={{ width: '100%' }}
                        onChange={(e) => {
                            setRegistroLeche({ ...registroLeche, idCabezaGanado: e.target.value })
                        }}
                        value={registroLeche.idCabezaGanado}
                    />
                </Grid>

                <Grid item style={{ marginBottom: '20px' }}>
                    <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Total leche producida</Typography>
                    <TextField required label="Leche total" variant="outlined" style={{ width: '100%' }}
                        InputProps={{
                            endAdornment: <InputAdornment position="start">litros</InputAdornment>,
                        }}
                        value={registroLeche.total}
                        onChange={(e) => {
                            setRegistroLeche({ ...registroLeche, total: e.target.value })
                        }}
                    />
                </Grid>

                <Grid item style={{ marginBottom: '20px' }}>
                    <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Turno</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label"> {registroLeche.turno} </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={registroLeche.turno}
                            label="Turno"
                            onChange={(e) => setRegistroLeche({ ...registroLeche, turno: e.target.value })}
                        >
                            <MenuItem value='M'>Mañana</MenuItem>
                            <MenuItem value='T'>Tarde</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid container direction='row'>
                    <Grid item marginRight={'2%'}>
                        <Button style={{ background: 'green' }} variant="contained" onClick={() => {
                            (guardarEdicion())
                        }}>
                            <Save style={{ marginRight: '10%' }} />
                            Guardar
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button style={{ background: 'red' }} variant="contained" onClick={() => (setEliminar(true))}>
                            <Delete style={{ marginRight: '10%' }} />
                            Eliminar
                        </Button>
                    </Grid>
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
                    <Button onClick={() => {
                        setError({ ...error, abierto: false })
                    }}
                        autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={exito.exito}
                onClose={() => {
                    setExito({ exito: false })
                    navigate('/content/home')
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
                        {exito.mensaje}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setExito({ exito: false })
                        navigate('/content/home')
                    }} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={eliminar}
                onClose={() => setEliminar(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
                    {"Alerta de eliminación de registro"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Una vez eliminado el registro no se podrá revertir, ¿está seguro que desea eliminar el registro?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ background: 'green' }} variant="contained" onClick={() => {
                        setEliminar(false)
                        eliminarRegistro()
                        navigate('/content/home')
                    }}>
                        <CheckCircle style={{ marginRight: '5%' }} />
                        Seguro
                    </Button>
                    <Button style={{ background: '#ebb815' }} variant="contained" onClick={() => setEliminar(false)} autoFocus>
                        <Cancel style={{ marginRight: '5%' }} />
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
