let value = true;
alert(typeof (value));

value = String(value);
alert(typeof (value));

alert("6" / "2"); // 3, strings are converted to numbers

let str = "123";
alert(typeof (str));

let num = Number(str);
alert(typeof (num));

let age = Number("an arbitrary string instead of a number");
alert(age); // NaN, conversion failed