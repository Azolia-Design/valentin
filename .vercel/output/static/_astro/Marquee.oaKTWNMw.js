import{o as g,g as q,i as h,c as p,u as v,b as x,t as C,a as _}from"./web.CAOUEYuq.js";import{g as o}from"./index.DjKJqAo0.js";import{S}from"./ScrollTrigger.DJCkYK2h.js";import{g as f}from"./lenis.DdMTSj3V.js";import"./_commonjsHelpers.BosuxZz1.js";var $=C("<div><div class=marquee><div class=marquee-inner><div class=marquee-inner-item>");const N=e=>{let t;return g((()=>{if(!t)return;o.registerPlugin(S.ScrollTrigger);const i=o.utils.selector(t),r={wrap:i(".marquee"),list:i(".marquee-inner"),item:i(".marquee-inner-item")};let s=1;const a=Math.floor(window.innerWidth/r.item.offsetWidth);a>=1&&(s+=a),new Array(s).fill().forEach(((e,t)=>{let i=r.item[0].cloneNode(!0);r.list[0].appendChild(i)}));let l=r.item[0].offsetWidth;const n={right:"-1",left:"1"};requestAnimationFrame((function t(){let i=o.getProperty(r.list[0],"x");i<-l?i=0:i>0&&(i=-l);let s=f().direction>=0?1:-1;o.quickSetter(r.list[0],"x","px")(i+(f().velocity+s*(Number(e.duration)||3))*n[e.start||"left"]),requestAnimationFrame(t)})),_((()=>{}))})),i=q($),r=i.firstChild.firstChild.firstChild,"function"==typeof t?v(t,i):t=i,h(r,(()=>e.children)),p((()=>x(i,e.class))),i;var i,r};export{N as default};