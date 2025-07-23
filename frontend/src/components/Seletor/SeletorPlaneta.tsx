import { useEffect, useState } from "react";
import type { Planetas } from "../../api/types/Api";
import { useOrbita } from "../../hooks/useOrbita";

export const SelectorPlaneta = () => {
   const { listarPlanetas, setPlaneta, planeta } = useOrbita()
   const [listaPlanetas, setListaPlanetas] = useState<{ id: string, nome: string }[]>([]);

   useEffect(() => {
      listarPlanetas().then(planetas => {
         setListaPlanetas(planetas);
      });
   }, [])

   return (
      <div className="selector-planeta">
         <h2>Selecione um planeta</h2>
         <select onChange={(e) => setPlaneta(e.target.value as Planetas)} value={planeta}>
            {listaPlanetas.map((planeta) => (
               <option key={planeta.id} value={planeta.id}>
                  {planeta.nome}
               </option>
            ))}
         </select>
      </div>
   );
}