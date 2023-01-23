import React from 'react';
import Login from './components/login';
import fondo from '../src/assets/img/fondo.jpg'
import { Navbar } from './components/Navbar';
import TablaLeche from './components/TablaLeche';
import Ganado from './components/Ganado';
import {BrowserRouter,Routes,Route} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<TablaLeche/>}/>
        <Route path='/ganado' element={<Ganado/>}/>
        <Route path='/leche' element={<TablaLeche/>}/>
      </Routes>
    </BrowserRouter> 
  );
}

export default App;