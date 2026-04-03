(function(){
var scripts=document.getElementsByTagName("script");
var last=scripts[scripts.length-1];
var src=last.getAttribute("src")||"";
var base=src.replace(/\?.*$/,"").replace(/js\/sidebar\.js$/,"");
var leftHTML='<div class="sidebar-section"><h3 class="sidebar-title">Servidores Aeromad</h3><ul class="sidebar-menu" id="server-widget"><li>Carregando...</li></ul></div><div class="ad-square"><ins class="adsbygoogle" data-ad-client="ca-pub-4111535989023878" data-ad-slot="1111111111" data-ad-format="rect" data-full-width-responsive="true"></ins></div><div class="sidebar-section"><h3 class="sidebar-title">Categorias</h3><ul class="sidebar-menu" id="categories-list"><li>Carregando...</li></ul></div><div class="sidebar-section"><h3 class="sidebar-title">Tech News</h3><ul class="sidebar-menu" id="tech-news-list"><li>Carregando...</li></ul></div>';
var rightStatic='<div class="trending-section"><h3 class="sidebar-title">Postagens</h3><ol class="trending-list" id="posts-list"><li>Carregando...</li></ol></div><div class="trending-section"><h3 class="sidebar-title">Tags</h3><div class="tags-cloud" id="tags-cloud"></div></div><div class="ad-vertical"><ins class="adsbygoogle" data-ad-client="ca-pub-4111535989023878" data-ad-slot="2222222222" data-ad-format="vertical" data-full-width-responsive="true"></ins></div><div class="trending-section"><h3 class="sidebar-title">Redes Sociais</h3><ul class="sidebar-menu social-menu"><li><a href="https://www.facebook.com/IesoNagata" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877f2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook</a></li><li><a href="https://www.youtube.com/@iesonagata" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff0000"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg> YouTube</a></li><li><a href="https://www.instagram.com/iesonagata/" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e4405f" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#e4405f"/></svg> Instagram</a></li></ul></div>';
var l=document.getElementById("sidebar-left");
if(l)l.innerHTML=leftHTML;
var r=document.getElementById("sidebar-right");
if(r)r.innerHTML=rightStatic;

function updateServerStatus(){
  var sw=document.getElementById("server-widget");
  if(!sw)return;
  var servers=[
    {name:"[SP/BR] iesonagata.com.br | 666th Aeromad Company Brasil | support server",id:"38346193"},
    {name:"666th Aeromad Company Brasil Oficial - Faircroft Islands",id:"38381095"}
  ];
  if(servers.length===0){
    sw.innerHTML='<li class="offline-text"> NÃO ENCONTRADOS</li>';
    return;
  }
  var html='<li class="online-text">ONLINE ('+servers.length+')</li>';
  servers.forEach(function(s){
    html+='<li class="server-item"><a href="https://www.battlemetrics.com/servers/reforger/'+s.id+'" target="_blank">'+s.name+'</a></li>';
  });
  sw.innerHTML=html;
}
updateServerStatus();

window.populateSidebarPosts=function(posts){
var pl=document.getElementById("posts-list");
if(pl){
var html="";
var count=Math.min(posts.length,10);
for(var i=0;i<count;i++){
html+='<li><a href="'+posts[i].url+'">'+posts[i].title+'</a></li>';
}
pl.innerHTML=html;
}
var cats={};
posts.forEach(function(p){
var c=p.categoria||"Sem categoria";
if(!cats[c])cats[c]=c;
});
var cl=document.getElementById("categories-list");
if(cl){
var ch="";
Object.keys(cats).sort().forEach(function(k){
ch+='<li><a href="'+base+'categoria/?cat='+encodeURIComponent(k)+'">'+cats[k]+'</a></li>';
});
cl.innerHTML=ch;
}
var tags={};
posts.forEach(function(p){
p.tags.forEach(function(t){
var k=t.toLowerCase();
if(!tags[k])tags[k]=t;
});
});
var tc=document.getElementById("tags-cloud");
if(tc){
var cacheKey="tagsPacked_"+(base.replace(/\//g,"_"));
var cached=localStorage.getItem(cacheKey);
var postsHash=JSON.stringify(posts).length;
if(cached){
try{
var data=JSON.parse(cached);
if(data.hash===postsHash&&data.html){
tc.innerHTML=data.html;
return;
}
}catch(e){}
}
var tagObjs=Object.keys(tags).map(function(k){return{tag:tags[k],len:tags[k].length}});
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
tagObjs=shuffle(tagObjs);
var maxPerLine=32;
var lines=[];
var used=[];
while(used.length<tagObjs.length){
var line=[];
var lineLen=0;
for(var i=0;i<tagObjs.length;i++){
if(used.indexOf(i)!==-1)continue;
var t=tagObjs[i];
var nextLen=lineLen+t.len+(line.length?1:0);
if(nextLen<=maxPerLine){
line.push(i);
lineLen=nextLen;
used.push(i);
}
}
if(line.length===0)break;
if(line.length===1&&tagObjs.length>1){
var t=tagObjs[line[0]];
if(t.len<=12){
continue;
}
}
lines.push(line);
}
var th="";
lines.forEach(function(line){
th+='<div class="tags-row">';
line.forEach(function(idx){
var t=tagObjs[idx];
th+='<a href="'+base+'tags/?tag='+encodeURIComponent(t.tag.toLowerCase())+'" class="tag-link">'+t.tag+'</a>';
});
th+='</div>';
});
tc.innerHTML=th;
localStorage.setItem(cacheKey,JSON.stringify({hash:postsHash,html:th}));
}
};
fetch(base+"js/posts.json")
.then(function(resp){return resp.json()})
.then(function(posts){window.populateSidebarPosts(posts)})
.catch(function(){});
var rssUrl=encodeURIComponent("https://news.google.com/rss/search?q=tecnologia+e+computadores&hl=pt-BR&gl=BR&ceid=BR:pt-419");
var newsUrl="https://news.google.com/search?q=tecnologia%20e%20computadores&hl=pt-BR&gl=BR&ceid=BR%3Apt-419";
fetch("https://api.rss2json.com/v1/api.json?rss_url="+rssUrl+"&_="+Date.now())
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
if(i<count-1)html+='<hr>';
}
list.innerHTML=html;
}else{
list.innerHTML='<li><a href="'+newsUrl+'" target="_blank" rel="noopener">Ver no Google News</a></li>';
}
})
.catch(function(){
var list=document.getElementById("tech-news-list");
if(list)list.innerHTML='<li><a href="'+newsUrl+'" target="_blank" rel="noopener">Ver no Google News</a></li>';
});
})();
