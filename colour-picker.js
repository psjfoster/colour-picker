/* colour-picker.js */
const colours = document.querySelectorAll("fieldset.colour");

function onLoad() {
  const hexColours = document.querySelectorAll(".hexColour");
  const RColours = document.querySelectorAll(".R");
  const GColours = document.querySelectorAll(".G");
  const BColours = document.querySelectorAll(".B");

  for (let c = 0; c < colours.length; c++) {
    hexColours[c].addEventListener("input", function() {
      writeHexToRgb(hexColours[c].value, c + 1);
    });
    RColours[c].addEventListener("input", function() {
      writeRgbToHex("R", parseInt(this.value), c + 1);
    });
    GColours[c].addEventListener("input", function() {
      writeRgbToHex("G", parseInt(this.value), c + 1);
    });
    BColours[c].addEventListener("input", function() {
      writeRgbToHex("B", parseInt(this.value), c + 1);
    });
  }
}

function writeHexToRgb(hex, n) {
  if (hex.length == 6 && 
      /[A-F,0-9]{6}/i.test(hex) == true) {
    document.querySelector("#numberR" + n).value = 
      parseInt(hex.substr(0,2), 16);
    document.querySelector("#numberG" + n).value = 
      parseInt(hex.substr(2,2), 16);
    document.querySelector("#numberB" + n).value = 
      parseInt(hex.substr(4,2), 16);

    setFieldsetColours(hex, n);
  }
}

function writeRgbToHex(colour, value, n) {
  let hex = document.querySelector("#hexCode" + n).value;

  if (value <= 255 && value >= 0) {
    value = value.toString(16);
    value = value.padStart(2, "0");
  }

  switch (colour) {
    case "R":
      hex = value + hex.substr(2);
      break;
    case "G":
      hex = hex.substr(0,2) + value + hex.substr(4);
      break;
    case "B":
      hex = hex.substr(0,4) + value;
      break;
  }
  document.querySelector("#hexCode" + n).value = hex;
  setFieldsetColours(hex, n);
}

function setFieldsetColours(hex, n) {
  const colour = document.querySelector("#colour" + n);
  colour.style.backgroundColor = "#" + hex;

  let R = parseInt(hex.substr(0,2), 16);
  let G = parseInt(hex.substr(2,2), 16);
  let B = parseInt(hex.substr(4,2), 16);

  let calcLuminosity = 
      (
        (R * 0.299) + 
        (G * 0.587) + 
        (B * 0.114)
      ) / 255;

  if (calcLuminosity > 0.41 && calcLuminosity != NaN) {
    colour.style.color = "black";
  } else {
    colour.style.color = "white";
  }

  calcLuminance(R, G, B, n);
}

function calcLuminance(R, G, B, n) {  
  R = R / 255;
  let Rs;
  if (R <= 0.03928) {
    Rs = R / 12.92;
  } else {
    Rs = Math.pow(((R + 0.055) / 1.055), 2.4);
  }

  G = G / 255;
  let Gs;
  if (G <= 0.03928) {
    Gs = G / 12.92;
  } else {
    Gs = Math.pow(((G + 0.055) / 1.055), 2.4);
  }

  B = B / 255;
  let Bs;
  if (B <= 0.03928) {
    Bs = B / 12.92;
  } else {
    Bs = Math.pow(((B + 0.055) / 1.055), 2.4);
  }

  const luminance = document.querySelector("#luminance" + n);
  luminance.value = 
    (Rs * 0.2126) + 
    (Gs * 0.7152) + 
    (Bs * 0.0722);

  calcContrastRatios();
}

function calcContrastRatios() {
  let luminanceArray = [];
  let contrastArray = [];

  for (let c = 0; c < colours.length; c++) {
    luminanceArray[c] = 
      parseFloat(document.querySelector("#luminance" + (c + 1)).value);
  }
  let minLuminance = Math.min(...luminanceArray);

  for (let c = 0; c < colours.length; c++) {
    contrastArray[c] = 
      luminanceArray[c] / minLuminance;
    document.querySelector("#contrast" + (c + 1)).value = contrastArray[c];
  }
}