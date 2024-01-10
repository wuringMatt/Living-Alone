<script>
    import { onAuthStateChanged, signOut } from "firebase/auth";
    import { getData, setData } from "$lib/dataHandling.js"
    import TitleBar from "../lib/components/titleBar.svelte";
    import Login from "../lib/components/login.svelte";
    export let data;

    const auth = data.auth.auth

    let pages = ["Events", "Meal-Preparation", "Tasks", "Budget", "Emergency-Contacts"]

    $: loggedIn = false;

    function logout(){
        signOut(auth).then(() => {
            loggedIn = false
        }).catch((err) => {
            console.log(err)
        });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) loggedIn = true;
        else loggedIn = false;
    })
</script>

<TitleBar title="Living Alone" back={false}/>
<div class="page">
    {#if loggedIn}
        <div class="buttonList">
            {#each pages as page}
                <a class="pageButton" href="/{page}">
                    <p class="buttonText">{page.replace("-", " ")}</p>
                </a>
            {/each}
            <a class="pageButton" on:click={logout} href="/" style="background-color: var(--secondary-bg-color);">
                <p class="buttonText">Logout</p>
            </a>
        </div>
    {:else}
        <Login auth={auth}/>
    {/if}
</div>


<style scoped>
    
    .page{
        margin-left: 20px;
        width: calc(100% - 40px);
        height: 100%;
    }

    .buttonList{
        display: grid;
        gap: 20px;
        align-items: center;
        grid-template-rows: repeat(1fr, 6);
        margin-bottom: 20px;  
        height: 70vh;  
    }

    .pageButton{
        width: 100%;
        height: 100%;
        border-radius: 15px;    
        border: 3px solid var(--secondary-bg-color);
        text-decoration: none;
        color: var(--text-color);
        filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.616));
        background-color: var(--main-bg-color);
        box-sizing: border-box;
    } 


    .buttonText{
        font-size: 1.2rem;
        font-weight: 400;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
