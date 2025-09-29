import React, { useState } from "react";

interface DeleteButtonProps {
  onDelete: () => Promise<void>; // Función que realiza la eliminación
  label?: string;
  icon?: React.ReactNode;
  
}

const ButtonDelete: React.FC<DeleteButtonProps> = ({
  onDelete,
  label = "Eliminar",
  icon,
  
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className="inline-flex items-center px-4 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Eliminando..." : <>{icon} {label}</>}
    </button>
  );
};

export default ButtonDelete;
