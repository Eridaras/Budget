from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.services.ad_auth import validate_credentials
from app.core.security import create_access_token, get_current_user
from app.models.auth_dto import AuthRequest, UserAD
from app.services.presupuesto_service import obtener_presupuesto_filtrado, actualizar_presupuesto_service
from app.models.presupuesto_dto import PresupuestoDTO
from typing import List

# Inicializar FastAPI
app = FastAPI()

# Configuración de CORS (¡esto es crucial!)
origins = [
    "http://localhost:3000",  # React frontend
    "http://192.168.1.209",   # IP del frontend/backend en producción
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta de prueba definida directamente en main.py con el path completo
@app.get("/Aplicativos/ApiPresupuestoGastos/test")
async def test():
    return {"status": "ok"}

# Ruta /auth/login movida a main.py con el path completo
@app.post("/Aplicativos/ApiPresupuestoGastos/auth/login")
def login(data: AuthRequest):
    auth_result = validate_credentials(data.username, data.password)
    if auth_result:
        token = create_access_token(auth_result["token_data"])
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": auth_result["user"]
        }
    else:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

# Rutas de presupuesto definidas con el path completo
@app.get("/Aplicativos/ApiPresupuestoGastos/presupuestos", response_model=List[dict])
def listar_presupuesto(user: UserAD = Depends(get_current_user)):
    # Se ejecuta antes para generar los registros del año siguiente si no existen
    return obtener_presupuesto_filtrado(user.sAMAccountName)

@app.post("/Aplicativos/ApiPresupuestoGastos/presupuestos/actualizar")
def actualizar_presupuesto(presupuesto: PresupuestoDTO, user: UserAD = Depends(get_current_user)):
    return actualizar_presupuesto_service(presupuesto, user.sAMAccountName)

