var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        { locations: ["0", "0", "0"], hits: ["", "", ""] },
        { locations: ["0", "0", "0"], hits: ["", "", ""] },
        { locations: ["0", "0", "0"], hits: ["", "", ""] }
    ],

    // Początkowe położenie okrętów, podane na stałe.
    /*
    	ships: [
    		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
    		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
    		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
    	],
    */

    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i]
            locations = ship.locations;
            var index = locations.indexOf(guess);

            // to jest usprawnienie! sprawdzamy,
            // czy okręt nie został już trafiony,
            // wyświetlamy stosowny komunikat użytownikowi i kończymyt działanie.
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("TRAFIONY!");
                if (this.isSunk(ship)) {
                    view.displayMessage("Zatopiłeś/aś mój okręt!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Spudłowałeś/aś.");
        return false;
    },

        isSunk: function(ship) {
            for (var i = 0; i < this.shipLength; i++) {
                if (ship.hits[i] != "hit") {
                    return false;
                }
            }
            return true;
        },

    generateShipLocations: function () {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Tablica okrętów: ");
        console.log(this.ships);
    },

generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) { // w poziomie
        row = Math.floor(Math.random() * this.boardSize);
        col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else { // w pionie
        row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        col = Math.floor(Math.random() * this.boardSize);
    }

var newShipLocations = [];
for (var i = 0; i < this.shipLength; i++) {
    if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
    } else {
        newShipLocations.push((row + i) + "" + col);
    }
}
return newShipLocations;
},

collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
        var ship = model.ships[i];
        for (var j = 0; j < locations.length; j++) {
            if (ship.locations.indexOf(locations[j]) >= 0) {
                return true;
            }
        }
    }
    return false;
}
};

var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};


var controler = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("Zatopiłeś wszystkie moje okręty w " + this.guesses + " próbach. <br /> Dziękuje za grę!");
                setTimeout(function() {
                    alert("Jeśli chcesz zagrać ponownie - odświerz stronę."); }, 5000);

            }
        }
    }
};

// funkcja pomocnicza przetwarzająca współrzędne wpisane przez użytkownika

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Ups, proszę wpisać literę i cyfrę.");
    } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Ups, to nie są współrzędne!");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Ups, pole poza planszą!");
        } else {
            return row + column;
        }
    }
    return null;
}

// funkcje obsługi zdarzeń

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controler.processGuess(guess);

    guessInput.value = "";
}
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

// funkcja init - wywoływana po zakończeniu wczytywania strony

window.onload = init;
    alert("Proszę używać dużych liter!");
function init() {
    // procedura obsługi przycisku Ognia!
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    // obsługa naciśnięcia klawisza "enter"
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

// Umieszczamy okręty na planszy
    model.generateShipLocations();
}
