export class ApiService {
    constructor(apiKey) {
        this._API_KEY = apiKey;
    }

    async getProfileInfo(id) {
        const url = `https://api.torn.com/user/${id}?selections=profile,personalstats,crimes&key=${this._API_KEY}`;

        try {
            const response = await fetch(url);
            const jsonResponse = JSON.parse(await response.text());

            return !('error' in jsonResponse)
                ? jsonResponse
                : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}