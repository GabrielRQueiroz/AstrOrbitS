import { Html } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from "three"

interface OrbitaMarcadoresProps {
   pos: THREE.Vector3 // posição em metros
   vel: THREE.Vector3 // velocidade em m/s
   constants: {
      G: number // m^3/kg/s^2
      M_sun: number // kg
      AU: number // m
   }
}

export const OrbitaMarcadores = ({ pos, vel, constants }: OrbitaMarcadoresProps) => {
   const { e, a, rPeri, rAfelio, eVec } = useMemo(() => {
      const r = pos.length()
      const v = vel.length()
      const GM = constants.G * constants.M_sun

      const h = new THREE.Vector3().crossVectors(pos, vel)
      const vxh = new THREE.Vector3().crossVectors(vel, h)

      const eVec = vxh.clone().multiplyScalar(1 / GM).sub(pos.clone().multiplyScalar(1 / r))
      const e = eVec.length()

      const energy = (v * v) / 2 - GM / r
      const a = -GM / (2 * energy)

      const rPeri = a * (1 - e)
      const rAfelio = a * (1 + e)

      return { e, a, rPeri, rAfelio, eVec }
   }, [pos, vel, constants])

   const periDir = eVec.clone().normalize()
   const posPeri = periDir.clone().multiplyScalar(rPeri / constants.AU)
   const posAfelio = periDir.clone().multiplyScalar(-rAfelio / constants.AU)

   return (
      <>
         {/* Marcador do Periélio */}
         <mesh position={[posPeri.x, posPeri.y, posPeri.z]}>
            <sphereGeometry args={[0.01, 16, 16]} />
            <meshStandardMaterial color="red" />
         </mesh>

         {/* Marcador do Afélio */}
         <mesh position={[posAfelio.x, posAfelio.y, posAfelio.z]}>
            <sphereGeometry args={[0.01, 16, 16]} />
            <meshStandardMaterial color="blue" />
         </mesh>

         {/* Exibição dos valores */}
         <Html position={[2, 1, 0]} style={{ pointerEvents: "none", color: "white" }}>
            <div style={{ background: "rgba(0,0,0,0.6)", padding: "8px", borderRadius: "8px", maxWidth: 220 }}>
               <p><b>Excentricidade:</b> {e.toFixed(4)}</p>
               <p><b>Semieixo maior (a):</b> {(a / constants.AU).toFixed(4)} AU</p>
               <p><b>Periélio (rₚ):</b> {(rPeri / constants.AU).toFixed(4)} AU</p>
               <p><b>Afélio (rₐ):</b> {(rAfelio / constants.AU).toFixed(4)} AU</p>
            </div>
         </Html>
      </>
   )
}
