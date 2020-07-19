//LayerGeoJSON
var mescladoLayer;


const city = {
  nome: [],
  id: [],
  casos: [],
  mortes: [],
  taxa: [],
  data: [],
};

/* Função que Destaca o Polígono */
function highlightFeature(e) {
  var layer = e.target;

  const [casosCorona, mortesCorona, dataUpdate] = renderCovidCases(
    layer.feature.properties.NM_MUN
  );

  /*Enviando municipio pro html acima do mapa*/
  //   document.getElementById("local_selecionado").textContent =
  //     e.target.feature.properties.NM_MUN;

  console.log(e.target.feature.properties.NM_MUN);
  console.log(e.target.feature.properties.CD_MUN);
  console.log(layer.feature.properties.NM_MUN);

  layer.setStyle({
    weight: 4,
    color: "#e6e0db",
    fillColor: "white",
    fillOpacity: 0,
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }

  layer.bindTooltip(
    `<small><center> <b> ${e.target.feature.properties.NM_MUN} </b></center><br>
    
      Confirmados<span><b></b></span>:<b> ${casosCorona} </b><br> 
      Óbitos<b></b>:  <b>${mortesCorona}</b><br><br>
      
      <b> <small> <center>Data de Atualização:</b><br><center> ${dataUpdate}</small> <br> `,
    { direction: "auto", noHide: true, sticky: true, opacity: 0.85 }
  );
}

/*Função Reseta HighLigth */
function resetHighlight(e) {
  mescladoLayer.resetStyle(e.target);
}

/*Função Click gera Zoom para Municípo Clicado */
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());

  var layer = e.target;

  console.log(e.target._tooltip._content); // Exibe conteudo da legenda pos click

  layer.setStyle({
    fillColor: "white",
    fillOpacity: 0,
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}

/*Função Interação com Munícipio */
function countriesOnEachFeature(feature, layer) {

  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
  console.log(layer.target);
}

/*Função que Define cores das Camadas */
function mescladoStyle(feature) {
  return {
    fillColor: getmescladoColor(feature.properties.NM_MICRO),
    weight: 2.2,
    opacity: 1,
    color: "#005AA8",
    dashArray: 3,
    fillOpacity: 0.7,
  };
}

/*Função que Define Cores pela Microrregião*/
function getmescladoColor(NM_MICRO) {
  if (NM_MICRO == "Macaé") {
    return "#87cefa";
  } else if (NM_MICRO == "Lagos") {
    return "blue";
  } else if (NM_MICRO == "Campos dos Goytacazes") {
    return "#c1c1c1";
  } else if (NM_MICRO == "Bacia de São João") {
    return "#43bc7e";
  } else {
    return "none";
  }
}

/* Controle do mapa */
var map = L.map("map").setView([-22.40452, -42.6734], 7.4);

mescladoLayer = L.geoJson(mesclado, {
  style: mescladoStyle,
  onEachFeature: countriesOnEachFeature,
}).addTo(map);

/*Adiciona Basemap*/
var Stadia_AlidadeSmoothDark = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 8.8,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }
);
map.addLayer(Stadia_AlidadeSmoothDark);

/* Controle da Legenda */
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  var labels = ["Bacia de São João", "Campos dos Goytacazes", "Lagos", "Macaé"];

  //div.innerHTML = "<div><center><b>Microrregiões</b></div>";

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
      '<i style=" background:' +
      getmescladoColor(labels[i]) +
      '">&nbsp</i>' +
      labels[i] +
      "<br/>";
  }
  return div;
};
legend.addTo(map);


/* Envia local do mouse para função */
function renderCovidCases(onmouse) {
  pos = city.nome.indexOf(`${onmouse}`);

  if (pos != -1) {
    //Teste Municipio
    console.log(`${city.nome[pos]}`);

    //Teste Casos
    console.log(`Casos: ${city.casos[pos]}`);

    //Teste Óbitos
    console.log(`Óbitos: ${city.mortes[pos]}`);

    //Teste Data
    console.log(`Data de Atual.: ${city.data[pos]}.`);

    //Envia dados Recebidos da Api
    const casosCorona = city.casos[pos];
    const mortesCorona = city.mortes[pos];

    //Recebe data de atualização
    const dataUpdateFormate = city.data[pos];

    //Altera formatação da Data
    function FormataStringData(dataUpdateFormate) {
      var dia = dataUpdateFormate.split("-")[0];
      var mes = dataUpdateFormate.split("-")[1];
      var ano = dataUpdateFormate.split("-")[2];

      return ano + "-" + ("0" + mes).slice(-2) + "-" + ("0" + dia).slice(-2);
    }

    //Envia data no formato BR
    const dataUpdate = FormataStringData(dataUpdateFormate);

    //Teste Data
    console.log(`Data de Atual.: ${dataUpdate}.`);


    return [casosCorona, mortesCorona, dataUpdate];
  } else {
    console.log("Nenhuma cidade selecionada");
  }
}

// API Url

const api_url =
  "https://brasil.io/api/dataset/covid19/caso/data/?is_last=True&state=RJ";

// Salvando a API localmente

async function receiveAPI() {
  const response = await fetch(api_url); //busca a API
  const data = await response.json();

  for (var i = 0; i < 94; i++) {
    city.nome[i] = data.results[i].city;
    city.id[i] = data.results[i].city_ibge_code;
    city.casos[i] = data.results[i].confirmed;
    city.mortes[i] = data.results[i].deaths;
    city.taxa[i] = data.results[i].death_rate;
    city.data[i] = data.results[i].date;
  }
  return city;
}

receiveAPI();
