const CACHE='prom-v64';
const BASE='/Prometheus';
const ASSETS=[
  BASE+'/',
  BASE+'/index.html',
  BASE+'/manifest.json',
  BASE+'/icons/icon-192.png',
  BASE+'/icons/icon-512.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(c=>{
      if(c)return c;
      return fetch(e.request).then(r=>{
        if(r&&r.status===200){
          const rc=r.clone();
          caches.open(CACHE).then(cache=>cache.put(e.request,rc));
        }
        return r;
      }).catch(()=>caches.match(BASE+'/index.html'));
    })
  );
});
