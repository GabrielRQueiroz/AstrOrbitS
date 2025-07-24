import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import * as THREE from "three"
import type { BuscarEstrela, BuscarPlaneta, Constantes } from "../api/types/Api"
import { OrbitaMarcadores } from "./OrbitaMarcadores"
import { ParticulasColisao } from "./ParticulasColisao"
// import { OrbitaPlano } from "./OrbitaPlano"

const TRAIL_LENGTH = 200
const DAY = 24 * 60 * 60

interface PlanetaProps {
   dadosPlaneta: BuscarPlaneta
   dadosEstrela: BuscarEstrela
   escalaTemporal: number
   constantes: Constantes
}

export const Planeta: React.FC<PlanetaProps> = ({ dadosPlaneta, dadosEstrela, escalaTemporal, constantes }) => {
   const [ativo, setAtivo] = useState<boolean>(true)
   const planetaRef = useRef<THREE.Mesh>(null)
   const trailRef = useRef<THREE.Line>(null)
   const trailPoints = useRef<THREE.Vector3[]>([])

   const pos = useRef(
      new THREE.Vector3( // AU -> m
         dadosPlaneta.x_AU * constantes.AU,
         dadosPlaneta.y_AU * constantes.AU,
         dadosPlaneta.z_AU * constantes.AU
      )
   )

   const vel = useRef(
      new THREE.Vector3( // AU/dia -> m/s
         dadosPlaneta.vx_AUperDay * constantes.AU / DAY,
         dadosPlaneta.vy_AUperDay * constantes.AU / DAY,
         dadosPlaneta.vz_AUperDay * constantes.AU / DAY
      )
   )

   useEffect(() => {
      setAtivo(true)
   }, [dadosPlaneta])

   useEffect(() => {
      pos.current = new THREE.Vector3(
         dadosPlaneta.x_AU * constantes.AU,
         dadosPlaneta.y_AU * constantes.AU,
         dadosPlaneta.z_AU * constantes.AU
      )
      vel.current = new THREE.Vector3(
         dadosPlaneta.vx_AUperDay * constantes.AU / DAY,
         dadosPlaneta.vy_AUperDay * constantes.AU / DAY,
         dadosPlaneta.vz_AUperDay * constantes.AU / DAY
      )
      trailPoints.current = []
      trailRef.current?.geometry.setDrawRange(0, 0)
   }, [dadosPlaneta, dadosEstrela])

   const rungeKutta = (pos: THREE.Vector3, vel: THREE.Vector3, h: number) => {
      const acc = (r: THREE.Vector3) => {
         const rLen = r.length()
         return r.clone().multiplyScalar(-constantes.G * dadosEstrela?.massa / (rLen ** 3))
      }

      const k1v = acc(pos).multiplyScalar(h)
      const k1x = vel.clone().multiplyScalar(h)

      const k2v = acc(pos.clone().add(k1x.clone().multiplyScalar(0.5))).multiplyScalar(h)
      const k2x = vel.clone().add(k1v.clone().multiplyScalar(0.5)).multiplyScalar(h)

      const k3v = acc(pos.clone().add(k2x.clone().multiplyScalar(0.5))).multiplyScalar(h)
      const k3x = vel.clone().add(k2v.clone().multiplyScalar(0.5)).multiplyScalar(h)

      const k4v = acc(pos.clone().add(k3x)).multiplyScalar(h)
      const k4x = vel.clone().add(k3v).multiplyScalar(h)

      const novaVel = vel.clone().add(
         k1v.clone().add(k2v.clone().multiplyScalar(2)).add(k3v.clone().multiplyScalar(2)).add(k4v).multiplyScalar(1 / 6)
      )

      const novaPos = pos.clone().add(
         k1x.clone().add(k2x.clone().multiplyScalar(2)).add(k3x.clone().multiplyScalar(2)).add(k4x).multiplyScalar(1 / 6)
      )

      return { novaPos, novaVel }
   }

   const trailGeometry = useMemo(() => new THREE.BufferGeometry(), [])

   useFrame((_, delta) => {
      if (!ativo || !planetaRef.current || delta > 0.01) return

      const h = delta * escalaTemporal

      const { novaPos, novaVel } = rungeKutta(pos.current, vel.current, h)
      console.table({
         delta: delta.toFixed(2),
         posicao: novaPos,
         velocidade: novaVel
      })

      pos.current = novaPos
      vel.current = novaVel

      // Atualiza posição do planeta
      planetaRef?.current?.position.set(
         novaPos.x / constantes.AU,
         novaPos.y / constantes.AU,
         novaPos.z / constantes.AU
      )

      // Adiciona ponto ao trail
      trailPoints.current.push(novaPos.clone().divideScalar(constantes.AU))
      if (trailPoints.current.length > TRAIL_LENGTH) {
         trailPoints.current.shift()
      }

      // Atualiza BufferGeometry
      const positions = new Float32Array(trailPoints.current.length * 3)
      trailPoints.current.forEach((p, i) => {
         positions[i * 3] = p.x
         positions[i * 3 + 1] = p.y
         positions[i * 3 + 2] = p.z
      })

      trailGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      trailGeometry.setDrawRange(0, trailPoints.current.length)
      trailGeometry.computeBoundingSphere()

      const distanciaAU = planetaRef?.current?.position.length() // Distância da origem (estrela)

      // Verificação de colisão
      if (distanciaAU <= dadosEstrela.raio / constantes.AU) {
         toast("Colisão detectada! Planeta removido.", {
            icon: "💥",
            position: "bottom-right",
            id: `colisao-${dadosPlaneta.idPlaneta}`,
         })
         setAtivo(false)
      }
   })

   if (!ativo && planetaRef.current) {
      return <ParticulasColisao posicao={planetaRef.current?.position.clone()} dadosEstrela={dadosEstrela} onFinish={() => {
         setAtivo(false)
         trailPoints.current = []
         trailRef.current?.geometry.setDrawRange(0, 0)
      }} />
   }
   else if (!ativo) return null

   return (
      <>
         <OrbitaMarcadores pos={pos.current.clone()} vel={vel.current.clone()} dadosEstrela={dadosEstrela} constantes={constantes} />
         {/* <OrbitaPlano pos={pos.current} vel={vel.current} /> */}

         <mesh ref={planetaRef}>
            <sphereGeometry args={[dadosPlaneta.raioPlaneta / constantes.AU, 32, 32]} />
            <meshStandardMaterial color="white" />
            <Html style={{pointerEvents: "none"}} position={[0.1, 0.1, 0.1]}>
               <div style={{ borderRadius: "0.5rem", color: "white", background: "rgba(0,0,0,0.6)", padding: "0.5rem" }}>
                  {dadosPlaneta.nomePlaneta}
               </div>
            </Html>
         </mesh>

         {/* @ts-ignore */}
         <line ref={trailRef} geometry={trailGeometry}>
            <lineBasicMaterial
               vertexColors={false}
               transparent
               opacity={0.8}
               color={"white"}
            />
         </line>
      </>
   )
}
