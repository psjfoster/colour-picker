/* colour-picker.js */

function onLoad() {
  initColours();
  tryStorage();
}

function initColours() {
  const colours = document.querySelectorAll("fieldset.colour");
  const hexColours = document.querySelectorAll(".hexColour");

  const rgbGroups = document.querySelectorAll("div.rgb-group");
  const hslGroups = document.querySelectorAll("div.hsl-group");

  for (let c = 0; c < colours.length; c++) {

    hexColours[c].addEventListener("input", function() {
      if (this.value.length == 6 && 
          /[A-F,0-9]{6}/i.test(this.value) == true) {
            writeHexToRgb(c + 1);
            writeRgbToHsl(c + 1);
          }
    });

    const rgbSet = rgbGroups[c].querySelectorAll(".R, .G, .B");
    for (let rgb of rgbSet) {
      rgb.addEventListener("input", function() {
        if (this.value <= 255 &&
            this.value >= 0) {
              writeRgbToHsl(c + 1);
              writeRgbToHex(c + 1);
        }
      });
    }

    const h = document.querySelector("#numberH" + (c + 1));
      h.addEventListener("input", function() {
        if (this.value >= 0 &&
            this.value < 360) {
              writeHslToRgb(c + 1);
              writeRgbToHex(c + 1);
        }
      });

      const slSet = hslGroups[c].querySelectorAll(".S, .L");
      for (let sl of slSet) {
        sl.addEventListener("input", function() {
          if (this.value >= 0 &&
              this.value <= 1) {
                writeHslToRgb(c + 1);
                writeRgbToHex(c + 1);
          }
      });
    }
  }

  const greyscaleToggle = document.querySelector("#greyscaleSwitch");
  greyscaleToggle.addEventListener("change", () => {
    if (greyscaleToggle.checked) {
      document.body.style.filter = "grayscale(100%)";
    }
    else {
      document.body.style.filter = "grayscale(0%)";
    }
  });
}

function tryStorage() {
  let colours = localStorage.getItem("colours");
  
  if (colours == null) {
    let colours = [
      {"name": "switchNeonPurple", "hex": "b400e6"},
      {"name": "switchNeonOrange", "hex": "faa005"},
      {"name": "switchNeonGreen", "hex": "1edc00"}
    ];
    localStorage.colours = JSON.stringify(colours);
  }

  colours = JSON.parse(localStorage.getItem("colours"));

  for (let c = 0; c < 3; c++) {
    document.querySelector("#hexCode" + (c + 1)).value =
      colours[c].hex;
    document.querySelector("#colour" + (c + 1) + " h1").innerText =
      colours[c].name;

    writeHexToRgb(c + 1);
    writeRgbToHsl(c + 1);
  }
}

function writeHexToRgb(n) {
  let hex = document.querySelector("#hexCode" + n).value;

  if (
    hex.length == 6 && 
    /[A-F,0-9]{6}/i.test(hex) == true
    ) {
    document.querySelector("#numberR" + n).value = 
        parseInt(hex.substr(0,2), 16);
    document.querySelector("#numberG" + n).value = 
        parseInt(hex.substr(2,2), 16);
    document.querySelector("#numberB" + n).value = 
        parseInt(hex.substr(4,2), 16);
  }

  setFieldsetColours(n);
}

function writeRgbToHsl(n) {
  const Rp = document.querySelector("#numberR" + n).value / 255;
  const Gp = document.querySelector("#numberG" + n).value / 255;
  const Bp = document.querySelector("#numberB" + n).value / 255;

  const Cmax = Math.max(Rp, Gp, Bp);
  const Cmin = Math.min(Rp, Gp, Bp);
  const Cdelta = Cmax - Cmin;
  
  let H = 0;
  if (Cdelta == 0) {
  }
  else if (Rp == Cmax) {
    H = 60 * (((Gp - Bp) / Cdelta) % 6);
  }
  else if (Gp == Cmax) {
    H = 60 * (((Bp - Rp) / Cdelta) + 2);
  }
  else if (Bp == Cmax) {
    H = 60 * (((Rp - Gp) / Cdelta) + 4);
  }

  if (H < 0) {
    H = H + 360;
  }

  let L = (Cmax + Cmin) / 2;

  let S = 0;
  if (Cdelta == 0) {
  }
  else {
    S = Cdelta / (1 - Math.abs((2 * L) - 1));
  }

  document.querySelector("#numberH" + n).value = H.toFixed(0);
  document.querySelector("#numberS" + n).value = S.toFixed(2);
  document.querySelector("#numberL" + n).value = L.toFixed(2);
}

function writeRgbToHex(n) {
  const R = document.querySelector("#numberR" + n).value;
  const G = document.querySelector("#numberG" + n).value;
  const B = document.querySelector("#numberB" + n).value;

  let Rh = parseInt(R).toString(16).padStart(2, "0");
  let Gh = parseInt(G).toString(16).padStart(2, "0");
  let Bh = parseInt(B).toString(16).padStart(2, "0");

  document.querySelector("#hexCode" + n).value = Rh + Gh + Bh;

  setFieldsetColours(n);
}

function writeHslToRgb(n) {
  const H = document.querySelector("#numberH" + n).value;
  const S = document.querySelector("#numberS" + n).value;
  const L = document.querySelector("#numberL" + n).value;

  const C = (1 - Math.abs((2 * L) - 1)) * S;
  const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = L - (C / 2);

  let Rh = 0;
  let Gh = 0;
  let Bh = 0;

  if (H >= 0 && H < 60) {
    Rh = C; Gh = X; Bh = 0;
  } else if (H >= 60 && H < 120) {
    Rh = X; Gh = C; Bh = 0;
  } else if (H >= 120 && H < 180) {
    Rh = 0; Gh = C; Bh = X;
  } else if (H >= 180 && H < 240) {
    Rh = 0; Gh = X; Bh = C;
  } else if (H >= 240 && H < 300) {
    Rh = X; Gh = 0; Bh = C;
  } else if (H >= 300 && H < 360) {
    Rh = C; Gh = 0; Bh = X;
  }

  let R = ((Rh + m) * 255).toFixed(0);
  let G = ((Gh + m) * 255).toFixed(0);
  let B = ((Bh + m) * 255).toFixed(0);

  document.querySelector("#numberR" + n).value = R;
  document.querySelector("#numberG" + n).value = G;
  document.querySelector("#numberB" + n).value = B;
}

function setFieldsetColours(n) {
  const colour = document.querySelector("#colour" + n);
  const hex = document.querySelector("#hexCode" + n).value;
  colour.style.backgroundColor = "#" + hex;

  const R = parseInt(hex.substr(0,2), 16);
  const G = parseInt(hex.substr(2,2), 16);
  const B = parseInt(hex.substr(4,2), 16);

  document.querySelector("#luminosity" + n).value = 
    (((R * 0.299) + (G * 0.587) + (B * 0.114)) / 255).toFixed(3);

  const testLuminance = calcLuminance(R, G, B);
  if (testLuminance < 0.175) {
    colour.style.color = "white";
  }
  else if (testLuminance > 0.183) {
    colour.style.color = "black";
  }
  
  document.querySelector("#luminance" + n).value = testLuminance;

  calcContrastRatios();
}

function calcLuminance(R, G, B) {
  R = R / 255;
  let Rs;
  if (R <= 0.03928) {
    Rs = R / 12.92;
  }
  else {
    Rs = Math.pow(((R + 0.055) / 1.055), 2.4);
  }

  G = G / 255;
  let Gs;
  if (G <= 0.03928) {
    Gs = G / 12.92;
  }
  else {
    Gs = Math.pow(((G + 0.055) / 1.055), 2.4);
  }

  B = B / 255;
  let Bs;
  if (B <= 0.03928) {
    Bs = B / 12.92;
  }
  else {
    Bs = Math.pow(((B + 0.055) / 1.055), 2.4);
  }

  return ((Rs * 0.2126) + (Gs * 0.7152) + (Bs * 0.0722)).toFixed(3);
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