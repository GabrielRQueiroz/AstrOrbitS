from astropy.constants import M_earth, M_jup, R_earth, R_jup

PLANETAS = {
    # https://nssdc.gsfc.nasa.gov/planetary/factsheet/
    "mercury": {
        "nome": "Mercúrio",
        "naif_id": 199,
        "massa": 0.330e24,
        "raio": 2489.5,
    },
    "venus": {
        "nome": "Vênus",
        "naif_id": 299,
        "massa": 4.87e24,
        "raio": 6052,
    },
    "earth": {
        "nome": "Terra",
        "naif_id": 399,
        "massa": M_earth.value,
        "raio": R_earth.value,
    },
    "moon": {
        "nome": "Lua",
        "naif_id": 301,
        "massa": 0.073e24,
        "raio": 1737.75,
    },
    "mars": {
        "nome": "Marte",
        "naif_id": 499,
        "massa": 0.642e24,
        "raio": 3396,
    },
    "jupiter": {
        "nome": "Júpiter",
        "naif_id": 599,
        "massa": M_jup.value,
        "raio": R_jup.value,
    },
    "saturn": {
        "nome": "Saturno",
        "naif_id": 699,
        "massa": 568e24,
        "raio": 60268,
    },
    "uranus": {
        "nome": "Urano",
        "naif_id": 799,
        "massa": 86.8e24,
        "raio": 25559,
    },
    "neptune": {
        "nome": "Netuno",
        "naif_id": 899,
        "massa": 102e24,
        "raio": 24764,
    },
    "pluto": {
        "nome": "Plutão",
        "naif_id": 999,
        "massa": 0.0130e24,
        "raio": 1188,
    },
}

ESTRELAS = {
    "sun": {
        "nome": "Sol",
        "massa": 1,
        "raio": 1,
        "cor": "yellow",
    },
    "alpha_centauri_a": {
        # https://iopscience.iop.org/article/10.3847/1538-3881/abfaff
        "nome": "Alfa Centauri A",
        "massa": 1.0788,
        "raio": 1.2175,
        "cor": "yellow",
    },
    "alpha_centauri_b": {
        # https://iopscience.iop.org/article/10.3847/1538-3881/abfaff
        "nome": "Alfa Centauri B",
        "massa": 0.9092,
        "raio": 0.8591,
        "cor": "orange",
    },
    "proxima_centauri": {
        # https://www.aanda.org/articles/aa/full_html/2017/02/aa29930-16/aa29930-16.html
        "nome": "Proxima Centauri",
        "massa": 0.1221,
        "raio": 0.1542,
        "cor": "red",
    },
    "barnard_star": {
        # https://iopscience.iop.org/article/10.3847/1538-4357/ac0aea
        "nome": "Estrela de Barnard",
        "massa": 0.161,
        "raio": 0.1542,
        "cor": "red",
    },
    "sirius_a": {
        # https://iopscience.iop.org/article/10.3847/1538-4357/aa6af8#references
        "nome": "Sírius A",
        "massa": 2.063,
        "raio": 1.7144,
        "cor": "blue",
    },
    "epsilon_eri": {
        # https://iopscience.iop.org/article/10.1088/0004-637X/744/2/138
        "nome": "Épsilon Eridani",
        "massa": 0.82,
        "raio": 0.74,
        "cor": "orange",
    },
    "betelgeuse": {
        # https://iopscience.iop.org/article/10.3847/1538-4357/abb8db
        "nome": "Betelgeuse",
        "massa": 17.75,
        "raio": 764,
        "cor": "red",
    },
}
