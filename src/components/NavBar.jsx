import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../styles/NavBar.css';

function NavBar() {
  const handleLogout = () => {
    // Lógica para cerrar sesión, como eliminar tokens de autenticación, etc.
    localStorage.removeItem('token'); // Ejemplo de eliminación de token
    window.location.href = '/'; // Redirigir a la página de inicio de sesión
  };

  const downloadReport = (type, format) => {
    const baseURL = 'http://127.0.0.1:8000';
    const url = `${baseURL}/reporte/${format}/${type}/`;
    window.location.href = url; // Descarga el archivo
  };

  return (
    <>
      <Navbar className="custom-navbar" expand="lg">
        <Container>
          <Navbar.Brand href="#">
            <div className="d-flex align-items-center">
              <img
                src="https://i.imgur.com/CUnu64x.png"
                height="50"
                className="d-inline-block align-top"
                alt="Logo"
              />
              <span className="ms-2">Administrador</span>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title="Base de datos" id="basic-nav-dropdown-db" className="nav-dropdown">
                <NavDropdown.Item as={Link} to="/Users">Usuarios</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/Modelos">Modelos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/Lineas">Líneas</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/Descripciones">Descripciones</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/Departamentos">Departamentos</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Reportes" id="basic-nav-dropdown-reports" className="nav-dropdown">
                <NavDropdown.Item onClick={() => downloadReport('Dia', 'pdf')}>Día (PDF)</NavDropdown.Item>
                <NavDropdown.Item onClick={() => downloadReport('Semana', 'pdf')}>Semana (PDF)</NavDropdown.Item>
                <NavDropdown.Item onClick={() => downloadReport('Mes', 'pdf')}>Mes (PDF)</NavDropdown.Item>
                <NavDropdown.Item onClick={() => downloadReport('Dia', 'excel')}>Día (Excel)</NavDropdown.Item>
                <NavDropdown.Item onClick={() => downloadReport('Semana', 'excel')}>Semana (Excel)</NavDropdown.Item>
                <NavDropdown.Item onClick={() => downloadReport('Mes', 'excel')}>Mes (Excel)</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Bitacora" id="basic-nav-dropdown-logs" className="nav-dropdown">
                <NavDropdown.Item as={Link} to="/Produccion">Produccion Blanks</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/BitacoraSlitter">Producción Slitter</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/BitacoraOsiladora">Producción Osiladora</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={handleLogout} className="nav-link">
                Cerrar sesión
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
    </>
  );
}

export default NavBar;
