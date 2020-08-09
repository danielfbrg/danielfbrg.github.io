// call the map   (map name)    [latitude , longitude] (zoomLevel)
const mymap = L.map("map").setView([-22.405, -41.8447], 18);

//Icon RootLocus
var photoImg =
  '<img src="https://static.wixstatic.com/media/189865_8ea3588f2cff4bc790a53994876270fd~mv2.png/v1/fill/w_199,h_50,al_c,q_85,usm_0.66_1.00_0.01/Logo%20-%20RootLocus.webp" height="40px" width="140px"/>';


//Icon ProfEPT
var photoImg2 =
  '<img src="http://portal1.iff.edu.br/pesquisa-e-inovacao/pos-graduacao-stricto-sensu/mestrado-profissional-em-educacao-profissional-e-tecnologica/arquivo/profept-novo-900-400.png" height="70px" width="140px"/>';


//Layer Styles
var styleTerreo = {
  color: "#00b8ff",
  weight: 1,
  opacity: 1,
};

var stylePav1 = {
  color: "#09ff00",
  weight: 1,
  opacity: 1,
};

var stylePav2 = {
  color: "#fdff00",
  weight: 1,
  opacity: 1,
};

var stylePav3 = {
  color: "#ff0000",
  weight: 1,
  opacity: .9,
  fillOpacity: 0.4
};

//Ok

//var lyrLim;
var lyrTerreo;
var lyrPav1;
var lyrPav2;
var lyrPav3;

//Layers

//lyrLim = L.geoJson(lim).addTo(mymap);

lyrTerreo = L.geoJson(ter, {
  style: styleTerreo,
})
  .bindPopup(function (lyrTerreo) {
    if (lyrTerreo.feature.properties.Nome === "Guarita Secundária") {
      return ` <center> <b> ${lyrTerreo.feature.properties.Nome} </b> <br> Horário de Funcionamento: 7h as 18h <center>`;
    } else {
      return `<b> ${lyrTerreo.feature.properties.Nome} </b>`;
    }
  })
  .addTo(mymap);

lyrPav1 = L.geoJson(pav1, {
  style: stylePav1,
})
  .bindPopup(function (lyrPav1) {
    return ` <center> <b> ${lyrPav1.feature.properties.Nome} </b> <br> Bloco ${lyrPav1.feature.properties.Bloco} </center>`;
  })
  .addTo(mymap);

lyrPav2 = L.geoJson(pav2, {
  style: stylePav2,
})
  .bindPopup(function (lyrPav2) {
    if (lyrPav2.feature.properties.Nome === "RootLocus Empresa JR") {
      return `<center> <b> ${lyrPav2.feature.properties.Nome} </b> <br> Bloco ${lyrPav2.feature.properties.Bloco} <br>
      ${photoImg} </br> <a href="https://www.rootlocus.com.br/"> Site </a> </center> `;
    }
    
    if (lyrPav2.feature.properties.Nome === "ProfEPT") {
      return `<center> <b> ${lyrPav2.feature.properties.Nome} </b> <br> Bloco ${lyrPav2.feature.properties.Bloco} <br>
      ${photoImg2} </br> <a href="http://portal1.iff.edu.br/pesquisa-e-inovacao/pos-graduacao-stricto-sensu/mestrado-profissional-em-educacao-profissional-e-tecnologica/mestrado-profissional-em-educacao-profissional-e-tecnologica"> Site </a> </center> `;

    } else {
      return `<center> <b> ${lyrPav2.feature.properties.Nome} </b> <br> Bloco ${lyrPav2.feature.properties.Bloco} </center>`;
    }
  })
  .addTo(mymap);

lyrPav3 = L.geoJson(pav3, {
  style: stylePav3,
})
  .bindPopup(function (lyrPav3) {
    return `<center> <b> ${lyrPav3.feature.properties.Nome} </b> <br> Bloco ${lyrPav3.feature.properties.Bloco} </center>`;
  })
  .addTo(mymap);

//Raster
var image = L.imageOverlay(
  "data/img/image.png",
  [
    [-22.403105, -41.847423],
    [-22.40635, -41.841215],
  ],
  {
    opacity: 0.9,
  }
).addTo(mymap);

//Itens to control(se estiver aqui, podemos escolher o comportamento, se estiver fora, estará fixo)
objOverlays = {
  //Limite: lyrLim,
  Térreo: lyrTerreo,
  "1º Pavimento": lyrPav1,
  "2º Pavimento": lyrPav2,
  "3º Pavimento": lyrPav3,
};

//Itens on Control
ctlLayers = L.control.layers(objOverlays).addTo(mymap);

//Add Tiles Types

//add tiles 1
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, {
  attribution:
    'danielfbrg@gmail.com &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 20,
});
tiles.addTo(mymap);

//add tiles 2
// L.tileLayer(
//   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
//   {
//     attribution:
//       'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 20,
//     id: "mapbox/streets-v11",
//     tileSize: 512,
//     zoomOffset: -1,
//     //my mapbox token
//     accessToken:
//       "pk.eyJ1IjoiZGFuaWVsZmJyZyIsImEiOiJja2J6Ym9zYnIwYXpoMnFvMTA4Z3A0eXVqIn0.ey31A__mikWlwap5Flbo1g",
//   }
// ).addTo(mymap);
