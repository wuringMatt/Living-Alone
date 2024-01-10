<script>
    export let data;
    import Modal from './Modal.svelte';
    import {deleteData, getData, setData} from '$lib/dataHandling.js';
    import {arrayUnion} from 'firebase/firestore';
    import TitleBar from '$lib/components/titleBar.svelte';

    let showModal1 = false;
    let showModal2 = false;
    let showModal3 = false;
    let showModal4 = false;
    let meals = data.data;
    let user;
    let userMeals;
    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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

    function setDisliked(){
        const disliked = document.getElementById("disliked").value;
        disliked.trim();
        setData("users/{userid}", {"prefrences": {"disliked": arrayUnion({name: disliked})}})
            .then(() => {
                getUserData();
            });
    }

    // function deleteDisliked(id) {
    //     deleteData("users/{userid}", {"prefrences": {"disliked"}})
    //         .then(() => {
    //             getUserData();
    //         });
    // }

    function setAllergie(){
        const allergie = document.getElementById("allergie").value;
        allergie.trim();
        setData("users/{userid}", {"prefrences": {"allergie": arrayUnion({name: allergie})}})
            .then(() => {
                getUserData();
            });
    }

    // function deleteAllergie(id) {
    //
    // }

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

    function clear(){
        deleteData("users/{userid}/meals/" + daysOfWeek[day])
            .then(() => {
                setData("users/{userid}/meals/" + daysOfWeek[day], {id: day})
                    .then(() => {
                        getData("users/{userid}/meals")
                            .then((res) => {
                                userMeals = res;
                                userMeals.sort((a, b) => a.id - b.id);
                            }).catch( err => console.log(err) )
                    })
            })
    }

</script>


<TitleBar title="Meal Prep"/>
<body>
{#if user}
<button on:click={() => (showModal1  = true)}>prefrences</button>
<button on:click={() => (showModal3  = true)}>groceries</button>
{#if userMeals}
    <div class="card-container">
            {#each userMeals as meal, day}
                <div class="card">
                    <div on:click={() => {changeDay(day); showModal2 = true;}}>
                        <p>change</p>
                    </div>
                    <div on:click={() => {changeDay(day); clear();}}>
                        <p>clear</p>
                    </div>
                <div on:click={() =>  {changeDay(day); showModal4 = true;}}>
                    {#if meal.label}
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
                </div>
            {/each}
    </div>
{/if}
<Modal id={1} bind:showModal={showModal1}>
    <h2 slot="header">
        prefrences
    </h2>
    <h2>
        allergies
    </h2>
    <form>
        <select id="allergie" name="allergie">
            <option value="alcohol-cocktail">alcohol-cocktail</option>
            <option value=" alcohol-free ">alcohol-free</option>
            <option value="celery-free">celery-free</option>
            <option value="crustacean-free">crustacean-free</option>
            <option value="dairy-free">dairy-free</option>
            <option value="DASH">DASH</option>
            <option value="egg-free">egg-free</option>
            <option value="fish-free">fish-free</option>
            <option value="fodmap-free">fodmap-free</option>
            <option value="gluten-free">gluten-free</option>
            <option value="immuno-supportive">immuno-supportive</option>
            <option value="keto-friendly">keto-friendly</option>
            <option value="kidney-friendly">kidney-friendly</option>
            <option value="kosher">kosher</option>
            <option value="low-potassium">low-potassium</option>
            <option value="low-sugar">low-sugar</option>
            <option value="lupine-free">lupine-free</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="mollusk-free">mollusk-free</option>
            <option value="mustard-free">mustard-free</option>
            <option value="No-oil-added">No-oil-added</option>
            <option value="paleo">paleo</option>
            <option value="peanut-free">peanut-free</option>
            <option value="pecatarian">pecatarian</option>
            <option value="pork-free">pork-free</option>
            <option value="red-meat-free">red-meat-free</option>
            <option value="sesame-free">sesame-free</option>
            <option value="shellfish-free">shellfish-free</option>
            <option value="soy-free">soy-free</option>
            <option value="sugar-conscious">sugar-conscious</option>
            <option value="sulfite-free">sulfite-free</option>
            <option value="tree-nut-free">tree-nut-free</option>
            <option value="vegan">vegan</option>
            <option value="vegetarian">vegetarian</option>
            <option value="wheat-free">wheat-free</option>
        </select>
        <br><br>
        <button on:click={setAllergie}>submit</button>
        {#if user.prefrences.allergie}
            {#each user.prefrences.allergie as allergie}
                <div>
                    <p>{allergie.name}</p>
<!--                    <button on:click={deleteAllergie(id)}>delete</button>-->
                </div>
            {/each}
        {/if}
    </form>
    <h2>
        disliked food
    </h2>
    <form>
        <input id="disliked"><button on:click={setDisliked}>submit</button>
        {#if user.prefrences.disliked}
            {#each user.prefrences.disliked as disliked}
                <div>
                    <p>{disliked.name}</p>
<!--                    <button on:click={deleteDisliked(id)}>delete</button>-->
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
    <h2 slot="header">
        change meal
    </h2>
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
            {#if meal.ingredientLines }
                <p>{meal.label ? meal.label : "no data"}</p>
                {#each meal.ingredientLines as ingredient}
                    {#if ingredient}
                        <br>
                        <p>{ingredient ? ingredient : "no data"}</p>
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
<Modal id={4} bind:showModal={showModal4}>
    <h2 slot="header">
        how to make this recipe
    </h2>
    {#if userMeals}
        <p>{userMeals[day].label ? userMeals[day].label : "no data"}</p>
        {#if userMeals[day].instructionLines}
        {#each userMeals[day].instructionLines as instruction}
            <br>
            <p>{instruction ? instruction : "no data"}</p>
        {/each}
        {:else}
            <p>This recipe does not have a instruction</p>
        {/if}
        <br>
    {:else}
        <p>No meal data available</p>
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