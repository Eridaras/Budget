# app/models/presupuesto_dto.py
from pydantic import BaseModel
from typing import Optional


class PresupuestoDTO(BaseModel):
    AREA: str
    CENTROCOSTO: str
    CENTROCOSTONOMBRE: str
    MES: str
    CUENTA: str
    CUENTANOMBRE: str
    # El cliente SOLO envía el nuevo monto y el año futuro
    PresupAñoNuevo: float
    ANIO: int            # año futuro (ej. 2026)
    Observación: Optional[str] = None
