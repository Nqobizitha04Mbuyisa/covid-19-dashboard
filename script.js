let covidData;
let casesChart;

async function loadCovidData() {
    try {
        const response = await fetch('./covid.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        covidData = data.countries;

        console.log(covidData);

        const countrySelect = document.getElementById("countrySelect");

        covidData.forEach(country => {
            const option = document.createElement("option");

            option.value = country.country;
            option.textContent = country.country;

            countrySelect.appendChild(option);
        });

        countrySelect.addEventListener("change", function () {
            const selectedCountry = this.value;

            if (selectedCountry) {
                createChart(selectedCountry);
            }
        });

    } catch (error) {
        console.error("Could not fetch data:", error);
    }
}


function createChart(countryName) {

    const country = covidData.find(
        country => country.country === countryName
    );

    const dates = country.data.map(record => record.date);

    const confirmedCases = country.data.map(
        record => record.confirmed
    );

    const ctx = document.getElementById("casesChart");

    if (casesChart) {
        casesChart.destroy();
    }

    casesChart = new Chart(ctx, {
        type: "line",

        data: {
            labels: dates,

            datasets: [{
                label: `${countryName} Confirmed Cases`,
                data: confirmedCases,
                borderWidth: 2,
                tension: 0.2
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


loadCovidData();