from app.db.bi_connection import get_bi_connection
import pandas as pd

def obtener_presupuesto_filtrado(usuario: str):
    conn = get_bi_connection()

    # 1. Obtener los centros de costo del usuario
    query_centros = f'''
        SELECT CentroCosto
        FROM BI.dbo.PresupuestoGastosUsers
        WHERE UsuarioAD = '{usuario}'
    '''
    centros_df = pd.read_sql(query_centros, conn)
    if centros_df.empty:
        return []

    centros_str = "', '".join(centros_df["CentroCosto"].unique())

    # 2. Obtener las cuentas que pertenecen a esos centros de costo
    query_cuentas = f'''
        SELECT CUENTA
        FROM BI.dbo.PresupuestoGastosCuentas
        WHERE CENTROCOSTO IN ('{centros_str}')
    '''
    cuentas_df = pd.read_sql(query_cuentas, conn)
    if cuentas_df.empty:
        return []

    cuentas_str = "', '".join(cuentas_df["CUENTA"].unique())

    # 3. Consultar la tabla final con esas cuentas
    query_presupuesto = f'''
        SELECT *
        FROM BI.dbo.PresupuestoGastos
        WHERE CUENTA IN ('{cuentas_str}')
    '''
    presupuesto_df = pd.read_sql(query_presupuesto, conn)
    return presupuesto_df.to_dict(orient="records")
