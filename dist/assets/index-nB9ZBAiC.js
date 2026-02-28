(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(a){if(a.ep)return;a.ep=!0;const l=s(a);fetch(a.href,l)}})();let F=100,A=null;const x=new Map,K=[];function X(t){K.push(t)}function $(){K.forEach(t=>t(V()))}function V(){return Array.from(x.values()).map(t=>({id:t.id,title:t.title,icon:t.icon,minimized:t.minimized,active:t.id===A}))}function J({title:t,icon:e,width:s,height:i,app:a,onClose:l,onResize:o,contentFactory:p}){const r="win-"+Date.now()+"-"+Math.random().toString(36).substr(2,6),m=document.getElementById("windows-container"),n=m.getBoundingClientRect(),d=Math.max(40,Math.min(n.width-(s||800)-40,80+Math.random()*200)),c=Math.max(20,Math.min(n.height-(i||500)-60,40+Math.random()*100)),u=document.createElement("div");u.className="os-window focused",u.id=r,u.style.cssText=`left:${d}px;top:${c}px;width:${s||800}px;height:${i||500}px;z-index:${++F};`,u.innerHTML=`
    <div class="window-titlebar" data-win-id="${r}">
      <div class="window-titlebar-icon"><span class="material-symbols-outlined icon-filled">${e||"window"}</span></div>
      <div class="window-title">${t||"Untitled"}</div>
      <div class="window-controls">
        <div class="window-ctrl-btn minimize" data-action="minimize"><span class="material-symbols-outlined">remove</span></div>
        <div class="window-ctrl-btn maximize" data-action="maximize"><span class="material-symbols-outlined">crop_square</span></div>
        <div class="window-ctrl-btn close" data-action="close"><span class="material-symbols-outlined">close</span></div>
      </div>
    </div>
    <div class="window-content"></div>
    <div class="resize-handle n"></div>
    <div class="resize-handle s"></div>
    <div class="resize-handle e"></div>
    <div class="resize-handle w"></div>
    <div class="resize-handle ne"></div>
    <div class="resize-handle nw"></div>
    <div class="resize-handle se"></div>
    <div class="resize-handle sw"></div>
  `,m.appendChild(u);const f=u.querySelector(".window-content");p&&p(f,r);const v={id:r,title:t,icon:e,el:u,minimized:!1,maximized:!1,prevRect:null,app:a,onClose:l,onResize:o};return x.set(r,v),Q(u,v),Z(u,v),ee(u,v),u.addEventListener("mousedown",()=>q(r)),q(r),$(),r}function Q(t,e){const s=t.querySelector(".window-titlebar");let i=!1,a,l,o,p;s.addEventListener("mousedown",r=>{r.target.closest(".window-controls")||e.maximized||(i=!0,a=r.clientX,l=r.clientY,o=t.offsetLeft,p=t.offsetTop,document.body.style.cursor="move",r.preventDefault())}),document.addEventListener("mousemove",r=>{if(!i)return;const m=r.clientX-a,n=r.clientY-l;t.style.left=o+m+"px",t.style.top=Math.max(0,p+n)+"px"}),document.addEventListener("mouseup",()=>{i&&(i=!1,document.body.style.cursor="")}),s.addEventListener("dblclick",r=>{r.target.closest(".window-controls")||U(e.id)})}function Z(t,e){const s=t.querySelectorAll(".resize-handle");let i=!1,a,l,o,p,r,m,n;s.forEach(d=>{d.addEventListener("mousedown",c=>{e.maximized||(i=!0,n=d.className.replace("resize-handle ",""),a=c.clientX,l=c.clientY,o=t.offsetWidth,p=t.offsetHeight,r=t.offsetLeft,m=t.offsetTop,c.preventDefault(),c.stopPropagation())})}),document.addEventListener("mousemove",d=>{if(!i)return;const c=d.clientX-a,u=d.clientY-l;let f=o,v=p,g=r,y=m;n.includes("e")&&(f=Math.max(320,o+c)),n.includes("w")&&(f=Math.max(320,o-c),g=r+c),n.includes("s")&&(v=Math.max(200,p+u)),n.includes("n")&&(v=Math.max(200,p-u),y=m+u),t.style.width=f+"px",t.style.height=v+"px",t.style.left=g+"px",t.style.top=y+"px"}),document.addEventListener("mouseup",()=>{i&&(i=!1,e.onResize&&e.onResize())})}function ee(t,e){t.querySelectorAll(".window-ctrl-btn").forEach(s=>{s.addEventListener("click",i=>{i.stopPropagation();const a=s.dataset.action;a==="minimize"?Y(e.id):a==="maximize"?U(e.id):a==="close"&&se(e.id)})})}function q(t){const e=x.get(t);!e||e.minimized||(x.forEach(s=>s.el.classList.remove("focused")),e.el.style.zIndex=++F,e.el.classList.add("focused"),A=t,$())}function Y(t){const e=x.get(t);e&&(e.el.classList.add("minimizing"),setTimeout(()=>{e.el.style.display="none",e.el.classList.remove("minimizing"),e.minimized=!0,A===t&&(A=null),$()},250))}function te(t){const e=x.get(t);e&&(e.minimized&&(e.el.style.display="flex",e.minimized=!1,e.el.style.animation="none",e.el.offsetHeight,e.el.style.animation="windowOpen 0.25s ease"),q(t),$())}function U(t){const e=x.get(t);e&&(e.maximized?(e.el.classList.remove("maximized"),e.prevRect&&(e.el.style.left=e.prevRect.left,e.el.style.top=e.prevRect.top,e.el.style.width=e.prevRect.width,e.el.style.height=e.prevRect.height),e.maximized=!1):(e.prevRect={left:e.el.style.left,top:e.el.style.top,width:e.el.style.width,height:e.el.style.height},e.el.classList.add("maximized"),e.maximized=!0),e.onResize&&e.onResize())}function se(t){const e=x.get(t);e&&(e.el.classList.add("closing"),setTimeout(()=>{e.onClose&&e.onClose(),e.el.remove(),x.delete(t),A===t&&(A=null),$()},200))}const ie=()=>document.getElementById("notifications-container");function w({title:t,message:e,icon:s,duration:i=5e3}){const a=document.createElement("div");return a.className="notification",a.innerHTML=`
    <div class="notification-icon">
      <span class="material-symbols-outlined">${s||"notifications"}</span>
    </div>
    <div class="notification-body">
      <div class="notification-title">${t}</div>
      <div class="notification-message">${e}</div>
      <div class="notification-time">Just now</div>
    </div>
  `,a.addEventListener("click",()=>_(a)),ie().appendChild(a),i>0&&setTimeout(()=>_(a),i),a}function _(t){!t||!t.parentNode||(t.classList.add("removing"),setTimeout(()=>t.remove(),300))}function ne(){setTimeout(()=>{w({title:"AI OS",message:"Welcome! Your intelligent desktop is ready.",icon:"neurology",duration:6e3})},1500),setTimeout(()=>{w({title:"AI Assistant",message:'Say "Hello" to get started with your AI Assistant!',icon:"smart_toy",duration:8e3})},4e3)}const O="ai-os-api-key",H="https://openrouter.ai/api/v1/chat/completions",j="google/gemini-2.0-flash-001",ae="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",oe=`You are AI Assistant, the intelligent companion built into AI OS — a web-based desktop environment. You are helpful, friendly, and concise.

Key behaviors:
- Format responses with markdown: **bold**, bullet points, numbered lists, code blocks
- Be conversational but informative
- Keep responses concise (under 200 words unless asked for detail)
- You can help with: writing, coding, brainstorming, explaining concepts, math, and general knowledge
- You are running inside a web-based OS that has apps like File Explorer, Notepad, Calculator, Terminal, Settings, Weather, and Browser
- When users ask about the OS, explain its features enthusiastically
- Use emojis sparingly but effectively for personality`,R=[{patterns:["hello","hi ","hey","greetings"],response:"Hello! 👋 I'm your AI Assistant powered by AI OS. What would you like to do today?"},{patterns:["how are you","how r u"],response:"I'm running smoothly! All systems are operational. How can I help you today?"},{patterns:["what can you do","help","features","capabilities"],response:`I can help with many things!

🔍 **Search** — Find files and info
📝 **Write** — Draft emails, docs, code
💡 **Ideas** — Brainstorm creatively
📊 **Analyze** — Process data
⚡ **Automate** — Streamline workflows

💡 **Tip:** Add your API key in Settings → AI to enable full capabilities!`},{patterns:["joke","funny","laugh"],response:`Here's one! 😄

Why do programmers prefer dark mode?

Because light attracts bugs! 🐛`},{patterns:["code","programming","python","javascript"],response:`I can help with coding!

\`\`\`js
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
\`\`\`

💡 Add your API key in Settings → AI for real code help!`},{patterns:["who are you","your name","about you"],response:`I'm **AI Assistant**, built into AI OS! 🤖

• **Engine:** OpenRouter AI (when configured)
• **Fallback:** Offline mock engine

Configure your key in **Settings → AI**!`},{patterns:["thank","thanks"],response:"You're welcome! 😊"},{patterns:["bye","goodbye"],response:"Goodbye! 👋 Have a great day!"}],T=[`I'm in offline mode. Add your **API key** in **Settings → AI** to unlock full AI!

Try saying: "Hello", "Tell me a joke", "What can you do?"`,"To get full AI answers, configure your **API key** in **Settings → AI Configuration**."];class re{constructor(){this.history=[],this.apiKey=localStorage.getItem(O)||ae,this._listeners=[],this._connected=!!this.apiKey}setApiKey(e){return this.apiKey=e,localStorage.setItem(O,e),this._connected=!!e,this.history=[],this._notifyListeners(e?"connected":"disconnected"),!0}getApiKey(){return this.apiKey}isConnected(){return this._connected}onStatusChange(e){this._listeners.push(e)}_notifyListeners(e){this._listeners.forEach(s=>s(e))}_buildMessages(e){const s=[{role:"system",content:oe}],i=this.history.slice(-20);for(const a of i)s.push({role:a.role==="ai"?"assistant":"user",content:a.content});return s.push({role:"user",content:e}),s}async getResponse(e){var a,l,o,p;if(this.history.push({role:"user",content:e}),this._connected&&this.apiKey)try{const r=await fetch(H,{method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json","HTTP-Referer":window.location.origin,"X-Title":"AI OS"},body:JSON.stringify({model:j,messages:this._buildMessages(e),max_tokens:1024})});if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(((a=d.error)==null?void 0:a.message)||`HTTP ${r.status}`)}const n=((p=(o=(l=(await r.json()).choices)==null?void 0:l[0])==null?void 0:o.message)==null?void 0:p.content)||"No response received.";return this.history.push({role:"ai",content:n}),n}catch(r){console.error("API error:",r);const m=`⚠️ API error: ${r.message}

Check your key in Settings → AI.`;return this.history.push({role:"ai",content:m}),m}await new Promise(r=>setTimeout(r,500+Math.random()*600));const s=e.toLowerCase().trim();for(const r of R)if(r.patterns.some(m=>s.includes(m)))return this.history.push({role:"ai",content:r.response}),r.response;const i=T[Math.floor(Math.random()*T.length)];return this.history.push({role:"ai",content:i}),i}async getStreamingResponse(e,s){var o,p,r,m;if(this.history.push({role:"user",content:e}),this._connected&&this.apiKey)try{const n=await fetch(H,{method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json","HTTP-Referer":window.location.origin,"X-Title":"AI OS"},body:JSON.stringify({model:j,messages:this._buildMessages(e),max_tokens:1024,stream:!0})});if(!n.ok){const v=await n.json().catch(()=>({}));throw new Error(((o=v.error)==null?void 0:o.message)||`HTTP ${n.status}`)}const d=n.body.getReader(),c=new TextDecoder;let u="",f="";for(;;){const{done:v,value:g}=await d.read();if(v)break;f+=c.decode(g,{stream:!0});const y=f.split(`
`);f=y.pop()||"";for(const C of y){const I=C.trim();if(!I||!I.startsWith("data: "))continue;const P=I.slice(6);if(P!=="[DONE]")try{const z=(m=(r=(p=JSON.parse(P).choices)==null?void 0:p[0])==null?void 0:r.delta)==null?void 0:m.content;z&&(u+=z,s&&s(u))}catch{}}}return this.history.push({role:"ai",content:u}),u}catch(n){console.error("Streaming error:",n);const d=`⚠️ API error: ${n.message}`;return this.history.push({role:"ai",content:d}),s&&s(d),d}const i=await this._getMockResponse(e),a=i.split(" ");let l="";for(let n=0;n<a.length;n++)l+=(n>0?" ":"")+a[n],s&&s(l),await new Promise(d=>setTimeout(d,25+Math.random()*35));return this.history.push({role:"ai",content:i}),i}async _getMockResponse(e){const s=e.toLowerCase().trim();for(const i of R)if(i.patterns.some(a=>s.includes(a)))return i.response;return T[Math.floor(Math.random()*T.length)]}getSuggestions(){return this.isConnected()?["Write a poem","Explain quantum computing","Help me code","Brainstorm ideas","Tell me a joke"]:["What can you do?","Tell me a joke","Help with code","Open Settings → AI"]}searchApps(e){const s=e.toLowerCase(),i=[{id:"assistant",name:"AI Assistant",icon:"neurology",keywords:["ai","chat","help","assistant"]},{id:"explorer",name:"File Explorer",icon:"folder_open",keywords:["file","folder","explorer"]},{id:"notepad",name:"Notepad",icon:"edit_note",keywords:["note","text","edit","write"]},{id:"calculator",name:"Calculator",icon:"calculate",keywords:["calc","math"]},{id:"terminal",name:"Terminal",icon:"terminal",keywords:["terminal","console","cmd"]},{id:"settings",name:"Settings",icon:"settings",keywords:["settings","config","theme"]},{id:"weather",name:"Weather",icon:"cloud",keywords:["weather","forecast"]},{id:"browser",name:"Chrome",icon:"chrome_reader_mode",keywords:["browser","web","internet","chrome"]}];return s?i.filter(a=>a.name.toLowerCase().includes(s)||a.keywords.some(l=>l.includes(s))):i}resetChat(){this.history=[]}}const h=new re;function le(t){const e=h.isConnected(),s=h.getSuggestions();t.innerHTML=`
    <div class="app-assistant">
      <div class="assistant-header">
        <div class="assistant-avatar"><span class="material-symbols-outlined icon-filled">neurology</span></div>
        <div class="assistant-info">
          <h3>AI Assistant</h3>
          <p id="assistant-status" style="color:${e?"var(--success)":"var(--warning)"}">
            ${e?"● AI Connected":"● Offline Mode — Add API key in Settings"}
          </p>
        </div>
      </div>
      <div class="assistant-messages" id="assistant-messages">
        <div class="message ai">
          <div class="message-bubble">${e?"Hello! 👋 I'm your <strong>AI-powered</strong> Assistant. I can help with writing, coding, brainstorming, and answering any questions. What would you like to do?":"Hello! 👋 I'm your AI Assistant. I'm currently in <strong>offline mode</strong>. Add your <strong>API key</strong> in <strong>Settings → AI</strong> to unlock full power!"}</div>
          <div class="message-time">${M()}</div>
        </div>
      </div>
      <div class="assistant-suggestions" id="assistant-suggestions">
        ${s.map(n=>`<div class="suggestion-chip">${n}</div>`).join("")}
      </div>
      <div class="assistant-input-area">
        <input type="text" class="assistant-input" id="assistant-input" placeholder="${e?"Ask AI anything...":"Ask me anything (offline)..."}" autocomplete="off">
        <button class="assistant-send" id="assistant-send"><span class="material-symbols-outlined">send</span></button>
      </div>
    </div>
  `;const i=t.querySelector("#assistant-messages"),a=t.querySelector("#assistant-input"),l=t.querySelector("#assistant-send"),o=t.querySelector("#assistant-suggestions");let p=!1;async function r(n){if(!n.trim()||p)return;p=!0,a.value="",a.disabled=!0,l.style.opacity="0.5",o.style.display="none",m("user",W(n));const d=document.createElement("div");d.className="message ai";const c=document.createElement("div");c.className="message-bubble",c.innerHTML='<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>',d.appendChild(c),i.appendChild(d),i.scrollTop=i.scrollHeight;try{if(h.isConnected())await h.getStreamingResponse(n,f=>{c.innerHTML=N(f),i.scrollTop=i.scrollHeight});else{const f=await h.getResponse(n);c.innerHTML=N(f)}}catch(f){c.innerHTML=`<span style="color:var(--danger)">⚠️ Error: ${W(f.message)}</span>`}const u=document.createElement("div");u.className="message-time",u.textContent=M(),d.appendChild(u),i.scrollTop=i.scrollHeight,p=!1,a.disabled=!1,a.focus(),l.style.opacity="1"}function m(n,d){const c=document.createElement("div");c.className=`message ${n}`,c.innerHTML=`<div class="message-bubble">${d}</div><div class="message-time">${M()}</div>`,i.appendChild(c),i.scrollTop=i.scrollHeight}a.addEventListener("keydown",n=>{n.key==="Enter"&&r(a.value)}),l.addEventListener("click",()=>r(a.value)),o.querySelectorAll(".suggestion-chip").forEach(n=>{n.addEventListener("click",()=>r(n.textContent))}),h.onStatusChange(n=>{const d=t.querySelector("#assistant-status");d&&(d.style.color=n==="connected"?"var(--success)":"var(--warning)",d.textContent=n==="connected"?"● AI Connected":"● Offline Mode",a.placeholder=n==="connected"?"Ask AI anything...":"Ask me anything (offline)...")}),setTimeout(()=>a.focus(),300)}function W(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function N(t){return t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/```(\w*)\n?([\s\S]*?)```/g,'<pre style="background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;margin:8px 0;overflow-x:auto;font-family:var(--font-mono);font-size:12px;line-height:1.5;">$2</pre>').replace(/`([^`]+)`/g,'<code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:12px;">$1</code>').replace(/\n/g,"<br>")}function M(){return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}class ce{constructor(){this.root={name:"root",type:"folder",children:{Desktop:{name:"Desktop",type:"folder",children:{"Welcome.txt":{name:"Welcome.txt",type:"file",content:`Welcome to AI OS!

This is your intelligent desktop environment.
Explore the apps and features!`},"Notes.txt":{name:"Notes.txt",type:"file",content:`My Notes
--------
- Try the AI Assistant
- Explore File Explorer
- Check Settings`}}},Documents:{name:"Documents",type:"folder",children:{Projects:{name:"Projects",type:"folder",children:{"project-plan.txt":{name:"project-plan.txt",type:"file",content:`AI OS Project Plan

1. Core desktop environment
2. Window management
3. AI Integration
4. App ecosystem`}}},"Resume.txt":{name:"Resume.txt",type:"file",content:`John Doe
Software Engineer

Skills: AI, Web Development, Cloud Computing`},"Ideas.txt":{name:"Ideas.txt",type:"file",content:`Future Ideas:
- Voice commands
- Plugin system
- Cloud sync
- Mobile support`}}},Downloads:{name:"Downloads",type:"folder",children:{"report.txt":{name:"report.txt",type:"file",content:`Quarterly Report Q4 2025

Revenue: $1.2M
Growth: 25%
Users: 50,000+`}}},Pictures:{name:"Pictures",type:"folder",children:{Screenshots:{name:"Screenshots",type:"folder",children:{}},Wallpapers:{name:"Wallpapers",type:"folder",children:{}}}},Music:{name:"Music",type:"folder",children:{}},Videos:{name:"Videos",type:"folder",children:{}}}}}resolve(e){if(e==="/"||e==="")return this.root;const s=e.replace(/^\//,"").split("/");let i=this.root;for(const a of s){if(!i.children||!i.children[a])return null;i=i.children[a]}return i}listDir(e){const s=this.resolve(e);return!s||s.type!=="folder"?[]:Object.values(s.children).map(i=>({name:i.name,type:i.type,size:i.content?i.content.length:0,children:i.children?Object.keys(i.children).length:0}))}readFile(e){const s=this.resolve(e);return!s||s.type!=="file"?null:s.content||""}writeFile(e,s){const i=e.replace(/^\//,"").split("/"),a=i.pop(),l="/"+i.join("/"),o=this.resolve(l);return!o||o.type!=="folder"?!1:(o.children[a]?o.children[a].content=s:o.children[a]={name:a,type:"file",content:s},!0)}createFolder(e){const s=e.replace(/^\//,"").split("/"),i=s.pop(),a="/"+s.join("/"),l=this.resolve(a);return!l||l.type!=="folder"||l.children[i]?!1:(l.children[i]={name:i,type:"folder",children:{}},!0)}deleteItem(e){const s=e.replace(/^\//,"").split("/"),i=s.pop(),a="/"+s.join("/"),l=this.resolve(a);return!l||!l.children[i]?!1:(delete l.children[i],!0)}rename(e,s){const i=e.replace(/^\//,"").split("/"),a=i.pop(),l="/"+i.join("/"),o=this.resolve(l);if(!o||!o.children[a])return!1;const p=o.children[a];return p.name=s,o.children[s]=p,delete o.children[a],!0}}const b=new ce;function de(t){let e="/",s=["/"],i=0;function a(){var r,m,n,d;const o=b.listDir(e),p=e==="/"?["root"]:["root",...e.replace(/^\//,"").split("/")];t.innerHTML=`
      <div class="app-explorer">
        <div class="explorer-sidebar">
          <div class="explorer-tree-item ${e==="/Desktop"?"active":""}" data-path="/Desktop">
            <span class="material-symbols-outlined icon-filled" style="color:#60cdff">desktop_windows</span> Desktop
          </div>
          <div class="explorer-tree-item ${e==="/Documents"?"active":""}" data-path="/Documents">
            <span class="material-symbols-outlined icon-filled" style="color:#fcc419">description</span> Documents
          </div>
          <div class="explorer-tree-item ${e==="/Downloads"?"active":""}" data-path="/Downloads">
            <span class="material-symbols-outlined icon-filled" style="color:#51cf66">download</span> Downloads
          </div>
          <div class="explorer-tree-item ${e==="/Pictures"?"active":""}" data-path="/Pictures">
            <span class="material-symbols-outlined icon-filled" style="color:#cc5de8">image</span> Pictures
          </div>
          <div class="explorer-tree-item ${e==="/Music"?"active":""}" data-path="/Music">
            <span class="material-symbols-outlined icon-filled" style="color:#ff922b">music_note</span> Music
          </div>
          <div class="explorer-tree-item ${e==="/Videos"?"active":""}" data-path="/Videos">
            <span class="material-symbols-outlined icon-filled" style="color:#ff6b6b">videocam</span> Videos
          </div>
        </div>
        <div class="explorer-main">
          <div class="explorer-toolbar">
            <div class="explorer-nav-btn ${i<=0?"disabled":""}" id="ex-back">
              <span class="material-symbols-outlined">arrow_back</span>
            </div>
            <div class="explorer-nav-btn ${i>=s.length-1?"disabled":""}" id="ex-forward">
              <span class="material-symbols-outlined">arrow_forward</span>
            </div>
            <div class="explorer-nav-btn" id="ex-up">
              <span class="material-symbols-outlined">arrow_upward</span>
            </div>
            <div class="explorer-breadcrumb">
              ${p.map((c,u)=>`<span class="explorer-breadcrumb-item" data-path="${u===0?"/":"/"+p.slice(1,u+1).join("/")}">${c}</span>${u<p.length-1?'<span class="explorer-breadcrumb-sep">›</span>':""}`).join("")}
            </div>
            <div class="explorer-nav-btn" id="ex-new-folder" title="New Folder">
              <span class="material-symbols-outlined">create_new_folder</span>
            </div>
          </div>
          <div class="explorer-content">
            ${o.length===0?'<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-tertiary);"><span class="material-symbols-outlined" style="font-size:48px;display:block;margin-bottom:12px;">folder_off</span>This folder is empty</div>':o.map(c=>`
                <div class="explorer-item" data-name="${c.name}" data-type="${c.type}">
                  <div class="explorer-item-icon">
                    <span class="material-symbols-outlined icon-filled" style="color:${c.type==="folder"?"#fcc419":"#74c0fc"}">${c.type==="folder"?"folder":pe(c.name)}</span>
                  </div>
                  <div class="explorer-item-name">${c.name}</div>
                </div>
              `).join("")}
          </div>
          <div class="explorer-statusbar">
            <span>${o.length} item${o.length!==1?"s":""}</span>
          </div>
        </div>
      </div>
    `,(r=t.querySelector("#ex-back"))==null||r.addEventListener("click",()=>{i>0&&(i--,e=s[i],a())}),(m=t.querySelector("#ex-forward"))==null||m.addEventListener("click",()=>{i<s.length-1&&(i++,e=s[i],a())}),(n=t.querySelector("#ex-up"))==null||n.addEventListener("click",()=>{if(e!=="/"){const c=e.split("/").filter(Boolean);c.pop(),l("/"+c.join("/")||"/")}}),(d=t.querySelector("#ex-new-folder"))==null||d.addEventListener("click",()=>{const c=prompt("New folder name:");c&&(b.createFolder((e==="/"?"":e)+"/"+c),a())}),t.querySelectorAll(".explorer-tree-item").forEach(c=>{c.addEventListener("click",()=>l(c.dataset.path))}),t.querySelectorAll(".explorer-breadcrumb-item").forEach(c=>{c.addEventListener("click",()=>l(c.dataset.path))}),t.querySelectorAll(".explorer-item").forEach(c=>{c.addEventListener("dblclick",()=>{const u=c.dataset.name;if(c.dataset.type==="folder")l((e==="/"?"":e)+"/"+u);else{const v=b.readFile((e==="/"?"":e)+"/"+u);v!==null&&window.__openNotepadWithContent&&window.__openNotepadWithContent(u,v,(e==="/"?"":e)+"/"+u)}}),c.addEventListener("click",u=>{t.querySelectorAll(".explorer-item.selected").forEach(f=>f.classList.remove("selected")),c.classList.add("selected")})})}function l(o){e=o||"/",s=s.slice(0,i+1),s.push(e),i=s.length-1,a()}a()}function pe(t){const e=t.split(".").pop().toLowerCase();return{txt:"description",md:"description",js:"javascript",py:"code",html:"html",css:"css",json:"data_object",jpg:"image",png:"image",gif:"gif",mp3:"audio_file",mp4:"video_file",pdf:"picture_as_pdf"}[e]||"draft"}function G(t,e,s,i,a){let l=a||null,o=s||"Untitled";t.innerHTML=`
    <div class="app-notepad">
      <div class="notepad-menubar">
        <div class="notepad-menu-item" id="np-new">File: New</div>
        <div class="notepad-menu-item" id="np-save">Save</div>
        <div class="notepad-menu-item" id="np-saveas">Save As</div>
        <div class="notepad-menu-item" id="np-wordwrap">Word Wrap: On</div>
      </div>
      <textarea class="notepad-editor" id="np-editor" spellcheck="false">${me(i||"")}</textarea>
      <div class="notepad-statusbar">
        <span id="np-filename">${o}</span>
        <span id="np-stats">Ln 1, Col 1 | 0 characters</span>
      </div>
    </div>
  `;const p=t.querySelector("#np-editor"),r=t.querySelector("#np-stats"),m=t.querySelector("#np-filename");function n(){const u=p.value;u.split(`
`);const f=p.selectionStart;let v=1,g=1;for(let y=0;y<f;y++)u[y]===`
`?(v++,g=1):g++;r.textContent=`Ln ${v}, Col ${g} | ${u.length} characters`}p.addEventListener("input",()=>{n()}),p.addEventListener("click",n),p.addEventListener("keyup",n),t.querySelector("#np-new").addEventListener("click",()=>{p.value="",l=null,o="Untitled",m.textContent=o,n()}),t.querySelector("#np-save").addEventListener("click",()=>{l?(b.writeFile(l,p.value),w({title:"Notepad",message:`Saved "${o}"`,icon:"save",duration:3e3})):d()}),t.querySelector("#np-saveas").addEventListener("click",d);function d(){const u=prompt("Save as (filename):",o);if(!u)return;const f="/Documents/"+u;b.writeFile(f,p.value),l=f,o=u,m.textContent=u,w({title:"Notepad",message:`Saved "${u}" to Documents`,icon:"save",duration:3e3})}let c=!0;t.querySelector("#np-wordwrap").addEventListener("click",function(){c=!c,p.style.whiteSpace=c?"pre-wrap":"pre",p.style.overflowX=c?"hidden":"auto",this.textContent=`Word Wrap: ${c?"On":"Off"}`}),setTimeout(()=>p.focus(),100),n()}function me(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ue(t){let e="",s="0",i=!0;const a=[["C","⌫","%","÷"],["7","8","9","×"],["4","5","6","-"],["1","2","3","+"],["±","0",".","="]];t.innerHTML=`
    <div class="app-calculator">
      <div class="calc-display">
        <div class="calc-expression" id="calc-expr"></div>
        <div class="calc-result" id="calc-result">0</div>
      </div>
      <div class="calc-buttons">
        ${a.map(r=>r.map(m=>{let n="calc-btn";return["÷","×","-","+"].includes(m)?n+=" operator":m==="="?n+=" equals":["C","⌫","%","±"].includes(m)&&(n+=" func"),`<div class="${n}" data-btn="${m}">${m}</div>`}).join("")).join("")}
      </div>
    </div>
  `;const l=t.querySelector("#calc-result"),o=t.querySelector("#calc-expr");t.querySelectorAll(".calc-btn").forEach(r=>{r.addEventListener("click",()=>p(r.dataset.btn))});function p(r){switch(r){case"C":e="",s="0",i=!0;break;case"⌫":s.length>1?s=s.slice(0,-1):s="0";break;case"±":s!=="0"&&(s=s.startsWith("-")?s.slice(1):"-"+s);break;case"%":s=String(parseFloat(s)/100);break;case"=":try{const m=(e+s).replace(/×/g,"*").replace(/÷/g,"/"),n=Function('"use strict"; return ('+m+")")();o.textContent=e+s+" =",s=String(Math.round(n*1e10)/1e10),e="",i=!0}catch{s="Error",i=!0}break;case"+":case"-":case"×":case"÷":e+=s+" "+r+" ",i=!0;break;case".":s.includes(".")||(s+="."),i=!1;break;default:i?(s=r,i=!1):s+=r}l.textContent=s,["=","C"].includes(r)||(o.textContent=e)}}function ve(t){let e="/";t.innerHTML=`
    <div class="app-terminal">
      <div class="terminal-output" id="term-output"></div>
      <div class="terminal-input-line">
        <span class="terminal-prompt" id="term-prompt">ai-os:/ $</span>
        <input type="text" class="terminal-input" id="term-input" autofocus spellcheck="false" autocomplete="off">
      </div>
    </div>
  `;const s=t.querySelector("#term-output"),i=t.querySelector("#term-input"),a=t.querySelector("#term-prompt");o("AI OS Terminal v1.0","system"),o(`Type "help" for available commands.
`,"system");function l(){a.textContent=`ai-os:${e} $`}function o(d,c=""){const u=document.createElement("div");u.className="terminal-line"+(c?" "+c:""),u.textContent=d,s.appendChild(u),s.scrollTop=s.scrollHeight}function p(d){const c=d.trim();if(!c)return;o(`${a.textContent} ${c}`,"");const u=c.split(/\s+/),f=u[0].toLowerCase(),v=u.slice(1);switch(f){case"help":o("Available commands:","system"),o("  ls [path]      - List directory contents","system"),o("  cd <path>      - Change directory","system"),o("  pwd            - Print working directory","system"),o("  cat <file>     - Display file contents","system"),o("  mkdir <name>   - Create directory","system"),o("  touch <name>   - Create empty file","system"),o("  rm <name>      - Remove file/folder","system"),o("  echo <text>    - Print text","system"),o("  whoami         - Current user","system"),o("  date           - Current date/time","system"),o("  uname          - System information","system"),o("  neofetch       - System info (fancy)","system"),o("  clear          - Clear terminal","system"),o("  history        - Command history","system");break;case"ls":{const g=r(v[0]||"."),y=b.listDir(g);y.length===0?o("(empty directory)"):y.forEach(C=>{const I=C.type==="folder"?"📁":"📄";o(`${I} ${C.name}`)});break}case"cd":if(!v[0]||v[0]==="~"||v[0]==="/")e="/";else if(v[0]===".."){const g=e.split("/").filter(Boolean);g.pop(),e="/"+g.join("/"),e==="/"&&(e="/")}else{const g=r(v[0]),y=b.resolve(g);y&&y.type==="folder"?e=g:o(`cd: no such directory: ${v[0]}`,"error")}l();break;case"pwd":o(e||"/");break;case"cat":{if(!v[0]){o("cat: missing operand","error");break}const g=b.readFile(r(v[0]));g!==null?o(g):o(`cat: ${v[0]}: No such file`,"error");break}case"mkdir":if(!v[0]){o("mkdir: missing operand","error");break}b.createFolder(r(v[0]))?o(`Created directory: ${v[0]}`,"success"):o(`mkdir: cannot create directory '${v[0]}'`,"error");break;case"touch":if(!v[0]){o("touch: missing operand","error");break}b.writeFile(r(v[0]),"")?o(`Created file: ${v[0]}`,"success"):o(`touch: cannot create file '${v[0]}'`,"error");break;case"rm":if(!v[0]){o("rm: missing operand","error");break}b.deleteItem(r(v[0]))?o(`Removed: ${v[0]}`,"success"):o(`rm: cannot remove '${v[0]}'`,"error");break;case"echo":o(v.join(" "));break;case"whoami":o("user@ai-os");break;case"date":o(new Date().toString());break;case"uname":o("AI OS 1.0.0 x86_64 WebAssembly");break;case"neofetch":o("","system"),o("       ╭──────────╮       user@ai-os","system"),o("       │  AI  OS  │       ──────────","system"),o("       │  ◉    ◉  │       OS: AI OS 1.0.0","system"),o("       │    ──    │       Kernel: Web 5.0","system"),o("       │  ╰────╯  │       Shell: ai-terminal","system"),o("       ╰──────────╯       Resolution: "+window.innerWidth+"x"+window.innerHeight,"system"),o("                          Theme: Dark Mode","system"),o("                          CPU: Neural Engine v2","system"),o("                          Memory: ∞ MB","system"),o("","system");break;case"clear":s.innerHTML="";break;case"history":m.forEach((g,y)=>o(`  ${y+1}  ${g}`));break;default:o(`${f}: command not found. Type "help" for available commands.`,"error")}}function r(d){return!d||d==="."?e:d.startsWith("/")?d:(e==="/"?"":e)+"/"+d}const m=[];let n=-1;i.addEventListener("keydown",d=>{if(d.key==="Enter"){const c=i.value;c.trim()&&(m.push(c),n=m.length),p(c),i.value=""}else d.key==="ArrowUp"?(d.preventDefault(),n>0&&(n--,i.value=m[n])):d.key==="ArrowDown"&&(d.preventDefault(),n<m.length-1?(n++,i.value=m[n]):(n=m.length,i.value=""))}),t.addEventListener("click",()=>i.focus()),setTimeout(()=>i.focus(),100)}function fe(t){let e="system";const s=[{name:"Blue",value:"#60cdff"},{name:"Purple",value:"#b4a0ff"},{name:"Pink",value:"#ff8bda"},{name:"Red",value:"#ff6b6b"},{name:"Orange",value:"#ff922b"},{name:"Yellow",value:"#fcc419"},{name:"Green",value:"#51cf66"},{name:"Teal",value:"#20c997"}];function i(){const o=getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();t.innerHTML=`
      <div class="app-settings">
        <div class="settings-sidebar">
          <div class="settings-sidebar-title">Settings</div>
          ${["system","personalization","ai","apps","about"].map(n=>`
            <div class="settings-nav-item ${e===n?"active":""}" data-section="${n}">
              <span class="material-symbols-outlined">${l(n)}</span>
              ${n.charAt(0).toUpperCase()+n.slice(1)}
            </div>
          `).join("")}
        </div>
        <div class="settings-main">${a(o)}</div>
      </div>
    `,t.querySelectorAll(".settings-nav-item").forEach(n=>{n.addEventListener("click",()=>{e=n.dataset.section,i()})}),t.querySelectorAll(".color-swatch").forEach(n=>{n.addEventListener("click",()=>{const d=n.dataset.color;document.documentElement.style.setProperty("--accent",d),document.documentElement.style.setProperty("--accent-glow",d+"20"),i()})}),t.querySelectorAll(".toggle").forEach(n=>n.addEventListener("click",()=>n.classList.toggle("on")));const p=t.querySelector("#save-api-key");p&&p.addEventListener("click",()=>{var d,c;const n=(c=(d=t.querySelector("#api-key-input"))==null?void 0:d.value)==null?void 0:c.trim();h.setApiKey(n||""),w(n?{title:"AI Connected",message:"✅ API key saved! AI Assistant is now powered by OpenRouter.",icon:"neurology",duration:5e3}:{title:"Key Removed",message:"Switched to offline mode.",icon:"info",duration:4e3}),i()});const r=t.querySelector("#clear-api-key");r&&r.addEventListener("click",()=>{const n=t.querySelector("#api-key-input");n&&(n.value=""),h.setApiKey(""),w({title:"Key Cleared",message:"Switched to offline mode.",icon:"info",duration:4e3}),i()});const m=t.querySelector("#test-ai");m&&m.addEventListener("click",async()=>{m.textContent="Testing...",m.style.opacity="0.6";try{const n=await h.getResponse('Say "Connection successful!" in exactly those words, nothing else.');w({title:"AI Test",message:`✅ Response: "${n.slice(0,80)}"`,icon:"check_circle",duration:6e3})}catch(n){w({title:"Test Failed",message:`❌ ${n.message}`,icon:"error",duration:5e3})}m.textContent="Test Connection",m.style.opacity="1"})}function a(o){var p;switch(e){case"system":return`
        <div class="settings-section-title">System</div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Performance Mode</div><div class="settings-item-desc">Optimize for performance</div></div><div class="toggle on"></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Animations</div><div class="settings-item-desc">Enable smooth animations</div></div><div class="toggle on"></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Sounds</div><div class="settings-item-desc">Play system sounds</div></div><div class="toggle"></div></div>
        </div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Storage</div><div class="settings-item-desc">Virtual filesystem — Unlimited</div></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Memory</div><div class="settings-item-desc">${(((p=performance.memory)==null?void 0:p.usedJSHeapSize)/1048576||64).toFixed(1)} MB used</div></div></div>
        </div>`;case"personalization":return`
        <div class="settings-section-title">Personalization</div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Accent Color</div><div class="settings-item-desc">Choose your accent color</div></div></div>
          <div style="padding:0 0 12px"><div class="color-swatches">${s.map(r=>`<div class="color-swatch ${o===r.value?"selected":""}" style="background:${r.value}" data-color="${r.value}" title="${r.name}"></div>`).join("")}</div></div>
        </div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Dark Mode</div><div class="settings-item-desc">Use dark theme</div></div><div class="toggle on"></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Transparency Effects</div><div class="settings-item-desc">Enable glassmorphism</div></div><div class="toggle on"></div></div>
        </div>`;case"ai":return`
        <div class="settings-section-title">AI Configuration</div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info">
            <div class="settings-item-title">Connection Status</div>
            <div class="settings-item-desc" style="color:${h.isConnected()?"var(--success)":"var(--warning)"};font-weight:500">
              ${h.isConnected()?"✅ Connected — OpenRouter (GPT-OSS 120B)":"⚠️ Offline Mode — No API key configured"}
            </div>
          </div></div>
        </div>
        <div class="settings-card">
          <div class="settings-item" style="flex-direction:column;align-items:stretch;gap:12px;">
            <div class="settings-item-info">
              <div class="settings-item-title">OpenRouter API Key</div>
              <div class="settings-item-desc">Get your key from <strong>openrouter.ai/keys</strong></div>
            </div>
            <div style="display:flex;gap:8px;">
              <input type="password" id="api-key-input" value="${h.getApiKey()}"
                placeholder="sk-or-..."
                style="flex:1;height:38px;background:var(--bg-input);border:1.5px solid var(--glass-border);
                border-radius:var(--radius-md);padding:0 14px;font-family:var(--font-mono);font-size:12px;
                color:var(--text-primary);outline:none;">
              <button id="save-api-key" style="height:38px;padding:0 20px;background:var(--accent-secondary);
                color:#fff;border:none;border-radius:var(--radius-md);font-family:var(--font);font-size:13px;
                font-weight:600;cursor:pointer;">Save</button>
              <button id="clear-api-key" style="height:38px;padding:0 14px;background:var(--bg-card);
                color:var(--text-secondary);border:1px solid var(--glass-border);border-radius:var(--radius-md);
                font-family:var(--font);font-size:13px;cursor:pointer;">Clear</button>
            </div>
          </div>
          ${h.isConnected()?`
          <div class="settings-item">
            <div class="settings-item-info"><div class="settings-item-title">Test Connection</div><div class="settings-item-desc">Send a test message to verify AI is working</div></div>
            <button id="test-ai" style="height:34px;padding:0 16px;background:var(--bg-card);
              color:var(--accent);border:1px solid var(--accent);border-radius:var(--radius-md);
              font-family:var(--font);font-size:12px;font-weight:500;cursor:pointer;">Test Connection</button>
          </div>`:""}
        </div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Smart Suggestions</div><div class="settings-item-desc">AI-powered suggestions in search</div></div><div class="toggle on"></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Streaming Responses</div><div class="settings-item-desc">Show responses word-by-word</div></div><div class="toggle on"></div></div>
        </div>
        <div class="settings-card" style="background:rgba(96,205,255,0.05);border-color:rgba(96,205,255,0.15);">
          <div class="settings-item" style="border:none;">
            <div class="settings-item-info">
              <div class="settings-item-title" style="color:var(--accent);">💡 How to get an API key</div>
              <div class="settings-item-desc" style="margin-top:8px;line-height:1.8;">
                1. Go to <strong>openrouter.ai</strong><br>
                2. Sign in or create an account<br>
                3. Go to <strong>Keys</strong> in the dashboard<br>
                4. Click <strong>"Create Key"</strong><br>
                5. Copy and paste it above
              </div>
            </div>
          </div>
        </div>`;case"apps":return`
        <div class="settings-section-title">Apps</div>
        <div class="settings-card">
          ${["AI Assistant","File Explorer","Notepad","Calculator","Terminal","Weather","Chrome"].map(r=>`
            <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">${r}</div><div class="settings-item-desc">v1.0.0 — Built-in</div></div></div>
          `).join("")}
        </div>`;case"about":return`
        <div class="settings-section-title">About</div>
        <div class="settings-card">
          <div style="text-align:center;padding:20px;">
            <div style="width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
              <img src="/logo.png" style="width:100%; height:100%; object-fit:contain; border-radius:16px;">
            </div>
            <h2 style="font-size:22px;font-weight:700;">AI OS</h2>
            <p style="color:var(--text-secondary);margin-top:4px;">Intelligent Desktop Environment</p>
            <p style="color:var(--accent);margin-top:4px;font-size:12px;">Powered by OpenRouter AI</p>
            <p style="color:var(--text-tertiary);margin-top:12px;font-size:13px;">Version 1.0.0</p>
          </div>
        </div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">AI Engine</div><div class="settings-item-desc">${h.isConnected()?"OpenRouter — GPT-OSS 120B":"Offline Mock"}</div></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Platform</div><div class="settings-item-desc">${navigator.platform}</div></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Resolution</div><div class="settings-item-desc">${screen.width}×${screen.height}</div></div></div>
        </div>`;default:return""}}function l(o){return{system:"computer",personalization:"palette",apps:"apps",ai:"neurology",about:"info"}[o]||"settings"}i()}function ge(t){const e=[{day:"Mon",icon:"☀️",temp:"24°"},{day:"Tue",icon:"⛅",temp:"22°"},{day:"Wed",icon:"🌤️",temp:"23°"},{day:"Thu",icon:"🌧️",temp:"18°"},{day:"Fri",icon:"⛈️",temp:"16°"},{day:"Sat",icon:"🌤️",temp:"21°"},{day:"Sun",icon:"☀️",temp:"25°"}];t.innerHTML=`
    <div class="app-weather">
      <div class="weather-current">
        <div class="weather-icon">🌤️</div>
        <div class="weather-temp">22°C</div>
        <div class="weather-desc">Partly Cloudy</div>
        <div class="weather-location">📍 San Francisco, CA</div>
      </div>
      <div class="weather-details">
        <div class="weather-detail-card">
          <div class="weather-detail-value">45%</div>
          <div class="weather-detail-label">Humidity</div>
        </div>
        <div class="weather-detail-card">
          <div class="weather-detail-value">12 km/h</div>
          <div class="weather-detail-label">Wind</div>
        </div>
        <div class="weather-detail-card">
          <div class="weather-detail-value">UV 5</div>
          <div class="weather-detail-label">UV Index</div>
        </div>
      </div>
      <div class="weather-forecast">
        ${e.map(s=>`
          <div class="forecast-item">
            <div class="forecast-day">${s.day}</div>
            <div class="forecast-icon">${s.icon}</div>
            <div class="forecast-temp">${s.temp}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function ye(t){var o,p,r,m;t.innerHTML=`
    <div class="app-browser">
      <div class="browser-toolbar">
        <div class="browser-nav-btn" id="br-back"><span class="material-symbols-outlined">arrow_back</span></div>
        <div class="browser-nav-btn" id="br-forward"><span class="material-symbols-outlined">arrow_forward</span></div>
        <div class="browser-nav-btn" id="br-refresh"><span class="material-symbols-outlined">refresh</span></div>
        <div class="browser-nav-btn" id="br-home"><span class="material-symbols-outlined">home</span></div>
        <input type="text" class="browser-url-bar" id="br-url" placeholder="Search or enter URL..." value="">
      </div>
      <div class="browser-content" id="br-content">
        <div class="browser-new-tab">
          <div style="font-size:48px;margin-bottom:8px;">🌐</div>
          <h2>New Tab</h2>
          <p style="color:var(--text-tertiary);font-size:13px;margin-top:4px;">Enter a URL above to browse the web</p>
          <div style="display:flex;gap:8px;margin-top:24px;flex-wrap:wrap;justify-content:center;">
            ${[{name:"Google",url:"https://www.google.com",emoji:"🔍"},{name:"Wikipedia",url:"https://www.wikipedia.org",emoji:"📚"},{name:"GitHub",url:"https://www.github.com",emoji:"💻"},{name:"YouTube",url:"https://www.youtube.com",emoji:"▶️"}].map(n=>`
              <div class="browser-shortcut" data-url="${n.url}" style="background:var(--bg-card);padding:14px 20px;border-radius:var(--radius-lg);cursor:pointer;text-align:center;min-width:80px;transition:background var(--transition-fast);">
                <div style="font-size:24px;margin-bottom:4px;">${n.emoji}</div>
                <div style="font-size:12px;color:var(--text-secondary);">${n.name}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;const e=t.querySelector("#br-url"),s=t.querySelector("#br-content");function i(n){if(!n)return;!n.startsWith("http://")&&!n.startsWith("https://")&&(n="https://"+n);let d=n;n.includes("youtube.com/watch?v=")?d=n.replace("youtube.com/watch?v=","youtube.com/embed/").split("&")[0]:n.includes("youtu.be/")?d=n.replace("youtu.be/","youtube.com/embed/").split("?")[0]:(n==="https://www.youtube.com"||n==="https://youtube.com")&&(d="https://www.youtube.com/embed/"),n.includes("google.com/search")&&(d=n+(n.includes("?")?"&":"?")+"igu=1"),e.value=n,s.innerHTML=`
      <div style="background: rgba(255, 204, 0, 0.1); color: #fcc419; padding: 4px; font-size: 11px; text-align: center; border-bottom: 1px solid rgba(255, 204, 0, 0.2); font-family: var(--font);">
        <strong>Note:</strong> Some major sites (ChatGPT, Gemini, etc.) block being opened inside other applications for security.
      </div>
      <iframe src="${d}" style="width:100%; height:calc(100% - 24px); border:none;" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"></iframe>
    `}function a(){e.value="",s.innerHTML=t.querySelector(".browser-content").innerHTML,l()}function l(){t.querySelectorAll(".browser-shortcut").forEach(n=>{n.addEventListener("click",()=>i(n.dataset.url)),n.addEventListener("mouseenter",()=>n.style.background="var(--bg-hover)"),n.addEventListener("mouseleave",()=>n.style.background="var(--bg-card)")})}e.addEventListener("keydown",n=>{n.key==="Enter"&&i(e.value)}),(o=t.querySelector("#br-back"))==null||o.addEventListener("click",()=>{const n=s.querySelector("iframe");if(n)try{n.contentWindow.history.back()}catch{}}),(p=t.querySelector("#br-forward"))==null||p.addEventListener("click",()=>{const n=s.querySelector("iframe");if(n)try{n.contentWindow.history.forward()}catch{}}),(r=t.querySelector("#br-refresh"))==null||r.addEventListener("click",()=>{const n=s.querySelector("iframe");if(n)try{n.src=n.src}catch{}}),(m=t.querySelector("#br-home"))==null||m.addEventListener("click",a),l(),i("https://www.google.com/webhp?igu=1")}const L=[{id:"assistant",name:"AI Assistant",icon:"neurology",color:"#60cdff",width:480,height:580,factory:(t,e)=>le(t)},{id:"explorer",name:"File Explorer",icon:"folder_open",color:"#fcc419",width:860,height:520,factory:(t,e)=>de(t)},{id:"notepad",name:"Notepad",icon:"edit_note",color:"#74c0fc",width:700,height:480,factory:(t,e)=>G(t)},{id:"calculator",name:"Calculator",icon:"calculate",color:"#51cf66",width:320,height:480,factory:(t,e)=>ue(t)},{id:"terminal",name:"Terminal",icon:"terminal",color:"#b4a0ff",width:720,height:450,factory:(t,e)=>ve(t)},{id:"settings",name:"Settings",icon:"settings",color:"#8b949e",width:820,height:540,factory:(t,e)=>fe(t)},{id:"weather",name:"Weather",icon:"cloud",color:"#74c0fc",width:440,height:520,factory:(t,e)=>ge(t)},{id:"browser",name:"Chrome",icon:"chrome_reader_mode",color:"#4285F4",width:900,height:560,factory:(t,e)=>ye(t)}],he=[{appId:"assistant",label:"AI Assistant"},{appId:"explorer",label:"File Explorer"},{appId:"notepad",label:"Notepad"},{appId:"terminal",label:"Terminal"},{appId:"browser",label:"Chrome"},{appId:"calculator",label:"Calculator"},{appId:"settings",label:"Settings"},{appId:"weather",label:"Weather"}];function E(t,e={}){const s=L.find(i=>i.id===t);s&&J({title:s.name,icon:s.icon,width:s.width,height:s.height,app:t,contentFactory:(i,a)=>{t==="notepad"&&e.fileName?G(i,a,e.fileName,e.content,e.filePath):s.factory(i,a)}})}window.__openNotepadWithContent=(t,e,s)=>{E("notepad",{fileName:t,content:e,filePath:s})};function be(){const t=document.getElementById("desktop-icons");t.innerHTML=he.map(e=>{const s=L.find(i=>i.id===e.appId);return`
      <div class="desktop-icon" data-app="${e.appId}">
        <div class="desktop-icon-img">
          <span class="material-symbols-outlined icon-filled" style="color:${(s==null?void 0:s.color)||"#fff"}">${(s==null?void 0:s.icon)||"apps"}</span>
        </div>
        <div class="desktop-icon-label">${e.label}</div>
      </div>
    `}).join(""),t.querySelectorAll(".desktop-icon").forEach(e=>{e.addEventListener("dblclick",()=>E(e.dataset.app)),e.addEventListener("click",()=>{t.querySelectorAll(".desktop-icon.selected").forEach(s=>s.classList.remove("selected")),e.classList.add("selected")})}),document.getElementById("desktop").addEventListener("contextmenu",e=>{e.preventDefault(),we(e.clientX,e.clientY,[{icon:"refresh",label:"Refresh",action:()=>{}},{separator:!0},{icon:"grid_view",label:"View",action:()=>{}},{icon:"sort",label:"Sort by",action:()=>{}},{separator:!0},{icon:"add",label:"New Folder",action:()=>{}},{icon:"description",label:"New File",action:()=>{}},{separator:!0},{icon:"settings",label:"Settings",action:()=>E("settings")},{icon:"neurology",label:"AI Assistant",action:()=>E("assistant")}])}),document.addEventListener("click",e=>{e.target.closest(".desktop-icon")||t.querySelectorAll(".desktop-icon.selected").forEach(s=>s.classList.remove("selected")),e.target.closest("#context-menu")||document.getElementById("context-menu").classList.remove("visible")})}function we(t,e,s){const i=document.getElementById("context-menu");i.innerHTML=s.map(a=>a.separator?'<div class="ctx-separator"></div>':`<div class="ctx-item" data-id="${a.label}">
      <span class="material-symbols-outlined">${a.icon}</span>
      <span class="ctx-item-label">${a.label}</span>
      ${a.shortcut?`<span class="ctx-item-shortcut">${a.shortcut}</span>`:""}
    </div>`).join(""),i.style.left=Math.min(t,window.innerWidth-220)+"px",i.style.top=Math.min(e,window.innerHeight-i.offsetHeight-60)+"px",i.classList.add("visible"),i.querySelectorAll(".ctx-item").forEach((a,l)=>{const p=s.filter(r=>!r.separator)[l];p!=null&&p.action&&a.addEventListener("click",()=>{p.action(),i.classList.remove("visible")})})}function xe(){const t=document.getElementById("taskbar");t.innerHTML=`
    <div class="taskbar-start" id="btn-start" style="padding: 6px;">
      <img src="/logo.png" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;">
    </div>
    <div class="taskbar-search" id="btn-search">
      <span class="material-symbols-outlined">search</span>
      <span>Search apps, files, settings...</span>
    </div>
    <div class="taskbar-apps" id="taskbar-apps"></div>
    <div class="taskbar-tray">
      <div class="tray-btn"><span class="material-symbols-outlined">wifi</span></div>
      <div class="tray-btn"><span class="material-symbols-outlined">volume_up</span></div>
      <div class="tray-btn"><span class="material-symbols-outlined">battery_full</span></div>
    </div>
    <div class="taskbar-clock" id="taskbar-clock">
      <div class="taskbar-clock-time"></div>
      <div class="taskbar-clock-date"></div>
    </div>
  `,document.getElementById("btn-start").addEventListener("click",e=>{e.stopPropagation(),S()}),document.getElementById("btn-search").addEventListener("click",e=>{e.stopPropagation(),S(!0)}),D(),setInterval(D,1e3),X(ke)}function D(){const t=new Date,e=document.getElementById("taskbar-clock");e&&(e.querySelector(".taskbar-clock-time").textContent=t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),e.querySelector(".taskbar-clock-date").textContent=t.toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"}))}function ke(t){const e=document.getElementById("taskbar-apps");e&&(e.innerHTML=t.map(s=>{const i=L.find(a=>a.id===s.app)||{};return`
      <div class="taskbar-app ${s.active?"active":""}" data-win-id="${s.id}" title="${s.title}">
        <span class="material-symbols-outlined" style="color:${i.color||"#fff"}">${s.icon}</span>
        <div class="taskbar-app-indicator"></div>
      </div>
    `}).join(""),e.querySelectorAll(".taskbar-app").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.winId,a=t.find(l=>l.id===i);a&&(a.active&&!a.minimized?Y(i):te(i))})}))}let k=!1;function Se(){var i;const t=document.getElementById("start-menu"),e=L;t.innerHTML=`
    <div class="start-search">
      <div class="start-search-box">
        <span class="material-symbols-outlined">search</span>
        <input type="text" class="start-search-input" id="start-search-input" placeholder="Type to search apps, files, settings...">
      </div>
    </div>
    <div class="start-section">
      <div class="start-section-header">
        <span class="start-section-title">Pinned</span>
        <span class="start-section-action">All apps ›</span>
      </div>
      <div class="start-pinned-grid" id="start-pinned-grid">
        ${e.map(a=>`
          <div class="start-app-item" data-app="${a.id}">
            <div class="start-app-icon"><span class="material-symbols-outlined icon-filled" style="color:${a.color}">${a.icon}</span></div>
            <div class="start-app-name">${a.name}</div>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="start-section">
      <div class="start-section-header">
        <span class="start-section-title">Recommended</span>
      </div>
      <div class="start-recommended-list">
        <div class="start-recommended-item" data-app="notepad">
          <div class="start-recommended-icon"><span class="material-symbols-outlined">description</span></div>
          <div class="start-recommended-info">
            <div class="start-recommended-name">Welcome.txt</div>
            <div class="start-recommended-detail">Recently opened</div>
          </div>
        </div>
        <div class="start-recommended-item" data-app="assistant">
          <div class="start-recommended-icon"><span class="material-symbols-outlined">neurology</span></div>
          <div class="start-recommended-info">
            <div class="start-recommended-name">Ask AI Assistant</div>
            <div class="start-recommended-detail">Get help with anything</div>
          </div>
        </div>
        <div class="start-recommended-item" data-app="terminal">
          <div class="start-recommended-icon"><span class="material-symbols-outlined">terminal</span></div>
          <div class="start-recommended-info">
            <div class="start-recommended-name">Open Terminal</div>
            <div class="start-recommended-detail">Run commands</div>
          </div>
        </div>
      </div>
    </div>
    <div class="start-footer">
      <div class="start-user">
        <div class="start-user-avatar">U</div>
        <div class="start-user-name">User</div>
      </div>
      <div class="start-power" id="start-power" title="Shut Down">
        <span class="material-symbols-outlined">power_settings_new</span>
      </div>
    </div>
  `,t.querySelectorAll(".start-app-item, .start-recommended-item").forEach(a=>{a.addEventListener("click",()=>{E(a.dataset.app),S(!1)})});const s=t.querySelector("#start-search-input");s.addEventListener("input",()=>{const a=h.searchApps(s.value),l=t.querySelector("#start-pinned-grid");l.innerHTML=a.map(o=>{var p;return`
      <div class="start-app-item" data-app="${o.id}">
        <div class="start-app-icon"><span class="material-symbols-outlined icon-filled" style="color:${((p=L.find(r=>r.id===o.id))==null?void 0:p.color)||"#fff"}">${o.icon}</span></div>
        <div class="start-app-name">${o.name}</div>
      </div>
    `}).join(""),l.querySelectorAll(".start-app-item").forEach(o=>{o.addEventListener("click",()=>{E(o.dataset.app),S(!1)})})}),(i=t.querySelector("#start-power"))==null||i.addEventListener("click",()=>{S(!1),document.getElementById("os-root").style.display="none";const a=document.getElementById("boot-screen");a.style.display="flex",a.querySelector(".boot-status").textContent="Shutting down...",a.querySelector(".boot-progress-bar").style.animation="none",a.querySelector(".boot-progress-bar").style.width="100%",setTimeout(()=>{a.querySelector(".boot-status").textContent="Restarting...",setTimeout(()=>location.reload(),1500)},2e3)}),document.addEventListener("click",a=>{k&&!a.target.closest("#start-menu")&&!a.target.closest("#btn-start")&&!a.target.closest("#btn-search")&&S(!1)})}function S(t){const e=document.getElementById("start-menu");t===!0?k=!0:t===!1?k=!1:k=!k,k?(e.classList.add("open"),setTimeout(()=>{const s=e.querySelector("#start-search-input");s&&s.focus()},300)):e.classList.remove("open")}function Ee(){const t=document.getElementById("boot-screen"),e=document.getElementById("lock-screen"),s=document.getElementById("os-root"),i=t.querySelector(".boot-status"),a=["Initializing system...","Loading AI Engine...","Starting window manager...","Loading applications...","Preparing desktop...","Ready!"];let l=0;const o=setInterval(()=>{l++,l<a.length&&(i.textContent=a[l])},450);setTimeout(()=>{clearInterval(o),t.style.transition="opacity 0.5s ease",t.style.opacity="0",setTimeout(()=>{t.style.display="none",e.style.display="flex",B();const p=setInterval(B,1e3);e.addEventListener("click",()=>{clearInterval(p),e.classList.add("unlocking"),setTimeout(()=>{e.style.display="none",s.style.display="block",Ae()},600)})},500)},2800)}function B(){const t=new Date;document.getElementById("lock-time").textContent=t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),document.getElementById("lock-date").textContent=t.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}function Ae(){be(),xe(),Se(),ne(),document.addEventListener("keydown",t=>{(t.key==="Meta"||t.key==="Escape"&&k)&&(t.preventDefault(),S())})}document.addEventListener("DOMContentLoaded",Ee);
