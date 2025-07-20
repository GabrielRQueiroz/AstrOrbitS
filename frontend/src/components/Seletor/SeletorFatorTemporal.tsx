import { useOrbita } from "../../hooks/useOrbita";

export const SelectorFatorTemporal = () => {
   const { acelerarSimulacao, desacelerarSimulacao, escalaTemporal } = useOrbita()

   const handleAcelerar = () => {
      acelerarSimulacao();
   };

   const handleDesacelerar = () => {
      desacelerarSimulacao();
   }

   return (
      <div className="selector-fator-temporal">
         <button
            disabled={escalaTemporal / 5000000 >= 8}
            onClick={handleAcelerar}>
            Acelerar
         </button>
         <button
            disabled={escalaTemporal / 5000000 <= 1}
            onClick={handleDesacelerar}>Desacelerar</button>
      </div>
   );
}