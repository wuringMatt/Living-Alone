<script>
    export let title = "Living Alone";
    export let back = true;
    export let link = "/";

</script>

<div id="titleBar">
    {#if back}
        <a href="{link}">«</a>
    {/if}
    <h1>{title}</h1>
</div>

<style scoped>
    #titleBar{
        width: 100%;
        box-sizing: border-box;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #titleBar h1{
        font-size: 2rem;
        font-weight: 600;
    }

    #titleBar a{
        position: absolute;
        left: 20px; 
        top: 5px;
        font-size: 3.5rem;
        text-decoration: none;
        color: white;
    }
</style>