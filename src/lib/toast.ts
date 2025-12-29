import { toast as sonnerToast } from "sonner";

export const toast = {
    success: (message: string) => {
        sonnerToast.success(message, {
            duration: 3000,
            className: "bg-green-900/90 border-green-500/50 text-green-100",
        });
    },
    error: (message: string) => {
        sonnerToast.error(message, {
            duration: 4000,
            className: "bg-red-900/90 border-red-500/50 text-red-100",
        });
    },
    info: (message: string) => {
        sonnerToast.info(message, {
            duration: 3000,
            className: "bg-blue-900/90 border-blue-500/50 text-blue-100",
        });
    },
    warning: (message: string) => {
        sonnerToast.warning(message, {
            duration: 3500,
            className: "bg-yellow-900/90 border-yellow-500/50 text-yellow-100",
        });
    },
    promise: <T,>(
        promise: Promise<T>,
        {
            loading,
            success,
            error,
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return sonnerToast.promise(promise, {
            loading,
            success,
            error,
            className: "bg-gray-900/90 border-gray-500/50 text-gray-100",
        });
    },
};
