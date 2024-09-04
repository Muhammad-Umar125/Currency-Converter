// const Base_Url = "https://api.currencyapi.com/v3/latest?apikey=cur_live_E19aK4ncRV5yODlZXb3XCVQB6ZTCXuARfFyjaVPJ"
const Base_Url = "https://api.currencyapi.com/v3/latest?apikey=cur_live_Ata7SzNWdTOQ37tlOMIskA11DE6mmMIBkcualbVN"

const dropdowns = document.querySelectorAll(".dropdown select")
const btn = document.querySelector("form button")
const msg = document.querySelector(".msg")
const fromCurr = document.querySelector(".from select")
const toCurr = document.querySelector(".to select")

for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option")
        newOption.innerText = currCode
        newOption.value = currCode
        if (select.name == "from" && currCode == "USD") {
            newOption.selected = "selected"
        }
        else if (select.name == "to" && currCode == "PKR") {
            newOption.selected = "selected"
        }
        select.append(newOption)

    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target)
    })
}

const updateFlag = (element) => {
    let currCode = element.value
    countryCode = countryList[currCode]

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`
    let img = element.parentElement.querySelector("img")
    img.src = newSrc
}


const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input")
    let amountValue = amount.value
    if (amountValue == "" || amountValue < -1) {
        amountValue = 1;
        amount.value = 1;
    }
    
    try {
        const response = await fetch(Base_Url);

        // Check if the response is not ok (e.g., status code 404 or 500)
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        // Parse the JSON response
        const data = await response.json();

        // Extract currency codes and their exchange rates
        const currencyData = data.data;
        let fromCode = fromCurr.value;
        let toCode = toCurr.value;

        // Get the exchange rates for the selected currencies
        const fromValue = currencyData[fromCode].value;
        const toValue = currencyData[toCode].value;

        // Calculate the final amount
        let finalAmount = (toValue / fromValue) * amountValue;
        msg.innerText = `${amountValue} ${fromCurr.value} = ${finalAmount.toFixed(6)} ${toCurr.value}`;

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault()
    updateExchangeRate()
})

window.addEventListener("load", () => {
    updateExchangeRate()
})

