import "../styles/globals.css";
import { Form } from "./components/Form";
import { useState } from "react";
import { Interview } from "./components/Interview";
import { Result } from "./components/Result";
import { Toaster } from "sonner";

export function App() {
  const [page, setPage] = useState<"form" | "interview" | "result">("form"); 

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {page === "form" && <Form />}
      {page === "interview" && <Interview />}
      {page === "result" && <Result />}
      <Toaster position="top-center" />
    </div>
  );
}
export default App;