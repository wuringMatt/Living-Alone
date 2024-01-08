<script>
    import { setData } from "$lib/dataHandling";
    import heart from './img/heart.png';
    import fullHeart from './img/heart-full.png';

    export let event;

    $: liked = event.Liked;
    let imgSrc = event.Liked ? fullHeart : heart;

    function like(){
        liked = !liked
        imgSrc = liked ? fullHeart : heart;
        setData("users/{userid}/events/" + event.Name, {Liked: liked})
            .catch(err => console.log(err))
    }
</script>

<div class="event">
    <img id="like" src={imgSrc} alt="Empty Heart Icon" on:click={like}/>
    <a href="{event.Link}" target="_blank">
        <h2>{event.Name}</h2>
        <img id="logo" src="{event.Img}" alt="Logo"/>
        <p>{event.StartDate}</p>
        <hr/>
        <p>{event.Description}</p>
    </a>
</div>

<style scoped>
    a {
        text-decoration: none;
        color: white;
    }

    #logo {
        width: 90%;
        border-radius: 10px;
    }

    #like:hover {
        cursor: pointer;
    }

    .event {
        margin: 0.5%;
        background-color: var(--secondary-bg-color);
        border-radius: 5px;

        text-align: center;
        min-width: 250px;
        max-width: 250px;
        height: 425px;
        overflow: hidden;
    }

    .event h2 {
        font-size: 1.5em;
        font-weight: bold;
        min-height: 100px;

        padding-top: 5%;
    }

    .event img {
        width: 10%;
        height: auto;
        padding-top: 3%;
    }
</style>