import { toast as sonnerToast } from "sonner";

export const toast = {
    success: (message: string) => {
        sonnerToast.success(message, {
            duration: 3000,
            className: "bg-card border-neon-primary text-neon-primary font-mono",
        });
    },
    error: (message: string) => {
        sonnerToast.error(message, {
            duration: 4000,
            className: "bg-card border-destructive text-destructive font-mono",
        });
    },
    info: (message: string) => {
        sonnerToast.info(message, {
            duration: 3000,
            className: "bg-card border-neon-cyan text-neon-cyan font-mono",
        });
    },
    warning: (message: string) => {
        sonnerToast.warning(message, {
            duration: 3500,
            className: "bg-card border-rank-gold text-rank-gold font-mono",
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
            className: "bg-card border-border text-foreground font-mono",
        });
    },
};
