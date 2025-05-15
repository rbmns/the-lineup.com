
// Re-export from the correct location
import { useToast as useToastOriginal } from "@/components/ui/toast";

export const useToast = useToastOriginal;

// Re-export the toast function as well
export { toast } from "@/components/ui/toast";
