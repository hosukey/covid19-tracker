'use strict';

const dropdown = document.querySelector('select');
const div = document.querySelector('div');
let provinceData = {};
let popData = {};

//api
//just 1 api

// const provinceRequest = function () {
//   fetch('https://api.opencovid.ca/summary')
//     .then((response) => response.json())
//     .then((data) => {
//       provinceData = data;
//       html();
//       dropdown.addEventListener('change', html);
//     });
// };

//promise.all
// getJSON(`https://api.opencovid.ca/other?stat=prov`)

const fetchProvinceSummary = fetch('https://api.opencovid.ca/summary');
const fetchProvincePopulation = fetch(
  'https://api.opencovid.ca/other?stat=prov'
);

Promise.all([fetchProvinceSummary, fetchProvincePopulation])
  .then((values) => {
    return Promise.all(values.map((r) => r.json()));
  })
  .then(([summary, population]) => {
    console.log(summary);
    console.log(population);
    provinceData = summary;
    popData = population;
    html();
    dropdown.addEventListener('change', html);
  });

//insert html
function html(e) {
  const dataResult = dropdown[dropdown.selectedIndex];
  const dataSetNumber = dataResult.dataset.num;
  let vacPercentage = (
    (provinceData.summary[dataSetNumber].cumulative_cvaccine /
      popData.prov[dataSetNumber].pop) *
    100
  ).toFixed(1);

  div.textContent = '';

  const contents = `<p> ${dataResult.value} case: ${provinceData.summary[dataSetNumber].cumulative_cases} vaccination: ${provinceData.summary[dataSetNumber].cumulative_cvaccine} percentage: ${vacPercentage}%</p>`;
  div.insertAdjacentHTML('beforeend', contents);
}

// provinceRequest();
