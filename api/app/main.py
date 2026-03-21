from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import settings
from app.core.logging import setup_logging, client_ip_filter
from app.services.model_loader import ModelLoader
from app.services.garment_classifier import init_garment_classifier
from app.api import size_suggestion as size_routing
from app.api import virtual_tryon as tryon_routing
from app.api import body_measurement as body_measurement_routing


# Setup logging
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    model_loader = ModelLoader()
    model_loader.load_model()
    app.state.model_loader = model_loader

    init_garment_classifier(settings.CLOTHING_CLASSIFIER_MODEL_PATH)
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Capstone Project API",
    description="Production ML API for Virtual Try-On & Size Suggestion",
    lifespan=lifespan
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_client_ip(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    client_ip_filter.client_ip = client_ip
    response = await call_next(request)
    return response

output_dir = Path("temp/output")
output_dir.mkdir(parents=True, exist_ok=True)
app.mount("/outputs", StaticFiles(directory=str(output_dir)), name="outputs")

@app.get("/")
async def root():
    messages = {
        "docs": "http://localhost:8000/docs",
        "redoc": "http://localhost:8000/redoc"
    }
    return messages

# Include routers
app.include_router(size_routing.router, prefix="/api/size-suggestion", tags=["Size Suggestion"])
app.include_router(tryon_routing.router, prefix="/api/virtual-tryon", tags=["Virtual Try-On"])
app.include_router(body_measurement_routing.router, prefix="/api/body-measurements", tags=["Body Measurement"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)