import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useOrbita } from '../hooks/useOrbita'
import { Estrela } from './Estrela'
import { Planeta } from './Planeta'

export const OrbitaCanvas = () => {
   const { dadosEstrela, dadosPlaneta, constantes } = useOrbita()

   if (!dadosEstrela || !dadosPlaneta || !constantes) {
      return <p>Carregando dados da simulação...</p>
   }

   return (
      <Canvas className="canvas" dpr={Math.min(window.devicePixelRatio, 2)} camera={{ position: [3, 3, 3], fov: 45 }}>
         <ambientLight intensity={0.5} />
         <pointLight position={[0, 0, 0]} intensity={2} />

         <Suspense fallback={null}>
            <Estrela dadosEstrela={dadosEstrela} constantes={constantes} />
            <Planeta dadosEstrela={dadosEstrela} dadosPlaneta={dadosPlaneta} constantes={constantes} />
            <OrbitControls maxDistance={dadosEstrela.raio / constantes.R_sol * 10} minDistance={dadosEstrela.raio / constantes.R_sol / 2} />
         </Suspense>
         <Stars count={500} />
      </Canvas>
   )
}
