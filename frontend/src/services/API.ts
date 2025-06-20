const BASE_URL = import.meta.env.VITE_BASE_URL;

class API {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getUrl(path: string) {
        return this.baseUrl + path;
    }

    private async request<T>(path: string, options: RequestInit): Promise<T> {
        const response = await fetch(this.getUrl(path), options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Request failed with status ${response.status}`);
        }
        return response.json();
    }

    public create<T>(path: string, body: object): Promise<T> {
        return this.request<T>(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    }

    public read<T>(path: string): Promise<T> {
        return this.request<T>(path, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    }
}

export default new API(BASE_URL);
