import React from "react";

interface ToggleSwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isOn: boolean;
    size?: "sm" | "md";
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    isOn,
    size = "md",
    className = "",
    ...rest
}) => {
    const dims = size === "sm" ? { h: "h-6", w: "w-10", knob: "h-4 w-4", on: "translate-x-5", off: "translate-x-1" } : { h: "h-8", w: "w-14", knob: "h-6 w-6", on: "translate-x-7", off: "translate-x-1" };
    return (
        <button
            className={`relative inline-flex ${dims.h} ${dims.w} items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${isOn ? "bg-blue-600" : "bg-slate-600"} ${className}`}
            {...rest}
        >
            <span
                className={`inline-block ${dims.knob} transform rounded-full bg-white transition-transform ${isOn ? dims.on : dims.off}`}
            />
        </button>
    );
};

