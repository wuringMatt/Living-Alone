<script>
    import { getData, setData } from "$lib/dataHandling";
    import { arrayUnion } from "firebase/firestore";
    import TitleBar from "$lib/components/titleBar.svelte";

    function handleSubmit(e){
        const formData = new FormData(e.target)
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        setData("users/{userid}", {"Emergency Contacts": arrayUnion(data)})
        .then((res) => {
            console.log(res)
            window.location.href = "/Emergency-Contacts"
        }).catch(err => console.log(err))
    }
</script>

<Titlebar title="Add Contact"/>
<section>
    <form on:submit|preventDefault={handleSubmit} >
        <label for="name">Name</label><br>
        <input type="text" name="name" required="true"><br><br>

        <label for="number">Number</label><br>
        <input type="text" name="number" required="true"><br><br>

        <button>Submit</button>
    </form>
</section>

<style scoped>
    section{
        padding: 0 10% 0 10%;
    }

    input{
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
    }

    button{
        width: 100%;
        padding: 10px;
        border: 1px solid black;
        background-color: white;
    }
</style>