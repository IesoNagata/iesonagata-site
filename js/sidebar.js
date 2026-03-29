(function(){
var leftHTML='<div class="sidebar-section"><h3 class="sidebar-title">Categorias</h3><ul class="sidebar-menu"><li><a href="#">Sem categoria</a></li></ul></div><div class="sidebar-section"><h3 class="sidebar-title">Clima</h3><div class="weather-widget"><div class="weather-icon">&#9728;&#65039;</div><div class="weather-temp">28&deg;C</div><div class="weather-condition">S&atilde;o Paulo, SP</div></div></div><div class="sidebar-section"><h3 class="sidebar-title">Tech News</h3><ul class="sidebar-menu" id="tech-news-list"><li>Carregando...</li></ul></div>';
var rightHTML='<div class="trending-section"><h3 class="sidebar-title">Em Alta</h3><ol class="trending-list"><li><a href="/2026/03/15/do-cansaco-ao-codigo-como-um-domingo-de-folga-virou-um-projeto-de-software/">Do Cansa\u00e7o ao C\u00f3digo</a></li><li><a href="/2026/02/27/conheca-o-cubecoders-amp-o-painel-de-controle-definitivo-para-seus-servidores-de-jogos/">CubeCoders AMP</a></li><li><a href="/2026/02/20/proxmox-arma-reforger-e-wordpress/">Proxmox, Arma Reforger e WordPress</a></li><li><a href="/2026/03/08/jogatina-armareforger/">Jogatina #ArmaReforger</a></li><li><a href="/2026/02/20/ksk-rostov-mais-uma-guerra-iniciada/">KSK Rostov</a></li></ol></div><div class="trending-section"><h3 class="sidebar-title">Tags</h3><div class="tags-cloud"><a href="#" class="tag-link">arma reforger</a><a href="#" class="tag-link">game server</a><a href="#" class="tag-link">linux</a><a href="#" class="tag-link">games</a><a href="#" class="tag-link">proxmox</a><a href="#" class="tag-link">cube coders</a><a href="#" class="tag-link">AMP</a></div></div><div class="trending-section"><h3 class="sidebar-title">Siga-nos</h3><ul class="sidebar-menu social-menu"><li><a href="https://www.facebook.com/IesoNagata" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877f2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook</a></li><li><a href="https://www.youtube.com/@iesonagata" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff0000"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg> YouTube</a></li><li><a href="https://www.instagram.com/iesonagata/" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e4405f" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#e4405f"/></svg> Instagram</a></li></ul></div>';
var l=document.getElementById("sidebar-left");
if(l)l.innerHTML=leftHTML;
var r=document.getElementById("sidebar-right");
if(r)r.innerHTML=rightHTML;
var rssUrl=encodeURIComponent("https://news.google.com/rss/topics/CAAqLAgKIiZDQkFTRmdvSkwyMHZNR1ptZHpWbUVnVndkQzFDVWhvQ1FsSW9BQVAB?hl=pt-BR&gl=BR&ceid=BR:pt-419");
fetch("https://api.rss2json.com/v1/api.json?rss_url="+rssUrl+"&count=10")
.then(function(r){return r.json()})
.then(function(data){
var list=document.getElementById("tech-news-list");
if(!list)return;
if(data.status==="ok"&&data.items&&data.items.length>0){
var html="";
var count=Math.min(data.items.length,10);
for(var i=0;i<count;i++){
var t=data.items[i].title;
var l=data.items[i].link;
html+='<li><a href="'+l+'" target="_blank" rel="noopener">'+t+'</a></li>';
}
list.innerHTML=html;
}else{
list.innerHTML='<li><a href="https://news.google.com/topics/CAAqLAgKIiZDQkFTRmdvSkwyMHZNR1ptZHpWbUVnVndkQzFDVWhvQ1FsSW9BQVAB?hl=pt-BR&gl=BR&ceid=BR%3Apt-419" target="_blank" rel="noopener">Ver no Google News</a></li>';
}
})
.catch(function(){
var list=document.getElementById("tech-news-list");
if(list)list.innerHTML='<li><a href="https://news.google.com/topics/CAAqLAgKIiZDQkFTRmdvSkwyMHZNR1ptZHpWbUVnVndkQzFDVWhvQ1FsSW9BQVAB?hl=pt-BR&gl=BR&ceid=BR%3Apt-419" target="_blank" rel="noopener">Ver no Google News</a></li>';
});
})();
