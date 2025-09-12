import React from "react";

export const TextInput: React.FC<
    React.InputHTMLAttributes<HTMLInputElement>
> = ({ className = "", ...rest }) => {
    return (
        <input
            className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${className}`}
            {...rest}
        />
    );
};

