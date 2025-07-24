import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef, useState } from "react"
import * as THREE from "three"
import type { BuscarEstrela } from "../api/types/Api"

interface ParticulasColisaoProps {
   posicao: THREE.Vector3
   count?: number
   onFinish: () => void
   dadosEstrela: BuscarEstrela
}

const frases = ["💥 BOOM!", "🔥 POW!", "☄️ KRAK!", "💣 BANG!"]

export const ParticulasColisao: React.FC<ParticulasColisaoProps> = ({ posicao, count = 150, onFinish, dadosEstrela }) => {
   const pointosRef = useRef<THREE.Points>(null)
   const textoRef = useRef<HTMLDivElement>(null)
   const [inicio] = useState(() => Date.now())
   const [opacidade, setOpacidade] = useState(1)
   const [frase] = useState(() => frases[Math.floor(Math.random() * frases.length)])

   const { posicoes, velocidades } = useMemo(() => {
      const posicoes = new Float32Array(count * 3)
      const velocidades = new Float32Array(count * 3)

      for (let i = 0; i < count; i++) {
         const i3 = i * 3

         posicoes[i3 + 0] = posicao.x
         posicoes[i3 + 1] = posicao.y
         posicoes[i3 + 2] = posicao.z

         const dir = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
         )
            .normalize()
            .multiplyScalar(Math.random() * 1)

         velocidades[i3 + 0] = dir.x
         velocidades[i3 + 1] = dir.y
         velocidades[i3 + 2] = dir.z
      }

      return { posicoes, velocidades }
   }, [count, posicao])

   useFrame(() => {
      const geometry = pointosRef.current?.geometry
      if (!geometry) return

      const pos = geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
         const i3 = i * 3
         pos[i3 + 0] += velocidades[i3 + 0] * 0.01
         pos[i3 + 1] += velocidades[i3 + 1] * 0.01
         pos[i3 + 2] += velocidades[i3 + 2] * 0.01
      }

      geometry.attributes.position.needsUpdate = true

      const tempoCorrido = (Date.now() - inicio) / 1000
      const _opacidade = Math.max(1 - tempoCorrido / 2, 0)
      setOpacidade(_opacidade)

      if (_opacidade === 0 && onFinish) onFinish()
   })

   return (
      <>
         <points ref={pointosRef}>
            <bufferGeometry>
               <bufferAttribute attach="attributes-position" args={[posicoes, 3]} />
            </bufferGeometry>
            <pointsMaterial
               color={dadosEstrela.cor}
               size={0.05}
               transparent
               opacity={opacidade}
               depthWrite={false}
            />
         </points>

         <Html style={{ pointerEvents: "none" }} position={[posicao.x, posicao.y, posicao.z]}>
            <div
               ref={textoRef}
               style={{
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textShadow: "0 0 8px red",
                  transition: "opacity 0.1s",
                  opacity: opacidade,
               }}
            >
               {frase}
            </div>
         </Html>
      </>
   )
}
