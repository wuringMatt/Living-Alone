<script>
    import { getData } from "$lib/dataHandling.js"
    import TitleBar from "$lib/components/titleBar.svelte";

    $: contacts = []

    getData("users/{userid}")
    .then((res) => {
        contacts = res["Emergency Contacts"]
    }).catch(err => console.log(err)) 

    function clipboard(contact){
        navigator.clipboard.writeText(contact.number);
        alert("Copied " + contact.name + "'s phone number!")
    }
</script>


<TitleBar title="Emergency Contacts"/>
<section>
    <div class="list">
        {#each contacts as contact}
            <a href="tel:{contact.number}" class="listItem">
                <p>{contact.name}</p>
                <p>{contact.number}</p>
            </a>
        {/each}
    </div>
    <a href="/Emergency-Contacts/addContact" class="addButton">Add Contact</a>
</section>

<style scoped>

    section{
        padding: 0 10% 0 10%;
    }

    .list{
        width: 100%;
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr;
    }

    .listItem{
        height: 50px;
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: none;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 0 20px 0 20px;
        text-decoration: none;
        color: black;
    }

    .addButton{
        display: flex;
        text-decoration: none;
        color: white;
        border: 2px solid white;
        padding: 10px;
        justify-content: center;
        margin-top: 10px;
    }

</style>