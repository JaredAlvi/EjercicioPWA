//Asignar nombre y version de la cache 
const CACHE_NAME='v1_cache_BCH_PWA';

//Configuracion de los ficheros a subir a la cache de la aplicacion
var urlsToCache= [
    './',
    './css/styles.css',
    './img/favicon-16.png',
    './img/favicon-32.png',
    './img/favicon-64.png',
    './img/favicon-96.png',
    './img/favicon-128.png',
    './img/favicon-192.png',
    './img/favicon-256.png',
    './img/favicon-384.png',
    './img/favicon-512.png',
    './img/favicon-1024.png'
];
//Eventos del ServerWorker
//Evento Install
//Se encarga de la instalacion del SW
//Guarda en cache los recursos estaticos
//La variable self permite 

self.addEventListener('install', e=> {
    //Utilizando la variable del evento
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
            //Le mandamos los elementos que tenemos en el array
            return cache.addAll(urlsToCache)
                .then(()=>{
                    self.skipWaiting();
                })
        })
        .catch(err=>console.log('No se ha registrado el cache', err))
    );
});

//Evento Activate 
//este evento permite que la aplicacion funcione offline
self.addEventListener('activate', e => {
    const cacheWhiteList = [CACHE_NAME];

    //que el evento espere a que termine de ejecutar
    e.waitUntil(
        caches.keys()
            .then(cachesNames=>{
                return Promise.all(
                    cachesNames.map(cachesName => {
                        if(cacheWhiteList.indexOf(cachesName)==-1)
                        {
                            //Borrar elementos que no se necesitan
                            return cache.delete(cachesName);
                        }
                    })
                );
            })
            .then(()=> {
                self.clients.claim();   //activa la cahce en el dispositivo

            })
    );
})

//Evento fetch
//consigue la informacion de intener.. hace una consulta al backend
//cuando se salrta de una pagina a otra pagina.. por ejemplo
//checa si ya tiene los recursos en cache y sino los solicita

self.addEventListener('fetch', e => {
    e.respdWith (
        caches.match(e.request)
            .then(res => {
                if(res){
                    //devuelvo datos desde cache
                    return res;
                }
                return fetch(e.request);//hago peticion al servidor en caso de de que no este en cache
            })
    );
});