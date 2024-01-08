import { MEAL_API_KEY, MEAL_APP_ID } from "$env/static/public"

export async function httpRequestMeal() {
    try {
        const apiKey = MEAL_API_KEY;
        const appId = MEAL_APP_ID;
        const base_url = "https://api.edamam.com/api/recipes/v2";
        const param = ['type=public', 'app_key=' + apiKey, 'app_id=' + appId, 'q=chicken', 'random=true']
        let url = param.length > 0 ? `${base_url}?${param.join('&')}` : base_url;

        const response = await fetch(url);

        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("Something went wrong on the API server!");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch data");
    }
}