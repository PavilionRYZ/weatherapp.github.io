const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
// const = document.querySelector("");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initial variables
const API_KEY="36111a4c3d0101a7fa965b5535502d2f";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
    if(!searchForm.classList.contains("active")){
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click",()=>{
    // pass clicked tab as input parameter 
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    // pass clicked tab as input parameter 
    switchTab(searchTab);
}); 


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }    
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // make grant container invisible 
    grantAccessContainer.classList.remove("active");
    // make visible
    loadingScreen.classList.add("active");

    // api call 

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log(err);
    }

}


function renderWeatherInfo(weatherInfo){
//   we have to fetch the elements 
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");
const temp = document.querySelector("[data-temp]");
const humidity = document.querySelector("[data-humidity]");
const windspeed = document.querySelector("[data-windspeed]");
const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const cloudiness = document.querySelector("[data-cloudiness]");


// fetch values  from weather infop element to ui 

 cityName.innerHTML = weatherInfo?.name;
 countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; 
 desc.innerHTML = weatherInfo?.weather[0]?.description;
 weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather[0]?.icon}@2x.png`;
 temp.innerHTML = `${weatherInfo?.main?.temp} \u00B0 C`; 
 windspeed.innerHTML = `${weatherInfo?.wind?.speed} m/s`;
 cloudiness.innerHTML =`${weatherInfo?.clouds?.all} \u0025`; 
 humidity.innerHTML = `${weatherInfo?.main?.humidity} \u0025`;
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){

    const userCoordinates ={ 
    lat:position.coords.latitude,
    lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(user);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName ==="")
    return;
    else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    // make visible
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");


    try{
        const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log(err);
        return;
    }
}
