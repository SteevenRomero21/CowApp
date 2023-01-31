import { Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AddCircleRounded, Cancel, CheckCircle } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function RegistroCabeza() {

    const navigate = useNavigate();

    const [cabezaGanado, setCabezaGanado] = useState({
        id_raza: '',
        nombre: '',
        sexo: 'M',
        id_padre: '',
        id_madre: '',
        estado: '',
        fecha_nacimiento: dayjs().format('YYYY-MM-DD'),
        id_procedencia: '',
        edad: '',
        precio: ''
    })

    const [padre, setPadre] = useState({
        id_raza: '',
        nombre: '',
        sexo: 'M',
        id_padre: '4',
        id_madre: '3',
        estado: '',
        fecha_nacimiento: dayjs('2010-01-01').format('YYYY-MM-DD'),
    })

    const [madre, setMadre] = useState({
        id_raza: '',
        nombre: '',
        sexo: 'H',
        id_padre: '4',
        id_madre: '3',
        estado: '',
        fecha_nacimiento: dayjs('2010-01-01').format('YYYY-MM-DD'),
    })

    const [procedencia, setProcedencia] = useState({
        id_procedencia: '',
        procedencia: ''
    })

    const [razas, setRazas] = useState([])
    const [checkedComprado, setCheckedComprado] = useState(false);
    const [procs, setProcs] = useState([])
    const [checkedProcd, setCheckedProcd] = useState(false);
    const [value, setValue] = React.useState(dayjs());
    const [checkedPadre, setCheckedPadre] = useState(false);
    const [checkedMadre, setCheckedMadre] = useState(false);

    const [error, setError] = useState({
        abierto: false,
        mensaje: '',
        titulo: ''
    });

    const [exito, setExito] = useState(false)

    var errorRegistro = false

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const guardarFormulario = async () => {

        const registrarCabeza = async (url) => {
            fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cabezaGanado)
            }).then(res => {
                if (res.status != 201) {
                    res.text().then(msg => {
                        error.mensaje = msg
                        setError({ abierto: true, mensaje: msg, titulo: 'Error al registrar' })
                    })
                } else {
                    var data = res.json()
                    setExito(true)
                }
            })
        }

        if (!checkedComprado) {

            var urlPropio = "http://192.168.0.88:8080/ganado/propio"

            if (checkedPadre || checkedMadre) {

                if (checkedPadre) {
                    fetch(urlPropio, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(padre)
                    }).then(res => {
                        if (res.status != 201) {
                            res.text().then(msg => {
                                error.mensaje = msg
                                setError({ abierto: true, mensaje: msg, titulo: 'Error al registrar nuevo padre' })
                            })
                        } else {
                            res.json().then(toro => {
                                cabezaGanado.id_padre = toro.id
                            })
                        }
                    })
                }

                if (checkedMadre) {
                    fetch(urlPropio, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(madre)
                    }).then(res => {
                        if (res.status != 201) {
                            res.text().then(msg => {
                                error.mensaje = msg
                                setError({ abierto: true, mensaje: msg, titulo: 'Error al registrar nueva madre' })
                            })
                        } else {
                            res.json().then(vaca => {
                                cabezaGanado.id_madre = vaca.id
                            })
                        }
                    })
                }
                await registrarCabeza(urlPropio)

            } else {
                registrarCabeza(urlPropio)
            }

        } else {
            var urlAjeno = "http://192.168.0.88:8080/ganado/comprado"
            var urlProcd = "http://192.168.0.88:8080/procedencia/crear"

            if (checkedProcd) {
                fetch(urlProcd, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(procedencia)
                }).then(res => {
                    if (res.status != 201) {
                        res.text().then(msg => {
                            error.mensaje = msg
                            setError({ abierto: true, mensaje: msg, titulo: 'Error al registrar nueva procedencia' })
                        })
                    } else {
                        res.json().then(p => {
                            console.log(p.id)
                            cabezaGanado.id_procedencia = p.id
                            registrarCabeza(urlAjeno)
                        })
                    }
                })
            } else {
                console.log(cabezaGanado)
                registrarCabeza(urlAjeno)
            }
        }
    }

    useEffect(() => {
        const urlRazas = "http://192.168.0.88:8080/razas"
        const urlProcd = "http://192.168.0.88:8080/procedencia"

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

        fetchRazas()
        fetchProcedencias()
    }, [])

    return (
        <div style={{ padding: '5%' }}>
            <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '5px', color: 'green' }}> Ganado </Typography>

            <Divider sx={{ marginBottom: '30px' }} />

            <Typography variant='h5' sx={{ marginBottom: '10px', color: '#242424', fontWeight: 'bold' }}> REGISTRAR NUEVA CABEZA DE GANADO 🐮 </Typography>

            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Grid container direction='column' width='50%' marginRight='10%'>
                    <Grid item style={{ marginBottom: '20px', marginTop: '20px' }}>
                        <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Nombre</Typography>
                        <TextField required label="Nombre" variant="outlined" style={{ width: '100%' }}
                            onChange={(e) => {
                                setCabezaGanado({ ...cabezaGanado, nombre: e.target.value })
                            }}
                            value={cabezaGanado.nombre}
                        />
                    </Grid>

                    <Grid item style={{ marginBottom: '20px' }}>
                        <Typography style={{ fontWeight: 'bold' }}>Sexo</Typography>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="M"
                            name="radio-buttons-group"
                            row
                            onChange={(e) => setCabezaGanado({ ...cabezaGanado, sexo: e.target.value })}
                        >
                            <FormControlLabel value="M" control={<Radio color="success" />} label="Macho" />
                            <FormControlLabel value="H" control={<Radio color="success" />} label="Hembra" />
                        </RadioGroup>
                    </Grid>

                    <Grid item style={{ marginBottom: '20px' }}>
                        <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Raza</Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={cabezaGanado.raza}
                            options={razas}
                            onChange={(e, n) => setCabezaGanado({ ...cabezaGanado, id_raza: n })}
                            renderInput={(params) => <TextField {...params} required label="Raza" />}
                        />
                    </Grid>

                    <Grid item style={{ marginBottom: '20px' }}>

                        <FormControl>
                            <FormControlLabel control={<Checkbox
                                checked={checkedComprado}
                                onChange={(e) => setCheckedComprado(e.target.checked)}
                                color="success"
                                {...label}
                            />} label="¿Es una cabeza de ganado comprada?" labelPlacement="start" />
                        </FormControl>
                    </Grid>

                    <Grid>
                        <Button style={{ background: 'green', width: '25%', marginRight: '2%' }} variant="contained" onClick={guardarFormulario} sx={1}>
                            <CheckCircle style={{ marginRight: '3%' }} />
                            Listo
                        </Button>

                        <Button style={{ background: '#ebb815', width: '25%' }} variant="contained" onClick={() => navigate('/content/ganado')} sx={1}>
                            <Cancel style={{ marginRight: '5%' }}  />
                            Cancelar
                        </Button>
                    </Grid>

                </Grid>

                {!checkedComprado && <Grid container direction='column' width='50%'>
                    <Grid item direction='row' style={{ marginBottom: '20px', marginTop: '20px' }}>
                        <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>ID padre</Typography>
                        <TextField required label="ID padre" variant="outlined" type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={checkedPadre}
                            onChange={(e) => setCabezaGanado({ ...cabezaGanado, id_padre: e.target.value })}
                        />
                        <FormControl style={{ marginLeft: '3%' }}>
                            <FormControlLabel control={<Checkbox
                                checked={checkedPadre}
                                onChange={(e) => setCheckedPadre(e.target.checked)}
                                color="success"
                                {...label}
                            />} label="Registrar nuevo padre" labelPlacement="end" />
                        </FormControl>

                        {checkedPadre && <TextField required label="Nombre del padre" variant="outlined" style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
                            onChange={(e) => setPadre({ ...padre, nombre: e.target.value })}
                        />}
                        {checkedPadre && <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={padre.id_raza}
                            options={razas}
                            onChange={(e, n) => setPadre({ ...padre, id_raza: n })}
                            renderInput={(params) => <TextField {...params} required label="Raza" />}
                            style={{ marginBottom: '10px' }}
                        />}

                    </Grid>

                    <Grid item direction='row' style={{ marginBottom: '20px' }}>
                        <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>ID madre</Typography>
                        <TextField required label="ID madre" variant="outlined" type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={checkedMadre}
                            onChange={(e) => setCabezaGanado({ ...cabezaGanado, id_madre: e.target.value })}
                        />
                        <FormControl style={{ marginLeft: '3%' }}>
                            <FormControlLabel control={<Checkbox
                                checked={checkedMadre}
                                onChange={(e) => setCheckedMadre(e.target.checked)}
                                color="success"
                                {...label}
                            />} label="Registrar nueva madre" labelPlacement="end" />
                        </FormControl>

                        {checkedMadre && <TextField required label="Nombre de la madre" variant="outlined" style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
                            onChange={(e) => setMadre({ ...madre, nombre: e.target.value })}
                        />}
                        {checkedMadre && <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={madre.id_raza}
                            options={razas}
                            onChange={(e, n) => setMadre({ ...madre, id_raza: n })}
                            renderInput={(params) => <TextField {...params} required label="Raza" />}
                            style={{ marginBottom: '10px' }}
                        />}
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
                                    setCabezaGanado({ ...cabezaGanado, fecha_nacimiento: newValue.format('YYYY-MM-DD') })
                                }}
                                renderInput={(params) => <TextField {...params} required style={{ width: '100%' }} />}
                                maxDate={dayjs()}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>}

                {checkedComprado && <Grid container direction='column' width='50%'>
                    <Grid item style={{ marginBottom: '20px', marginTop: '20px' }}>
                        <Typography style={{ marginBottom: '10px', fontWeight: 'bold' }}>Edad (en años)</Typography>
                        <TextField required label="Edad" variant="outlined" style={{ width: '100%' }} type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => setCabezaGanado({ ...cabezaGanado, edad: e.target.value })}
                        />
                    </Grid>

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
                            disabled={checkedProcd}
                        />
                        <FormControl style={{ marginLeft: '3%' }}>
                            <FormControlLabel control={<Checkbox
                                checked={checkedProcd}
                                onChange={(e) => setCheckedProcd(e.target.checked)}
                                color="success"
                                {...label}
                            />} label="Registrar nueva procedencia" labelPlacement="end" />
                        </FormControl>

                        {checkedProcd && <TextField required label="Lugar de procedencia" variant="outlined" style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
                            onChange={(e) => setProcedencia({ ...procedencia, procedencia: e.target.value })}
                        />}

                    </Grid>

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
                        />
                    </Grid>
                </Grid>}

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
                        <ErrorIcon fontSize="large" sx={{ color: 'red' }} />
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
                        <CheckCircleIcon fontSize="large" color="success" />
                        <DialogContentText id="alert-dialog-description">
                            Se ha registrado la nueva cabeza de ganado correctamente
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setExito(false)
                            navigate('/content/ganado')
                        }} autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        </div>
    )
}
