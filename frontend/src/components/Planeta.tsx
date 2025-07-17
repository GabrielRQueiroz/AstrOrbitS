import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import type { BuscarEstrela, BuscarPlaneta, Constantes } from "../api/types/Api"
import { OrbitaMarcadores } from "./OrbitaMarcadores"
// import { OrbitaPlano } from "./OrbitaPlano"

const TIME_SCALE = 5000000
const TRAIL_LENGTH = 200
const DAY = 24 * 60 * 60

interface PlanetaProps {
   dadosPlaneta: BuscarPlaneta
   dadosEstrela: BuscarEstrela
   constantes: Constantes
}

export const Planeta = ({ dadosPlaneta, dadosEstrela, constantes }: PlanetaProps) => {
   const meshRef = useRef<THREE.Mesh>(null)
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
      meshRef.current?.position.set(
         pos.current.x / constantes.AU,
         pos.current.y / constantes.AU,
         pos.current.z / constantes.AU
      )
      trailRef.current?.geometry.setDrawRange(0, 0)
   }, [dadosPlaneta, dadosEstrela])

   const rungeKutta = (pos: THREE.Vector3, vel: THREE.Vector3, dt: number) => {
      const acc = (r: THREE.Vector3) => {
         const rLen = r.length()
         return r.clone().multiplyScalar(-constantes.G * dadosEstrela?.massa / (rLen * rLen * rLen))
      }

      const k1v = acc(pos).multiplyScalar(dt)
      const k1x = vel.clone().multiplyScalar(dt)

      const k2v = acc(pos.clone().add(k1x.clone().multiplyScalar(0.5))).multiplyScalar(dt)
      const k2x = vel.clone().add(k1v.clone().multiplyScalar(0.5)).multiplyScalar(dt)

      const k3v = acc(pos.clone().add(k2x.clone().multiplyScalar(0.5))).multiplyScalar(dt)
      const k3x = vel.clone().add(k2v.clone().multiplyScalar(0.5)).multiplyScalar(dt)

      const k4v = acc(pos.clone().add(k3x)).multiplyScalar(dt)
      const k4x = vel.clone().add(k3v).multiplyScalar(dt)

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
      const dt = delta * TIME_SCALE

      const { novaPos, novaVel } = rungeKutta(pos.current, vel.current, dt)
      pos.current = novaPos
      vel.current = novaVel

      // Atualiza posição do planeta
      meshRef?.current?.position.set(
         novaPos.x / constantes.AU,
         novaPos.y / constantes.AU,
         novaPos.z / constantes.AU
      )

      // Adiciona ponto ao trail (em km)
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
   })

   return (
      <>
         <OrbitaMarcadores pos={pos.current} vel={vel.current} dadosEstrela={dadosEstrela} constantes={constantes} />
         {/* <OrbitaPlano pos={pos.current} vel={vel.current} /> */}

         <mesh ref={meshRef}>
            <sphereGeometry args={[10 * dadosPlaneta.raioPlaneta / constantes.AU, 32, 32]} />
            <meshStandardMaterial color="white" />
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
