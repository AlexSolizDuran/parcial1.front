import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


function SuccessMessage() {
  const searchParams = useSearchParams();
  const isCreated = searchParams.get("created") === "true";
  const isDeleted = searchParams.get("deleted") === "true";
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isCreated || isDeleted) {
      setMessage(isCreated ? "La persona ha sido creada correctamente." : "La persona ha sido eliminada correctamente.");
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000); // El mensaje desaparecerá después de 5 segundos

      // Limpia el temporizador si el componente se desmonta
      return () => clearTimeout(timer);
    }
  }, [isCreated, isDeleted]);

  if (!showSuccess) {
    return null;
  }

  return (
    <div className="fixed top-20 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg animate-bounce z-50" role="alert">
      <p className="font-bold">¡Éxito!</p>
      <p>{message}</p>
    </div>
  );
}

export default SuccessMessage;