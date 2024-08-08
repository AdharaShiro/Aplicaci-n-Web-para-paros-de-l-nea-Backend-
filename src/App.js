
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavBar from './components/NavBar';
import LoginForm from './components/Login';
import Usuarios from './components/Usuarios';
import Modelos from './components/Modelos';
import Lineas from './components/Lineas';
import Descripciones from './components/Descripciones';
import Departamentos from './components/Departamentos';
import FormularioProduccion from './components/FormularioProduccion';
import FormularioSlitter from './components/FormularioSlitter';
import FormularioOsiladora from './components/FomularioOsiladora';

export default function App() {
  return (

    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/ASC" element={<NavBar />} />
          <Route path="/Produccion" element={<FormularioProduccion />} />
          <Route path="/BitacoraSlitter" element={<FormularioSlitter />} />
          <Route path="/BitacoraOsiladora" element={<FormularioOsiladora />} />
          <Route path="/Users" element={<Usuarios />} />
          <Route path="/Modelos" element={<Modelos />} />
          <Route path="/Lineas" element={<Lineas />} />
          <Route path="/Descripciones" element={<Descripciones />} />
          <Route path="/Departamentos" element={<Departamentos />} /> 
        </Routes>
        
      </BrowserRouter>
    </div>
  );
}
