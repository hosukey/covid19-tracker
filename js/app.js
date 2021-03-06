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
      getGlobalData(data);
    });
};

const canadaRequest = function () {
  fetch('https://api.opencovid.ca/')
    .then((response) => response.json())
    .then((data) => {
      console.log('canada', data);
      getCanadaData(data);
    });
};

globalRequest();
canadaRequest();

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

// calculating last time updated - global
const timeCalculation = function (data) {
  const time = new Date(data.updated);
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();
  const hour = time.getHours();
  const mins = time.getMinutes();
  // console.log(year, month, day, hour, mins);
  const convertingMonth = months[month];
  return `Last updated ${convertingMonth} ${day}, ${year} ${hour}:${mins}`;
};

//calculating last time updated - canada
const timeCalcCanada = function (data) {
  // replace - to / to make it work on ios (2022-01-28 format gives you error NaN on mobile )
  const t = data.version.replace(/-/g, '/');

  const time = new Date(t);
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();
  const hour = time.getHours();
  const mins = time.getMinutes();
  const convertingMonth = months[month];
  return `Last updated ${convertingMonth} ${day}, ${year} ${hour}:${mins}`;
};

// adding commas to the numbers (thousands)
const numberWithCommas = function (number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// adding arrow classes
const addArrow = function (data) {
  if (data === 0) {
    return 'zero';
  } else if (data >= 0) {
    return 'positive';
  } else {
    return 'negative';
  }
};

const addArrowRecovered = function (data) {
  if (data === 0) {
    return 'zero';
  } else if (data >= 0) {
    return 'recovered-changes';
  } else {
    return 'negative';
  }
};

// update global data
const getGlobalData = function (data) {
  globalCases.innerHTML = `${numberWithCommas(
    data.cases
  )} <span class="changes ${addArrow(data.todayCases)}">${numberWithCommas(
    data.todayCases
  )}</span>`;
  globalDeaths.innerHTML = `${numberWithCommas(data.deaths)}
  <span class="changes ${addArrow(data.todayDeaths)}">${numberWithCommas(
    data.todayDeaths
  )}</span>
  `;
  globalUpdate.textContent = timeCalculation(data);
};

// update canada data
const getCanadaData = function (data) {
  canadaCases.innerHTML = `${numberWithCommas(data.summary[0].cumulative_cases)}
  <span class="changes ${addArrow(
    data.summary[0].cumulative_cases
  )}">${numberWithCommas(data.summary[0].cases)}</span>
  `;
  canadaDeaths.innerHTML = `${numberWithCommas(
    data.summary[0].cumulative_deaths
  )}
  <span class="changes ${addArrow(data.summary[0].cases)}">${numberWithCommas(
    data.summary[0].deaths
  )}</span>
  `;
  canadaRecovered.innerHTML = `${numberWithCommas(
    data.summary[0].cumulative_recovered
  )}
  <span class="changes ${addArrowRecovered(
    data.summary[0].recovered
  )}">${numberWithCommas(data.summary[0].recovered)}</span>
  `;
  canadaUpdate.textContent = timeCalcCanada(data);
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
        )} <span class="changes ${addArrow(
    provinceData.summary[dataSetNumber].cases
  )}">${numberWithCommas(provinceData.summary[dataSetNumber].cases)}</span></li>
      </ul>
    </div>

    <div class="province__items--item">
      <span class="line"></span>
      <ul class="deaths item">
        <li>deaths</li>
        <li>${numberWithCommas(
          provinceData.summary[dataSetNumber].cumulative_deaths
        )}
        <span class="changes ${addArrow(
          provinceData.summary[dataSetNumber].deaths
        )}">${numberWithCommas(
    provinceData.summary[dataSetNumber].deaths
  )}</span>
        </li>
      </ul>
    </div>

    <div class="province__items--item">
      <span class="line"></span>
      <ul class="recovered item">
        <li>recovered</li>
        <li>${numberWithCommas(
          provinceData.summary[dataSetNumber].cumulative_recovered
        )} 
        <span class="changes ${addArrowRecovered(
          provinceData.summary[dataSetNumber].recovered
        )}">${numberWithCommas(
    provinceData.summary[dataSetNumber].recovered
  )}</span>
        </li>
    
      </ul>
    </div>

    <div class="province__items--item">
      <span class="line"></span>
      <ul class="vaccinated item">
        <li>vaccinated *</li>
        <li>${numberWithCommas(
          provinceData.summary[dataSetNumber].cumulative_cvaccine
        )}
        <span> (${vacPercentage}%)</span>
        </li>
      </ul>
    </div>
  </div>
  `;
  provinceDataContainer.insertAdjacentHTML('beforeend', html);
  provinceUpdate.textContent = dateCalculation(data);
};

// UI Styling
