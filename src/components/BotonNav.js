import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import { useNavigate } from 'react-router-dom';

export default function BotonNav() {
  const [value, setValue] = React.useState(0);
  const navigate=useNavigate();

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="INICIO" icon={<HomeRoundedIcon/>} onClick={()=>navigate('/')}/>
        <BottomNavigationAction label="REGISTRO DE LECHE" icon={<EventNoteRoundedIcon />} onClick={()=>navigate('/leche')}/>
        <BottomNavigationAction label="GANADO" icon={<GrassRoundedIcon />} onClick={()=>navigate('/ganado')}/>
      </BottomNavigation>
    </Box>
  );
}