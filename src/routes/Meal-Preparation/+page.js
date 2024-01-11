import { getData } from "$lib/dataHandling.js";

export async function load() {
    const apiKey = "6e1f576cb9b8b43309bdbd07e8be9895";
    const appId = "35107b1e";
    const base_url = "https://api.edamam.com/api/recipes/v2";

    try {
        const user = await getData("users/{userid}");

        const params = [`type=public`, `app_key=${apiKey}`, `app_id=${appId}`, `random=true`, `q=chicken`];

        if (user.prefrences) {
            if (Array.isArray(user.prefrences.allergie) && user.prefrences.allergie.length > 0 || Array.isArray(user.prefrences.disliked) && user.prefrences.disliked.length > 0){
                params.pop();
            }

            if (Array.isArray(user.prefrences.disliked) && user.prefrences.disliked.length > 0) {
                user.prefrences.disliked.forEach(disliked => {
                    params.push(`excluded=${encodeURIComponent(disliked.name)}`);
                });
            }

            if (Array.isArray(user.prefrences.allergie) && user.prefrences.allergie.length > 0) {
                user.prefrences.allergie.forEach(allergie => {
                    params.push(`health=${encodeURIComponent(allergie.name)}`);
                });
            }

            if (user.prefrences.maxTime) {
                params.push(`time=${user.prefrences.maxTime}`);
            }
        }

        const url = params.length > 0 ? `${base_url}?${params.join('&')}` : base_url;
        const response = await fetch(url);

        if (response.status === 200) {
            const data = await response.json();
            return { data };
        } else {
            throw new Error("Something went wrong on the API server!");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch data");
    }
}
