from fastapi import FastAPI

from starlette.middleware.cors import CORSMiddleware
import os

from tortoise.contrib.fastapi import HTTPNotFoundError, register_tortoise
from tortoise.queryset import QuerySet
from tortoise import Tortoise

from .routers import posts, comments, cache, general

app = FastAPI(
    title="Reddit Display and Tagger project",
    description="This is a project to display, tag and save the data into postgres database, with auto docs for the API",
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the data from environment variables
DEFAULT = "Not Set"
DSN = os.environ.get("TORTOISEORM_DSN", DEFAULT)

# Check if api's working
@app.get("/")
def read_root():
    """
    # To check if API is working
    """
    return {"API": "Working"}


app.include_router(cache.router, tags=["cache"])
app.include_router(posts.router, tags=["posts"])
app.include_router(comments.router, tags=["comments"])
app.include_router(general.router, tags=["general"])


register_tortoise(
    app,
    db_url=DSN,
    modules={"models": ["app.models.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)