import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FormularioProduccion.css';
import Navegador from './NavBar';

function FormularioSlitter() {
    const [producciones, setProducciones] = useState([{ modelo: '', tiempoInicio: '', tiempoFin: '', kilosOk: '', cintas: '', masterCoils: '', hmc: '', gw: '', ancho: '' }]);
    const [paros, setParos] = useState([{ departamento: '', descripcion: '', produccionId: '', duracion: '', observaciones: '' }]);
    const [departamentos, setDepartamentos] = useState([]);
    const [descripciones, setDescripciones] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [currentModelId, setCurrentModelId] = useState('');

    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [turno, setTurno] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Realiza múltiples solicitudes HTTP para obtener departamentos, descripciones y modelos.
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

    useEffect(() => {
        // Establece automáticamente el turno basado en la hora actual.
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
        const nuevaFila = { modelo: '', tiempoInicio: '', tiempoFin: '', kilosOk: '', cintas: '', masterCoils: '', hmc: '', gw: '', ancho: '' };
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
            // Prepara los datos de producción para ser enviados a la API.
            const produccionesData = producciones.map(produccion => ({
                modelo: produccion.modelo,
                fecha,
                tiempo_inicio: produccion.tiempoInicio,
                tiempo_fin: produccion.tiempoFin,
                kilos_ok: produccion.kilosOk,
                cintas: produccion.cintas,
                master_coils: produccion.masterCoils,
                hmc: produccion.hmc,
                gw: produccion.gw,
                ancho: produccion.ancho,
                turno
            }));
    
            // Envía los datos de producción a la API.
            for (const data of produccionesData) {
                await axios.post('http://localhost:8000/api/slitter_produccion/create/', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
    
            // Prepara los datos de paros para ser enviados a la API.
            const parosData = paros.map(paro => ({
                departamento: paro.departamento,
                descripcion: paro.descripcion,
                duracion: paro.duracion,
                observaciones: paro.observaciones,
                turno
            }));
    
            // Envía los datos de paros a la API.
            for (const data of parosData) {
                await axios.post('http://localhost:8000/api/slitter_paro/create/', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
    
            alert('Datos guardados correctamente');
        } catch (error) {
            console.error('Error guardando datos:', error.response.data);
            alert('Error guardando datos');
        }
    };

    // Función para manejar cambios en las filas de producción.
    const manejarCambioProduccion = (index, campo, valor) => {
        const nuevasProducciones = [...producciones];
        nuevasProducciones[index][campo] = valor;
        setProducciones(nuevasProducciones);

        // Actualiza el ID del modelo actual y asigna este ID a los paros que no tienen uno.
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

    // Renderiza el formulario de producción y paros en la interfaz de usuario.
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
                                                <th>Modelo</th>
                                                <th>Tiempo de Inicio</th>
                                                <th>Tiempo de Fin</th>
                                                <th>Kilos OK</th>
                                                <th>Cintas</th>
                                                <th>Master Coils</th>
                                                <th>HMC</th>
                                                <th>GW</th>
                                                <th>Ancho</th>
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
                                                                <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
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
                                                        <input type="number" value={prod.kilosOk} onChange={(e) => manejarCambioProduccion(index, 'kilosOk', e.target.value)} style={{ fontSize: '1.4em', width: '100px' }} />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={prod.cintas} onChange={(e) => manejarCambioProduccion(index, 'cintas', e.target.value)} style={{ fontSize: '1.4em', width: '100px' }} />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={prod.masterCoils} onChange={(e) => manejarCambioProduccion(index, 'masterCoils', e.target.value)} style={{ fontSize: '1.4em', width: '100px' }} />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={prod.hmc} onChange={(e) => manejarCambioProduccion(index, 'hmc', e.target.value)} style={{ fontSize: '1.4em', width: '100px' }} />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={prod.gw} onChange={(e) => manejarCambioProduccion(index, 'gw', e.target.value)} style={{ fontSize: '1.4em', width: '100px' }} />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={prod.ancho} onChange={(e) => manejarCambioProduccion(index, 'ancho', e.target.value)} style={{ fontSize: '1.4em', width: '100px' }} />
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
                        <div className="footer-buttons">
                            <button type="button" className="btn btn-custom" onClick={guardarDatos}>Guardar Datos</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormularioSlitter;