import {getData} from "$lib/dataHandling.js";

const obj = {
    "budget.income": {

    }
}

export async function load() {
    let userIncome, userSpending;

    await getData('users/{userid}/budget')
        .then((res) => {
            userIncome = res[0];
            userSpending = res[1];
        }).catch(err => console.log(err));

    return { userIncome, userSpending };
}