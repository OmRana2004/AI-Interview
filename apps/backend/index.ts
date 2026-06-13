import express from "express";
import { PreInterviewBody } from "./types";
import { scrapeGithub } from "./scrapers/github";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/v1/pre-interview", async (req, res) => {
    const { success, data } = PreInterviewBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Incorrect body"
        });
    }

    const githubUrl = data.github.endsWith("/")
        ? data.github.slice(0, -1)
        : data.github;

    const githubUsername = githubUrl.split("/").pop()!;

    try {
  const githubData = await scrapeGithub(githubUsername);

  return res.json({
    github: githubData
  });
} catch (error: any) {
  if (error.response?.status === 404) {
    return res.status(404).json({
      message: "GitHub user not found"
    });
  }

  return res.status(500).json({
    message: "Something went wrong"
  });
}
});

app.listen(3001, () => {
    console.log("Server listening on port 3001");
});