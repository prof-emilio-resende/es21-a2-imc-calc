function translateImc(imc) {
    if (isNaN(imc)) return 'Erro no IMC, não numérico';

    if(imc < 18.5) return 'magreza';
    if(imc < 24.9) return 'normal';
    if(imc < 30) return 'sobrepeso';
    
    return 'obesidade';
}

function calculateImc() {
    var height = 1.77;
    var weight = 88.00;

    var imc = weight / height ** 2;
    alert(parseFloat(imc).toFixed(2) + ' ' + translateImc(imc))
}
