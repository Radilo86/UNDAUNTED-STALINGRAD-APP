// Service worker: guarda la app para usarla sin conexión una vez instalada.
const CACHE = 'stc-1.8.2-20261124133631';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('stc-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
// Responde desde la caché (rápido y sin conexión) y descarga en segundo plano la versión nueva para la próxima apertura.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then((c) => c.match(e.request).then((hit) => {
    const net = fetch(e.request).then((r) => {
      if (r && r.ok) c.put(e.request, r.clone());
      return r;
    }).catch(() => hit || c.match('./index.html'));
    return hit || net;
  })));
});
