import{S as Y,P as J,W as Q,I as V,A as _,T as c,a as M,M as b,b as d,c as E,D as $,G as v,d as ee,e as te,f as oe,g as P,h as ne,O as se}from"./vendor.5775b046.js";const ae=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))w(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const p of s.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&w(p)}).observe(document,{childList:!0,subtree:!0});function g(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerpolicy&&(s.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?s.credentials="include":n.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function w(n){if(n.ep)return;n.ep=!0;const s=g(n);fetch(n.href,s)}};ae();const o=new Y;let u=new J(75,window.innerWidth/window.innerHeight,.1,1e3);u.position.setZ(-10);u.position.setY(25);const i=new Q({alpha:!0,antialias:!0,canvas:document.querySelector("#bg")}),R=new V(i,u,i.domElement);i.setPixelRatio(window.devicePixelRatio);i.setSize(window.innerWidth,window.innerHeight);u.position.setZ(30);i.xr.enabled=!0;document.body.appendChild(_.createButton(i));window.addEventListener("resize",re);function re(){u.aspect=window.innerWidth/window.innerHeight,u.updateProjectionMatrix(),i.setSize(window.innerWidth,window.innerHeight)}i.render(o,u);const m=20,ie=new c().load("../Resources/Textures/earthTexture.jpg");new c().load("../Resources/Maps/earthNormalMap.tif");const ce=new M(3,32,32),de=new b({map:ie}),a=new d(ce,de);a.position.set(m,0,10);o.add(a);const le=new c().load("../Resources/Textures/sun.jpg"),ue=new M(10,32,32),pe=new E({map:le}),D=new d(ue,pe);o.add(D);const me=new c().load("../Resources/Textures/marsTexture.jpg"),he=new M(3/2,32,32),we=new b({map:me}),r=new d(he,we);r.position.setX(m*1.5);o.add(r);const ye=new c().load("../Resources/Textures/moonTexture.jpg"),fe=new M(3*.25,32,32),ge=new b({map:ye}),x=new d(fe,ge);x.position.setX(m+8);o.add(x);const be=new c().load("../Resources/Textures/psycheTexture.jpg"),xe=new $(1),G=new b({map:be}),h=new d(xe,G);h.position.setX(m*2.5);a.position.setX(m);var y=new v;const W=new ee;W.load("../Resources/Models/PsycheModel.stl",function(e){const t=new d(e,G);t.position.setX(m*2.5),o.add(t),y.add(t),o.add(y)},e=>{console.log(e.loaded/e.total*100+"% loaded")},e=>{console.log(e)});new b;W.load("../Resources/Models/SpaceCraft.stl",function(e){const t=new d(e,G);t.position.setX(m*2.5),t.scale.set(.005,.005,.005),o.add(t),y.add(t)},e=>{console.log(e.loaded/e.total*100+"% loaded")},e=>{console.log(e)});const H=te();document.body.appendChild(H.dom);const Te=new oe(16050587,5,150);o.add(Te);R.add(a);R.add(r);R.add(D);const Le=new P(5,3),Me=new c().load("../Resources/Textures/earthLabelTexture.jpg"),Ee=new E({map:Me,side:ne}),C=new d(Le,Ee);C.position.set(a.position.x,a.position.y+5,a.position.z);const I=C.clone();I.rotation.y+=3.141;I.position.set(a.position.x,a.position.y+5,a.position.z-.01);o.add(C);o.add(I);const ve=new P(5,3),Re=new c().load("../Resources/Textures/marsLabelTexture.jpg"),Ce=new E({map:Re}),B=new d(ve,Ce);B.position.set(r.position.x,r.position.y+5,r.position.z);const j=B.clone();j.rotation.y+=3.141;j.position.set(r.position.x,r.position.y+5,r.position.z-.01);o.add(B);o.add(j);const Ie=new P(5,3),Be=new c().load("../Resources/Textures/psycheLabelTexture.jpg"),je=new E({map:Be}),A=new d(Ie,je);A.position.set(h.position.x,h.position.y+5,h.position.z);const F=A.clone();F.rotation.y+=3.141;F.position.set(h.position.x,h.position.y+5,h.position.z-.01);o.add(A);o.add(F);const Ae=new c().load("../Resources/Textures/spaceBackground.jpg");o.background=Ae;let S=!1;const Fe=["The Psyche mission will begin by launching from our home planet Earth!","This is the Psyche spacecraft. It is an unmanned orbiting spacecraft","The current launch date is set for August 01, 2022"],Pe=["Resources/Images/earthFact1.jpeg","Resources/Images/earthFact2.jpeg","Resources/Images/earthFact3.jpeg"];let k=!1;const Ge=["The Psyche spacecraft will fly by Mars on its way to Psyche","The fly by will give the spacecraft the extra speed it needs for its journey","The fly by is expected to happen sometime in 2023"],Se=["Resources/Images/marsFact1.jpeg","Resources/Images/marsFact2.jpeg","Resources/Images/marsFact3.jpeg"];a.addEventListener("click",e=>{S?z():(S=!0,X("Earth"),N("Earth"))});r.addEventListener("click",e=>{k?z():(k=!0,X("Mars"),N("Mars"))});function z(){l=2,document.getElementById("fact-card").innerText="",S=!1,k=!1}function X(e){document.getElementById("fact-card").innerText="";const t=document.createElement("div");t.setAttribute("class","card");const g=document.createElement("img");g.setAttribute("class","card-img-top"),g.setAttribute("id","card-img");const w=document.createElement("div");w.setAttribute("class","card-body");const n=document.createElement("p");n.setAttribute("class","card-text"),n.setAttribute("id","fact-text"),w.appendChild(n);const s=document.createElement("div");s.setAttribute("class","card-button-container");const p=document.createElement("button"),L=document.createElement("button"),K=document.createTextNode("Close"),U=document.createTextNode("Read More");p.setAttribute("class","control-button"),L.setAttribute("class","control-button"),p.appendChild(K),L.appendChild(U),s.appendChild(p),s.appendChild(L),t.appendChild(g),t.appendChild(w),t.appendChild(s),document.getElementById("fact-card").appendChild(t),p.addEventListener("click",z),L.addEventListener("click",function(){N(e)})}let l=0,q="";function N(e){l==2?l=0:e!=q?(console.log("different identifier, setting factIndex to 0"),l=0,q=e):l++,console.log("Updating "+e+" with factIndex: "+l);let t;switch(e){case"Earth":t=document.createTextNode(Fe[l]),document.getElementById("fact-text").innerHTML="",document.getElementById("fact-text").appendChild(t),document.getElementById("card-img").setAttribute("src",Pe[l]);break;case"Mars":t=document.createTextNode(Ge[l]),document.getElementById("fact-text").innerHTML="",document.getElementById("fact-text").appendChild(t),document.getElementById("card-img").setAttribute("src",Se[l]);break;default:console.log("Error in showNextFact switch")}}const ke=new se(u,i.domElement);var f=new v;f.add(a);f.add(x);f.add(C);f.add(I);o.add(f);var T=new v;T.add(r);T.add(B);T.add(j);o.add(T);var O=new v;O.add(x);o.add(O);y.add(A);y.add(F);function Z(){i.setAnimationLoop(ze)}function ze(){requestAnimationFrame(Z),a.rotation.y+=.003,r.rotation.y+=.003,f.rotation.y+=5e-4,T.rotation.y+=4e-4,O.rotation.y+=5e-4,y.rotation.y+=2e-4,x.rotation.y+=.003,ke.update(),R.update(),H.update(),i.render(o,u)}Z();
