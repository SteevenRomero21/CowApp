import React from "react";
import {Avatar, Button, Grid, Paper, TextField} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Logo from '../assets/img/vaca.png'

const Login=()=>{
    const paperStyle={padding :20, height:'93vh', width:250, margin:"0px auto", display: "flex", justifyContent:'center', flexDirection:"column"}
    const avatarStyle={backgroundColor: 'green'}
    const btnstyle={margin:'8px 0', backgroundColor: 'green'}
    
    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                <img src={Logo} width="40%"/>
                <h1>Iniciar Sesión</h1>
                <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                </Grid> 
                <TextField  id="standard-basic"  label='Usuario' placeholder="Ingrese el usuario" fullWidth required variant="standard"/>
                <TextField  id="standard-basic" label='Contraseña' placeholder="Ingrese la contraseña" type='password' fullWidth required variant="standard"/> 
                <h1>
                    
                </h1>
                <Button variant="contained" type='submit' color='primary' style={btnstyle} fullWidth>Iniciar Sesión</Button>
            </Paper>
        </Grid>
    )
}
export default Login;
