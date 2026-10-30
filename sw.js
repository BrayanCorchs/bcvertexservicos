/* BC Vertex Serviços — funciona offline */
const VERSAO='bcv-servicos-v1';
const ARQUIVOS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSAO).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSAO).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // página: tenta a internet primeiro (pega atualizações), sem internet usa a cópia salva
  if(r.mode==='navigate'||(u.origin===location.origin&&u.pathname.endsWith('.html'))){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSAO).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html').then(m=>m||caches.match('./'))));return}
  // demais arquivos e fontes: cópia salva primeiro
  if(u.origin===location.origin||u.hostname.endsWith('gstatic.com')||u.hostname.endsWith('googleapis.com')){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(VERSAO).then(c=>c.put(r,cp))}return res})))}
});
