import { WEATHER_API_KEY } from "./apikey.js";
console.log(WEATHER_API_KEY);

const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-text"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    wIcon = wrapper.querySelector(".weather-part img"),
    back = wrapper.querySelector("header i");
    console.log(back);

// const WEATHER_API_KEY = "51bbf56af29d4a526fde863ebefe832d";
let api;

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
})

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser won't support Geolocation-Api")
    }
})

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Getting Weather Details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json())
        .then(result => weatherDetails(result));
}


function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.innerText = `${inputField.value} isn't a valid city`;
        infoTxt.classList.replace("pending", "error");
    }
    else {

        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            wIcon.src = "assets/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "assets/strom.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "assets/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "assets/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "assets/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "assets/rain.svg";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city},${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(temp);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info);
    }
}
back.addEventListener("click",()=>{
    location.reload();
});