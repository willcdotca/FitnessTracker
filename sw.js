let cacheName = "FitnessTracker";

let filesToCache = [
  "/FitnessTracker/",
  "sw.js",
  "assets/media/alarm.mp3",
  "manifest.json",
  "assets/img/icon_192.png",
  "assets/img/icon_256.png",
  "assets/img/icon_512.png"
];

self.addEventListener("install", event=>
    event.waitUntil(caches.open(cacheName).then((cache) =>cache.addAll(filesToCache)))
)

self.addEventListener('fetch', event=> {
  if (event.request.url.includes('clean-cache')) caches.delete(cacheName).then(isDeleted=>console.log('Cache cleared'))
  event.respondWith(caches.match(event.request).then(response=>response || fetch(event.request)));
});

self.addEventListener('activate', e=> {
  e.waitUntil(caches.keys().then( keyList=>
      Promise.all(keyList.map(key=> { if (key !== cacheName) return caches.delete(key)})))
  );
  return self.clients.claim();
});
