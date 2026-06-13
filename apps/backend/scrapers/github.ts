import axios from "axios";

export async function scrapeGithub(username: string) {
    const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        }
    );

    return response.data.map((repo: any) => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url
    }));
}