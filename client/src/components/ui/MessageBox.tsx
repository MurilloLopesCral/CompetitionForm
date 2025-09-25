import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import React from "react";

type MessageType = "error" | "warning" | "info" | "success";

interface MessageBoxProps {
    type?: MessageType;
    message: string;
}

const iconMap = {
    error: <XCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />
};

const styleMap = {
    error: "bg-red-500/10 border-red-500 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500 text-yellow-400",
    info: "bg-blue-500/10 border-blue-500 text-blue-400",
    success: "bg-green-500/10 border-green-500 text-green-400"
};

export const MessageBox: React.FC<MessageBoxProps> = ({
    type = "info",
    message
}) => {
    return (
        <div
            className={`flex items-center space-x-2 border px-4 py-2 rounded-lg text-sm ${styleMap[type]}`}
        >
            {iconMap[type]}
            <span>{message}</span>
        </div>
    );
};
