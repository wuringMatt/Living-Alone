<script>
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
    import { setData } from "$lib/dataHandling"
    export let auth;

    $: type = "signIn";
    $: error = "";

    let userObj = {
        "email": "",
        "Emergency Contacts": [],
        "prefrences": {
            "allergie": [],
            "maxTime": 0,
            "people": 1
        }
    }

    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    function addUserToDB(user){
        return new Promise((resolve, reject) => {
            userObj.email = user.email
            setData("users/{userid}", userObj)
            .then(()=>{
                days.forEach((day) => {
                    setData("users/{userid}/meals/" + day, {id: days.indexOf(day)})
                    .then(res => console.log(res))
                    .catch(err => console.log(err))
                })
            })
            .then(()=>{
                resolve()
            })
        })
    }


    function createUser(auth, email, password){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            error = ""
            addUserToDB(user)
            .then(() => {
                window.location.href = "/"
            })
        })
        .catch((err) => {
            console.log(err.code);
            error = err.message
        });
    }

    function signInUser(auth, email, password){
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            error = ""
            window.location.href = "/"
        })
        .catch((err) => {
            console.log(err.code)
            error = err.message;
        })
    }

    function onSubmit(e){
        const formData = new FormData(e.target)

        const d = {};
        for (let field of formData) {
        const [key, value] = field;
        d[key] = value;
        }

        if(type == "signIn"){
            signInUser(auth, d.email, d.password);
        } else {
            createUser(auth, d.email, d.password);
        }
    }
</script>

<div class="container">
    <form on:submit|preventDefault={onSubmit}>
        <label for="email">Email</label><br>
        <input type="email" name="email" required={true}><br><br>

        <label for="password">Password</label><br>
        <input type="password" name="password" required={true}><br><br>

        {#if error}
            <p>{error}</p><br>  
        {/if}

        <div class="buttonWrapper">
            <button type="submit" on:click={()=> type = "signIn"}>Login</button>
            <button type="submit" on:click={()=> type = "signUp"}>Register</button>
        </div>
    </form>
</div>

<style scoped>
    .container{
        align-items: center;
        display: grid;
        height: 60vh;
    }

    input{
        width: 100%;
        height: 40px;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 5px;
    }

    p{
        font-size: 0.9rem;
        color: red;
    }

    button{
        width: 100%;
        height: 40px;
        background-color: white;
        border-radius: 5px;
    }

    .buttonWrapper{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px
    }
</style>