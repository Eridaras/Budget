import pyodbc
from app.core.config_core import settings

def get_bi_connection():
    conn_str = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={settings.DATABASE_HOST};"
        f"DATABASE={settings.DATABASE_BI};"
        f"UID={settings.DATABASE_USER};"
        f"PWD={settings.DATABASE_PASSWORD};"
    )
    return pyodbc.connect(conn_str)
