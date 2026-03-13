export interface GithubStats {
  login: string;
  name: string;
  followers: number;
  repos: number;
  totalStars: number;
  contributions: {
    date: string;
    count: number;
  }[];
  totalContributions: number;
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
}