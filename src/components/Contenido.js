import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TablaLeche from './TablaLeche'
import Ganado from './Ganado'
import { Navbar } from './Navbar'
import Home from './Home'
import RegistroCabeza from './RegistroCabeza'
import VerCabezaGanado from './VerCabezaGanado'
import VerLeche from './VerLeche'
import EditRegistroXVaca from './EditRegistroXVaca'
import FinPrenez from './FinPrenez'
import CrearUsuarios from './CrearUsuarios'

export default function Contenido() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='home' element={<Home />} />
        <Route path='leche' element={<TablaLeche />} />
        <Route path='ganado' element={<Ganado />} />
        <Route path='usuarios' element={<CrearUsuarios />} />
        <Route path='ganado/prenez/:id' element={<FinPrenez />} />
        <Route path='nuevo' element={<RegistroCabeza />} />
        <Route path='ganado/ver/:id' element={<VerCabezaGanado />} />
        <Route path='leche/ver/:id' element={<VerLeche />} />
        <Route path='leche/editar/:id' element={<EditRegistroXVaca />} >
        </Route>
      </Routes>
    </div>
  )
}
