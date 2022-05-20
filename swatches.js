/* swatches.js */

async function onLoad() {
  const getColours = await fetch("./colourSwatches.json");
  const coloursJson = await getColours.json();

  console.log(createSwatches(coloursJson.colours));
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
    
    if (colours[c].luminance == undefined) {
      colours[c].luminance = calcLuminance(hex);
    }
    const luminance = parseFloat(colours[c].luminance);
    console.log(luminance);

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

function calcLuminance(hex) {
  let r = parseInt(hex.substr(0,2), 16);
  let g = parseInt(hex.substr(2,2), 16);
  let b = parseInt(hex.substr(4,2), 16);

  let rgb = [r, g, b];

  for (let x = 0; x < 3; x++) {
    let y = rgb[x];
    y = y / 255;
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