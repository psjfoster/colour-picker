/* swatches.js */

async function onLoad() {
  const getColours = await fetch("./colourSwatches.json");
  const coloursJson = await getColours.json();

  let colours = createSwatches(coloursJson.colours);
  console.log(orderSwatches(colours));
}

function createSwatches(colours) {
  for (c = 0; c < colours.length; c++) {

    if (document.getElementById("swatch" + c) == undefined) {
      addSwatch(c);
    }
    const div = document.getElementById("swatch" + c);
    const h1 = div.getElementsByTagName("h1")[0];
    const input = div.getElementsByTagName("input")[0];
    const name = colours[c].name;
    const hex = colours[c].hex;
    
    if (colours[c].luminance == undefined || colours[c].hue == undefined) {
      let r = parseInt(hex.substr(0,2), 16) / 255
      let g = parseInt(hex.substr(2,2), 16) / 255;
      let b = parseInt(hex.substr(4,2), 16) / 255;

      colours[c].luminance = calcLuminance(r, g, b);
      colours[c].hue = calcHue(r, g, b);
    }

    const luminance = parseFloat(colours[c].luminance);

    div.style.backgroundColor = "#" + hex;
    h1.innerHTML = name;
    input.value = hex;
    input.title = name;

    if (luminance < 0.175) {
      div.style.color = "white";
    } else {
      div.style.color = "black";
    }
  }
  
  return colours;
}

function calcLuminance(r, g, b) {
  let rgb = [r, g, b];
  
  for (let x = 0; x < 3; x++) {
    let y = rgb[x];
    if (y <= 0.03928) {
      y = y / 12.92
    } else {
      y = Math.pow(((y + 0.055) / 1.055), 2.4)
    }
    rgb[x] = y;
  }

  return ((rgb[0] * 0.2126) + (rgb[1] * 0.7152) + (rgb[2] * 0.0722)).toFixed(3);
}

function addSwatch(n) {
  const swatches = document.getElementById("swatches");
  const refSwatch = document.getElementById("swatch0");
  const newSwatch = refSwatch.cloneNode(true);

  newSwatch.id = "swatch" + n;
  swatches.appendChild(newSwatch);
}

function calcHue(r, g, b) {
  const Cmax = Math.max(r, g, b);
  const Cmin = Math.min(r, g, b);
  const Cdelta = Cmax - Cmin;
  
  let hue = 0;
  if (Cdelta == 0) {
  }
  else if (r == Cmax) {
    hue = 60 * (((g - b) / Cdelta) % 6);
  }
  else if (g == Cmax) {
    hue = 60 * (((b - r) / Cdelta) + 2);
  }
  else if (b == Cmax) {
    hue = 60 * (((r - g) / Cdelta) + 4);
  }

  if (hue < 0) {
    hue = hue + 360;
  }
  return hue.toFixed(0);
}

function orderSwatches(colours) {
  colours.sort(function(a, b) {
    if (parseInt(a["hue"]) > parseInt(b["hue"])) {
      return -1;
    } else if (parseInt(a["hue"]) < parseInt(b["hue"])) {
      return 1;
    } else {
      if (a["luminance"] > b["luminance"]) {
        return -1;
      } else {
        return 1;
      }
    }
  });

  return colours;
}