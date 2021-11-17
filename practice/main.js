'use strict';

// //https://api.opencovid.ca/summary

// const container = document.querySelector('.container');

// const renderCountry = function (data, className = '') {
//   const time = new Date(data.updated);
//   const year = time.getFullYear();
//   const month = time.getMonth();
//   const day = time.getDate();
//   const hour = time.getHours();
//   const mins = time.getMinutes();
//   console.log(year, month, day, hour, mins);

//   const months = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sept',
//     'Oct',
//     'Nov',
//     'Dec',
//   ];
//   const convertingMonth = months[month];

//   const html = `<div class="country"><span>🇨🇦</span> ${data.country}</div>
//       <div class="total-cases"><span>💣 Total cases:</span> ${data.cases}</div>
//       <div class="today-cases"><span>👀 Today's cases:</span> ${data.todayCases}</div>
//       <div class="total-deaths"><span>😵 Total deaths:</span> ${data.deaths}</div>
//       <div class="today-death"><span>☠️ Today's death:</span> ${data.todayDeaths}</div>
//       <div class="updated"><span>⏱ Updated time:</span> ${convertingMonth} ${day},  ${year} ${hour}:${mins}</div>`;

//   container.insertAdjacentHTML('beforeend', html);
// };

// const request = function () {
//   fetch('https://disease.sh/v3/covid-19/countries/Canada?strict=true')
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       renderCountry(data);
//     });
// };

// const summary = function () {
//   fetch('https://api.opencovid.ca/summary')
//     .then((response1) => response1.json())
//     .then((data1) => {
//       console.log(data1);
//       console.log(data1.summary[1]);
//     });
// };

// const provinces = function () {
//   fetch('https://api.opencovid.ca/other?stat=prov')
//     .then((response1) => response1.json())
//     .then((data2) => {
//       console.log(data2);
//     });
// };
// request();
// summary();
// provinces();

const dropdown = document.querySelector('select');
const div = document.querySelector('div');
let provinceData = {};

//api
const provinceRequest = function () {
  fetch('https://api.opencovid.ca/summary')
    .then((response) => response.json())
    .then((data) => {
      provinceData = data;
      html();
      dropdown.addEventListener('change', html);
    });
};

//insert html
function html(e) {
  const dataResult = dropdown[dropdown.selectedIndex];
  const dataSetNumber = dataResult.dataset.num;

  div.textContent = '';

  const contents = `<p> ${dataResult.value} case: ${provinceData.summary[dataSetNumber].cumulative_cases}</p>`;
  div.insertAdjacentHTML('beforeend', contents);
}

provinceRequest();
