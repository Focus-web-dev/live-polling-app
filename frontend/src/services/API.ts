const BASE_URL = import.meta.env.VITE_BASE_URL;

class API {
    private baseUrl;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getUrl(path: string) {
        return this.baseUrl + path;
    }

    public async create(path: string, body: BodyInit) {
        console.log(this.baseUrl);

        const requestUrl = this.getUrl(path);

        const requestOptions: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        };

        const response = await fetch(requestUrl, requestOptions);

        if (!response.ok) {
            throw new Error("API: create failed");
        }

        return response.json();
    }

    public read() {}

    public update() {}

    public delete() {}
}

export default new API(BASE_URL);
