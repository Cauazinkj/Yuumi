import logging
from fastapi import FastAPI
from app.api.v1.routes import router as v1_router

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Yuumi API", debug=True)  # Adicione debug=True

app.include_router(v1_router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"message": "ok"}

@app.on_event("startup")
async def startup_event():
    logger.info("Aplicação iniciando...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Aplicação encerrando...")