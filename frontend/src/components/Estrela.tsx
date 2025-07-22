import { useTexture } from "@react-three/drei"
import { AdditiveBlending } from "three"
import type { BuscarEstrela, Constantes } from "../api/types/Api"

export const Estrela: React.FC<{ dadosEstrela: BuscarEstrela, constantes: Constantes }> = ({ dadosEstrela, constantes }) => {
   const { cor, raio } = dadosEstrela
   const glowTexture = useTexture("/textures/glow.png")

   return (
      <group>
         <mesh>
            <sphereGeometry args={[raio / constantes.AU, 32, 32]} />
            <meshStandardMaterial emissive={cor} emissiveIntensity={1} />
         </mesh>

         {/* Halo brilhante */}
         <sprite scale={[
            Math.sqrt(raio / constantes.AU) * 8,
            Math.sqrt(raio / constantes.AU) * 8,
            1]
         }>
            <spriteMaterial
               map={glowTexture}
               color={cor}
               blending={AdditiveBlending}
               transparent
               opacity={0.3}
               depthWrite={false}
            />
         </sprite>
      </group>
   )
}
