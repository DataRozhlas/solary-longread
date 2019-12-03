var map = L.map('map').setView([33, 0], 2);
map.scrollWheelZoom.disable()

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
});

var statusColor = {
    'start': '#4daf4a',
    'closed': '#e41a1c',
    'planned': '#ff7f00'
};

var catName = {
    'start': '<span style="color: #4daf4a;">Zahájena stavba reaktorů: ',
    'closed': '<span style="color: #e41a1c;">Uzavřeno reaktorů: ',
    'planned': '<span style="color: #ff7f00;">Plánováno reaktorů: '
};

function cRadius(val) {
    return Math.sqrt(val / Math.PI)
}

function drawMap(startPeriod) {
    map.eachLayer(function (layer) { //uklid prekresleni
        map.removeLayer(layer);
    });
    tiles.addTo(map)
    
    var reaktorySel = Object.values(reaktory).filter(re => 
        ((re.start >= startPeriod[0]) & (re.start <= startPeriod[1])) 
        | ((re.zavreno >= startPeriod[0]) & (re.zavreno <= startPeriod[1]))  //filtr podle casu
    );

    var nukePlants = {};
    Object.values(reaktorySel).forEach(function(re) { //rozdeleni do kategorii, grouping po elektrarnach
        if (!([re.lat, re.long] in nukePlants)) {
            nukePlants[[re.lat, re.long]] = {
                'start': [],
                'closed': [],
                'planned': [],
            };
        }
        // rozdeleni do kat. podle stavu data zmeny
        if (((re.start >= startPeriod[0]) & (re.start <= startPeriod[1])) & (re.stav != 'plánovaná')) {
            nukePlants[[re.lat, re.long]]['start'].push(re)
        }
        if ((re.zavreno >= startPeriod[0]) & (re.zavreno <= startPeriod[1])) {
            nukePlants[[re.lat, re.long]]['closed'].push(re)
        }
        if (((re.start >= startPeriod[0]) & (re.start <= startPeriod[1])) & (re.stav == 'plánovaná')) {
            nukePlants[[re.lat, re.long]]['planned'].push(re)
        }
    });

Object.keys(nukePlants).forEach(function(plant) {
    var markers = [];
    var cats = Object.keys(nukePlants[plant])
    cats.sort(function(a, b) {
        return nukePlants[plant][b].length - nukePlants[plant][a].length;
    })
    cats.forEach(function(cat) {
        var len = nukePlants[plant][cat].length;
        if (len > 0) {
            markers.push(L.circleMarker(plant.split(',').map(Number), {
                radius: cRadius(len * 120),
                color: '#bdbdbd',
                weight: 1,
                fillColor: statusColor[cat],
                fillOpacity: 0.8,
            }).on('click', function(e) {
                var ttipHead,
                    ttipBody = '';
                var p = e.target._latlng;
                var data = nukePlants[[p.lat, p.lng]];
                Object.keys(data).forEach(function(cname) {
                    var c = data[cname]
                    if (c.length > 0) {
                        ttipHead = 'Elektrárna <b>' + c[0].platz + '</b>, ' + c[0].stat + ', výkon ' + c[0].kapacita + ' MWh';
                        
                        var years = []; //vypis let
                        if ((cname == 'start') | (cname == 'planned')) {
                            c.forEach(function(v) {
                                years.push(v.start)
                            })
                        } else if (cname == 'closed') {
                            c.forEach(function(v) {
                                years.push(v.zavreno)
                            })
                        }
                        ttipBody += '<br>' + catName[cname] + c.length + ' (' 
                        + String(Array.from(new Set(years))).replace(/,/g, ', ') + ')</span>'
                    }
                })
                document.getElementById('ttip').innerHTML = ttipHead + ttipBody;
            })
        );
        };
    });
    var plantMarkers = L.layerGroup(markers).addTo(map);  
});
};

drawMap([1955, 1986])
document.getElementById('selector').addEventListener('change', function(e) {
    drawMap(e.target.value.split(',').map(Number))
});