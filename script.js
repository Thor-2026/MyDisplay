// =========================
// LIVE CLOCK
// =========================

function updateClock() {

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    document.getElementById("date").innerHTML =
        now.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

}

updateClock();
setInterval(updateClock,1000);


// =========================
// WEATHER
// Uses Open-Meteo (FREE)
// Default: Vancouver, BC
// Change latitude & longitude to your location
// =========================

async function loadWeather(){

    try{

        const url="https://api.open-meteo.com/v1/forecast?latitude=49.28&longitude=-123.12&current=temperature_2m,weather_code";

        const response=await fetch(url);

        const data=await response.json();

        document.getElementById("temperature").innerHTML=
            Math.round(data.current.temperature_2m)+"°C";

        let code=data.current.weather_code;

        let icon="☀️";
        let text="Clear";

        if(code>=1 && code<=3){

            icon="⛅";
            text="Partly Cloudy";

        }

        if(code>=45){

            icon="🌫️";
            text="Fog";

        }

        if(code>=51){

            icon="🌧️";
            text="Rain";

        }

        if(code>=71){

            icon="❄️";
            text="Snow";

        }

        if(code>=95){

            icon="⛈️";
            text="Storm";

        }

        document.getElementById("weatherIcon").innerHTML=icon;
        document.getElementById("weatherText").innerHTML=text;

    }

    catch(e){

        document.getElementById("weatherText").innerHTML="Offline";

    }

}

loadWeather();

// Refresh weather every 15 minutes
setInterval(loadWeather,900000);


// =========================
// AUTO REFRESH PAGE
// Every 5 minutes
// =========================

setTimeout(function(){

    location.reload();

},300000);


// =========================
// OPTIONAL
// Rotate notices every 10 sec
// =========================

const notices=[
"Safety First<br><br>Wear PPE",
"Check Today's Shift Schedule",
"Report Hazards Immediately",
"Have A Great Day!"
];

let noticeIndex=0;

setInterval(function(){

    noticeIndex++;

    if(noticeIndex>=notices.length){

        noticeIndex=0;

    }

    document.getElementById("notice").innerHTML=
        notices[noticeIndex];

},10000);
