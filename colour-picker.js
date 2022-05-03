/* colour-picker.js */
function onLoad() {
  const colours = document.querySelectorAll("fieldset.colour");
  const hexColours = document.querySelectorAll(".hexColour");
  const RColours = document.querySelectorAll(".R");
  const GColours = document.querySelectorAll(".G");
  const BColours = document.querySelectorAll(".B");
  const HColours = document.querySelectorAll(".H");
  const SColours = document.querySelectorAll(".S");
  const LColours = document.querySelectorAll(".L");

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
    HColours[c].addEventListener("input", function() {
      writeHslToRgb(c + 1);
    });
    SColours[c].addEventListener("input", function() {
      writeHslToRgb(c + 1);
    });
    LColours[c].addEventListener("input", function() {
      writeHslToRgb(c + 1);
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

  if (value > 255) {
    value = 255;
  }
  if (value < 0) {
    value = 0;
  }

  value = value.toString(16);
  value = value.padStart(2, "0");

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

  writeRgbToHsl(R, G, B, n);
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
      ((Rs * 0.2126) + 
      (Gs * 0.7152) + 
      (Bs * 0.0722)).toFixed(3);

  calcContrastRatios();
}

function calcContrastRatios() {  
  const colours = document.querySelectorAll("fieldset.colour");
  let luminanceArray = [];
  let contrastArray = [];

  for (let l = 0; l < colours.length; l++) {
    luminanceArray[l] = 
        parseFloat(document.querySelector("#luminance" + (l + 1)).value);
  }

  let minLuminance = Math.min(...luminanceArray);

  for (let c = 0; c < colours.length; c++) {
    contrastArray[c] = (luminanceArray[c] + 0.05) / (minLuminance + 0.05);
    document.querySelector("#contrast" + (c + 1)).value = 
        contrastArray[c].toFixed(1);
  }
}

function writeRgbToHsl(R, G, B, n) {
  R = R / 255;
  G = G / 255;
  B = B / 255;

  let Cmax = Math.max(R, G, B);
  let Cmin = Math.min(R, G, B);
  let Cdelta = Cmax - Cmin;

  let H = 0;
  if (Cdelta == 0) {
  } else if (R == Cmax) {
    H = 60 * (((G - B) / Cdelta) % 6);
  } else if (G == Cmax) {
    H = 60 * (((B - R) / Cdelta) + 2);
  } else if (B == Cmax) {
    H = 60 * (((R - G) / Cdelta) + 4);
  }

  if (H < 0) {
    H = H + 360;
  }

  let L = (Cmax + Cmin) / 2;

  let S = 0;
  if (Cdelta == 0) {
  } else {
    S = Cdelta / (1 - Math.abs((2 * L) - 1));
  }

  document.querySelector("#numberH" + n).value = H.toFixed(0);
  document.querySelector("#numberS" + n).value = S.toFixed(2);
  document.querySelector("#numberL" + n).value = L.toFixed(2);
}

function writeHslToRgb(n) {
  const H = document.querySelector("#numberH" + n).value;
  const S = document.querySelector("#numberS" + n).value;
  const L = document.querySelector("#numberL" + n).value;

  let C = (1 - Math.abs((2 * L) - 1)) * S;

  let X = C * (1 - Math.abs(((H / 60) % 2) - 1));

  let m = L - (C / 2);

  let Rh = 0;
  let Gh = 0;
  let Bh = 0;

  if (H >= 0 && H < 60) {
    Rh = C;
    Gh = X;
    Bh = 0;
  } else if (H >= 60 && H < 120) {
    Rh = X;
    Gh = C;
    Bh = 0;
  } else if (H >= 120 && H < 180) {
    Rh = 0;
    Gh = C;
    Bh = X;
  } else if (H >= 180 && H < 240) {
    Rh = 0;
    Gh = X;
    Bh = C;
  } else if (H >= 240 && H < 300) {
    Rh = X;
    Gh = 0;
    Bh = C;
  } else if (H >= 300 && H < 360) {
    Rh = C;
    Gh = 0;
    Bh = X;
  }

  let R = (Rh + m) * 255;
  let G = (Gh + m) * 255;
  let B = (Bh + m) * 255;

  document.querySelector("#numberR" + n).value = R.toFixed(0);
  document.querySelector("#numberG" + n).value = G.toFixed(0);
  document.querySelector("#numberB" + n).value = B.toFixed(0);

  writeRgbToHex
}