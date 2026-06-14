import express from "express";
import { PreInterviewBody } from "./types";
import { scrapeGithub } from "./scrapers/github";
import cors from "cors";
import { prisma } from "./db";
import { ai } from "./gemini";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.text({ type: ["application/sdp", "text/plain"]}))

app.post("/api/v1/pre-interview", async (req, res) => {
  const { success, data } = PreInterviewBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect body",
    });
    return
  }

  const githubUrl = data.github.endsWith("/")
    ? data.github.slice(0, -1)
    : data.github;

  const githubUsername = githubUrl.split("/").pop()!;

  try {
    const githubData = await scrapeGithub(githubUsername);

    const interview = await prisma.interview.create({
      data: {
        githubMetadata: JSON.stringify(githubData),
        status: "Pre",
      },
    });

    return res.json({
      id: interview.id,
      github: githubData,
    });
  } catch (error: any) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "GitHub user not found",
      });
    }
}
})

    app.post("/api/v1/session", async (req, res) => {
    
    const sessionConfig = JSON.stringify({
        type: "realtime",
        model: "gpt-realtime",
        audio: { output: { voice: "marin" } },
    });

        const fd = new FormData();
    fd.set("sdp", req.body);
    fd.set("session", sessionConfig);
  
    try {
      const r = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
          "OpenAI-Safety-Identifier": "hashed-user-id",
        },
        body: fd,
      });

      const sdp = await r.text();
      res.send(sdp);
    } catch (error) {
        console.error("Token generation error:", error);
        res.status(500).json({ error: "Faild to generate token" });
    }
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
