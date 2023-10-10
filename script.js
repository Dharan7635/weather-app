const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-text"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button");

const apiKey = "51bbf56af29d4a526fde863ebefe832d";
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
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Getting Weather Details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json())
        .then(result => weatherDetails(result));
}


function weatherDetails(info) {
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city`;
        infoTxt.classList.replace("pending","error");
    }
    else{
        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
    }
}
