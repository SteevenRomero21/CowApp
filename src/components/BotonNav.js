import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
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
        sx={{
          "& .Mui-selected * ": {
            color: "#008000"
          },
          "& .MuiBottomNavigationAction-root, svg": {
            color: "#242424"
          },
       }}
      >
        <BottomNavigationAction label="Inicio" icon={<HomeRoundedIcon />} onClick={()=>navigate('home')}/>
        <BottomNavigationAction label="Leche" icon={<EventNoteRoundedIcon />} onClick={()=>navigate('leche')}/>
        <BottomNavigationAction label="Ganado" icon={<GrassRoundedIcon />} onClick={()=>navigate('ganado')}/>
      </BottomNavigation>
    </Box>
  );
}