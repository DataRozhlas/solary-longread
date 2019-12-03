const mapaProvozoven = document.querySelector('#mapa-provozoven');
if (window.innerWidth < 600) {
    mapaProvozoven.innerHTML = '<img src="https://data.irozhlas.cz/solary-longread/grafika/mapa2.gif" alt="Animovaná mapa solárních elektráren" style="width:100%;"><p style="font-size:75%"><a href="https://public.flourish.studio/visualisation/1033932/">Interaktivní verze mapy (cca 4 MB)</a>';
    console.log("úzkej");
} else {
    console.log("širokej");
    mapaProvozoven.innerHTML = '<div class="flourish-embed" data-src="visualisation/1033932"></div>';
}

