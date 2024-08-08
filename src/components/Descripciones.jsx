import React, { useState, useEffect } from 'react';
import { Table, Form, Card, Button, Modal, Pagination } from 'react-bootstrap';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import axios from 'axios';
import Navegador from './NavBar';
import '../styles/Usuarios.css';
import '../App.css';

function TableDescripciones() {
  const [searchTerm, setSearchTerm] = useState('');
  const [descripciones, setDescripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDescripcion, setSelectedDescripcion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Cambia el número de elementos por página según sea necesario
  const csrftoken = localStorage.getItem('csrftoken');

  const fetchDescripciones = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/list_descripciones/');
      setDescripciones(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Hubo un error al obtener los datos!', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDescripciones();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página cuando se realiza una búsqueda
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowUpdateModal = (descripcion) => {
    setSelectedDescripcion(descripcion);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowDeleteModal = (descripcion) => {
    setSelectedDescripcion(descripcion);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const DescripcionStore = (props) => {
    const [idDescripcion, setIdDescripcion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const { fetchDescripciones, onHide } = props;

    const store = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post(
          'http://localhost:8000/api/descripcion/create/',
          { idDescripcion, Descripcion: descripcion },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.data.message) {
          alert("Descripción agregada");
          fetchDescripciones(); // Recargar la lista de descripciones
          setIdDescripcion('');
          setDescripcion('');
          onHide();
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
            Agregar Descripción
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={store} style={{ textAlign: 'center', fontSize: '1.2em' }}>
            <Form.Group className="mb-3" controlId="formIdDescripcion">
              <Form.Label style={{ fontSize: '1.2em' }}>ID Descripción:</Form.Label>
              <Form.Control
                name="idDescripcion"
                value={idDescripcion}
                onChange={(e) => setIdDescripcion(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label style={{ fontSize: '1.2em' }}>Descripción:</Form.Label>
              <Form.Control
                name="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
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

  const DescripcionUpdate = (props) => {
    const { descripcion, onHide, fetchDescripciones } = props;
    const [current_idDescripcion, setCurrent_idDescripcion] = useState('');
    const [new_idDescripcion, setNew_idDescripcion] = useState('');
    const [newDescripcion, setNewDescripcion] = useState('');

    useEffect(() => {
      if (descripcion) {
        setCurrent_idDescripcion(descripcion.idDescripcion);
        setNew_idDescripcion(descripcion.idDescripcion);
        setNewDescripcion(descripcion.Descripcion);
      }
    }, [descripcion]);

    const update = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      try {
        const response = await axios.put(
          'http://localhost:8000/api/descripcion/update/',
          { idDescripcion: current_idDescripcion,
            Descripcion: newDescripcion },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.data.message) {
          alert("Descripción actualizada");
          fetchDescripciones(); // Recargar la lista de descripciones
          onHide();
        } else {
          console.error("Error: No se obtuvo data en la respuesta");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al actualizar descripción");
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
            Actualizar Descripción
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={update} style={{ textAlign: 'center', fontSize: '1.2em' }}>
            <Form.Group className="mb-3" controlId="formIdDescripcion">
              <Form.Label style={{ fontSize: '1.2em' }}>ID Descripción:</Form.Label>
              <Form.Control
                name="idDescripcion"
                value={new_idDescripcion}
                onChange={(e) => setNew_idDescripcion(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label style={{ fontSize: '1.2em' }}>Descripción:</Form.Label>
              <Form.Control
                name="descripcion"
                value={newDescripcion}
                onChange={(e) => setNewDescripcion(e.target.value)}
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

  const DescripcionDestroy = (props) => {
    const { descripcion, onHide, fetchDescripciones } = props;

    const deleteDescripcion = async () => {
      const token = localStorage.getItem('token');
      const csrftoken = localStorage.getItem('csrftoken');

      try {
        const response = await axios.delete(
          `http://localhost:8000/api/descripcion/delete/${descripcion.idDescripcion}/`,
          {
            headers: {
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.data.message) {
          alert("Descripción eliminada");
          fetchDescripciones(); // Recargar la lista de descripciones
          onHide();
        } else {
          console.error("Error: No se obtuvo data en la respuesta");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al eliminar descripción");
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
            Eliminar Descripción
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar la descripción {descripcion.Descripcion}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteDescripcion}>Eliminar</Button>
          <Button onClick={onHide}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = descripciones.filter(descripcion =>
    descripcion.Descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(descripciones.filter(descripcion =>
    descripcion.Descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h2>Lista de Descripciones</h2>
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
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center">Cargando...</td>
                  </tr>
                ) : (
                  currentItems.map((descripcion) => (
                    <tr key={descripcion.idDescripcion}>
                      <td>{descripcion.idDescripcion}</td>
                      <td>{descripcion.Descripcion}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleShowUpdateModal(descripcion)}
                          style={{ marginRight: '10px' }}
                        >
                          <BrushOutlinedIcon className="mr-2" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleShowDeleteModal(descripcion)}
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
      <DescripcionStore show={showAddModal} onHide={handleCloseAddModal} fetchDescripciones={fetchDescripciones} />
      <DescripcionUpdate
        show={showUpdateModal}
        onHide={handleCloseUpdateModal}
        descripcion={selectedDescripcion || {}}
        fetchDescripciones={fetchDescripciones}
      />
      <DescripcionDestroy
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        descripcion={selectedDescripcion || {}}
        fetchDescripciones={fetchDescripciones}
      />
    </div>
  );
}

export default TableDescripciones;
