import React from 'react';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Contenido from './components/Contenido';
import TablaLeche from './components/TablaLeche';
import Ganado from './components/Ganado';
import Home from './components/Home';
import VerCabezaGanado from './components/VerCabezaGanado';
import VerLeche from './components/VerLeche';
import EditRegistroXVaca from './components/EditRegistroXVaca';
import FinPrenez from './components/FinPrenez';
import CrearUsuarios from './components/CrearUsuarios';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />

        <Route path='/content' element={<Contenido />}>
          <Route path='home' element={<Home />} />
          <Route path='leche' element={<TablaLeche />} />
          <Route path='usuarios' element={<CrearUsuarios />} />
          <Route path='leche/ver/:id' element={<VerCabezaGanado />} />
          <Route path='leche/editar/:id' element={<EditRegistroXVaca />} />
          <Route path='ganado' element={<Ganado />} />
          <Route path='ganado/prenez/:id' element={<FinPrenez />} />
          <Route path='nuevo' element={<Ganado />} />
          <Route path='ganado/ver/:id' element={<VerLeche />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;