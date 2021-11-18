'use strict';

// variables ----------------
const globalCases = document.querySelector('.global .cases li:nth-child(2)');
const globalDeaths = document.querySelector('.global .deaths li:nth-child(2)');
const globalUpdate = document.querySelector('.global__updated');
const canadaCases = document.querySelector('.canada .cases li:nth-child(2)');
const canadaDeaths = document.querySelector('.canada .deaths li:nth-child(2)');
const canadaRecovered = document.querySelector(
  '.canada .recovered li:nth-child(2)'
);
const canadaUpdate = document.querySelector('.canada__updated');
const provinceUpdate = document.querySelector('.province__updated');
const provinceDataContainer = document.querySelector('.provinceDataContainer');
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
const selectProvinceBtn = document.querySelector('.prov-dropdown');
const fetchProvinceSummary = fetch('https://api.opencovid.ca/summary');
const fetchProvincePopulation = fetch(
  'https://api.opencovid.ca/other?stat=prov'
);
let provinceData = {};
let populationData = {};

// API ----------------
const globalRequest = function () {
  fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      // console.log('global', data);
      timeCalculation(data);
      getGlobalData(data);
    });
};

const canadaRequest = function () {
  fetch('https://disease.sh/v3/covid-19/countries/Canada?strict=true')
    .then((response) => response.json())
    .then((data) => {
      // console.log('canada', data);
      timeCalculation(data);
      getCanadaData(data);
    });
};

globalRequest();
canadaRequest();

// const provinceRequest = function () {
//   fetch('https://api.opencovid.ca/summary')
//     .then((response) => response.json())
//     .then((data) => {
//       console.log('province', data);
//       provinceData = data;
//       getProvinceData(data);
//       selectProvinceBtn.addEventListener('change', getProvinceData);
//       dateCalculation(data);
//     });
// };

//fetch province summary data & province population data
Promise.all([fetchProvinceSummary, fetchProvincePopulation])
  // destructuring
  .then((values) => {
    return Promise.all(values.map((r) => r.json()));
  })
  .then(([summary, population]) => {
    // console.log(summary);
    // console.log(population);
    // save data to a variable
    provinceData = summary;
    populationData = population;
    getProvinceData(summary);
    selectProvinceBtn.addEventListener('change', getProvinceData);
  });

// functions ----------------
// calculating last time updated - global & canada
const timeCalculation = function (data) {
  const time = new Date(data.updated);
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();
  const hour = time.getHours();
  const mins = time.getMinutes();
  //   console.log(year, month, day, hour, mins);
  const convertingMonth = months[month];
  return `Last updated ${convertingMonth} ${day}, ${year} ${hour}:${mins}`;
};

// adding commas to the numbers (thousands)
const numberWithCommas = function (number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// update global data
const getGlobalData = function (data) {
  globalCases.textContent = `${numberWithCommas(data.cases)}`;
  globalDeaths.textContent = `${numberWithCommas(data.deaths)}`;
  globalUpdate.textContent = timeCalculation(data);
};

// update canada data
const getCanadaData = function (data) {
  canadaCases.textContent = `${numberWithCommas(data.cases)}`;
  canadaDeaths.textContent = `${numberWithCommas(data.deaths)}`;
  canadaRecovered.textContent = `${numberWithCommas(data.recovered)}`;

  canadaUpdate.textContent = timeCalculation(data);
};

// update province data
const getProvinceData = function (data) {
  const dataResult = selectProvinceBtn[selectProvinceBtn.selectedIndex];
  const dataSetNumber = dataResult.dataset.number;
  const dataSetPop = dataResult.dataset.pop;
  //vaccine percentage calculation
  let vacPercentage = (
    (provinceData.summary[dataSetNumber].cumulative_cvaccine /
      populationData.prov[dataSetPop].pop) *
    100
  ).toFixed(0);

  provinceDataContainer.textContent = '';

  const dateCalculation = function (data) {
    const time = provinceData.summary[dataSetNumber].date.split('-');
    const [day, month, year] = time;
    const convertingMonth = months[month - 1];
    return `Last updated ${convertingMonth} ${day}, ${year}`;
  };

  const html = `
  <div class="province__name">${
    populationData.prov[dataSetPop].province_full
  }</div>
  <div class="province__items items">
    <div class="province__items--item">
      <span class="line"></span>
      <ul class="cases item">
        <li>Cases</li>
        <li>${numberWithCommas(
          provinceData.summary[dataSetNumber].cumulative_cases
        )}</li>
      </ul>
    </div>

    <div class="province__items--item">
      <span class="line"></span>
      <ul class="deaths item">
        <li>deaths</li>
        <li>${numberWithCommas(
          provinceData.summary[dataSetNumber].cumulative_deaths
        )}</li>
      </ul>
    </div>

    <div class="province__items--item">
      <span class="line"></span>
      <ul class="recovered item">
        <li>recovered</li>
        <li>${numberWithCommas(
          provinceData.summary[dataSetNumber].cumulative_recovered
        )}</li>
      </ul>
    </div>

    <div class="province__items--item">
      <span class="line"></span>
      <ul class="vaccinated item">
        <li>vaccinated *</li>
        <li>${numberWithCommas(
          provinceData.summary[dataSetNumber].cumulative_cvaccine
        )}<span> (${vacPercentage}%)</span></li>
      </ul>
    </div>
  </div>
  `;
  provinceDataContainer.insertAdjacentHTML('beforeend', html);
  provinceUpdate.textContent = dateCalculation(data);
};
