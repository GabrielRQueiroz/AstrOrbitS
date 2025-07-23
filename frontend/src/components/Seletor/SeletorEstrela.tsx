import { useEffect, useState } from "react";
import { useOrbita } from "../../hooks/useOrbita";
import type { Estrelas } from "../../api/types/Api";

export const SelectorEstrela = () => {
   const {listarEstrelas, setEstrela, estrela} = useOrbita()
   const [listaEstrelas, setListaEstrelas] = useState<{ id: string, nome: string }[]>([]);

   useEffect(() => {
      listarEstrelas().then(estrelas => {
         setListaEstrelas(estrelas);
      });
   }, [])
   
   return (
      <div className="selector-estrela">
         <h2>Selecione uma estrela</h2>
         <select  onChange={(e) => setEstrela(e.target.value as Estrelas)} value={estrela}>
            {listaEstrelas.map((estrela) => (
               <option key={estrela.id} value={estrela.id}>
                  {estrela.nome}
               </option>
            ))}
         </select>
      </div>
   );
}