export interface GitHubIssue {
    number: number;
    title: string;
    body: string;
    created_at: string;
    labels: { name: string }[];
    user: { login: string };
}

export interface Article {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: string;
}
