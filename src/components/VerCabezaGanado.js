import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ArrowBack, AssistantPhoto, Cancel, CheckCircle, Delete, Download, Edit, Error, Save } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

export default function VerCabezaGanado() {

    const navigate = useNavigate();
    const params = useParams()

    const [cabezaGanado, setCabezaGanado] = useState({
        id: '',
        id_raza: '',
        nombre: '',
        sexo: 'M',
        id_padre: '',
        n_padre: '',
        r_padre: '',
        id_madre: '',
        n_madre: '',
        r_madre: '',
        estado: '',
        fecha_nacimiento: dayjs().format('YYYY-MM-DD'),
        id_procedencia: 0,
        edad: '',
        precio: '',
        tipo: ''
    })

    const [prenada, setPrenada] = useState(false)
    const [razas, setRazas] = useState([])
    const [procs, setProcs] = useState([])
    const [value, setValue] = useState(dayjs());
    const [edicion, setEdicion] = useState(true)
    const [propio, setPropio] = useState(true)
    const [eliminar, setEliminar] = useState(false)
    const [exito, setExito] = useState({
        exito: false,
        mensaje: ''
    })
    const [error, setError] = useState({
        abierto: false,
        mensaje: '',
        titulo: ''
    });

    const downloadQRCode = () => {
        const canvas = document.getElementById("qr-gen");
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${cabezaGanado.nombre}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    useEffect(() => {
        if (params.id) {
            const url = `http://192.168.0.88:8080/ganado/${params.id}`
            const fetchGanadoInfo = async () => {
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                        },
                    });
                    const json = await response.json();
                    cabezaGanado.id = params.id
                    cabezaGanado.id_raza = json.raza.raza
                    cabezaGanado.nombre = json.nombre
                    cabezaGanado.sexo = json.sexo
                    cabezaGanado.estado = json.estado
                    cabezaGanado.tipo = json.tipo
                    console.log(cabezaGanado)
                    if (json.tipo === 'PROPIO') {
                        setCabezaGanado({ ...cabezaGanado, id_padre: json.padre.id, n_padre: json.padre.nombre, r_padre: json.padre.raza.raza, id_madre: json.madre.id, n_madre: json.madre.nombre, r_madre: json.madre.raza.raza, fecha_nacimiento: json.fechaNacimiento.substring(0, 10) })
                        setValue(dayjs(json.fechaNacimiento).format('YYYY-MM-DD'))
                        console.log(cabezaGanado)
                    } else {
                        setPropio(false)
                        setCabezaGanado({ ...cabezaGanado, edad: json.edad, id_procedencia: json.procedencia.id, precio: json.precio })
                    }
                } catch (error) {
                    console.log(error)
                }
            }

            const urlRazas = "http://192.168.0.88:8080/razas"
            const urlProcd = "http://192.168.0.88:8080/procedencia"
            const urlPrenez = 'http://192.168.0.88:8080/estaprenada/' + params.id

            const fetchRazas = async () => {
                try {
                    const response = await fetch(urlRazas, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                        },
                    });
                    const json = await response.json();
                    var finalData = []
                    json.forEach(registro => {
                        finalData.push(registro.raza)
                    })
                    setRazas(finalData)
                } catch (error) {
                    console.log(error)
                }
            }

            const fetchProcedencias = async () => {
                try {
                    const response = await fetch(urlProcd, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                        },
                    });
                    const json = await response.json();
                    var finalData = []
                    json.forEach(registro => {
                        finalData.push(registro.id)
                    })
                    setProcs(finalData)
                } catch (error) {
                    console.log(error)
                }
            }

            const fetchEstaPrenada = async () => {
                try {
                    const response = await fetch(urlPrenez, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                        },
                    });
                    const res = await response.text();
                    console.log(res)
                    setPrenada(res == 'true')
                } catch (error) {
                    console.log(error)
                }
            }

            fetchRazas()
            fetchProcedencias()
            fetchGanadoInfo()
            fetchEstaPrenada()
        }

    }, [params.id])

    const iniciarPrenez = () => {
        const urlPrenez = 'http://192.168.0.88:8080/prenez/crear'
        const prenezReq = {
            id: 0,
            idCabezaGanado: params.id,
            estado: 'PRENADA',
            fechaInseminacion: dayjs().format('YYYY-MM-DD'),
            fechaParto: '',
        }
        fetch(urlPrenez, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prenezReq)
        }).then(res => {
            if (res.status != 201) {
                res.text().then(msg => {
                    error.mensaje = msg
                    setError({ abierto: true, mensaje: msg, titulo: 'Error al registrar' })
                })
            } else {
                navigate('/content/ganado')
            }
        })
    }

    const guardarCambios = () => {

        var urlPet = ''

        const guardarCabeza = async (url) => {
            fetch(url, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cabezaGanado)
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

        if (cabezaGanado.tipo === 'PROPIO')
            urlPet = 'http://192.168.0.88:8080/ganado/propio/' + cabezaGanado.id
        else
            urlPet = 'http://192.168.0.88:8080/ganado/comprado/' + cabezaGanado.id

        console.log(cabezaGanado)
        guardarCabeza(urlPet)
    }

    const eliminarGanado = () => {
        var urlPet = 'http://192.168.0.88:8080/ganado/' + cabezaGanado.id
        console.log(urlPet)
        const eliminarCabeza = async (url) => {
            fetch(url, {
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

        eliminarCabeza(urlPet)
    }

    return (
        <div style={{ padding: '5%' }}>

            <Grid container direction='row'>
                <Grid item xs={10.9}>
                    <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '5px', color: 'green' }}> Ganado </Typography>
                </Grid>

                <Grid item sx={1.1}>
                    <Button style={{ background: '#ebb815' }} variant="contained" onClick={() => navigate('/content/ganado')}>
                        <ArrowBack style={{ marginRight: '10%' }} />
                        Volver
                    </Button>
                </Grid>
            </Grid>



            <Divider sx={{ marginBottom: '30px' }} />

            {edicion &&
                <Typography variant='h4' sx={{ color: '#242424', fontWeight: 'bold' }}> {cabezaGanado.nombre} 🐮 </Typography>}

            <div style={{ display: 'flex', flexDirection: 'row' }}>

                <Grid container direction='column' width={'70%'} marginRight='10%'>

                    {edicion &&
                        <Grid item style={{ marginBottom: '10px' }}>
                            <Typography style={{ marginBottom: '10px', fontWeight: 'bold', color: '#797979' }}>ID: {cabezaGanado.id} </Typography>
                        </Grid>}

                    <Grid container direction='row'>

                        {edicion && propio &&

                            <Grid item style={{ marginBottom: '20px', marginTop: '20px', marginRight: '10%' }} sx={6}>
                                <Typography> ID padre: {cabezaGanado.id_padre} </Typography>
                                <Typography> Nombre padre: {cabezaGanado.n_padre} </Typography>
                                <Typography> Raza padre: {cabezaGanado.r_padre} </Typography>
                            </Grid>}

                        {edicion && propio &&

                            <Grid item style={{ marginBottom: '20px', marginTop: '20px' }} sx={6}>
                                <Typography> ID madre: {cabezaGanado.id_madre} </Typography>
                                <Typography> Nombre madre: {cabezaGanado.n_madre} </Typography>
                                <Typography> Raza madre: {cabezaGanado.r_madre} </Typography>
                            </Grid>}

                        {edicion && !propio &&

                            <Grid item style={{ marginBottom: '20px', marginTop: '20px', marginRight: '10%' }} sx={6}>
                                <Typography> Edad: {cabezaGanado.edad} años </Typography>
                                <Typography> Procedencia: {cabezaGanado.id_procedencia} </Typography>
                                <Typography> Precio: $ {cabezaGanado.precio} </Typography>
                            </Grid>}

                    </Grid>

                    {edicion && <Divider sx={{ marginBottom: '30px' }} />}

                    {!edicion &&
                        <Grid item style={{ marginBottom: '20px' }}>
                            <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Nombre</Typography>
                            <TextField required label="Nombre" variant="outlined" style={{ width: '100%' }}
                                onChange={(e) => {
                                    setCabezaGanado({ ...cabezaGanado, nombre: e.target.value })
                                }}
                                value={cabezaGanado.nombre}
                                disabled={edicion}
                            />
                        </Grid>}

                    <Grid item style={{ marginBottom: '20px' }}>
                        <Typography style={{ fontWeight: 'bold' }}>Sexo</Typography>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="M"
                            name="radio-buttons-group"
                            row
                            onChange={(e) => setCabezaGanado({ ...cabezaGanado, sexo: e.target.value })}
                            value={cabezaGanado.sexo}
                            disabled={edicion}
                        >
                            <FormControlLabel value="M" control={<Radio color="success" />} disabled={edicion} label="Macho" />
                            <FormControlLabel value="H" control={<Radio color="success" />} disabled={edicion} label="Hembra" />
                        </RadioGroup>
                    </Grid>

                    <Grid item style={{ marginBottom: '20px' }}>
                        <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Raza</Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={cabezaGanado.id_raza}
                            options={razas}
                            onChange={(e, n) => setCabezaGanado({ ...cabezaGanado, id_raza: n })}
                            renderInput={(params) => <TextField {...params} required label="Raza" />}
                            disabled={edicion}
                        />
                    </Grid>

                    <Grid item style={{ marginBottom: '20px' }}>
                        <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Estado</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label"> {cabezaGanado.estado} </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={cabezaGanado.estado}
                                label="Estado"
                                onChange={(e) => setCabezaGanado({ ...cabezaGanado, estado: e.target.value })}
                                disabled={edicion}
                            >
                                <MenuItem value='VIVA'>Viva</MenuItem>
                                <MenuItem value='MUERTA'>Muerta</MenuItem>
                                <MenuItem value='VENDIDA'>Vendida</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>










                    <Grid container direction='row'>

                        {!edicion && propio &&

                            <Grid item style={{ marginBottom: '20px', marginTop: '20px', marginRight: '10%' }} sx={6}>
                                <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>ID padre</Typography>
                                <TextField required label="ID padre" variant="outlined" type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    disabled={edicion}
                                    onChange={(e) => setCabezaGanado({ ...cabezaGanado, id_padre: e.target.value })}
                                    value={cabezaGanado.id_padre}
                                />
                            </Grid>}

                        {!edicion && propio &&
                            <Grid item style={{ marginBottom: '20px', marginTop: '20px' }} sx={6}>
                                <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>ID madre</Typography>
                                <TextField required label="ID madre" variant="outlined" type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    disabled={edicion}
                                    onChange={(e) => setCabezaGanado({ ...cabezaGanado, id_madre: e.target.value })}
                                    value={cabezaGanado.id_madre}
                                />
                            </Grid>}

                    </Grid>

                    {propio &&
                        <Grid item style={{ marginBottom: '20px' }}>
                            <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Fecha de nacimiento</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Fecha"
                                    inputFormat="YYYY-MM-DD"
                                    value={value}
                                    onChange={(newValue) => {
                                        setValue(newValue);
                                        setCabezaGanado({ ...cabezaGanado, fecha_nacimiento: newValue.format('YYYY-MM-DD') })
                                    }}
                                    renderInput={(params) => <TextField {...params} required style={{ width: '100%' }} />}
                                    maxDate={dayjs()}
                                    disabled={edicion}
                                />
                            </LocalizationProvider>
                        </Grid>}


                    {!edicion && !propio &&
                        <Grid item style={{ marginBottom: '20px', marginTop: '20px' }}>
                            <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Edad (en años)</Typography>
                            <TextField required label="Edad" variant="outlined" style={{ width: '100%' }} type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setCabezaGanado({ ...cabezaGanado, edad: e.target.value })}
                                disabled={edicion}
                                value={cabezaGanado.edad}
                            />
                        </Grid>}

                    {!edicion && !propio &&
                        <Grid item style={{ marginBottom: '20px' }}>
                            <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Procedencia</Typography>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={procs}
                                renderInput={(params) => <TextField {...params} required label="Procedencia" />}
                                onChange={(e, v) => {
                                    setCabezaGanado({ ...cabezaGanado, id_procedencia: v })
                                }}
                                disabled={edicion}
                                value={cabezaGanado.id_procedencia}
                            />
                        </Grid>}

                    {!edicion && !propio &&
                        <Grid item style={{ marginBottom: '20px' }}>
                            <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Precio</Typography>
                            <TextField required label="Precio" variant="outlined" style={{ width: '100%' }} type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                onChange={(e) => setCabezaGanado({ ...cabezaGanado, precio: e.target.value })}
                                value={cabezaGanado.precio}
                            />
                        </Grid>}

                </Grid>

                <Grid container direction='column' width={'30%'}>
                    {edicion &&
                        <Grid item style={{ marginBottom: '20px', marginTop: '20px', marginRight: '10%' }} sx={6}>
                            <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>QR Arete</Typography>
                            <QRCodeCanvas id="qr-gen" value={cabezaGanado.id} size={300} />
                            <Button onClick={() => downloadQRCode()} style={{ marginTop: '10px' }}>
                                <Download style={{ marginRight: '10%' }} />
                                Descargar
                            </Button>
                        </Grid>}


                </Grid>

            </div>

            <Grid container direction='row' style={{ marginTop: '20px' }}>
                {edicion &&
                    <Grid item>
                        <Button style={{ background: 'green' }} variant="contained" onClick={() => setEdicion(!edicion)}>
                            <Edit style={{ marginRight: '10%' }} />
                            Editar
                        </Button>
                    </Grid>
                }

                {!prenada && edicion && cabezaGanado.sexo == 'H' &&
                    <Grid item>
                        <Button style={{ background: '#ebb815', width: '130%', marginLeft: '5%' }} variant="contained" onClick={() => iniciarPrenez()}>
                            <AssistantPhoto style={{ marginRight: '10%' }} />
                            Iniciar preñez
                        </Button>
                    </Grid>
                }


                {!edicion &&
                    <Grid container direction='row'>
                        <Grid item marginRight={'2%'}>
                            <Button style={{ background: 'green' }} variant="contained" onClick={() => {
                                guardarCambios()
                            }}>
                                <Save style={{ marginRight: '10%' }} />
                                Guardar
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button style={{ background: 'red' }} variant="contained" onClick={() => setEliminar(true)}>
                                <Delete style={{ marginRight: '10%' }} />
                                Eliminar
                            </Button>
                        </Grid>
                    </Grid>
                }
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
                        navigate('/content/ganado')
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
                        eliminarGanado()
                        navigate('/content/ganado')
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