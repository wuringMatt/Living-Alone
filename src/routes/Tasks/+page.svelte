<script>
    import Modal from "./modal.svelte";
    import { setData, getData, deleteData } from "$lib/dataHandling";
    import TitleBar from "$lib/components/titleBar.svelte";
    
    $: active = false;
    $: currentSelect = "chore";
    $: modalActive = false;
    $: deleteModalActive = false;
    $: taskList = [];
    $: selectedTask = {}

    const timeTable = {
        "Twice Weekly": 3,
        "Weekly": 7,
        "Biweekly": 14,
        "Monthly": 30,
        "Bimonthly": 60,
        "Quarterly": 90,
        "Half-yearly": 180,
    }

    getData("users/{userid}/tasks")
    .then((res) => {
        taskList = res
        taskList.forEach((task) => {
            if(task.done == true){
                let today = new Date().toLocaleDateString();
                if(getDifferenceInDays(task.completionDate, today) >= timeTable[task.frequency]){
                    task.done = false;
                    task.completionDate = null;
                }
            }
        })
        console.log(taskList)
    }).catch(err => console.log(err))

    function handleSubmit(e){
        const formData = new FormData(e.target)
        const data = {};
        for (let field of formData) {
        const [key, value] = field;
        data[key] = value;
        }

        data["done"] = false;
        setData("users/{userid}/tasks/" + data.name, data)
        .then(() => {
            getData("users/{userid}/tasks")
            .then((res) => {
                taskList = res
            }).catch(err => console.log(err))
        })
        .then(() => {
            currentSelect = "chore"
            modalActive = false;
        })
    }

    function editTask(task){
        deleteModalActive = true;
        selectedTask = task
    }

    function deleteTask(name){
        deleteData("users/{userid}/tasks/" + name)
        .then(() => {
            getData("users/{userid}/tasks")
            .then((res) => {
                taskList = res
            }).catch(err => console.log(err))
            console.log("task deleted")
            deleteModalActive = false;
        }).catch(err => console.log(err))
    }

    function completionToggle(task){
        let today = new Date().toLocaleDateString();
        if(!task.done == false) {today = null};
        console.log(today)
        setData("users/{userid}/tasks/" + task.name, {"done": !task.done, "completionDate": today})
        .catch(err => console.log(err))
    }

    function getDifferenceInDays(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
    }
</script>


<TitleBar title="Tasks"/>

<div class="page">
    <div class="taskGrid">
        <h3>Chores</h3>
        <div class="line1"></div>
        <div class="taskList">
            {#each taskList as task}
                {#if task.type == "chore" && task.done == false}
                    <button class="task">
                        <input type="checkbox" name="done" bind:checked={task.done} on:click={completionToggle(task)}>
                        <p on:click={editTask(task)}>{task.name}</p>
                        <p>{task.frequency}</p>
                    </button>
                {/if}
            {/each}
        
            {#each taskList as task}
                {#if task.type == "chore" && task.done == true}
                    <button class="task">
                        <input type="checkbox" name="done" bind:checked={task.done} on:click={completionToggle(task)}>
                        <p on:click={editTask(task)}>{task.name}</p>
                        <p>{task.frequency}</p>
                    </button>
                {/if}
            {/each}
        </div>
    </div>
    <div class="taskGrid">
        <h3>Maintenance</h3>
        <div class="line2"></div>
        <div class="taskList">
            {#each taskList as task}
                {#if task.type == "maintenance" && task.done == false}
                    <button class="task">
                        <input type="checkbox" name="done" bind:checked={task.done}>
                        <p on:click={editTask(task)}>{task.name}</p>
                        <p>{task.frequency}</p>
                    </button>
                {/if}
            {/each}

            {#each taskList as task}
                {#if task.type == "maintenance" && task.done == true}
                    <button class="task">
                        <input type="checkbox" name="done" bind:checked={task.done}>
                        <p on:click={editTask(task)}>{task.name}</p>
                        <p>{task.frequency}</p>
                    </button>
                {/if}
            {/each}
        </div>
    </div>
    <button class="addButton" on:click={() => {modalActive = true}}>Add Task</button>
</div>

<Modal active={modalActive}>
    <h2>Add Task</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <label for="name">Task name</label><br>
        <input type="text" name="name" required="true"><br><br>

        <label for="type">Task type</label><br>
        <select name="type" on:change={(v) => {currentSelect = v.target.selectedOptions[0].value}} required="true">
            <option value="chore">Chore</option>
            <option value="maintenance">Maintenance</option>
        </select><br><br>

        <label for="frequency">Frequency</label><br>
        <select name="frequency" required="true">
            {#if currentSelect == "chore"}
                <option value="Twice Weekly">Twice a week</option>
                <option value="Weekly">Weekly</option>
                <option value="Biweekly">Biweekly</option>
                <option value="Monthly">Monthly</option>
            {:else if currentSelect == "maintenance"}
                <option value="Monthly">Monthly</option>
                <option value="Bimonthly">Bimonthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-yearly">Half-yearly</option>
            {/if}
        </select><br><br>
        <button class="addTask">Add Task</button>
    </form>
</Modal>

<Modal active={deleteModalActive}>
    <h2>{selectedTask.name}</h2>
    <button class="addTask" on:click={deleteTask(selectedTask.name)}>Delete Task</button>
    <button class="addTask" on:click={() => {deleteModalActive = false}}>Back</button>
</Modal>


<style scoped>
    .page{
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 40px;
        gap: 20px;
        box-sizing: border-box;
        padding: 0 10% 0 10%;
        height: calc(100vh - 200px);
    }

    .taskGrid{
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        grid-template-rows: 20px 3px 1fr;
        max-height: calc((100vh - 260px) / 2);
    }

    .line1{
        border: 2px solid var(--first-accent-color);
    }

    .line2{
        border: 2px solid var(--secondary-accent-color);
    }

    .taskList{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        height: 100%;
        grid-template-rows: repeat(5, 40px);
        overflow-y: scroll;
    }

    .task{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        justify-content: center;
        height: 40px;
        background-color: white;
        border: none;
        border-radius: 15px;
        box-sizing: border-box;
    }

    .addButton{
        height: 40px;
        background-color: white;
        box-sizing: border-box;
        border: none;
    }

    input, select{
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid gray;
    }

    .addTask{
        width: 100%;
        background-color: white;
        border: 1px solid gray;
        box-sizing: border-box;
        padding: 10px;
    }

    h2{
        width: 100%;
        height: 50px;
        margin-bottom: 20px;
        justify-content: center;
        align-items: center;
        display: flex;
        font-size: 2rem;
        font-weight: 600;
        color: black;
    }

    h3{
        height: 20px;
        font-size: 1.3rem;
        justify-content: center;
        display: flex;
    }
</style>