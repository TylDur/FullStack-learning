function showMessage() {
  alert( 'Hello everyone!' );
}
showMessage();

function printMessage(){
    let message = "Hello I'm Local Variable"; //Local Variable
    alert(message);
}
printMessage();

let name = "I'm a Global Variable"; //Global Variable 

function printName(){
  alert(name);
}
printName();

function withParameter(from, text) { // parameters: from, text
  alert(from + ': ' + text);
}

withParameter('Ann', 'Hello!'); // Ann: Hello! 
withParameter('Ann', "What's up?"); // Ann: What's up? 

function Sum(a,b){
  return (a+b);
}
let result = Sum(2,3);
alert(result);

function CheckAge(age){
  if(age >= 18){
    return true;
  }
  else{
    return false;
  }
}

let age = prompt("What is your age?? " , 18);
if(CheckAge(age)){
  alert("Access Granted!!");
}
else{
  alert("NO Access!!");
}

function doNothing(){
  return;
}
alert(doNothing() === undefined);

function min(a,b){
  return a < b ? a : b;
}
alert(min(2,3));

function pow(a,b){
  return a ** b;
}
alert(pow(3,2));