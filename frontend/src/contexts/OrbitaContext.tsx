import { createContext, useEffect, useState, type ReactNode } from 'react'
import { apiUrl } from '../api'

export const OrbitaContext = createContext({
   orbitaDados: null,
   constantes: null,
})

export const OrbitaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [orbitData, setOrbitData] = useState(null)
   const [constants, setConstants] = useState(null)

   // Busca dados orbitais
   useEffect(() => {
      fetch(`${apiUrl}/api/orbit-data?body=Earth`)
         .then(res => res.json())
         .then(data => setOrbitData(data))
   }, [])

   // Busca constantes
   useEffect(() => {
      fetch(`${apiUrl}/api/constants`)
         .then(res => res.json())
         .then(data => setConstants(data))
   }, [])

   return (
      <OrbitaContext.Provider value={{ orbitaDados: orbitData, constantes: constants }}>
         {children}
      </OrbitaContext.Provider>
   )
}
