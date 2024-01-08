<script>
    export let data;
    import Modal from './Modal.svelte';
    import {getData, setData} from '$lib/dataHandling.js';
    import {arrayUnion} from 'firebase/firestore';

    let showModal1 = false;
    let showModal2 = false;
    let showModal3 = false;
    let showModal4 = false;
    let meals = data.data;
    let user;
    let userMeals;
    let daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    let day = 0;

    getUserData();

    function getUserData(){
        getData("users/{userid}")
            .then((res) => {
                user = res;
            }).catch( err => console.log(err) )
        getData("users/{userid}/meals")
            .then((res) => {
                userMeals = res;
                userMeals.sort((a, b) => a.id - b.id);
            }).catch( err => console.log(err) )
    }

    function changeDay(setDay) {
        if (typeof setDay === 'number') {
            day = setDay;
            console.log(day);
        } else {
            console.error('Invalid day value:', setDay);
        }
    }

    function setPeople(){
        const people = document.getElementById("people").value;
        console.log(people);
        setData("users/{userid}", {"prefrences": {"people": people}})
            .then(() => {
                getUserData();
            });
    }

    function setTime(){
        const time = document.getElementById("time").value;
        console.log(time);
        setData("users/{userid}", {"prefrences": {"maxTime": time}})
            .then(() => {
                getUserData();
            });
    }

    function setPrefrences(){
        const prefrence = document.getElementById("prefrence").value;
        setData("users/{userid}", {"prefrences": {"allergie": arrayUnion({name: prefrence})}})
            .then(() => {
                getUserData();
            });
    }

    function setMeal(meal) {
        meal.recipe['id'] = day;
        setData("users/{userid}/meals/" + daysOfWeek[day], meal.recipe)
            .then(() => {
                getData("users/{userid}/meals")
                    .then((res) => {
                        userMeals = res;
                        userMeals.sort((a, b) => a.id - b.id);
                    }).catch( err => console.log(err) )
            });
    }

    getData("users/{userid}/meals")
        .then((res) => {
            userMeals = res;
        }).catch( err => console.log(err)
    );

</script>

<body>
{#if user}
<button on:click={() => (showModal1  = true)}>prefrences</button>
<button on:click={() => (showModal3  = true)}>groceries</button>
{#if userMeals}
    <div class="card-container">
            {#each userMeals as meal, day}
                <div on:click={() => { showModal2 = true; changeDay(day); }} class="card">
                    {#if meal}
                        <p>{daysOfWeek[meal.id] ? daysOfWeek[meal.id] : "no data"}</p>
                        <p>{meal.label ? meal.label : "no data"}</p>
                        <img src={meal.image ? meal.image : "no data"} alt="Meal Image" />
                        <p>{meal.totalTime ? meal.totalTime : "no data"} minutes to prepare</p>
                        <p>origin: {meal.cuisineType ? meal.cuisineType : "no data"}</p>
                        <p>type: {meal.mealType ? meal.mealType : "no data"}</p>
                    {:else}
                        <p>No meal data available</p>
                    {/if}
                </div>
            {/each}
    </div>
{/if}
<Modal id={1} bind:showModal={showModal1}>
    <h2 slot="header">
        prefrences
    </h2>
    <h2>
        allergies / disliked food
    </h2>
    <form>
        <input id="prefrence"><button on:click={setPrefrences}>submit</button>
        {#if user}
           {#each user.prefrences.allergie as allergie}
                <div>
                    <p>{allergie.name}</p>
                </div>
           {/each}
        {/if}
    </form>
    <h2>
        max time
    </h2>
    <form>
        <input type="number" id="time"><button on:click={setTime}>submit</button>
        {#if user}
            <p>{user.prefrences.maxTime}</p>
        {/if}
    </form>
    <h2>
        amount people
    </h2>
    <form>
        <input type="number" id="people"><button on:click={setPeople}>submit</button>
        {#if user}
            <p>{user.prefrences.people}</p>
        {/if}
    </form>
</Modal>
<Modal id={2} bind:showModal={showModal2}>
    <div class="card-container">
        {#each meals.hits as meal}
            <div on:click={() => setMeal(meal)} class="card">
                <p>{meal.recipe.label}</p>
                <img src={meal.recipe.image} alt="Meal Image" />
                <p>{meal.recipe.totalTime} minutes to prepare</p>
                <p>origin: {meal.recipe.cuisineType}</p>
                <p>type: {meal.recipe.mealType}</p>
            </div>
        {/each}
    </div>
</Modal>
<Modal id={3} bind:showModal={showModal3}>
    <h2 slot="header">
        groceries
    </h2>
    {#if userMeals}
        {#each userMeals as meal}
            {#if meal}
                <p>{meal.label ? meal.label : "no data"}</p>
                {#each meal.ingredientLines as ingredient}
                    {#if ingredient}
                        <p>{ingredient ? ingredient : "no data"}</p>
                        <br>
                    {:else}
                        <p>No ingredient data available</p>
                    {/if}
                {/each}
                <br>
            {:else}
                <p>No meal data available</p>
            {/if}
        {/each}
    {/if}
</Modal>
{/if}
{#if !user}
<h2>please login</h2>
{/if}
</body>

<style>
    .card-container {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .card {
        color: black;
        width: calc(40% - 10px);
        box-sizing: border-box;
        border: 1px solid #ddd;
        padding: 15px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        margin-left: 3%;
        margin-right: 3%;
    }

    .card img {
        max-width: 100%;
        max-height: 100%;
        display: block;
        margin: 0 auto;
    }

    .card p {
        word-wrap: break-word;
        overflow: hidden;
    }

    .card:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

</style>