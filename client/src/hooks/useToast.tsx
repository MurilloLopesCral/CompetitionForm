import { toast } from "react-toastify";

export function useToast() {
    const showToast = (message: string, type: "success" | "error") => {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    };

    return { showToast };
}
