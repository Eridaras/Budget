import React from 'react';
import '../styles/FiltroPresupuesto.css';

const FiltroPresupuesto = ({ filtros, setFiltros }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('[FILTRO] Cambio de', name, '→', value);
    setFiltros({ ...filtros, [name]: value });
  };

  const limpiarFiltros = () => {
    console.log('[FILTRO] Limpiar filtros');
    setFiltros({ cuenta: '', mes: '' });
  };

  return (
    <div className="filtros-container">
      <input
        type="text"
        placeholder="Buscar cuenta..."
        name="cuenta"
        value={filtros.cuenta}
        onChange={handleChange}
        className="filtro-input"
      />

      <select
        name="mes"
        value={filtros.mes}
        onChange={handleChange}
        className="filtro-input"
      >
        <option value="">Mes</option>
        {[
          'Enero','Febrero','Marzo','Abril','Mayo','Junio',
          'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
        ].map((m, i) => (
          <option key={i+1} value={i+1}>{m}</option>
        ))}
      </select>

      <button onClick={limpiarFiltros} className="btn-limpiar">
        Limpiar filtros
      </button>
    </div>
  );
};

export default FiltroPresupuesto;
