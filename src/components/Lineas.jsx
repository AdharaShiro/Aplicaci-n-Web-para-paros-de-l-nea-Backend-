import React, { useState, useEffect } from 'react';
import { Table, Form, Card, Button, Modal, Pagination } from 'react-bootstrap';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import axios from 'axios';
import Navegador from './NavBar';
import '../styles/Usuarios.css';
import '../App.css';

function TableLineas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLinea, setSelectedLinea] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de elementos por página
  const csrftoken = localStorage.getItem('csrftoken');

  const fetchLineas = async () => {
    try {
        // Realiza una solicitud GET a la API para obtener la lista de líneas.
        const response = await axios.get('http://localhost:8000/api/lineas/');
        
        // Almacena las líneas obtenidas en el estado y detiene la carga.
        setLineas(response.data);
        setLoading(false);
    } catch (error) {
        console.error('Hubo un error al obtener los datos!', error);
        
        // Detiene la carga incluso si ocurre un error.
        setLoading(false);
    }
};

// useEffect para cargar las líneas cuando el componente se monta.
useEffect(() => {
    fetchLineas();
}, []); // La dependencia vacía [] indica que este efecto solo se ejecuta una vez al montar el componente.

// Función para manejar la búsqueda de líneas.
const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda en el estado.
    setCurrentPage(1); // Reinicia a la primera página al realizar una búsqueda.
};

// Filtra las líneas en función del término de búsqueda.
const filteredLineas = lineas.filter(linea =>
    linea.linea.toLowerCase().includes(searchTerm.toLowerCase())
);

// Funciones para manejar la visualización y ocultamiento de los modales de agregar, actualizar y eliminar.
const handleShowAddModal = () => setShowAddModal(true);
const handleCloseAddModal = () => setShowAddModal(false);
const handleShowUpdateModal = (linea) => {
    setSelectedLinea(linea); // Almacena la línea seleccionada en el estado.
    setShowUpdateModal(true);
};
const handleCloseUpdateModal = () => setShowUpdateModal(false);
const handleShowDeleteModal = (linea) => {
    setSelectedLinea(linea); // Almacena la línea seleccionada en el estado.
    setShowDeleteModal(true);
};
const handleCloseDeleteModal = () => setShowDeleteModal(false);

// Componente LineaStore para agregar una nueva línea.
const LineaStore = (props) => {
    const [idLinea, setIdLinea] = useState(''); // Estado para almacenar el ID de la línea.
    const [linea, setLinea] = useState(''); // Estado para almacenar el nombre de la línea.

    // Función para enviar los datos de la nueva línea a la API.
    const store = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario.
        const token = localStorage.getItem('token'); // Obtiene el token de autenticación.

        try {
            const response = await axios.post(
                'http://localhost:8000/api/lineas/create/',
                { idLinea, linea }, // Datos que se envían a la API.
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token, // Autenticación con el token.
                        'X-CSRFTOKEN': csrftoken // CSRF token para la seguridad.
                    }
                }
            );

            if (response.data.message) {
                alert("Linea agregada");
                fetchLineas(); // Recarga la lista de líneas.
                setIdLinea(''); // Limpia el estado del ID de la línea.
                setLinea(''); // Limpia el estado del nombre de la línea.
                handleCloseAddModal(); // Cierra el modal de agregar línea.
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
                    Agregar Linea
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={store} style={{ textAlign: 'center', fontSize: '1.2em' }}>
                    <Form.Group className="mb-3" controlId="formIdLinea">
                        <Form.Label style={{ fontSize: '1.2em' }}>ID Linea:</Form.Label>
                        <Form.Control
                            name="idLinea"
                            value={idLinea}
                            onChange={(e) => setIdLinea(e.target.value)}
                            required
                            style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formLinea">
                        <Form.Label style={{ fontSize: '1.2em' }}>Linea:</Form.Label>
                        <Form.Control
                            name="linea"
                            value={linea}
                            onChange={(e) => setLinea(e.target.value)}
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

// Componente LineaUpdate para actualizar una línea existente.
const LineaUpdate = (props) => {
    const { linea, onHide } = props;
    const [idLinea, setIdLinea] = useState(linea.idLinea); // Estado para almacenar el ID de la línea.
    const [lineaNombre, setLineaNombre] = useState(linea.linea); // Estado para almacenar el nombre de la línea.

    useEffect(() => {
        setIdLinea(linea.idLinea);
        setLineaNombre(linea.linea);
    }, [linea]); // Actualiza los estados cuando la línea cambia.

    // Función para enviar los datos actualizados a la API.
    const update = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario.
        const token = localStorage.getItem('token'); // Obtiene el token de autenticación.

        try {
            const response = await axios.put(
                'http://localhost:8000/api/lineas/update/',
                {
                    idLinea: idLinea,
                    linea: lineaNombre
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token, // Autenticación con el token.
                        'X-CSRFTOKEN': csrftoken // CSRF token para la seguridad.
                    }
                }
            );

            if (response.data.message) {
                alert("Linea actualizada");
                fetchLineas(); // Recarga la lista de líneas.
                onHide(); // Cierra el modal de actualización.
            } else {
                console.error("Error: No se obtuvo data en la respuesta");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al actualizar linea");
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
                    Actualizar Linea
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={update} style={{ textAlign: 'center', fontSize: '1.2em' }}>
                    <Form.Group className="mb-3" controlId="formIdLinea">
                        <Form.Label style={{ fontSize: '1.2em' }}>ID Linea:</Form.Label>
                        <Form.Control
                            name="idLinea"
                            value={idLinea}
                            onChange={(e) => setIdLinea(e.target.value)}
                            required
                            style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formLinea">
                        <Form.Label style={{ fontSize: '1.2em' }}>Linea:</Form.Label>
                        <Form.Control
                            name="linea"
                            value={lineaNombre}
                            onChange={(e) => setLineaNombre(e.target.value)}
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

// Componente LineaDestroy para eliminar una línea.
const LineaDestroy = (props) => {
    const { linea, onHide } = props;

    // Función para enviar la solicitud de eliminación a la API.
    const deleteLinea = async () => {
        const token = localStorage.getItem('token'); // Obtiene el token de autenticación.
        const csrftoken = localStorage.getItem('csrftoken'); // Obtiene el CSRF token.

        try {
            const response = await axios.delete(
                `http://localhost:8000/api/lineas/delete/${linea.idLinea}/`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token, // Autenticación con el token.
                        'X-CSRFTOKEN': csrftoken // CSRF token para la seguridad.
                    }
                }
            );

            if (response.data.message) {
                alert("Linea eliminada");
                fetchLineas(); // Recarga la lista de líneas.
                onHide(); // Cierra el modal de eliminación.
            } else {
                console.error("Error: No se obtuvo data en la respuesta");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al eliminar linea");
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
                    Eliminar Linea
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que deseas eliminar la linea {linea.linea}?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={deleteLinea}>Eliminar</Button>
                <Button onClick={onHide}>Cancelar</Button>
            </Modal.Footer>
        </Modal>
    );
};

// Variables y lógica de paginación.
const indexOfLastItem = currentPage * itemsPerPage; // Índice del último elemento en la página actual.
const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Índice del primer elemento en la página actual.
const currentItems = filteredLineas.slice(indexOfFirstItem, indexOfLastItem); // Elementos de la página actual.
const totalPages = Math.ceil(filteredLineas.length / itemsPerPage); // Número total de páginas.

// Función para manejar el clic en los números de paginación.
const handleClick = (pageNumber) => setCurrentPage(pageNumber);

// Función para renderizar la paginación.
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

// Renderizado del componente principal que muestra la lista de líneas y modales para agregar, actualizar y eliminar.
return (
    <div>
        <Navegador />
        <div className="main-content">
            <div className="background-image"></div>
            <Card className="user-table-card" style={{ width: '95%', borderRadius: '20px', margin: 'auto', marginTop: '50px' }}>
                <Card.Header className="header-gradient text-center" style={{ borderRadius: '20px 20px 0 0' }}>
                    <h2>Lista de Lineas</h2>
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
                                <th>Linea</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="text-center">Cargando...</td>
                                </tr>
                            ) : (
                                currentItems.map((linea) => (
                                    <tr key={linea.idLinea}>
                                        <td>{linea.idLinea}</td>
                                        <td>{linea.linea}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => handleShowUpdateModal(linea)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                <BrushOutlinedIcon className="mr-2" />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => handleShowDeleteModal(linea)}
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
        <LineaStore show={showAddModal} onHide={handleCloseAddModal} />
        <LineaUpdate
            show={showUpdateModal}
            onHide={handleCloseUpdateModal}
            linea={selectedLinea || {}}
        />
        <LineaDestroy
            show={showDeleteModal}
            onHide={handleCloseDeleteModal}
            linea={selectedLinea || {}}
        />
    </div>
);
}

export default TableLineas;
