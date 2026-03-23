// Prometheus v6.3 Définitif — Service Worker
// Gestion offline intelligente + cache météo
const CACHE = 'prometheus-v63-def';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Open-Meteo : network first, timeout 4s, fallback cache avec header
  if (url.hostname === 'api.open-meteo.com') {
    e.respondWith(
      Promise.race([
        fetch(e.request).then(r => {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return r;
        }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))
      ]).catch(() =>
        caches.match(e.request).then(cached =>
          cached
            ? new Response(cached.body, { headers: { ...cached.headers, 'X-Offline': '1' } })
            : new Response('{"offline":true}', { headers: { 'Content-Type': 'application/json' } })
        )
      )
    );
    return;
  }
  // Assets : cache-first
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
