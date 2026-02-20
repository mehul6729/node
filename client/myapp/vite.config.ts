import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: true, // Allows access from your phone
    port: 5000, // Optional: Change port to 3000 like CRA
  },
})



// export default defineConfig({
//   plugins: [react()],
//   base: "./", // Ensures relative paths work in Tomcat
//   resolve: {
//     alias: {
//       api: path.resolve(__dirname, "src/api"),
//       assets: path.resolve(__dirname, "src/assets"),
//       components: path.resolve(__dirname, "src/components"),
//       hooks: path.resolve(__dirname, "src/hooks"),
//       pages: path.resolve(__dirname, "src/pages"),
//       state: path.resolve(__dirname, "src/state"),
//       utility: path.resolve(__dirname, "src/utility"),
//     },
//   },
//   server: {
//     host: true, // Allows access from your phone
//     port: 3000, // Optional: Change port to 3000 like CRA
//   },
//   define: {
//     "process.env": {}, // ✅ Fix for "process is not defined"
//   },
// });
