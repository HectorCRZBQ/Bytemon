// Variables para el mapa y la capa de Leaflet
let map;
let tileLayer;

function setup() {
    // No creamos el canvas de p5.js ya que Leaflet ocupará todo el espacio.
    noCanvas();

    // Configuramos el mapa de Leaflet en el div con id 'map'
    map = L.map('map').setView([40.416775, -3.703790], 5); // Coordenadas de Madrid, España como ejemplo

    // Añadimos una capa de mosaicos de OpenStreetMap
    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function draw() {
    // Aquí puedes agregar código de p5.js para dibujar sobre el mapa o actualizar elementos
}
