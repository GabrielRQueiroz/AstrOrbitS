from astropy.constants import G, M_sun, R_sun, au
from astropy.time import Time
from astroquery.jplhorizons import Horizons
from constants import ESTRELAS, PLANETAS
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Permite frontend acessar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou especifique seu domínio na produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/planetas")
def get_planetas():
    planetas = {}
    for identificador, dados in PLANETAS.items():
        planetas[identificador] = dados["nome"]
    return planetas


@app.get("/api/planeta/{identificador}")
def get_orbit_data(identificador: str = "earth", epoch = Time.now()):
    identificador = identificador.lower()

    if identificador not in PLANETAS:
        raise HTTPException(status_code=404, detail="Planeta não configurado")

    dados = PLANETAS[identificador]
    naif_id = dados["naif_id"]

    obj = Horizons(id=naif_id, location="@sun", epochs=epoch.jd)
    vectors = obj.vectors()

    data = {
        "idPlaneta": naif_id,
        "nomePlaneta": dados["nome"],
        "massaPlaneta": dados["massa"],
        "raioPlaneta": dados["raio"],
        "x_AU": vectors["x"][0],
        "y_AU": vectors["y"][0],
        "z_AU": vectors["z"][0],
        "vx_AUperDay": vectors["vx"][0],
        "vy_AUperDay": vectors["vy"][0],
        "vz_AUperDay": vectors["vz"][0],
    }
    return data


@app.get("/api/constantes")
def get_constants():
    return {
        "G": G.value,  # m³ kg⁻¹ s⁻²
        "AU": au.value,  # m
        "M_sol": M_sun.value,
        "R_sol": R_sun.value,
    }


@app.get("/api/estrelas")
def get_estrelas():
    estrelas = {}

    for identificador, dados in ESTRELAS.items():
        estrelas[identificador] = dados["nome"]

    return estrelas


@app.get("/api/estrela/{identificador}")
def get_estrela(identificador: str):
    identificador = identificador.lower()

    if identificador not in ESTRELAS:
        raise HTTPException(status_code=404, detail="Estrela não configurada")

    dados = ESTRELAS[identificador]
    return {
        "nome": dados["nome"],
        "massa": dados["massa"] * M_sun.value,
        "raio": dados["raio"] * R_sun.value,
        "cor": dados["cor"],
    }
