import React from "react";

export const Select: React.FC<
    React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ className = "", children, ...rest }) => {
    return (
        <select
            className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${className}`}
            {...rest}
        >
            {children}
        </select>
    );
};

