const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputFeild = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = wrapper.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

let api;
const apiKey = "244b5bf96b69c2ddfb9a64568394cdc8";

inputFeild.addEventListener("keyup", e => {
    // if user pressed enter btn and input value is not empty
    if (e.key == "Enter" && inputFeild.value != "") {
        requestApi(inputFeild.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) { // if browser supports geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation api");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords; // getting lat and lon of the user device from coords
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Getting weather details..";
    infoTxt.classList.add("pending");
    // getting api response and returning it parsed into a js object, then
    // calling the weatherDetails function with the api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputFeild.value} is not a valid city name`;
    } else {
        // lets get required properties' values from the info object

        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        // using custom icon according to the id which the api returns us
        if (id == 800) {
            wIcon.src = "clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "rain.svg";
        }

        // lets pass these values to particular html elements

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        inputFeild.value = "";
        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
