export class LangflowClient {
    private baseURL: string = 'http://localhost:3000'; // Proxy server URL

    async post(endpoint: string, body: any, headers: Record<string, string> = { 'Content-Type': 'application/json' }) {
        const url = `${this.baseURL}/proxy`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint, body }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`${response.status} ${response.statusText} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Request Error:', error.message || error);
            throw error;
        }
    }
}
