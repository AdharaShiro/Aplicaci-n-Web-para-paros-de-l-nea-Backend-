import React, { useState, useEffect } from 'react';
import { Table, Form, Card, Button, Modal, Pagination } from 'react-bootstrap';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import axios from 'axios';
import Navegador from './NavBar';

function TableModelos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedModelo, setSelectedModelo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de elementos por página
  const csrftoken = localStorage.getItem('csrftoken');

  const fetchModelos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/modelos/');
      setModelos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Hubo un error al obtener los datos!', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelos();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página al buscar
  };

  const filteredModelos = modelos.filter(modelo =>
    modelo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowUpdateModal = (modelo) => {
    setSelectedModelo(modelo);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowDeleteModal = (modelo) => {
    setSelectedModelo(modelo);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const ModeloStore = (props) => {
    const [idModelo, setIdModelo] = useState('');
    const [nombre, setNombre] = useState('');

    const store = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post(
          'http://localhost:8000/api/modelos/create/',
          { idModelo, nombre },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.data.message) {
          alert("Modelo agregado");
          fetchModelos(); // Recargar la lista de modelos
          setIdModelo('');
          setNombre('');
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
            Agregar Modelo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={store} style={{ textAlign: 'center', fontSize: '1.2em' }}>
            <Form.Group className="mb-3" controlId="formIdModelo">
              <Form.Label style={{ fontSize: '1.2em' }}>ID Modelo:</Form.Label>
              <Form.Control
                name="idModelo"
                value={idModelo}
                onChange={(e) => setIdModelo(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label style={{ fontSize: '1.2em' }}>Nombre:</Form.Label>
              <Form.Control
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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

  const ModeloUpdate = (props) => {
    const { modelo, onHide } = props;
    const [current_idModelo, setCurrent_idModelo] = useState('');
    const [idModelo, setIdModelo] = useState('');
    const [nombre, setNombre] = useState('');

    useEffect(() => {
      if (modelo) {
        setCurrent_idModelo(modelo.idModelo);
        setIdModelo(modelo.idModelo);
        setNombre(modelo.nombre);
      }
    }, [modelo]);

    const updateModelo = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      try {
        const response = await axios.put(
          `http://localhost:8000/api/modelos/update/`,
          { current_idModelo: current_idModelo, idModelo: idModelo, nombre: nombre },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.data.message) {
          alert(`Modelo "${nombre}" actualizado correctamente.`);
          fetchModelos(); // Refrescar la lista de Modelos después de actualizar uno
          onHide();
        } else {
          console.error("Error: No se obtuvo data en la respuesta");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al actualizar modelo");
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
            Actualizar Modelo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateModelo} style={{ textAlign: 'center', fontSize: '1.2em' }}>
            <Form.Group className="mb-3" controlId="formIdModelo">
              <Form.Label style={{ fontSize: '1.2em' }}>ID Modelo:</Form.Label>
              <Form.Control
                name="idModelo"
                value={idModelo}
                onChange={(e) => setIdModelo(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label style={{ fontSize: '1.2em' }}>Nombre:</Form.Label>
              <Form.Control
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group>
              <Button type='submit' style={{ backgroundColor: '#0097B2', borderColor: '#0097B2', fontSize: '1.2em' }}>Actualizar</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide} style={{ backgroundColor: 'red', borderColor: 'red', fontSize: '1.2em' }}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const ModeloDestroy = (props) => {
    const { modelo, onHide } = props;

    const deleteModelo = async () => {
      const token = localStorage.getItem('token');
      const csrftoken = localStorage.getItem('csrftoken');

      try {
        const response = await axios.delete(
          `http://localhost:8000/api/modelos/delete/${modelo.idModelo}/`,
          {
            headers: {
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.status === 200) {
          alert("Modelo eliminado");
          setModelos((prevModelos) =>
            prevModelos.filter((mod) => mod.idModelo !== modelo.idModelo)
          );
          onHide();
        } else {
          console.error("Error: No se obtuvo data en la respuesta");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al eliminar modelo");
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
            Eliminar Modelo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar el modelo {modelo.nombre}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteModelo}>Eliminar</Button>
          <Button onClick={onHide}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Variables y lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredModelos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredModelos.length / itemsPerPage);

  const handleClick = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => handleClick(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return paginationItems;
  };

  return (
    <div>
      <Navegador />
      <div className="main-content">
        <div className="background-image"></div>
        <Card className="user-table-card" style={{ width: '95%', borderRadius: '20px', margin: 'auto', marginTop: '50px' }}>
          <Card.Header className="header-gradient text-center" style={{ borderRadius: '20px 20px 0 0' }}>
            <h2>Lista de Modelos</h2>
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
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center">Cargando...</td>
                  </tr>
                ) : (
                  currentItems.map((modelo) => (
                    <tr key={modelo.idModelo}>
                      <td>{modelo.idModelo}</td>
                      <td>{modelo.nombre}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleShowUpdateModal(modelo)}
                          style={{ marginRight: '10px' }}
                        >
                          <BrushOutlinedIcon className="mr-2" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleShowDeleteModal(modelo)}
                        >
                          <DeleteOutlineOutlinedIcon className="mr-2" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <Pagination className="justify-content-center mt-4">{renderPagination()}</Pagination>
          </Card.Body>
        </Card>
      </div>
      <ModeloStore show={showAddModal} onHide={handleCloseAddModal} />
      <ModeloUpdate
        show={showUpdateModal}
        onHide={handleCloseUpdateModal}
        modelo={selectedModelo || {}}
      />
      <ModeloDestroy
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        modelo={selectedModelo || {}}
      />
    </div>
  );
}

export default TableModelos;
