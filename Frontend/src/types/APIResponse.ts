import axios from "axios";
import { toast } from "sonner";

export const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Something went wrong!";
        toast.error(errorMessage);  
    } else {
        toast.error("An unexpected error occurred.");
    }
};