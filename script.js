let covidData;
let casesChart;
let dailyCasesChart;

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

        // Add countries to dropdown
        covidData.forEach(country => {
            const option = document.createElement("option");

            option.value = country.country;
            option.textContent = country.country;

            countrySelect.appendChild(option);
        });

        // Listen for country selection
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

    // Find selected country
    const country = covidData.find(
        country => country.country === countryName
    );

    // Get dates
    const dates = country.data.map(
        record => record.date
    );

    // Get cumulative confirmed cases
    const confirmedCases = country.data.map(
        record => record.confirmed
    );

    // Get cumulative deaths
    const deathsData = country.data.map(
        record => record.deaths
    );

    // Get cumulative recoveries
    const recoveredData = country.data.map(
        record => record.recovered
    );


    // Get latest values
    const latestData = country.data[country.data.length - 1];

    const deaths = latestData.deaths;
    const recovered = latestData.recovered;
    const confirmed = latestData.confirmed;

    // Calculate active cases
    const active = confirmed - deaths - recovered;


    // Update metric cards
    document.getElementById("confirmedMetric").textContent = confirmed;
    document.getElementById("deathsMetric").textContent = deaths;
    document.getElementById("recoveredMetric").textContent = recovered;
    document.getElementById("activeMetric").textContent = active;


    // Calculate daily new cases
    const dailyCases = country.data.map((record, index) => {

        // First available day has no previous day
        if (index === 0) {
            return 0;
        }

        return record.confirmed - country.data[index - 1].confirmed;
    });


    // --------------------------------
    // CUMULATIVE CASES LINE CHART
    // --------------------------------

    const ctx = document.getElementById("casesChart");

    // Destroy previous chart before creating a new one
    if (casesChart) {
        casesChart.destroy();
    }

    casesChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: dates,

            datasets: [

                {
                    label: "Confirmed Cases",
                    data: confirmedCases,
                    borderWidth: 2,
                    tension: 0.2
                },

                {
                    label: "Deaths",
                    data: deathsData,
                    borderWidth: 2,
                    tension: 0.2
                },

                {
                    label: "Recoveries",
                    data: recoveredData,
                    borderWidth: 2,
                    tension: 0.2
                }

            ]
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


    // --------------------------------
    // DAILY NEW CASES BAR CHART
    // --------------------------------

    const dailyCasesCtx =
        document.getElementById("dailyCasesChart");

    // Destroy previous chart
    if (dailyCasesChart) {
        dailyCasesChart.destroy();
    }

    dailyCasesChart = new Chart(dailyCasesCtx, {

        type: "bar",

        data: {

            labels: dates,

            datasets: [

                {
                    label: `${countryName} Daily New Cases`,
                    data: dailyCases,
                    borderWidth: 1
                }

            ]
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


// Load the data when the page opens
loadCovidData();