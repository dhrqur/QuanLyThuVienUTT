import { Toaster } from "sonner";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        closeButton
        position="top-right"
        richColors
        toastOptions={{
          duration: 2600,
          classNames: {
            toast: "rounded-xl border-slate-200 shadow-lg",
            title: "font-bold",
            description: "text-sm",
          },
        }}
      />
    </>
  );
}

export default App;
