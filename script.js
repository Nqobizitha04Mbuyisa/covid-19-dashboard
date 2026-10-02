async function loadCovidData() {
  try {
    const response = await fetch('./covid.json'); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.countries);
    const countryNames = data.countries.map(country => country.country);
    console.log("countries", countryNames); 

    const countrySelect = document.getElementById("countrySelect");

    console.log("dropdown", countrySelect);

    countryNames.forEach(countryName => {
    const option = document.createElement("option");

    option.value = countryName;
    option.textContent = countryName;

    countrySelect.appendChild(option);
    });

  } catch (error) {
    console.error("Could not fetch data:", error);
  }
}
loadCovidData();