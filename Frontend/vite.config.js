import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    // define: {
    //     "process.env": {
    //         VITE_BACKEND_API: JSON.stringify(import.meta.env.VITE_BACKEND_API),
    //     },
    // },
    plugins: [react()],
});
