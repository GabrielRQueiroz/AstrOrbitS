from astropy import units as u
from astropy.constants import G, M_earth, M_sun, au
from astroquery.jplhorizons import Horizons
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

NAIF_IDS = {
    "sun": "10",
    "mercury": "199",
    "venus": "299",
    "earth": "399",
    "moon": "301",
    "mars": "499",
    "jupiter": "599",
    "saturn": "699",
    "uranus": "799",
    "neptune": "899",
    "pluto": "999",
}

app = FastAPI()

# Permite frontend acessar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou especifique seu domínio na produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/orbit-data")
def get_orbit_data(body: str = "earth", epoch: float = 2451545.0):
    body_id = NAIF_IDS[body.lower()]
    obj = Horizons(id=body_id, location="@sun", epochs=epoch)
    vectors = obj.vectors()
    data = {
        "x_AU": vectors["x"][0],
        "y_AU": vectors["y"][0],
        "z_AU": vectors["z"][0],
        "vx_AUperDay": vectors["vx"][0],
        "vy_AUperDay": vectors["vy"][0],
        "vz_AUperDay": vectors["vz"][0],
    }
    return data


@app.get("/api/constants")
def get_constants():
    return {
        "G": G.value,  # m³ kg⁻¹ s⁻²
        "M_sun": M_sun.value,  # kg
        "M_earth": M_earth.value,  # kg
        "AU": au.value,  # m
    }
