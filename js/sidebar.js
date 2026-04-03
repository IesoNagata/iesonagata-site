(function(){
var scripts=document.getElementsByTagName("script");
var last=scripts[scripts.length-1];
var src=last.getAttribute("src")||"";
var base=src.replace(/\?.*$/,"").replace(/js\/sidebar\.js$/,"");
var leftHTML='<div class="sidebar-section"><h3 class="sidebar-title">Categorias</h3><ul class="sidebar-menu" id="categories-list"><li>Carregando...</li></ul></div><div class="sidebar-section"><h3 class="sidebar-title">Tech News</h3><ul class="sidebar-menu" id="tech-news-list"><li>Carregando...</li></ul></div>';
var rightStatic='<div class="trending-section"><h3 class="sidebar-title">Postagens</h3><ol class="trending-list" id="posts-list"><li>Carregando...</li></ol></div><div class="trending-section"><h3 class="sidebar-title">Tags</h3><div class="tags-cloud" id="tags-cloud"></div></div><div class="trending-section"><h3 class="sidebar-title">Siga-nos</h3><ul class="sidebar-menu social-menu"><li><a href="https://www.facebook.com/IesoNagata" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877f2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook</a></li><li><a href="https://www.youtube.com/@iesonagata" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff0000"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg> YouTube</a></li><li><a href="https://www.instagram.com/iesonagata/" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e4405f" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#e4405f"/></svg> Instagram</a></li></ul></div>';
var l=document.getElementById("sidebar-left");
if(l)l.innerHTML=leftHTML;
var r=document.getElementById("sidebar-right");
if(r)r.innerHTML=rightStatic;

var dias=["Domingo","Segunda-feira","Ter\u00e7a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S\u00e1bado"];
var meses=["janeiro","fevereiro","mar\u00e7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
var wcodes={0:"C\u00e9u limpo",1:"Quase limpo",2:"Parcialmente nublado",3:"Nublado",45:"Nevoeiro",48:"Nevoeiro com geada",51:"Garoa leve",53:"Garoa",55:"Garoa forte",56:"Garoa gelada leve",57:"Garoa gelada",61:"Chuva leve",63:"Chuva",65:"Chuva forte",66:"Chuva gelada leve",67:"Chuva gelada forte",71:"Neve leve",73:"Neve",75:"Neve forte",77:"Granizo",80:"Pancadas leves",81:"Pancadas",82:"Pancadas fortes",85:"Nevasca leve",86:"Nevasca forte",95:"Tempestade",96:"Tempestade com granizo leve",99:"Tempestade com granizo forte"};
var wicons={0:"&#9728;&#65039;",1:"&#9728;&#65039;",2:"&#9925;",3:"&#2601;&#65039;",45:"&#127787;&#65039;",48:"&#127787;&#65039;",51:"&#127783;&#65039;",53:"&#127783;&#65039;",55:"&#127783;&#65039;",56:"&#127783;&#65039;",57:"&#127783;&#65039;",61:"&#127783;&#65039;",63:"&#127783;&#65039;",65:"&#127783;&#65039;",66:"&#127783;&#65039;",67:"&#127783;&#65039;",71:"&#10052;&#65039;",73:"&#10052;&#65039;",75:"&#10052;&#65039;",77:"&#127783;&#65039;",80:"&#127783;&#65039;",81:"&#127783;&#65039;",82:"&#127783;&#65039;",85:"&#10052;&#65039;",86:"&#10052;&#65039;",95:"&#9928;&#65039;",96:"&#9928;&#65039;",99:"&#9928;&#65039;"};

function updateTime(){
  var el=document.getElementById("weather-time");
  if(!el)return;
  var now=new Date();
  var d=dias[now.getDay()]+", "+now.getDate()+" de "+meses[now.getMonth()]+" de "+now.getFullYear();
  var h=String(now.getHours()).padStart(2,"0");
  var m=String(now.getMinutes()).padStart(2,"0");
  var s=String(now.getSeconds()).padStart(2,"0");
  el.innerHTML='<div class="weather-date">'+d+'</div><div class="weather-hour">'+h+":"+m+":"+s+'</div>';
}
updateTime();
setInterval(updateTime,1000);

function updateWeather(code,temp,name){
  var c=document.getElementById("weather-content");
  if(!c)return;
  var icon=c.querySelector(".weather-icon");
  var tmp=c.querySelector(".weather-temp");
  var cond=c.querySelector(".weather-condition");
  if(icon)icon.innerHTML=wicons[code]||"&#9728;&#65039;";
  if(tmp)tmp.innerHTML=Math.round(temp)+"&deg;C";
  if(cond)cond.textContent=wcodes[code]||"Indispon\u00edvel";
  var loc=document.createElement("div");
  loc.className="weather-location";
  loc.textContent=name;
  c.appendChild(loc);
}

function fetchWeather(lat,lon){
  fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current_weather=true")
  .then(function(r){return r.json()})
  .then(function(d){
    if(d.current_weather){
      var code=d.current_weather.weathercode;
      var temp=d.current_weather.temperature;
      fetch("https://nominatim.openstreetmap.org/reverse?format=json&lat="+lat+"&lon="+lon+"&accept-language=pt-BR")
      .then(function(r){return r.json()})
      .then(function(g){
        var city=g.address.city||g.address.town||g.address.village||g.address.county||"";
        var state=g.address.state||"";
        var name=city+(state?", "+state:"");
        updateWeather(code,temp,name);
      })
      .catch(function(){updateWeather(code,temp,"Localiza\u00e7\u00e3o desconhecida")});
    }
  })
  .catch(function(){});
}

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(
    function(pos){fetchWeather(pos.coords.latitude,pos.coords.longitude)},
    function(){updateWeather(0,28,"S\u00e3o Paulo, SP")}
  );
}else{
  updateWeather(0,28,"S\u00e3o Paulo, SP");
}
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
var tagObjs=Object.keys(tags).map(function(k){return{tag:tags[k],len:tags[k].length}});
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
tagObjs=shuffle(tagObjs);
var maxPerLine=26;
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
if(line.length===1){
var t=tagObjs[line[0]];
if(t.len<=12&&used.length+1<tagObjs.length){
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
