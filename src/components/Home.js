import { Cancel, CheckCircle, Edit, Error, Save } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import MUIDataTable from 'mui-datatables';
import React, { useEffect } from 'react'
import { useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function Home() {

    const navigate = useNavigate()
    const [fecha, setFecha] = useState("")

    const [data, setData] = useState([])
    const [editando, setEditando] = useState(false)
    const [tt, setTt] = useState(0)
    const [hoy, setHoy] = useState({
        fechaRegistro: dayjs().format('YYYY-MM-DD'),
        totalTernero: 0,
        totalSobrante: 0
    })

    const [peticion, setPeticion] = useState({
        idRegistro: dayjs().format('YYYY-MM-DD'),
        totalTerneros: 0
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

    const columns = ["Id registro", "Id de la vaca", "Nombre", "Turno", "Total (litros)", "Realizó el registro", {
        name: "",
        options: {
            filter: false,
            customBodyRenderLite: (dataIndex, rowIndex) => {
                return (
                    <Button style={{}} variant="text" onClick={() => navigate('/content/leche/editar/' + data[dataIndex][0])}>
                        Editar
                        <Edit style={{ marginLeft: '10%' }} />

                    </Button>
                )
            }
        }
    }]

    const options = {
        selectableRows: false,
        selectableRowsHeader: false,
        filter: 'false',
        download: 'false',
        print: 'false',
        textLabels: {
            body: {
                noMatch: 'No se han ingresado registros todavía',
            }
        },
        serverSide: false
    }

    useEffect(() => {
        const url = "http://192.168.0.88:8080/leche/registros/hoy"

        var today = new Date();
        setFecha(today.toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' }))

        const fetchRegistrosLeche = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                    },
                });
                const json = await response.json();
                var finalData = []
                json.forEach(registro => {
                    var singleData = []
                    singleData.push(registro.id)
                    singleData.push(registro.cabezaGanado.id)
                    singleData.push(registro.cabezaGanado.nombre)
                    singleData.push(registro.turno == 'T' ? 'Tarde' : 'Mañana')
                    singleData.push(registro.total)
                    singleData.push(registro.usuario.persona.nombre)
                    finalData.push(singleData)
                })

                setData(finalData)
            } catch (error) {
                console.log(error)
            }
        }

        const fetchDatosHoy = async () => {
            const urlHoy = "http://192.168.0.88:8080/leche/registros/" + dayjs().format('YYYY-MM-DD')
            console.log(urlHoy)
            try {
                const response = await fetch(urlHoy, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                    },
                });
                const json = await response.json();
                setHoy({ ...hoy, totalTernero: json.totalTernero, totalSobrante: json.totalSobrante })
            } catch (error) {
                console.log(error)
            }
        }

        const fetchTt = async () => {
            const urlHoy = "http://192.168.0.88:8080/leche/registros/" + dayjs().format('YYYY-MM-DD')
            try {
                const response = await fetch(urlHoy, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                    },
                });
                const json = await response.json();
                setTt(json.totalTernero)
            } catch (error) {
                console.log(error)
            }
        }

        fetchRegistrosLeche()
        fetchDatosHoy()
        fetchTt()

        const interval = setInterval(() => {
            fetchRegistrosLeche()
            fetchDatosHoy()
        }, 5000)

        return () => clearInterval(interval)

    }, [])

    const guardarTTerneros = async () => {
        const url = "http://192.168.0.88:8080/leche/registrar/totalterneros"
        console.log(peticion)
        fetch(url, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(peticion)
        }).then(res => {
            if (res.status != 201) {
                res.text().then(msg => {
                    error.mensaje = msg
                    setError({ abierto: true, mensaje: msg, titulo: 'Error al guardar' })
                })
            } else {
                setExito({ exito: true, mensaje: 'Se ha guardado la información correctamente' })
            }
        })
    }

    return (
        <div style={{ padding: '5%' }}>

            <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '5px', color: 'green' }}> Inicio </Typography>

            <Divider sx={{ marginBottom: '30px' }} />
            <div style={{ display: 'inline' }}>
                <Grid container direction='row' style={{ marginBottom: '20px' }} alignItems="center">
                    <Grid item xs={9}>
                        <Typography variant='h5' sx={{ marginBottom: '10px', color: '#242424', fontWeight: 'bold' }}> REGISTROS DE LECHE - HOY 📆 </Typography>
                    </Grid>

                    <Grid item xs={3} alignItems="center">

                        <TextField style={{ width: '49%', marginRight: '3%' }} size="small" label="Total terneros" variant="outlined" disabled={!editando}
                            InputProps={{
                                endAdornment: <InputAdornment position="start">litros</InputAdornment>,
                            }}
                            value={tt}
                            onChange={(e) => {
                                setTt(e.target.value)
                                setPeticion({ ...peticion, totalTerneros: e.target.value })
                            }}
                        />

                        {editando &&
                            <Button style={{ background: 'green', marginRight: '2%', height: '39px' }} variant="contained"
                                onClick={() => guardarTTerneros()}
                            >
                                <Save />
                            </Button>
                        }

                        {editando &&
                            <Button style={{ background: '#ebb815', marginRight: '2%', height: '39px' }} variant="contained" onClick={() => {
                                setEditando(false)
                                setTt(hoy.totalTernero)
                            }}
                            >
                                <Cancel />
                            </Button>
                        }

                        {!editando &&
                            <Button style={{ background: 'green', width: '43%', height: '39px' }} variant="contained" onClick={() => setEditando(true)}>
                                <Edit style={{ marginRight: '5%' }} />
                                Actualizar
                            </Button>}
                    </Grid>
                </Grid>

                <Grid container direction='column' width={'500px'}>
                    <Grid container direction='row'>
                        <Grid item xs={6}>
                            <Typography style={{ fontWeight: 'bold' }}> Total:  </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography> {hoy.totalSobrante + hoy.totalTernero} litros </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction='row'>
                        <Grid item xs={6}>
                            <Typography style={{ fontWeight: 'bold' }}> Total sobrante:  </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography> {hoy.totalSobrante} litros </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction='row'>
                        <Grid item xs={6}>
                            <Typography style={{ fontWeight: 'bold' }}> Total terneros:  </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography> {hoy.totalTernero} litros </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ marginBottom: '30px', marginTop: '30px' }} />

                <Typography variant='h5' sx={{ marginBottom: '10px', color: '#242424', fontWeight: 'bold' }}> REGISTROS DE LECHE POR VACA 📋 </Typography>
                <MUIDataTable
                    title={fecha}
                    data={data}
                    columns={columns}
                    options={options}
                />

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
                            setTt(hoy.totalTernero)
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
                        setEditando(false)
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
                            setEditando(false)
                        }} autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}
