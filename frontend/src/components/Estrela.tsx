import type { BuscarEstrela, Constantes } from "../api/types/Api"

export const Estrela = ({ dadosEstrela, constantes }: { dadosEstrela: BuscarEstrela, constantes: Constantes }) => {
   const { cor, raio } = dadosEstrela

   return (
      <mesh>
         <sphereGeometry args={[raio / constantes.AU, 32, 32]} />
         <meshStandardMaterial emissive={cor} emissiveIntensity={1} />
      </mesh>
   )
}
