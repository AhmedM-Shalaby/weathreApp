const input = document.getElementById("input")
const add = document.getElementById("add")
const closeWeather = document.querySelectorAll(".close")
const Shows = document.getElementById("Shows")
const dataShearch = document.getElementById("data")
const select = document.querySelector(".select")
let dataHistory = []
let allCities = []
let req = false
input.focus()
// Get Weather Data
async function getWeather(valueCity) {
  let apiData = `https://api.openweathermap.org/data/2.5/weather?q=${valueCity.city_name_en}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`;
  const res = await fetch(apiData);
  const data = await res.json();
  showWeather(data, valueCity);
}
// ==============================================================
document.body.addEventListener("click", (e) => {
  let Element = e.target
  if (Element.dataset.del == "yes") {
    deleteWeather(Element)
  }
})
// Check Data History
if (localStorage.getItem("dataWeather") !== null) {
  dataHistory = JSON.parse(localStorage.getItem("dataWeather"))
  for (let i = 0; i < dataHistory.length; i++) {
    getWeather(dataHistory[i]);
  }
}
//  Get Cities Alll =============================================
async function getCities() {
  const res = await fetch("data/cities.json")
  const data = await res.json()
  return allCities = (data)
}
// =======================================================
function fliterData(arr) {
  let city = arr.find(Element => {
    return Element.city_name_en.toLowerCase() == input.value.toLowerCase() ||
      Element.city_name_ar.toLowerCase() == input.value.toLowerCase()
  })
  if (city == undefined) {
    Swal.fire('Not Found')
  }
  else if (checkIsHere(city)) {
    Swal.fire('You have already added')
  }
  else {
    getWeather(city);
    dataHistory.push(city)
    localStorage.setItem("dataWeather", JSON.stringify(dataHistory))
  }
  input.value = ""
}
function checkIsHere(obj) {
  console.log(dataHistory);

  let here = dataHistory.find(Element => {
    return Element.id == obj.id
  })
  return here
}
add.addEventListener("click", (e) => {
  e.preventDefault()

  if (input.value !== "") {
    fliterData(allCities)
    select.style.display = "none"
    dataShearch.innerHTML = ""
  } else {
    Swal.fire(
      'Ooops',
      'Write The Name City?',
      'question'
    )
  }
})
function showWeather(obj, { id, city_name_ar }) {
  Shows.innerHTML += `
  <div class="col-lg-3 col-sm-6 my-5 parent">
        <div class="content">
        <i class="fa-solid fa-xmark close" data-Del="yes" id="${id}"></i>
        <div class="city-title">
        <div class="title-txt">
          ${obj.name}
        </div>
        <div class="title-txt">
          ${city_name_ar}
        </div>
        <div class="country rounded-pill bg-warning px-2 text-white">${obj.sys.country}</div>
      </div>
      <div class="temperature">
        <span class="temp">${Math.round(obj.main.temp)}</span>
        <span class="celesius">&#8451;</span>
      </div>
      <img class="image" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${obj.weather[0].icon}.svg" alt="">
      <p class="weather-description mt-3 mb-0">${obj.weather[0].description}</p>
        </div>
      </div>
        `
}
function deleteWeather(el) {
  dataHistory = dataHistory.filter(Element => {
    return Element.id !== el.id
  })
  let parent = el.closest(".parent")
  parent.remove()
  localStorage.setItem("dataWeather", JSON.stringify(dataHistory))
}
function formSelect(arr, value) {
  let show = arr.filter(Element => {
    return Element.city_name_en.toLowerCase().includes(value) ||
      Element.city_name_ar.toLowerCase().includes(value)
  });
  autoComplet(show);
}
input.addEventListener("input", () => {
  let search = input.value.toLowerCase()
  if (!req) {
    req = true
    return getCities().then(res => { formSelect(res, search) })
  } else {
    formSelect(allCities, search)
  }
})
function autoComplet(arr) {
  if (arr.length > 5) {
    arr.length = 4
  }
  let data = ""
  for (let i = 0; i < arr.length; i++) {
    data += `
    <tr>
      <td class="nameCity">${arr[i]["city_name_en"]}</td>
      <td class="left nameCity">${arr[i].city_name_ar}</td>
    </tr>`
  }
  if (!input.value == "") {
    select.style.display = "table"
    dataShearch.innerHTML = data
  } else {
    select.style.display = "none"
    dataShearch.innerHTML = ""
  }
  selectNameCity()
}

function selectNameCity() {
  let test = document.querySelectorAll(".nameCity")
  test.forEach(Element => {
    Element.addEventListener("click", () => {
      input.value = Element.textContent
    })
  })
}
