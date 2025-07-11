import { useEffect, useRef } from "react"
import { useOrbita } from "../hooks/useOrbita"

export const Capa = () => {
   const { orbitaDados, constantes } = useOrbita()
   const capaRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      if (orbitaDados && constantes) {
         if (capaRef.current) {
            capaRef.current.classList.remove("visible")
            capaRef.current.classList.add("fade-out")
         }
      }
   }, [orbitaDados])

   return (
      <>
         <div ref={capaRef} className="cover visible" />
      </>
   )
}