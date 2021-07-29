function createRequest() {
    var request = null;
    try {
        request = new XMLHttpRequest();
    } catch (tryMS) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (otherMS) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (failed) {
                console.log("no way to create XMLHttpRequest object");
            }
        }
    }

    return request;
}

function handleImcCalculateResponse(callback) {
    var self = this;
    return function() {
        if (self.readyState == 4) {
            if (self.status == 200) {
                callback(JSON.parse(self.responseText));
            } else {
                alert('sorry, something wrong on API call');
            }
        }
    }
}

function calculateImcAPI(person) {
    var request = createRequest();
    request.onreadystatechange = handleImcCalculateResponse.bind(request)(function (
        calculatedPerson
    ) {
        person.imc = calculatedPerson.imc;
        person.speak(parseFloat(person.imc).toFixed(2) + " " + translateImc(person.imc), document.getElementById("imc"))
    });
    request.open('POST', 'http://localhost:8080/imc/calculate', true);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify({'height': person.height, 'weight': person.weight}));
}

var translateImc = function (imc) {
    if (isNaN(imc)) return "Erro no IMC, não numérico";

    if (imc < 18.5) this.text = "magreza";
    else if (imc < 24.9) this.text = "normal";
    else if (imc < 30) this.text = "sobrepeso";
    else if (imc > 30) this.text = "obesidade";

    return this.text;
};

function Person(height, weight) {
    if (typeof height !== "number" || isNaN(height))
        throw Error("height must be a number!");
    if (typeof weight !== "number" || isNaN(weight))
        throw Error("weight must be a number!");

    this.height = height;
    this.weight = weight;
    this.speak = function (text, element) {
        element.innerText = text;
    };
}

function Dietician(height, weight) {
    Person.call(this, height, weight);
    this.calculateImc = function () {
        calculateImcAPI(this);
    };
}

Dietician.prototype = Object.create(Person.prototype);
Dietician.prototype.constructor = Dietician;

function buildCalculateImc() {
    var heightElement = document.getElementById("altura");
    var weightElement = document.getElementById("peso");
    var dietician = new Dietician(0.0, 0.0);

    return function () {
        dietician.height = parseFloat(heightElement.value);
        dietician.weight = parseFloat(weightElement.value);

        dietician.calculateImc();
        dietician.speak(
            parseFloat(dietician.imc).toFixed(2) +
                " " +
                translateImc(dietician.imc),
            document.getElementById("imc")
        );
    };
}

window.onload = function () {
    var btn = document.querySelector(".data .form button.action");
    btn.addEventListener("click", buildCalculateImc());
};
