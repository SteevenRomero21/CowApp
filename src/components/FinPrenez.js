import { CheckCircle, Error } from '@mui/icons-material';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export default function FinPrenez() {

    const navigate = useNavigate();
    const params = useParams()

    const [estado, setEstado] = useState('PRODUCCION')
    const [checkedCrear, setCheckedCrear] = useState(true)

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const [prenezReq, setPrenez] = useState({
        id: params.id,
        idCabezaGanado: '',
        estado: 'PRENADA',
        fechaInseminacion: '',
        fechaParto: dayjs().format('YYYY-MM-DD'),
    })

    const [error, setError] = useState({
        abierto: false,
        mensaje: '',
        titulo: ''
    });

    const guardarNuevoEstado = () => {
        var url = ''
        if (estado == 'ABORTO')
            url = 'http://192.168.0.88:8080/prenez/actualizar/aborto'
        else
            url = 'http://192.168.0.88:8080/prenez/actualizar/produccion'

        fetch(url, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prenezReq)
        }).then(res => {
            if (res.status != 201) {
                res.text().then(msg => {
                    error.mensaje = msg
                    setError({ abierto: true, mensaje: msg, titulo: 'Error al guardar' })
                })
            } else {
                if (checkedCrear && estado != 'ABORTO')
                    navigate('/content/nuevo')
                else
                    navigate('/content/ganado')
            }
        })
    }

    return (
        <div style={{ padding: '5%' }}>

            <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: '5px', color: 'green' }}> Preñez </Typography>

            <Divider sx={{ marginBottom: '30px' }} />

            <Grid container direction='column'>
                <Grid item style={{ marginBottom: '20px' }}>
                    <Typography style={{ fontWeight: 'bold' }}>¿Cómo terminó el proceso de preñez?</Typography>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="PRODUCCION"
                        name="radio-buttons-group"
                        row
                        onChange={(e) => setEstado(e.target.value)}
                        value={estado}
                    >
                        <FormControlLabel value="PRODUCCION" control={<Radio color="success" />} label="Parto normal" />
                        <FormControlLabel value="ABORTO" control={<Radio color="success" />} label="Aborto espontáneo" />
                    </RadioGroup>
                </Grid>

                {estado == 'PRODUCCION' &&
                    <Grid item style={{ marginBottom: '20px' }}>
                        <FormControl style={{ marginLeft: '3%' }}>
                            <FormControlLabel control={<Checkbox
                                checked={checkedCrear}
                                onChange={(e) => setCheckedCrear(e.target.checked)}
                                color="success"
                                {...label}
                            />} label="Registrar ternero ahora" labelPlacement="end" />
                        </FormControl>
                    </Grid>}

                <Grid item style={{ marginBottom: '20px' }}>
                    <Button style={{ background: 'green', width: '25%', marginRight: '2%' }} variant="contained" onClick={() => guardarNuevoEstado()} sx={1}>
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

        </div>
    )
}
