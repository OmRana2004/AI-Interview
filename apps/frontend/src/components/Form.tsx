import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { useNavigate } from "react-router";

export function Form() {
  const [github, setGithub] = useState("");
  const  [loading, setLoading] = useState(false)
  const navigate = useNavigate();


 async function onSubmit() {
    if (!github) {
      toast("Please fill in both fields");
      return;
    }

    setLoading(true);

    const res = await axios.post(`${BACKEND_URL}/api/v1/pre-interview`,{
        github
    })

    navigate(`/interview/${res.data.id}`)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Ai Interview Kickstart
        </h2>
        <div className="p-2">
          <Input
            placeholder="Github URL"
            onChange={(e) => setGithub(e.target.value)}
          />
        </div>
        <div className="flex justify-center p-4">
          <Button disabled={loading} onClick={onSubmit}>{loading ? "Starting Interview..." : " Start Interview "}</Button>
        </div>
      </div>
    </div>
  );
}

export default Form;
