<script>
import TitleBar from "$lib/components/titleBar.svelte";
import Card from "./card.svelte";
import {getData} from "$lib/dataHandling.js";
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "$lib/firebaseConfig.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

$: filteredEvents = [];
$: eventsCityList = [];

getData('users/{userid}/events')
    .then((res) => {
        filteredEvents = res;
    }).then(() => {
        filteredEvents.forEach((event) => {
            if(event.City === null){return}
            eventsCityList.push(event.City);
        });

        eventsCityList = eventsCityList;
}).catch((err) => console.log(err));

onAuthStateChanged(auth, (user) => {
   if (user) {
       const q = query(collection(db, `users/${user.uid}/events`));
       const unsubscribe = onSnapshot(q, (querySnapshot) => {
           const events = [];
           querySnapshot.forEach((doc) => {
               events.push(doc.data());
           });
           filteredEvents = events;
       });
   }
});

let city, minDate, maxDate, filterMatches = [];
function filterEvents() {
    filterMatches = [];

    filteredEvents.forEach((event) => {
        if ((!city || event.City === city) && (!minDate || event.StartDate >= minDate) && (!maxDate || event.StartDate <= maxDate)) {
            if(!city && !minDate && !maxDate){return}
            filterMatches.push(event);
        }
    });

    filterMatches.forEach((match) => {
        if (match.City !== city && match.StartDate < minDate && match.StartDate > maxDate) {
            filterMatches.splice(match, 1);
        }
    });
}
</script>

<TitleBar title="Events"/>
    
<div class="filter-container" on:click={filterEvents}>
    <div>
        <label for="city">Location:</label>
       <div>
           <select bind:value={city}>
               <option value="" selected>-- Select Location --</option>
               {#if eventsCityList}
                   {#each eventsCityList as city}
                       <option value="{city}">{city}</option>
                   {/each}
               {/if}
           </select>
       </div>
    </div>

    <div>
        <label for="date">Date:</label>
        <div style="display: flex; gap: 5px;">
            <input name="date" type="date" bind:value={minDate} on:input={filterEvents} placeholder="Date minimum">
            <input name="date" type="date" bind:value={maxDate} on:input={filterEvents} placeholder="Date maximum">
        </div>
    </div>
</div>

{#if filterMatches.length > 0}
    <h3>Filtered Events</h3>
    <div class="event-container">
        {#each filterMatches as match}
            <Card event={match} />
        {/each}
    </div>
{/if}

<h3>Liked Events</h3>
<div class="event-container">
    {#each filteredEvents as event}
        {#if event.Liked}
            <Card event={event} />
        {/if}
    {/each}
</div>

<h3>All Events</h3>
<div class="event-container">
    {#each filteredEvents as event}
        {#if !event.Liked}
            <Card event={event} />
        {/if}
    {/each}
</div>
    
<style scoped>
    h1 {
        font-size: 3em;
        font-weight: bold;
        text-align: center;
        margin-top: 2%;
        margin-bottom: 3%;
    }

    h3 {
        font-size: 2em;
        font-weight: bold;
        text-align: center;
        margin-top: 2%;
        margin-bottom: 3%;
    }

    .event-container {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        text-wrap: balance;
    }

    ::-webkit-scrollbar {
        background-color: var(--main-bg-color);
    }

    ::-webkit-scrollbar-thumb {
        background-color: var(--secondary-bg-color);
        border-radius: 10px;
    }

    .filter-container {
        display: flex;
        margin-bottom: 3%;
        justify-content: center;
        gap: 10px;
    }

    @media only screen and (max-width: 500px) {
        .filter-container {
            display: grid;
            width: 100%;
            justify-content: center;
        }
    }

    .filter-container input, select {
        border: none;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px;
        height: 25px;
        margin-top: 5px;
    }

    .filter-container button {
        border: none;
        border-radius: 10px;
        height: 25px;
    }
</style>
    