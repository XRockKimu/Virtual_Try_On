from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging, client_ip_filter
from app.services.model_loader import ModelLoader
from app.api.routes import health, predict


# Setup logging
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    model_loader = ModelLoader()
    model_loader.load_model()
    app.state.model_loader = model_loader
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


# Client IP middleware
@app.middleware("http")
async def add_client_ip(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    client_ip_filter.client_ip = client_ip
    response = await call_next(request)
    return response


# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, tags=["Predictions"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
