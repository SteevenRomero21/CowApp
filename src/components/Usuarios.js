import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Avatar, Grid} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';

export default function Usuarios() {
  const avatarStyle={backgroundColor: '#242424'}
  return (
   <div style={{display:'flex',justifyContent: 'center',alignItems: 'center', height: '80vh'}}>
    <Grid align='center' width='350px'>
      <h2 style={{justifyContent: 'center', textAlign:'center'}}>Mis Datos</h2>
      <Avatar sx={{ width: 56, height: 56 }} style={avatarStyle}><AccountCircleIcon/></Avatar>
      <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <h3>Nombre:</h3>
      <TextField id="standard-basic" label="" variant="standard" />
      <h3>Nombre de Usuario:</h3>
      <TextField id="standard-basic" label="" variant="standard" />
      <h3>Ciudad de Procedencia:</h3>
      <TextField id="standard-basic" label="" variant="standard" />
    </Box>
    <Button variant="contained">Nuevo</Button>
    <Button variant="contained">Cambiar Contraseña</Button>
    </Grid>
   </div>
  );
}