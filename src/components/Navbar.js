import React, { useState } from 'react'
import { AppBar, Grid, Tabs, Toolbar, Typography, Tab, Button } from '@mui/material'
import Logo from '../assets/img/vaca.png'
import { Box } from '@mui/system';
import BotonUsuario from './BotonUsuario';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TablaLeche from './TablaLeche';
import Usuarios from './Usuarios';
import BotonNav from './BotonNav';

export const Navbar = () => {
    const [value, setValue]=useState(); 
  return (<>
    <AppBar position="sticky" sx={{backgroundColor:'#ffffff'}}>
            <Toolbar> 
                <Grid sx={{placeItems:'center'}} container>
                    <Grid items xs={2}>
                        <Typography>
                        <img src={Logo} width="25%"/>
                        </Typography>
                    </Grid>
                    <Grid item xs={2}/>
                    <Grid item xs={6}>
                        <BotonNav/>
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={1}>
                        <Box display="flex"> 
                            <BotonUsuario/>  
                        </Box>
                    </Grid>   
                </Grid>
            </Toolbar>
        </AppBar>   
    </>
  )
}
