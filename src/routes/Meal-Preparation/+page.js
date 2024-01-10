import {getData} from "$lib/dataHandling.js";

export async function load() {
    const apiKey = "6e1f576cb9b8b43309bdbd07e8be9895";
    const appId = "35107b1e";
    const base_url = "https://api.edamam.com/api/recipes/v2";
    let user;
    await getData("users/{userid}")
        .then((res) => {
            user = res;
        }).catch( err => console.log(err) );

    const params = [`type=public`, `app_key=${apiKey}`, `app_id=${appId}`, `random=true`, `q=chicken`];
    if (user.prefrences.disliked || user.prefrences.allergie){
        params.pop();
    }
    if (user.prefrences.disliked) {
        user.prefrences.disliked.forEach(allergen => {
            params.push(`excluded=${encodeURIComponent(allergen.name)}`);
        });
    }
    if (user.prefrences.allergie) {
        user.prefrences.allergie.forEach(allergen => {
            params.push(`health=${encodeURIComponent(allergen.name)}`);
        });
    }
    if (user.prefrences.maxTime) {
        params.push(`time=${user.prefrences.maxTime}`);
    }

    try {
        const url = params.length > 0 ? `${base_url}?${params.join('&')}` : base_url;
        console.log(url);

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
