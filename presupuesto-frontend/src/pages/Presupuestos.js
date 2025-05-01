import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FiltroPresupuesto from '../components/FiltroPresupuesto';
import PresupuestoTable from '../components/PresupuestoTable';
import '../styles/Presupuestos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Presupuestos = () => {
  const navigate = useNavigate();
  const [presupuestos, setPresupuestos] = useState([]);
  const [filtros, setFiltros] = useState({ cuenta: '', mes: '' });
  const [loading, setLoading] = useState(false);
  const [modificados, setModificados] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchPresupuestos(token);
    }
  }, [navigate]);

  const fetchPresupuestos = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/presupuestos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const arrayData = Array.isArray(data) ? data : data.presupuestos || [];
      const conIndices = arrayData.map((row, idx) => ({ ...row, originalIndex: idx }));
      setPresupuestos(conIndices);
      setModificados({});
      console.log('[BACKEND] Carga completada:', conIndices.length, 'filas');
    } catch (error) {
      console.error('[BACKEND] Error al obtener presupuestos:', error);
      setPresupuestos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePresupuesto = (originalIndex, campo, valor) => {
    setPresupuestos((prev) => {
      const actualizados = [...prev];
      actualizados[originalIndex][campo] = valor;
      return actualizados;
    });
    setModificados((prev) => ({ ...prev, [originalIndex]: true }));
    console.log(`[UI] Campo modificado en fila ${originalIndex}: ${campo} = ${valor}`);
  };

  const handleActualizar = async () => {
    const token = localStorage.getItem('token');
    const filasModificadas = Object.keys(modificados).map((idx) => {
      const { originalIndex, Observacion, ...resto } = presupuestos[idx];
      return {
        ...resto,
        'Observación': Observacion // Mapeo sin tilde → con tilde
      };
    });

    if (filasModificadas.length === 0) {
      toast.info('No hay cambios para actualizar.', { className: 'toast-chaide' });
      return;
    }

    console.log('[BACKEND] Enviando', filasModificadas.length, 'solicitudes individuales');

    try {
      for (const fila of filasModificadas) {
        console.log('[BACKEND] Enviando fila:', fila);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/presupuestos/actualizar`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fila),
        });

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }
      }

      toast.success('Presupuestos actualizados correctamente', { className: 'toast-chaide' });
      fetchPresupuestos(token);
    } catch (error) {
      console.error('[BACKEND] Error en fetch:', error);
      toast.error('Presupuesto Gastos dice: Error al actualizar Presupuestos', { className: 'toast-chaide' });
    }
  };

  const handleFiltro = (nuevoFiltro) => {
    console.log('[FILTRO] Nuevos filtros:', nuevoFiltro);
    setFiltros(nuevoFiltro);
  };

  const presupFiltrados = presupuestos.filter((p) => {
    return (
      (!filtros.cuenta || p.CUENTA?.includes(filtros.cuenta)) &&
      (!filtros.mes || p.MES?.toString() === filtros.mes?.toString())
    );
  });

  return (
    <div className="presupuestos-container">
      <Header />
      <div className="bienvenida">
        BIENVENIDO: <span className="usuario-nombre">{localStorage.getItem('usuarioNombre') || 'Usuario'}</span>
      </div>
      <div className="fila-filtros">
        <FiltroPresupuesto filtros={filtros} setFiltros={handleFiltro} />
        <button className="boton-actualizar" onClick={handleActualizar}>
          Actualizar Presupuestos
        </button>
      </div>
      <PresupuestoTable
        data={presupFiltrados}
        onChange={handleChangePresupuesto}
        loading={loading}
      />
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default Presupuestos;
