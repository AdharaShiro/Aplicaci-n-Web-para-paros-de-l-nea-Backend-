import axios from 'axios';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/FormularioProduccion.css';
import '../styles/LoginForm.css';
import { useNavigate } from 'react-router-dom';


// Configuración inicial de Axios para manejar cookies y CSRF tokens de manera automática.
// Esta configuración es crucial para proteger las solicitudes POST, PUT, DELETE, etc., de ataques CSRF.
axios.defaults.xsrfCookieName = 'csrftoken'; // Nombre de la cookie donde se almacenará el token CSRF.
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'; // Nombre del encabezado que se utilizará para enviar el token CSRF.
axios.defaults.withCredentials = true; // Permite que las solicitudes incluyan cookies de sesión y CSRF.


// Creación de una instancia de Axios con una configuración base.
// baseURL establece la URL base para todas las solicitudes HTTP realizadas con esta instancia.
const client = axios.create({
    baseURL: "http://127.0.0.1:8000" // URL base de la API a la que se harán las solicitudes.
});


// Definición del componente funcional LoginForm, que maneja el formulario de inicio de sesión.
const LoginForm = () => {
    // useNavigate permite la navegación programática dentro de la aplicación.
    const navigate = useNavigate();

    // Definimos el estado inicial del formulario usando useState.
    // formData almacena los valores introducidos por el usuario en los campos del formulario.
    const [formData, setFormData] = useState({
        idUser: '', // Almacena el número de empleado.
        password: '', // Almacena la contraseña del usuario.
        lineName: '' // Almacena el nombre de la línea.
    });

    // Estado para manejar posibles errores durante el inicio de sesión.
    const [error, setError] = useState('');

    // Estado para almacenar el token CSRF que se utilizará en las solicitudes POST.
    const [token, setToken] = useState('');

    // handleChange es una función que se ejecuta cada vez que el usuario cambia un valor en el formulario.
    // Actualiza el estado de formData con el nuevo valor introducido en el campo correspondiente.
    const handleChange = (e) => {
        setFormData({
            ...formData, // Conserva los valores actuales del estado.
            [e.target.name]: e.target.value // Actualiza el campo que fue modificado.
        });
    };

    // useEffect es un hook que se ejecuta después de que el componente se monta.
    // Aquí, lo utilizamos para obtener el token CSRF cuando el componente se carga.
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/csrf-token/');
                setToken(response.data.csrfToken); // Almacena el token CSRF en el estado.
            } catch (error) {
                console.error('Hubo un error al obtener el token CSRF!', error);
            }
        };

        fetchToken(); // Ejecuta la función para obtener el token CSRF.
    }, []); // La dependencia vacía [] indica que este efecto solo se ejecuta una vez al montar el componente.

    // handleSubmit es una función que se ejecuta cuando el usuario envía el formulario.
    // Envía una solicitud POST a la API para autenticar al usuario.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario de recargar la página.
        console.log("Formulario enviado:", formData); // Muestra en la consola los datos del formulario enviados.

        try {
            // Envía los datos del formulario a la API para autenticar al usuario.
            const response = await client.post("/api/login/", {
                idUser: formData.idUser, // Envía el número de empleado.
                password: formData.password, // Envía la contraseña.
                lineName: formData.lineName // Envía el nombre de la línea.
            }, {
                headers: {
                    'Content-Type': 'application/json', // Establece el tipo de contenido como JSON.
                    'X-CSRFTOKEN': token // Incluye el token CSRF en el encabezado de la solicitud.
                }
            });

            // Si la respuesta es exitosa (código 200), almacena el token CSRF y la línea en el almacenamiento local.
            if (response.status === 200) {
                localStorage.setItem("csrf_token", response.data.token);
                localStorage.setItem("linea", formData.lineName);
                localStorage.setItem("position", response.data.position);

                // Redirige al usuario a la página correspondiente según el nombre de la línea.
                switch (formData.lineName.toLowerCase()) {
                    case 'osciladora':
                        navigate('/BitacoraOsiladora'); // Redirige a la página de Bitácora Osiladora.
                        break;
                    case 'slitter':
                        navigate('/BitacoraSlitter'); // Redirige a la página de Bitácora Slitter.
                        break;
                    default:
                        navigate('/Produccion'); // Redirige a la página de Producción si no coincide ninguna línea.
                        break;
                }
            } else {
                setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            }
        } catch (err) {
            console.error('Detalles del error:', err.response ? err.response.data : err.message);
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }
    };

    // Renderiza el formulario de inicio de sesión en la interfaz de usuario.
    return (
        <main className="container">
            <div className="row align-items-center">
                <div className="col-md-6 mt-5 d-flex align-items-center">
                    <a href="https://imgur.com/lE5STgX">
                        <img
                            src="https://i.imgur.com/lE5STgX.png"
                            title="source: imgur.com"
                            className="img-fluid custom-img"
                            alt="Imagen"
                        />
                    </a>
                </div>
                <div className="col-md-6 mt-5 d-flex align-items-center">
                    <form onSubmit={handleSubmit} className="card card-body shadow-lg p-4 w-100">
                        <center className="mb-4">
                            <h1>Aguascalientes Steel</h1>
                            <h2>Coil Center</h2>
                            <h3>ASC</h3>
                        </center>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="mb-3 text-start">
                            <label htmlFor="idUser">Número de empleado:</label>
                            <input
                                type="text"
                                name="idUser"
                                id="idUser"
                                className="form-control form-control-custom"
                                placeholder="Ingresa tu número de empleado"
                                value={formData.idUser}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="password">Contraseña:</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form-control form-control-custom"
                                placeholder="Ingresa la contraseña"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="lineName">Nombre de línea:</label>
                            <input
                                type="text"
                                name="lineName"
                                id="lineName"
                                className="form-control form-control-custom"
                                placeholder="Ingresa el nombre de línea"
                                value={formData.lineName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button
                                type="submit"
                                className="btn btn-outline-info"
                                style={{ backgroundColor: '#0097B2', color: 'white' }}
                            >
                                Acceder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

// Exportamos el componente LoginForm para que pueda ser utilizado en otras partes de la aplicación.
export default LoginForm;