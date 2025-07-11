import * as THREE from "three"

interface OrbitaPlanoProps {
   pos: THREE.Vector3,
   vel: THREE.Vector3,
   size?: number,
   divisions?: number
}

export const OrbitaPlano = ({ pos, vel, size = 200, divisions = 25 }: OrbitaPlanoProps) => {
   // Momento angular
   const h = new THREE.Vector3().crossVectors(pos, vel)
   const normal = h.clone().normalize()
   const normalUnitario = new THREE.Vector3(0, 1, 0)
   const quaternion = new THREE.Quaternion().setFromUnitVectors(normalUnitario, normal)

   return (
      <group quaternion={quaternion}>
         <gridHelper
            args={[size, divisions, "gray", "gray"]}
         />
      </group>
   )
}
