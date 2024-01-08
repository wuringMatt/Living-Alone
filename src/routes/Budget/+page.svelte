<script>
    import TitleBar from "$lib/components/titleBar.svelte";
    import { setData } from "$lib/dataHandling.js";

    let incomeForm, spendingForm, calculator, totalIncome, totalSpending;

    let income = {
        Salary: null,
        RentAllowance: null,
        HealthCareAllowance: null,
        Other: null,
    };

    let spending = {
        Tuition: null,
        StudyMaterials: null,
        Rent: null,
        Subscriptions: null,
        Transportation: null,
        Groceries: null,
        Clothes: null,
        Other: null,
    };

    export let data;

    if (data && data.userIncome && Object.keys(data.userIncome).length > 0) {
        income.Salary = data.userIncome.Salary;
        income.RentAllowance = data.userIncome.RentAllowance;
        income.HealthCareAllowance = data.userIncome.HealthCareAllowance;
        income.Other = data.userIncome.Other;
    }

    if (data && data.userSpending && Object.keys(data.userSpending).length > 0) {
        spending.Tuition = data.userSpending.Tuition;
        spending.StudyMaterials = data.userSpending.StudyMaterials;
        spending.Rent = data.userSpending.Rent;
        spending.Subscriptions = data.userSpending.Subscriptions;
        spending.Transportation = data.userSpending.Transportation;
        spending.Groceries = data.userSpending.Groceries;
        spending.Clothes = data.userSpending.Clothes;
        spending.Other = data.userSpending.Other;
    }

    function nextScene() {
        if (!totalIncome) {
            if (NotEmpty(income)) {
                incomeForm.style.transform = 'translate(-800%, -50%)'
                spendingForm.style.opacity = 1;
                spendingForm.style.transform = 'translate(-50%, -50%)';

                setData('users/{userid}/budget/income',
                    {
                        Salary: income.Salary,
                        RentAllowance: income.RentAllowance,
                        HealthCareAllowance: income.HealthCareAllowance,
                        Other: income.Other,
                    }).catch((err) => console.log(err));

                totalIncome = calculateTotal(income);
            } else {
                alert('Please fill in all required (*) fields');
            }
        } else if (!totalSpending) {
            if (NotEmpty(spending)) {
                spendingForm.style.transform = 'translate(-800%, -50%)';
                calculator.style.opacity = 1;
                calculator.style.transform = 'translate(-50%, -50%)';

                setData('users/{userid}/budget/spending',
                    {
                        Tuition: spending.Tuition,
                        StudyMaterials: spending.StudyMaterials,
                        Rent: spending.Rent,
                        Subscriptions: spending.Subscriptions,
                        Transportation: spending.Transportation,
                        Groceries: spending.Groceries,
                        Clothes: spending.Clothes,
                        Other: spending.Other,
                    }).catch((err) => console.log(err));

                totalSpending = calculateTotal(spending);
            } else {
                alert('Please fill in all required (*) fields');
            }
        }
    }

    function NotEmpty(object) {
        let requirementsNotMet = [];

        for (const variable in object) {
            if (variable !== 'Other') {
                if (object[variable] === null) {
                    requirementsNotMet.push(variable);
                }
            }
        }

        return requirementsNotMet.length <= 0;
    }

    function calculateTotal(object) {
        let total = 0;

        for (const variable in object) {
            if (object[variable] !== null) {
                total += object[variable]
            }
        }

        return total;
    }
</script>

<TitleBar title="Budget Calculator"/>

<div bind:this={incomeForm} class="income-container center-container">
    <form id="incomeForm" class="formStyle">
        <h3>Income</h3>
        <label>Salary *</label>
        <input bind:value={income.Salary} type="number" placeholder="€0,-">

        <label>Rent allowence *</label>
        <input bind:value={income.RentAllowance} type="number" placeholder="€0,-">

        <label>Health care allowance *</label>
        <input bind:value={income.HealthCareAllowance} type="number" placeholder="€0,-">

        <label>Other income</label>
        <input bind:value={income.Other} type="number" placeholder="€0,-">

        <button on:click={nextScene}>Next</button>
    </form>
</div>

<div bind:this={spendingForm} class="spending-container center-container">
    <form class="formStyle">
        <h3>Spending</h3>
        <label>Tuition *</label>
        <input bind:value={spending.Tuition} type="number" placeholder="€0,-">

        <label>Study materials *</label>
        <input bind:value={spending.StudyMaterials} type="number" placeholder="€0,-">

        <label>Rent *</label>
        <input bind:value={spending.Rent} type="number" placeholder="€0,-">

        <label>Subscriptions *</label>
        <input bind:value={spending.Subscriptions} type="number" placeholder="€0,-">

        <label>Transportation *</label>
        <input bind:value={spending.Transportation} type="number" placeholder="€0,-">

        <label>Groceries *</label>
        <input bind:value={spending.Groceries} type="number" placeholder="€0,-">

        <label>Clothes *</label>
        <input bind:value={spending.Clothes} type="number" placeholder="€0,-">

        <label>Other (sports, entertainment, etc.)</label>
        <input bind:value={spending.Other} type="number" placeholder="€0,-">

        <button on:click={nextScene}>Next</button>
    </form>
</div>

<div bind:this={calculator} class="calculator-container center-container">
    <table>
        <thead>
        <tr>
            <th>Income:</th>
            <th>€ {totalIncome}</th>
        </tr>
        <tr>
            <th>Spending:</th>
            <th>€ {totalSpending}</th>
        </tr>
        <tr>
            <th>Savings/Deficit:</th>
            <th class="{totalIncome-totalSpending > 0 ? 'positive' : 'negative'}">€ {totalIncome-totalSpending}</th>
        </tr>
        </thead>
    </table>
</div>

<style scoped>
    input {
        border: none;
        border-radius: 10px;
        box-sizing: border-box;
    }

    .center-container {
        position: absolute;
        transition: transform 0.5s ease-in-out;
    }

    .income-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .spending-container {
        position: fixed;
        opacity: 0;
        top: 50%;
        left: 50%;
        transform: translate(100%, -50%);
    }

    .calculator-container {
        position: fixed;
        opacity: 0;
        top: 50%;
        left: 50%;
        transform: translate(100%, -50%);
    }

    .calculator-container table {
        border-collapse: collapse;
        table-layout: fixed;
    }

    .calculator-container th {
        padding: 8px;
        text-align: left;
    }

    .formStyle {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .formStyle h3 {
        padding-top: 10%;
        padding-bottom: 5%;

        font-size: 1.1em;
        font-weight: bold;
    }

    .formStyle label{
        display: block;
        padding: 5%;
    }

    .formStyle button {
        margin-top: 5%;
        border: none;
        border-radius: 5px;
        font-size: 15px;
    }

    .positive {
        color: green;
    }

    .negative {
        color: red;
    }
</style>