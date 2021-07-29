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
        this.imc = this.weight / this.height ** 2;
        return this.imc;
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
