import { useEffect, useLayoutEffect, useRef } from "react"
import imgUrl from "../assets/AOS.png"
import { useOrbita } from "../hooks/useOrbita"

export const Capa = () => {
   const { dadosPlaneta, dadosEstrela, constantes } = useOrbita()
   const capaRef = useRef<HTMLDivElement>(null)

   useLayoutEffect(() => {
      if (capaRef.current) capaRef.current.style.backgroundImage = `url("${imgUrl}")`
   }, [capaRef])

   useEffect(() => {
      if (dadosPlaneta && dadosEstrela && constantes) {
         if (capaRef.current) {
            capaRef.current.classList.remove("visible")
            capaRef.current.classList.add("fade-out")
         }
      }
   }, [dadosPlaneta, dadosEstrela, constantes])

   return (
      <>
         <div ref={capaRef} className="cover visible" />
      </>
   )
}