import React, { useState, useEffect } from 'react';
import { Table, Form, Card, Button, Modal, Pagination } from 'react-bootstrap';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import axios from 'axios';
import Navegador from './NavBar';
import '../styles/Usuarios.css';
import '../App.css';

function TableDepartamentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Cambia el número de elementos por página según sea necesario
  const csrftoken = localStorage.getItem('csrftoken');

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/list_departamentos/');
      setDepartamentos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Hubo un error al obtener los datos!', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página cuando se realiza una búsqueda
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowUpdateModal = (departamento) => {
    setSelectedDepartamento(departamento);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowDeleteModal = (departamento) => {
    setSelectedDepartamento(departamento);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const DepartamentoStore = (props) => {
    const [idDepartamento, setIdDepartamento] = useState('');
    const [departamento, setDepartamento] = useState('');

    const store = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post(
          'http://localhost:8000/api/departamento/create/',
          { idDepartamento, departamento },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.data.message) {
          alert("Departamento agregado");
          fetchDepartamentos(); // Recargar la lista de departamentos
          setIdDepartamento('');
          setDepartamento('');
          handleCloseAddModal();
        } else {
          console.error("Error: No se obtuvo data en la respuesta");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: '#0097B2', color: 'white' }}>
          <Modal.Title id="contained-modal-title-vcenter">
            Agregar Departamento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={store} style={{ textAlign: 'center', fontSize: '1.2em' }}>
            <Form.Group className="mb-3" controlId="formIdDepartamento">
              <Form.Label style={{ fontSize: '1.2em' }}>ID Departamento:</Form.Label>
              <Form.Control
                name="idDepartamento"
                value={idDepartamento}
                onChange={(e) => setIdDepartamento(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDepartamento">
              <Form.Label style={{ fontSize: '1.2em' }}>Departamento:</Form.Label>
              <Form.Control
                name="departamento"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group>
              <Button type='submit' style={{ backgroundColor: '#0097B2', borderColor: '#0097B2', fontSize: '1.2em' }}>Guardar</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide} style={{ backgroundColor: 'red', borderColor: 'red', fontSize: '1.2em' }}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const DepartamentoUpdate = (props) => {
    const { departamento, onHide } = props;
    const [idDepartamento, setIdDepartamento] = useState('');
    const [newDepartamento, setNewDepartamento] = useState('');

    useEffect(() => {
      if (departamento) {
        setIdDepartamento(departamento.idDepartamento);
        setNewDepartamento(departamento.departamento);
      }
    }, [departamento]);

    const update = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      try {
        const response = await axios.put(
          'http://localhost:8000/api/departamento/update/',
          { idDepartamento, departamento: newDepartamento },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.data.message) {
          alert("Departamento actualizado");
          fetchDepartamentos(); // Recargar la lista de departamentos
          onHide();
        } else {
          console.error("Error: No se obtuvo data en la respuesta");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al actualizar departamento");
      }
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: '#0097B2', color: 'white' }}>
          <Modal.Title id="contained-modal-title-vcenter">
            Actualizar Departamento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={update} style={{ textAlign: 'center', fontSize: '1.2em' }}>
            <Form.Group className="mb-3" controlId="formIdDepartamento">
              <Form.Label style={{ fontSize: '1.2em' }}>ID Departamento:</Form.Label>
              <Form.Control
                name="idDepartamento"
                value={idDepartamento}
                onChange={(e) => setIdDepartamento(e.target.value)}
                required
                disabled
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDepartamento">
              <Form.Label style={{ fontSize: '1.2em' }}>Departamento:</Form.Label>
              <Form.Control
                name="departamento"
                value={newDepartamento}
                onChange={(e) => setNewDepartamento(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Button type="submit" style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}>Actualizar</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide} style={{ backgroundColor: 'red', borderColor: 'red', fontSize: '1.2em' }}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const DepartamentoDestroy = (props) => {
    const { departamento, onHide } = props;

    const deleteDepartamento = async () => {
      const token = localStorage.getItem('token');
      const csrftoken = localStorage.getItem('csrftoken');

      try {
        const response = await axios.delete(
          `http://localhost:8000/api/departamento/delete/${departamento.idDepartamento}/`,
          {
            headers: {
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.status === 200) {
          alert("Departamento eliminado");
          fetchDepartamentos(); // Recargar la lista de departamentos
          onHide();
        } else {
          console.error("Error: No se obtuvo data en la respuesta");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al eliminar departamento");
      }
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Eliminar Departamento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar el departamento {departamento.departamento}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteDepartamento}>Eliminar</Button>
          <Button onClick={onHide}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departamentos.filter(departamento =>
    departamento.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(departamentos.filter(departamento =>
    departamento.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  ).length / itemsPerPage);

  const handleClick = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handleClick(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination>{items}</Pagination>
    );
  };

  return (
    <div>
      <Navegador />
      <div className="main-content">
        <div className="background-image"></div>
        <Card className="user-table-card" style={{ width: '95%', borderRadius: '20px', margin: 'auto', marginTop: '50px' }}>
          <Card.Header className="header-gradient text-center" style={{ borderRadius: '20px 20px 0 0' }}>
            <h2>Lista de Departamentos</h2>
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Form.Control
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-50"
                style={{ borderRadius: '50px', fontSize: '1.2em' }}
              />
              <Button
                onClick={handleShowAddModal}
                style={{ backgroundColor: 'transparent', borderColor: 'green', fontSize: '1.2em', color: 'green' }}
                className="btn btn-outline-success"
              >
                <GroupAddOutlinedIcon className="mr-2" />
              </Button>
            </div>
            <Table striped bordered hover responsive className="table-transparent">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Departamento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center">Cargando...</td>
                  </tr>
                ) : (
                  currentItems.map((departamento) => (
                    <tr key={departamento.idDepartamento}>
                      <td>{departamento.idDepartamento}</td>
                      <td>{departamento.departamento}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleShowUpdateModal(departamento)}
                          style={{ marginRight: '10px' }}
                        >
                          <BrushOutlinedIcon className="mr-2" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleShowDeleteModal(departamento)}
                        >
                          <DeleteOutlineOutlinedIcon className="mr-2" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            {renderPagination()}
          </Card.Body>
        </Card>
      </div>
      <DepartamentoStore show={showAddModal} onHide={handleCloseAddModal} fetchDepartamentos={fetchDepartamentos} />
      <DepartamentoUpdate
        show={showUpdateModal}
        onHide={handleCloseUpdateModal}
        departamento={selectedDepartamento || {}}
        fetchDepartamentos={fetchDepartamentos}
      />
      <DepartamentoDestroy
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        departamento={selectedDepartamento || {}}
        fetchDepartamentos={fetchDepartamentos}
      />
    </div>
  );
}

export default TableDepartamentos;
