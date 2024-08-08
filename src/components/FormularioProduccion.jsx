import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FormularioProduccion.css';
import Navegador from './NavBar';

function FormularioProduccion() {
    // Definimos los estados iniciales usando useState.
    // producciones almacena las filas de producción introducidas por el usuario.
    const [producciones, setProducciones] = useState([{ modelo: '', tiempoInicio: '', tiempoFin: '', golpes: '', pzaPorGolpes: '', pzaOk: '' }]);
    
    // paros almacena las filas de paros introducidas por el usuario.
    const [paros, setParos] = useState([{ departamento: '', descripcion: '', produccionId: '', duracion: '', observaciones: '' }]);
    
    // Almacena los departamentos, descripciones y modelos obtenidos de la API.
    const [departamentos, setDepartamentos] = useState([]);
    const [descripciones, setDescripciones] = useState([]);
    const [modelos, setModelos] = useState([]);
    
    // currentModelId almacena el ID del modelo actual seleccionado.
    const [currentModelId, setCurrentModelId] = useState('');

    // fecha almacena la fecha actual.
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    
    // turno almacena el turno actual basado en la hora del día.
    const [turno, setTurno] = useState('');

    // useEffect para obtener datos de la API cuando el componente se monta.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [departamentoResponse, descripcionResponse, modeloResponse] = await Promise.all([
                    axios.get('http://localhost:8000/api/list_departamentos/'),
                    axios.get('http://localhost:8000/api/list_descripciones/'),
                    axios.get('http://localhost:8000/api/modelos/')
                ]);

                // Almacena los datos obtenidos en los estados correspondientes.
                setDepartamentos(departamentoResponse.data);
                setDescripciones(descripcionResponse.data);
                setModelos(modeloResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // La dependencia vacía [] indica que este efecto solo se ejecuta una vez al montar el componente.

    // useEffect para establecer automáticamente el turno basado en la hora actual.
    useEffect(() => {
        const setTurnoAutomatico = () => {
            const horaActual = new Date().getHours();
            if (horaActual >= 6 && horaActual < 14) {
                setTurno('Matutino');
            } else if (horaActual >= 14 && horaActual < 22) {
                setTurno('Vespertino');
            } else {
                setTurno('Nocturno');
            }
        };
        setTurnoAutomatico();
    }, []); // La dependencia vacía [] indica que este efecto solo se ejecuta una vez al montar el componente.

    // Función para agregar una nueva fila de producción.
    const agregarFilaProduccion = () => {
        const nuevaFila = { modelo: '', tiempoInicio: '', tiempoFin: '', golpes: '', pzaPorGolpes: '', pzaOk: '' };
        setProducciones(prevProducciones => [...prevProducciones, nuevaFila]);
    };

    // Función para agregar una nueva fila de paro.
    const agregarFilaParos = () => {
        const nuevaFila = { departamento: '', descripcion: '', produccionId: currentModelId, duracion: '', observaciones: '' };
        setParos(prevParos => [...prevParos, nuevaFila]);
    };

    // Función para guardar los datos de producción y paros.
    const guardarDatos = async () => {
        try {
            const linea = localStorage.getItem('linea');  // Recuperar la línea de producción almacenada.
            
            // Guardar datos de producción.
            for (const produccion of producciones) {
                if (!produccion.modelo || !produccion.tiempoInicio || !produccion.tiempoFin || !produccion.golpes || !produccion.pzaPorGolpes || !produccion.pzaOk) {
                    alert('Todos los campos de producción son obligatorios.');
                    return;
                }
                const response = await axios.post('http://localhost:8000/api/produccion/create/', {
                    modelo: produccion.modelo,
                    fecha: fecha,
                    tiempo_inicio: produccion.tiempoInicio,
                    tiempo_fin: produccion.tiempoFin,
                    golpes: produccion.golpes,
                    pieza_por_golpe: produccion.pzaPorGolpes,
                    piezas_ok: produccion.pzaOk,
                    turno: turno,
                    linea: linea  // Incluir la línea de producción.
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': localStorage.getItem('csrf_token')  // Recuperar el CSRF token.
                    }
                });
                console.log(response.data);
            }

            // Guardar datos de paros.
            for (const paro of paros) {
                if (!paro.departamento || !paro.descripcion || !paro.duracion || !paro.observaciones) {
                    alert('Todos los campos de paro son obligatorios.');
                    return;
                }
                const response = await axios.post('http://localhost:8000/api/paro/create/', {
                    departamento: paro.departamento,
                    descripcion: paro.descripcion,
                    duracion: paro.duracion,
                    turno: turno,
                    observaciones: paro.observaciones,
                    linea: linea  // Incluir la línea de producción si es relevante para los paros.
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFTOKEN': localStorage.getItem('csrf_token')  // Recuperar el CSRF token.
                    }
                });
                console.log(response.data);
            }
            alert('Datos guardados correctamente');
        } catch (error) {
            console.error('Error guardando datos:', error);
            alert('Error guardando datos');
        }
    };

    // Función para manejar cambios en las filas de producción.
    const manejarCambioProduccion = (index, campo, valor) => {
        const nuevasProducciones = [...producciones];
        nuevasProducciones[index][campo] = valor;
        setProducciones(nuevasProducciones);

        if (campo === 'modelo') {
            setCurrentModelId(valor);
            setParos(prevParos => 
                prevParos.map(paro => 
                    paro.produccionId === '' ? { ...paro, produccionId: valor } : paro
                )
            );
        }
    };

    // Función para manejar cambios en las filas de paros.
    const manejarCambioParo = (index, campo, valor) => {
        const nuevosParos = [...paros];
        nuevosParos[index][campo] = valor;
        setParos(nuevosParos);
    };

    // Renderiza el formulario de producción en la interfaz de usuario.
    return (
        <div>
            <Navegador />
            <div className="container mt-5">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="card card-fecha-turno">
                            <h4>Fecha: {fecha}</h4>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card card-fecha-turno">
                            <h4>Turno: {turno}</h4>
                        </div>
                    </div>
                </div>
                <div className="card h-200" style={{ width: '110%' }}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6" style={{ paddingRight: '25px' }}>
                                <div className="section-header">
                                    <h2>Producción por Turno</h2>
                                </div>
                                <div className="table-responsive">
                                    <table className="table" id="tablaProduccion">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Modelo (ID)</th>
                                                <th>Tiempo de Inicio</th>
                                                <th>Tiempo de Fin</th>
                                                <th>Golpes</th>
                                                <th>Pieza por Golpe</th>
                                                <th>Pieza Ok</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {producciones.map((prod, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <select 
                                                            value={prod.modelo} 
                                                            onChange={(e) => manejarCambioProduccion(index, 'modelo', e.target.value)} 
                                                            style={{ fontSize: '1.4em', width: '250px' }}
                                                        >
                                                            <option value="">Seleccionar modelo</option>
                                                            {modelos.map((modelo) => (
                                                                <option key={modelo.idModelo} value={modelo.idModelo}>{modelo.idModelo}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="time"
                                                            value={prod.tiempoInicio}
                                                            onChange={(e) => manejarCambioProduccion(index, 'tiempoInicio', e.target.value)}
                                                            style={{ fontSize: '1.4em', width: '120px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="time"
                                                            value={prod.tiempoFin}
                                                            onChange={(e) => manejarCambioProduccion(index, 'tiempoFin', e.target.value)}
                                                            style={{ fontSize: '1.4em', width: '120px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={prod.golpes} onChange={(e) => manejarCambioProduccion(index, 'golpes', e.target.value)} style={{ fontSize: '1.4em', width: '100px' }} />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={prod.pzaPorGolpes} onChange={(e) => manejarCambioProduccion(index, 'pzaPorGolpes', e.target.value)} style={{ fontSize: '1.4em', width: '100px' }} />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={prod.pzaOk} onChange={(e) => manejarCambioProduccion(index, 'pzaOk', e.target.value)} style={{ fontSize: '1.4em', width: '100px' }} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button type="button" className="btn btn-custom" onClick={agregarFilaProduccion}>Agregar Fila Producción</button>
                            </div>
                            <div className="col-md-6" style={{ paddingLeft: '25px' }}>
                                <div className="section-header">
                                    <h2>Paros de Línea</h2>
                                </div>
                                <div className="table-responsive">
                                    <table className="table" id="tablaParos">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Departamento</th>
                                                <th>Descripción de Paro</th>
                                                <th>ID</th>
                                                <th>Duración</th>
                                                <th>Observaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paros.map((paro, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <select 
                                                            value={paro.departamento} 
                                                            onChange={(e) => manejarCambioParo(index, 'departamento', e.target.value)} 
                                                            style={{ fontSize: '1.4em', width: '210px' }}
                                                        >
                                                            <option value="">Seleccionar departamento</option>
                                                            {departamentos.map((dep) => (
                                                                <option key={dep.idDepartamento} value={dep.departamento}>{dep.departamento}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select 
                                                            value={paro.descripcion} 
                                                            onChange={(e) => manejarCambioParo(index, 'descripcion', e.target.value)} 
                                                            style={{ fontSize: '1.4em', width: '250px' }}
                                                        >
                                                            <option value="">Seleccionar descripción</option>
                                                            {descripciones.map((desc) => (
                                                                <option key={desc.idDescripcion} value={desc.Descripcion}>{desc.Descripcion}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input type="text" value={paro.produccionId} readOnly style={{ fontSize: '1.6em', width: '75px' }} />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={paro.duracion} onChange={(e) => manejarCambioParo(index, 'duracion', e.target.value)} style={{ fontSize: '1.4em', width: '70px' }} />
                                                    </td>
                                                    <td>
                                                        <input type="text" value={paro.observaciones} onChange={(e) => manejarCambioParo(index, 'observaciones', e.target.value)} style={{ fontSize: '1.4em', width: '250px' }} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button type="button" className="btn btn-custom" onClick={agregarFilaParos}>Agregar Fila Paro</button>
                            </div>
                        </div>
                        <button type="button" className="btn btn-custom" onClick={guardarDatos}>Guardar Datos</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Exportamos el componente FormularioProduccion para que pueda ser utilizado en otras partes de la aplicación.
export default FormularioProduccion;