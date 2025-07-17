import { createContext, useEffect, useState, type ReactNode } from 'react'
import { apiUrl, endpoints } from '../api'
import { type BuscarEstrela, type BuscarPlaneta, type Constantes, type Estrelas, type ListarEstrelas, type ListarPlanetas, type Planetas } from '../api/types/Api'

export const OrbitaContext = createContext({
   dadosPlaneta: undefined as BuscarPlaneta | undefined,
   dadosEstrela: undefined as BuscarEstrela | undefined,
   setPlaneta: (planeta: Planetas) => { },
   setEstrela: (estrela: Estrelas) => { },
   planeta: 'earth' as Planetas,
   estrela: 'sun' as Estrelas,
   listarPlanetas: () => Promise.resolve([] as { id: string, nome: string }[]),
   listarEstrelas: () => Promise.resolve([] as { id: string, nome: string }[]),
   constantes: undefined as Constantes | undefined
})

export const OrbitaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [planeta, setPlaneta] = useState<Planetas>('earth')
   const [estrela, setEstrela] = useState<Estrelas>('sun')
   const [dadosPlaneta, setDadosPlaneta] = useState<BuscarPlaneta>()
   const [dadosEstrela, setDadosEstrela] = useState<BuscarEstrela>()
   const [constantes, setConstantes] = useState<Constantes>()

   // Busca dados planeta
   useEffect(() => {
      fetch(`${apiUrl}${endpoints.dadosPlaneta.replace('{0}', planeta)}`)
         .then(res => res.json())
         .then(data => setDadosPlaneta(data))
   }, [planeta])

   // Busca dados estrela
   useEffect(() => {
      fetch(`${apiUrl}${endpoints.dadosEstrela.replace('{0}', estrela)}`)
         .then(res => res.json())
         .then(data => setDadosEstrela(data))
   }, [estrela])

   // Busca constantes
   useEffect(() => {
      fetch(`${apiUrl}${endpoints.constantes}`)
         .then(res => res.json())
         .then(data => setConstantes(data))
   }, [])

   const listarPlanetas = () => {
      const res = fetch(`${apiUrl}${endpoints.listarPlanetas}`)
         .then(res => res.json())
         .then((data: ListarPlanetas) => {
            const planetas = Object.entries(data).map(([id, nome]) => ({ id, nome }))
            return planetas
         })
      return res
   }

   const listarEstrelas = () => {
      const res = fetch(`${apiUrl}${endpoints.listarEstrelas}`)
         .then(res => res.json())
         .then((data: ListarEstrelas) => {
            const estrelas = Object.entries(data).map(([id, nome]) => ({ id, nome }))
            return estrelas
         })
      return res
   }

   return (
      <OrbitaContext.Provider value={{ dadosPlaneta, dadosEstrela, setPlaneta, planeta, setEstrela, estrela, listarPlanetas, listarEstrelas, constantes }}>
         {children}
      </OrbitaContext.Provider>
   )
}
