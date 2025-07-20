import { Html } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from "three"
import type { BuscarEstrela, Constantes } from "../api/types/Api"

interface OrbitaMarcadoresProps {
   pos: THREE.Vector3 // posição em metros
   vel: THREE.Vector3 // velocidade em m/s
   constantes: Constantes
   dadosEstrela: BuscarEstrela
}

export const OrbitaMarcadores = ({ pos, vel, dadosEstrela, constantes }: OrbitaMarcadoresProps) => {
   const { e, a, rPeri, rAfelio } = useMemo(() => {
      const r = pos.length()
      const v = vel.length()
      const GM = constantes.G * dadosEstrela.massa

      const h = new THREE.Vector3().crossVectors(pos, vel)
      const vxh = new THREE.Vector3().crossVectors(vel, h)

      const eVec = vxh.clone().multiplyScalar(1 / GM).sub(pos.clone().multiplyScalar(1 / r))
      const e = eVec.length()

      const energy = (v * v) / 2 - GM / r
      const a = -GM / (2 * energy)

      const rPeri = a * (1 - e)
      const rAfelio = a * (1 + e)

      return { e, a, rPeri, rAfelio, eVec }
   }, [pos, vel, dadosEstrela, constantes])

   return (
      <>
         {/* Exibição dos valores */}
         <Html position={[2, 1, 0]} style={{ pointerEvents: "none", color: "white" }}>
            <div style={{ background: "rgba(0,0,0,0.6)", padding: "8px", borderRadius: "8px", maxWidth: 220 }}>
               <p><b>Excentricidade:</b> {e.toFixed(4)}</p>
               <p><b>Semieixo maior (a):</b> {(a / constantes.AU).toFixed(4)} AU</p>
               <p><b>Periélio (rₚ):</b> {(rPeri / constantes.AU).toFixed(4)} AU</p>
               <p><b>Afélio (rₐ):</b> {(rAfelio / constantes.AU).toFixed(4)} AU</p>
            </div>
         </Html>
      </>
   )
}
