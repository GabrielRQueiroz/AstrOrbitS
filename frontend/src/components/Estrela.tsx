export const Estrela = () => {
   return (
      <mesh>
         <sphereGeometry args={[0.1, 32, 32]} />
         <meshStandardMaterial emissive="yellow" emissiveIntensity={1} />
      </mesh>
   )
}
