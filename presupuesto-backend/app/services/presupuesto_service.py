from typing import List, Dict, Any
from datetime import datetime
from app.db.bi_connection import get_bi_connection
from fastapi import HTTPException  # Importar HTTPException

# ---------------------- CONSULTA ----------------------
def obtener_presupuesto_filtrado(username: str) -> List[Dict[str, Any]]:
    try:
        conn = get_bi_connection()
        cur = conn.cursor()

        # Ejecutar el SP que devuelve todos los registros, ya con los presupuestos correctos (PresupAñoActu y PresupAñoNuevo)
        cur.execute("EXEC ConsultaPresupuestoGastos @UsuarioAD = ?", (username,))
        cols = [c[0] for c in cur.description]
        bruto = [dict(zip(cols, r)) for r in cur.fetchall()]

        # Verificación: Imprimir para asegurarnos de que 'Presupuesto' está presente
        print(f"Columnas recuperadas: {cols}")
        
        resp: List[Dict[str, Any]] = []

        # Recorrer los resultados del SP y devolverlos tal cual
        for r in bruto:
            anio = int(r["ANIO"])

            # Solo mostrar los registros del año siguiente (2026)
            if anio == (datetime.now().year + 1):  # Año siguiente (2026)
                # Asignar los presupuestos a 2 decimales y garantizar que sean enteros, no cadenas ni null
                presup_actu = int(r["PresupAñoActu"]) if r["PresupAñoActu"] is not None else 0  # Valor por defecto: 0
                presup_nuevo = int(r["PresupAñoNuevo"]) if r["PresupAñoNuevo"] is not None else 0  # Valor por defecto: 0
                observacion = r["Observación"] if r["Observación"] is not None else ""  # Asegurarse de que la observación sea una cadena vacía si no existe

                resp.append({
                    "AREA": r["AREA"],
                    "CENTROCOSTO": r["CENTROCOSTO"],
                    "CENTROCOSTONOMBRE": r["CENTROCOSTONOMBRE"],
                    "MES": r["MES"],
                    "CUENTA": r["CUENTA"],
                    "CUENTANOMBRE": r["CUENTANOMBRE"],
                    "PresupAñoActu": presup_actu,  # Presupuesto del año actual (2025), como entero
                    "PresupAñoNuevo": presup_nuevo,  # Presupuesto del año siguiente (2026), como entero
                    "ANIO": anio,
                    "Observacion": observacion,  # Observación, asegurándose de que no sea null o undefined

                })

        return resp
    except Exception as e:
        print(f"Error al obtener los presupuestos: {e}")
        raise HTTPException(status_code=500, detail="Error al procesar la solicitud.")

# ---------------------- ACTUALIZAR ----------------------
def actualizar_presupuesto_service(data, usuario: str) -> Dict[str, Any]:
    try:
        conn = get_bi_connection()
        cur = conn.cursor()

        # Permisos
        cur.execute("SELECT 1 FROM BI.dbo.PresupuestoGastosUsers WHERE UsuarioAD=? AND CentroCosto=?", (usuario, data.CENTROCOSTO))
        if not cur.fetchone():
            raise Exception("Sin permiso para este centro de costo.")
        
        anio_actual = data.ANIO  # Año actual (ej. 2026)
        cur.execute("""
            UPDATE BI.dbo.PresupuestoGastos
            SET Presupuesto = ?, Observación = ?
            WHERE CENTROCOSTO = ? AND CUENTA = ? AND MES = ? AND ANIO = ?
        """, (data.PresupAñoNuevo, data.Observación, data.CENTROCOSTO, data.CUENTA, data.MES, anio_actual))
        conn.commit()

        return {"status": "Presupuesto actualizado correctamente"}
    except Exception as e:
        print(f"Error al actualizar el presupuesto: {e}")
        raise HTTPException(status_code=500, detail="Error al actualizar el presupuesto.")

