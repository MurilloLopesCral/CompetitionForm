import React from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
    primary:
        "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
    secondary:
        "px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all transform hover:scale-105",
    ghost:
        "px-4 py-2 bg-transparent text-white rounded-lg transition-all"
};

export const Button: React.FC<ButtonProps> = ({
    children,
    className = "",
    variant = "primary",
    ...rest
}) => {
    return (
        <button className={`${variantClasses[variant]} ${className}`} {...rest}>
            {children}
        </button>
    );
};

