// --- Componente Button.tsx ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
}

const Button3: React.FC<ButtonProps> = ({ children, variant = 'primary', loading = false, className, ...props }) => {
    
    let baseStyles = 'px-4 py-2 rounded-lg font-medium transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed';
    
    if (variant === 'primary') {
        baseStyles += ' bg-blue-600 text-white hover:bg-blue-700';
    } else if (variant === 'danger') {
        baseStyles += ' bg-red-600 text-white hover:bg-red-700';
    } else {
        baseStyles += ' bg-gray-200 text-gray-800 hover:bg-gray-300';
    }

    return (
        <button
            {...props}
            disabled={props.disabled || loading}
            className={`${baseStyles} ${className}`}
        >
            {loading ? 'Cargando...' : children}
        </button>
    );
};

export default Button3;