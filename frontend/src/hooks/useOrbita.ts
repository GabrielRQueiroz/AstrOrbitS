import { useContext } from "react"
import { OrbitaContext } from "../contexts/OrbitaContext"

export const useOrbita = () => {
  return useContext(OrbitaContext)
}