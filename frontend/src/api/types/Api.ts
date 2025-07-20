
export interface ListarPlanetas extends Record<string, string> { }

export interface ListarEstrelas extends Record<string, string> { }

export type Planetas =
   "mercury" |
   "venus" |
   "earth" |
   // "moon" |
   "mars" |
   "jupiter" |
   "saturn" |
   "uranus" |
   "neptune" |
   "pluto"

export type Estrelas =
   "sun" |
   "alpha_centauri_a" |
   "alpha_centauri_b" |
   "proxima_centauri" |
   "barnard_star" |
   "sirius_a" |
   "epsilon_eri" |
   "betelgeuse"

export interface BuscarPlaneta {
   idPlaneta: string
   nomePlaneta: string
   massaPlaneta: number
   raioPlaneta: number
   x_AU: number
   y_AU: number
   z_AU: number
   vx_AUperDay: number
   vy_AUperDay: number
   vz_AUperDay: number
}

export interface BuscarEstrela {
   nome: string
   massa: number
   raio: number
   cor: string
}

export interface Constantes {
   AU: number
   G: number
   M_sol: number
   R_sol: number
}