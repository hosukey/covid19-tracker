'use strict';

// variables
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

// functions
// calculating time updated - global & canada
const timeCalculation = function (data) {
  const time = new Date(data.updated);
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();
  const hour = time.getHours();
  const mins = time.getMinutes();
  //   console.log(year, month, day, hour, mins);

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
  const convertingMonth = months[month];
  return `Last updated ${convertingMonth} ${day}, ${year} ${hour}:${mins}`;
};

// calculation date updated for provinces
const dateCalculation = function (data) {
  const time = data.summary[0].date.split('-');
  const [day, month, year] = time;
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
  const convertingMonth = months[month - 1];
  return `Last updated ${convertingMonth} ${day}, ${year}`;
};

// adding commas to the number (thousands)
const numberWithCommas = function (number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const getGlobalData = function (data) {
  globalCases.textContent = `${numberWithCommas(data.cases)}`;
  globalDeaths.textContent = `${numberWithCommas(data.deaths)}`;
  globalUpdate.textContent = timeCalculation(data);
};

const getCanadaData = function (data) {
  canadaCases.textContent = `${numberWithCommas(data.cases)}`;
  canadaDeaths.textContent = `${numberWithCommas(data.deaths)}`;
  canadaUpdate.textContent = timeCalculation(data);
};

const getProvinceData = function (data) {
  const html = `
  <div class="province__name">${data.summary[1].province}</div>
  <div class="province__items items">
    <div class="province__items--item">
      <span class="line"></span>
      <ul class="cases item">
        <li>Cases</li>
        <li>${numberWithCommas(data.summary[1].cumulative_cases)}</li>
      </ul>
    </div>

    <div class="province__items--item">
      <span class="line"></span>
      <ul class="deaths item">
        <li>deaths</li>
        <li>${numberWithCommas(data.summary[1].cumulative_deaths)}</li>
      </ul>
    </div>

    <div class="province__items--item">
      <span class="line"></span>
      <ul class="recovered item">
        <li>recovered</li>
        <li>${numberWithCommas(data.summary[1].cumulative_recovered)}</li>
      </ul>
    </div>

    <div class="province__items--item">
      <span class="line"></span>
      <ul class="vaccinated item">
        <li>vaccinated *</li>
        <li>${numberWithCommas(
          data.summary[1].cumulative_cvaccine
        )}<span> (80%)</span></li>
      </ul>
    </div>
  </div>
  `;

  provinceUpdate.insertAdjacentHTML('beforebegin', html);
  provinceUpdate.textContent = dateCalculation(data);
};

// api
const globalRequest = function () {
  fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      timeCalculation(data);
      getGlobalData(data);
    });
};

const canadaRequest = function () {
  fetch('https://disease.sh/v3/covid-19/countries/Canada?strict=true')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      timeCalculation(data);
      getCanadaData(data);
    });
};

const provinceRequest = function () {
  fetch('https://api.opencovid.ca/summary')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      dateCalculation(data);
      getProvinceData(data);
    });
};

// const otherInfoRequest = function () {
//   fetch('https://api.opencovid.ca/other?stat=prov')
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     });
// };

// handler
globalRequest();
canadaRequest();
provinceRequest();
// otherInfoRequest();
