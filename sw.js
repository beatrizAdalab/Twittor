//imports
importScripts('js/sw-utils.js');


// variables cache
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dinamyc-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//intalamos las caches
self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


//eliminar cache antiguo
self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if(key !== STATIC_CACHE  && key.includes('static')) {
                return caches.delete(key)
            }
            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        })
    });

    e.waitUntil( respuesta );
});

self.addEventListener('fetch', e => {
//busca en cache si no está, ve a internet y actualiza cache
    const respuesta = caches.match(e.request).then(res => {
        if(res){
            return res
        } else {
           return fetch(e.request).then(newRes => {
               return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes )
           })
        }
    });


    e.respondWith(respuesta);
})