import React from 'react';
import '../styles/PresupuestoTable.css';

const getTituloColumna = (campo) => {
  const mapa = {
    CENTROCOSTONOMBRE: 'CENTRO COSTO',
    CUENTANOMBRE: 'NOMBRE CUENTA',
    PresupAnoActu: 'PRESUPUESTO ANTERIOR',
    PresupAñoNuevo: 'PRESUPAÑO NUEVO',
    ANIO: 'AÑO',
    Observacion: 'OBSERVACIÓN',
    CUENTA: 'CUENTA',
    MES: 'MES',
  };
  return mapa[campo] || campo.toUpperCase();
};

const PresupuestoTable = ({ data, onChange, loading }) => {
  if (loading) return <div className="loading-msg">Cargando presupuestos...</div>;
  if (!data.length) return <div className="empty-msg">No hay datos para mostrar.</div>;

  const camposMostrar = Object.keys(data[0]).filter(
    (campo) => !['AREA', 'CENTROCOSTO', 'originalIndex'].includes(campo)
  );

  const formatDecimal = (value) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(2);
    }
    return value;
  };

  return (
    <div className="tabla-container">
      <table className="presupuesto-tabla">
        <thead>
          <tr>
            {camposMostrar.map((key) => (
              <th key={key}>{getTituloColumna(key)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((fila, idx) => (
            <tr key={idx}>
              {camposMostrar.map((campo) => {
                let valor = fila[campo];
                const isEditable = campo === 'PresupAñoNuevo' || campo === 'Observacion';
                const isDecimalCampo = ['PresupAnoActu', 'PresupAñoNuevo'].includes(campo);

                if (!isEditable && isDecimalCampo && !isNaN(parseFloat(valor))) {
                  valor = formatDecimal(valor);
                }

                return (
                  <td key={campo}>
                    {isEditable ? (
                      <input
                        type={campo === 'PresupAñoNuevo' ? 'number' : 'text'}
                        className="editable-input"
                        step="0.01"
                        value={campo === 'PresupAñoNuevo' ? (valor ?? '') : (valor || '')}
                        onChange={(e) =>
                          onChange(fila.originalIndex ?? idx, campo, e.target.value)
                        }
                      />
                    ) : (
                      valor
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PresupuestoTable;
