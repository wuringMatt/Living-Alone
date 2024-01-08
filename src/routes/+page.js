import { getAuthentication } from "$lib/dataHandling";

export async function load(){
    const auth = getAuthentication()
    return { auth }
}