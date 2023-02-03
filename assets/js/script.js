var locations = [];

$("#search-button").on("click", function(event) {
    event.preventDefault();

    var search = $("#search-input").val().trim();
    
    if (search == "") {
        return;
    }

    locations.push(search);

    var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" +
    search + "&appid=b163cdbf260a24669a52af24040a91f0";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => currentInfo(response[0]));

    $("#search-input").val("");
    renderHistory();
});

function currentInfo({ lat, lon }) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" 
    + lon + "&units=metric&appid=b163cdbf260a24669a52af24040a91f0";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        $("#today").text(`${response.name} (${moment().format("DD/MM/YYYY")})`);
        var icon = $("<img>").attr("src", `http://openweathermap.org/img/w/${response.weather[0].icon}.png`);
        var temp = $("<p>").text(`${response.main.temp} °C`);
        var wind = $("<p>").text(`${response.wind.speed} KPH`);
        var humid = $("<p>").text(`${response.main.humidity}%`);
        $("#today").append(icon, temp, wind, humid);
    });

    forecastInfo(lat, lon);
}

function displayForecast(response) {
    $("#forecast").empty();

    for (let i =0; i < response.length;i++) {
        var card = $("<div>").addClass("card");

        card.text(response[i].dt_txt);
        var icon = $("<img>").attr("src", `http://openweathermap.org/img/w/${response[i].weather[0].icon}.png`);
        var temp = $("<p>").text(`${response[i].main.temp} °C`);
        var wind = $("<p>").text(`${response[i].wind.speed} KPH`);
        var humid = $("<p>").text(`${response[i].main.humidity}%`);
        card.append(icon, temp, wind, humid);

        $("#forecast").append(card);
    }
}
  
function forecastInfo(lat, lon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" 
    + lon + "&units=metric&appid=b163cdbf260a24669a52af24040a91f0";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var days = [];

        for (let i =0; i< response.list.length; i++) {
            if (response.list[i].dt_txt.includes("12:00:00")) {
                days.push(response.list[i]);
            }
        }

        displayForecast(days);
    });
}

function renderHistory() {
    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#history").empty();
 
    // Looping through the array of movies
    for (var i = 0; i < locations.length; i++) {
      // Then dynamicaly generating buttons for each movie in the array
      // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
      var a = $("<button>");
      // Adding a class of movie-btn to our button
      a.addClass("hist-btn");
      // Adding a data-attribute
      a.attr("data-name", locations[i]);
      // Providing the initial button text
      a.text(locations[i]);
      // Adding the button to the buttons-view div
      $("#history").append(a);
    }

    localStorage.setItem("history", locations);
}

function pastInfo() {
    var search = $(this).attr("data-name");
    var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" +
    search + "&appid=b163cdbf260a24669a52af24040a91f0";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => currentInfo(response[0]));
}

$(document).on("click", ".hist-btn", pastInfo);