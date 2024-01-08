<script>
    export let active;
</script>

{#if active}
    <section>
        <div class="modal">
            <slot/>
        </div>
    </section>
{/if}

<style scoped>
    section{
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.363);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3;
    }

    .modal{
        background-color: white;
        width: calc(100vw - 20%);
        height: 400px;
        box-sizing: border-box;
        border-radius: 25px;
        padding: 40px;
    }
</style>