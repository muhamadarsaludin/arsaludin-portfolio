import { GithubStats } from "@/types/github";

const query = `
  query($login: String!) {
    user(login: $login) {
      login
      name

      # Followers
      followers {
        totalCount
      }

      # Repositories
      repositories(ownerAffiliations: OWNER, first: 100, isFork: false) {
        totalCount,
        nodes {
          name
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
        }
      }

      # Contributions
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
      }
    }
  }
`;

export async function getGithubStats(): Promise<GithubStats> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login: process.env.GITHUB_USERNAME },
    }),
    next: { revalidate: 86400 }, // cache 24 hours
  });

  const json = await res.json();
  const user = json.data.user;

  const contributions =
    user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (week: any) => week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
      }))
    );

  const totalStars = user.repositories.nodes.reduce(
    (acc: number, repo: any) => acc + repo.stargazerCount,
    0
  );

  console.log(user)

  return {
    login: user.login,
    name: user.name,
    followers: user.followers.totalCount,
    repos: user.repositories.totalCount,
    totalStars,
    contributions,
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    totalCommitContributions: user.contributionsCollection.totalCommitContributions,
    totalPullRequestContributions: user.contributionsCollection.totalPullRequestContributions,
    totalIssueContributions: user.contributionsCollection.totalIssueContributions,
  };
}
