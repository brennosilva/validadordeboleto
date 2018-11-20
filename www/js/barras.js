function f_barra() {
  var antes = codigoBarras.value;
  var depois = calcula_barra(linhaDigitavel.value);
  codigoBarras.value = depois;
  antes = antes.replace(/[^0-9]/g, '')
  if ((antes != depois) && antes != '') alert('O código de barras digitado não confere:\n' + antes + '\n' + depois);
  f_venc();
  return (false);
}
function f_linha() {
  var antes = linhaDigitavel.value.replace(/[^0-9]/g, '');
  var depois = calcula_linha(codigoBarras.value);
  linhaDigitavel.value = depois;
  depois = depois.replace(/[^0-9]/g, '')
  if ((antes != depois) && antes != '') alert('O código de barras digitado não confere:\n' + antes + '\n' + depois);
  f_venc();
  return (false);
}
function f_venc() {
  if (codigoBarras.value.substr(5, 4) == 0)
    vencimento.value = 'O boleto pode ser pago em qualquer data';
  else
    vencimento.value = fator_vencimento(codigoBarras.value.substr(5, 4)).substr(0,10);
  valor.value = (codigoBarras.value.substr(9, 8) * 1) + ',' + codigoBarras.value.substr(17, 2);

  // seta o banco
  banco.value = f_banco(codigoBarras.value.substr(0, 3));
  moeda.value = f_moeda(codigoBarras.value.substr(3, 1));

  return (false);
}
function calcula_barra(linha) {
  //var linha = linhaDigitavel.value; // Linha Digit�vel
  barra = linha.replace(/[^0-9]/g, '');
  //
  // C�LCULO DO D�GITO DE AUTOCONFER�NCIA (DAC)   -   5� POSI��O
  if (modulo11_banco('34191000000000000001753980229122525005423000') != 1) alert('Função "modulo11_banco" está com erro!');
  //
  //if (barra.length == 36) barra = barra + '00000000000';
  if (barra.length < 47) barra = barra + '00000000000'.substr(0, 47 - barra.length);
  if (barra.length != 47) alert('A linha do código de barras está incompleta!' + barra.length);
  //
  barra = barra.substr(0, 4)
    + barra.substr(32, 15)
    + barra.substr(4, 5)
    + barra.substr(10, 10)
    + barra.substr(21, 10)
    ;
  //codigoBarras.value = barra;
  if (modulo11_banco(barra.substr(0, 4) + barra.substr(5, 39)) != barra.substr(4, 1))
    alert('Digito verificador ' + barra.substr(4, 1) + ', o correto é ' + modulo11_banco(barra.substr(0, 4) + barra.substr(5, 39)) + '\nO sistema não altera automaticamente o digito correto na quinta casa!');
  //if (codigoBarras.value != form.barra2.value) alert('Barras diferentes');
  return (barra);
}
function calcula_linha(barra) {
  //var barra = codigoBarras.value; // Codigo da Barra
  linha = barra.replace(/[^0-9]/g, '');
  //
  if (modulo10('399903512') != 8) alert('Função "modulo10" está com erro!');
  if (linha.length != 44) alert('A linha do código de barras está incompleta!');
  //
  var campo1 = linha.substr(0, 4) + linha.substr(19, 1) + '.' + linha.substr(20, 4);
  var campo2 = linha.substr(24, 5) + '.' + linha.substr(24 + 5, 5);
  var campo3 = linha.substr(34, 5) + '.' + linha.substr(34 + 5, 5);
  var campo4 = linha.substr(4, 1);  // Digito verificador
  var campo5 = linha.substr(5, 14); // Vencimento + Valor
  //
  if (modulo11_banco(linha.substr(0, 4) + linha.substr(5, 99)) != campo4)
    alert('Digito verificador ' + campo4 + ', o correto é ' + modulo11_banco(linha.substr(0, 4) + linha.substr(5, 99)) + '\nO sistema não altera automaticamente o digito correto na quinta casa!');
  //
  if (campo5 == 0) campo5 = '000';
  //
  linha = campo1 + modulo10(campo1)
    + ' '
    + campo2 + modulo10(campo2)
    + ' '
    + campo3 + modulo10(campo3)
    + ' '
    + campo4
    + ' '
    + campo5
    ;
  //if (linhaDigitavel.value != form.linha2.value) alert('Linhas diferentes');
  return (linha);
}
function fator_vencimento(dias) {
  //Fator contado a partir da data base 07/10/1997
  //*** Ex: 04/07/2000 fator igual a = 1001
  //alert(dias);
  var currentDate, t, d, mes;
  t = new Date();
  currentDate = new Date();
  currentDate.setFullYear(1997, 9, 7);//alert(currentDate.toLocaleString());
  t.setTime(currentDate.getTime() + (1000 * 60 * 60 * 24 * dias));//alert(t.toLocaleString());
  mes = (currentDate.getMonth() + 1); if (mes < 10) mes = "0" + mes;
  dia = (currentDate.getDate() + 1); if (dia < 10) dia = "0" + dia;
  //campo.value = dia +"."+mes+"."+currentDate.getFullYear();campo.select();campo.focus();
  return (t.toLocaleString());
}
function modulo10(numero) {

  numero = numero.replace(/[^0-9]/g, '');
  var soma = 0;
  var peso = 2;
  var contador = numero.length - 1;
  //alert(contador);
  //numero = '00183222173';
  //for (var i=0; i <= contador - 1; i++) {
  //alert(10);
  //for (contador=10; contador >= 10 - 1; contador--) {
  while (contador >= 0) {
    //alert(contador);
    //alert(numero.substr(contador,1));
    multiplicacao = (numero.substr(contador, 1) * peso);
    if (multiplicacao >= 10) { multiplicacao = 1 + (multiplicacao - 10); }
    soma = soma + multiplicacao;
    //alert(numero.substr(contador,1)+' * '+peso+' = '+multiplicacao + ' =>' + soma) ;
    //alert(soma);
    if (peso == 2) {
      peso = 1;
    } else {
      peso = 2;
    }
    contador = contador - 1;
  }
  var digito = 10 - (soma % 10);
  //alert(numero + '\n10 - (' + soma + ' % 10) = ' + digito);
  if (digito == 10) digito = 0;
  return digito;
}

function debug(txt) {
  form.t.value = form.t.value + txt + '\n';
}
function modulo11_banco(numero) {

  numero = numero.replace(/[^0-9]/g, '');
  //debug('Barra: '+numero);
  var soma = 0;
  var peso = 2;
  var base = 9;
  var resto = 0;
  var contador = numero.length - 1;
  //debug('tamanho:'+contador);
  // var numero = "12345678909";
  for (var i = contador; i >= 0; i--) {
    //alert( peso );
    soma = soma + (numero.substring(i, i + 1) * peso);
    //debug( i+': '+numero.substring(i,i+1) + ' * ' + peso + ' = ' +( numero.substring(i,i+1) * peso)+' soma='+ soma);
    if (peso < base) {
      peso++;
    } else {
      peso = 2;
    }
  }
  var digito = 11 - (soma % 11);
  //debug( '11 - ('+soma +'%11='+(soma % 11)+') = '+digito);
  if (digito > 9) digito = 0;
  /* Utilizar o d�gito 1(um) sempre que o resultado do c�lculo padr�o for igual a 0(zero), 1(um) ou 10(dez). */
  if (digito == 0) digito = 1;
  return digito;
}


function f_banco(numeroBanco) {
  var bancoSetado = "";
  switch (numeroBanco) {
    case "001":
      bancoSetado = "Banco do Brasil";
      break;
    case "237":
      bancoSetado = "Banco Bradesco";
      break;
    case "033":
      bancoSetado = "Banco Santander";
      break;
    case "341":
      bancoSetado = "Banco Itaú";
      break;
    case "745":
      bancoSetado = "Banco Citibank";
      break;
    default:
      bancoSetado = "####";
  }
  return bancoSetado;
}

function f_moeda(numeroMoeda) {
  var moeda = "";
  switch (numeroMoeda) {
    case "9":
      moeda = "R$";
      break;
    default:
      moeda = "##";
  }
  return moeda;
}
function f_limpar() {
  linhaDigitavel.value = "";
  codigoBarras.value = "";
  vencimento.value = "";
  valor.value = "";
  banco.value = "";
  moeda.value = "";
}