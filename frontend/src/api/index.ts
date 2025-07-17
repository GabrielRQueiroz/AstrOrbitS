export const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const endpoints = {
   listarPlanetas: "/api/planetas",
   dadosPlaneta: "/api/planeta/{0}",
   constantes: "/api/constantes",
   listarEstrelas: "/api/estrelas",
   dadosEstrela: "/api/estrela/{0}"
}