import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  containerClassName?: string;
  numericOnly?: boolean; // 👈 Prop para restringir solo números
}

const FormInput = ({
  label,
  name,
  containerClassName = "",
  numericOnly = false,
  ...props
}: FormInputProps) => {
  // Maneja la entrada si numericOnly está activado
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (numericOnly) {
      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""); // elimina todo lo que no sea número
    }
    if (props.onInput) props.onInput(e); // mantiene compatibilidad con onInput externo
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (numericOnly) {
      // solo permitir dígitos, borrar, tab, flechas
      if (
        !/[0-9]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Tab" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight" &&
        e.key !== "Delete"
      ) {
        e.preventDefault();
      }
    }
    if (props.onKeyDown) props.onKeyDown(e); // compatibilidad con onKeyDown externo
  };

  return (
    <div className={containerClassName}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...props}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="mt-1 px-2 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
};

export default FormInput;
