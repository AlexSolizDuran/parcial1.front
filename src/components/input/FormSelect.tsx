import React from "react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  containerClassName?: string;
  children: React.ReactNode;
}

const FormSelect = ({ label, name, containerClassName = "", children, ...props }: FormSelectProps) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        {...props}
        className="mt-1 px-2 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {children}
      </select>
    </div>
  );
};

export default FormSelect;