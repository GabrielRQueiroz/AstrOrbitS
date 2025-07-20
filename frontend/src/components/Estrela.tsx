import type { BuscarEstrela, Constantes } from "../api/types/Api"

export const Estrela: React.FC<{ dadosEstrela: BuscarEstrela, constantes: Constantes }> = ({ dadosEstrela, constantes }) => {
   const { cor, raio } = dadosEstrela

   return (
      <mesh>
         <sphereGeometry args={[raio / constantes.AU, 32, 32]} />
         <meshStandardMaterial emissive={cor} emissiveIntensity={1} />
      </mesh>
   )
}
