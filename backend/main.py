import sqlalchemy
from fastapi import FastAPI
from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from fastapi import FastAPI

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Just expose two points.
@app.get("/")
def read_root():
    return {"Hello": "from ljud-backend!"}

class Investigation(BaseModel):
    id: int
    name: str

@app.get("/investigations")
def read_root():
    return [
        Investigation(id=0, name="Kalles knarkaffärer"),
        Investigation(id=1, name="Länsmansjäveln"),
    ]
