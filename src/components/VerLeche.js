import { ArrowBack, Cancel, CheckCircle, Edit, Error, Save } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import MUIDataTable from 'mui-datatables';
import React, { useEffect } from 'react'
import { useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

export default function VerLeche() {

    const navigate = useNavigate()
    const params = useParams()

    const [fecha, setFecha] = useState("")

    const columns = ["Id de la vaca", "Nombre", "Turno", "Total (litros)", "Realizó el registro"]

    const [data, setData] = useState([])
    const [hoy, setHoy] = useState({
        fechaRegistro: dayjs().format('YYYY-MM-DD'),
        totalTernero: 0,
        totalSobrante: 0
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

    const options = {
        selectableRows: false,
        selectableRowsHeader: false,
        filter: 'false',
        download: 'false',
        print: 'false',
        textLabels: {
            body: {
                noMatch: 'No se registró este día',
            }
        },
        serverSide: false
    }

    useEffect(() => {
        const url = "http://192.168.0.88:8080/leche/registros/listarde/" + params.id



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
                    singleData.push(registro.cabezaGanado.id)
                    singleData.push(registro.cabezaGanado.nombre)
                    singleData.push(registro.turno == 'T' ? 'Tarde' : 'Mañana')
                    singleData.push(registro.total)
                    singleData.push(registro.usuario.persona.nombre)
                    finalData.push(singleData)
                    setHoy({ fechaRegistro: registro.registro.fechaRegistro.substring(0, 10), totalTernero: registro.registro.totalTernero, totalSobrante: registro.registro.totalSobrante })
                    var today = new Date(registro.registro.fechaRegistro.substring(0, 10));
                    setFecha(today.toLocaleDateString("es-ES", { timeZone: "UTC" }, { year: 'numeric', month: 'long', day: 'numeric' }))
                })
                setData(finalData)
            } catch (error) {
                console.log(error)
            }
        }

        fetchRegistrosLeche()
    }, [])

    return (
        <div style={{ padding: '5%' }}>
            <Grid container direction='row'>
                <Grid item xs={10.9}>
                    <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '5px', color: 'green' }}> Leche </Typography>
                </Grid>

                <Grid item sx={1.1}>
                    <Button style={{ background: '#ebb815' }} variant="contained" onClick={() => navigate('/content/leche')}>
                        <ArrowBack style={{ marginRight: '10%' }} />
                        Volver
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{ marginBottom: '30px' }} />
            <div style={{ display: 'inline' }}>
                <Grid container direction='row' style={{ marginBottom: '20px' }} alignItems="center">
                    <Grid item xs={6}>
                        <Typography variant='h5' sx={{ marginBottom: '10px', color: '#242424', fontWeight: 'bold' }}> REGISTROS DE LECHE - {fecha.toUpperCase()} 🥛 </Typography>
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
                    title={""}
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
                        }}
                            autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={exito.exito}
                    onClose={() => {
                        setExito({ exito: false, ...exito })
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
                            setExito({ exito: false, ...exito })

                        }} autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}
