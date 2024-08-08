import React, { useState, useEffect } from 'react';
import { Table, Form, Card, Button, Modal, Pagination } from 'react-bootstrap';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import axios from 'axios';
import Navegador from './NavBar';
import '../styles/Usuarios.css';
import '../App.css';

function TableUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Número de elementos por página
  const csrftoken = localStorage.getItem('csrftoken');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/usuarios/');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Hubo un error al obtener los datos!', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página cuando se realiza una búsqueda
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowUpdateModal = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const UserStore = (props) => {
    const [idUser, setidUser] = useState('');
    const [username, setUsername] = useState('');
    const [lastname, setLastname] = useState('');
    const [position, setPosition] = useState('');
    const [password, setPassword] = useState('');
    const { fetchUsers, onHide } = props;

    const store = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post(
          'http://localhost:8000/api/user-management/create/',
          {
            idUser: idUser,
            username: username,
            lastname: lastname,
            position: position,
            password: password
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.data.message) {
          alert("Usuario agregado");
          fetchUsers();  // Refrescar la lista de usuarios después de agregar uno nuevo
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
            Agregar Usuario
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="image-container text-center" style={{ marginBottom: '20px' }}>
            <img src="https://i.imgur.com/VJSpzf3.png" alt="Users" style={{ maxWidth: '200px', borderRadius: '50%' }} />
          </div>
          <Form onSubmit={store} style={{ textAlign: 'center', fontSize: '1.2em' }}>
            <Form.Group className="mb-3" controlId="formIdUser">
              <Form.Label style={{ fontSize: '1.2em' }}>ID Usuario:</Form.Label>
              <Form.Control
                name="idUser"
                value={idUser}
                onChange={(e) => setidUser(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label style={{ fontSize: '1.2em' }}>Nombre:</Form.Label>
              <Form.Control
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastname">
              <Form.Label style={{ fontSize: '1.2em' }}>Apellido:</Form.Label>
              <Form.Control
                name="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPosition">
              <Form.Label style={{ fontSize: '1.2em' }}>Posición:</Form.Label>
              <Form.Control
                name="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label style={{ fontSize: '1.2em' }}>Contraseña:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

  const UserUpdate = (props) => {
    const { user, onHide } = props;
    const [currentIdUser, setCurrentIdUser] = useState('');
    const [idUser, setidUser] = useState('');
    const [username, setUsername] = useState('');
    const [lastname, setLastname] = useState('');
    const [position, setPosition] = useState('');
    const [password, setPassword] = useState('');
    const { fetchUsers } = props;
  
    useEffect(() => {
      if (user) {
        setCurrentIdUser(user.idUser);
        setidUser(user.idUser);
        setUsername(user.username);
        setLastname(user.lastname);
        setPosition(user.position);
      }
    }, [user]);
  
    const update = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
  
      try {
        const response = await axios.put(
          'http://localhost:8000/api/user-management/update/',
          {
            currentIdUser: currentIdUser,
            idUser: idUser,
            username: username,
            lastname: lastname,
            position: position,
            password: password // Solo enviar si se está actualizando la contraseña
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );
  
        if (response.data.message) {
          alert("Usuario actualizado");
          fetchUsers(); // Refrescar la lista de usuarios después de actualizar uno
          onHide(); // Cerrar el modal
        } else {
          console.error("Error: No se obtuvo data en la respuesta");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al actualizar usuario");
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
            Actualizar Usuario
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="image-container text-center" style={{ marginBottom: '20px' }}>
            <img src="https://i.imgur.com/VJSpzf3.png" alt="Users" style={{ maxWidth: '200px', borderRadius: '50%' }} />
          </div>
          <Form onSubmit={update} style={{ textAlign: 'center', fontSize: '1.2em' }}>
            <Form.Group className="mb-3" controlId="formIdUser">
              <Form.Label style={{ fontSize: '1.2em' }}>ID Usuario:</Form.Label>
              <Form.Control
                name="idUser"
                value={idUser}
                onChange={(e) => setidUser(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label style={{ fontSize: '1.2em' }}>Nombre:</Form.Label>
              <Form.Control
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastname">
              <Form.Label style={{ fontSize: '1.2em' }}>Apellido:</Form.Label>
              <Form.Control
                name="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPosition">
              <Form.Label style={{ fontSize: '1.2em' }}>Posición:</Form.Label>
              <Form.Control
                name="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                style={{ borderRadius: '50px', width: '60%', margin: '0 auto', fontSize: '1.2em' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label style={{ fontSize: '1.2em' }}>Contraseña:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

  const UserDestroy = (props) => {
    const { user, onHide } = props;
    const { fetchUsers } = props;

    const deleteUser = async () => {
      const token = localStorage.getItem('token');
      const csrftoken = localStorage.getItem('csrftoken');

      try {
        const response = await axios.delete(
          `http://localhost:8000/api/user-management/delete/${user.idUser}/`,
          {
            headers: {
              'Authorization': 'Bearer ' + token,
              'X-CSRFTOKEN': csrftoken
            }
          }
        );

        if (response.data.message) {
          alert("Usuario eliminado");
          fetchUsers(); // Refrescar la lista de usuarios después de eliminar uno
          onHide();
        } else {
          console.error("Error: No se obtuvo data en la respuesta");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al eliminar usuario");
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
            Eliminar Usuario
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar al usuario {user.username} {user.lastname}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteUser}>Eliminar</Button>
          <Button onClick={onHide}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
            <h2>Lista de Empleados</h2>
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
                  <th>Apellido</th>
                  <th>Posición</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">Cargando...</td>
                  </tr>
                ) : (
                  currentItems.map((user) => (
                    <tr key={user.idUser}>
                      <td>{user.idUser}</td>
                      <td>{user.username}</td>
                      <td>{user.lastname}</td>
                      <td>{user.position}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleShowUpdateModal(user)}
                          style={{ marginRight: '10px' }}
                        >
                          <BrushOutlinedIcon className="mr-2" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleShowDeleteModal(user)}
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
      <UserStore show={showAddModal} onHide={handleCloseAddModal} fetchUsers={fetchUsers} />
      <UserUpdate
        show={showUpdateModal}
        onHide={handleCloseUpdateModal}
        user={selectedUser || {}}
        fetchUsers={fetchUsers}
      />
      <UserDestroy
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        user={selectedUser || {}}
        fetchUsers={fetchUsers}
      />
    </div>
  );
}

export default TableUsers;
