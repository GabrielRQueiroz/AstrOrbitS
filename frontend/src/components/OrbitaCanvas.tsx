import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useOrbita } from '../hooks/useOrbita'
import { Planeta } from './Planeta'
import { Estrela } from './Estrela'

export const OrbitaCanvas = () => {
   const { orbitaDados, constantes } = useOrbita()

   if (!orbitaDados || !constantes) {
      return <p>Carregando dados da simulação...</p>
   }

   return (
      <Canvas className="canvas" dpr={Math.min(window.devicePixelRatio, 2)} camera={{ position: [3, 3, 3], fov: 45 }}>
         <ambientLight intensity={0.5} />
         <pointLight position={[0, 0, 0]} intensity={2} />

         <Suspense fallback={null}>
            <Estrela />
            <Planeta orbitaDados={orbitaDados} constantes={constantes} />
         </Suspense>

         <OrbitControls maxDistance={8} minDistance={1} />
         <Stars count={2000} />
      </Canvas>
   )
}
