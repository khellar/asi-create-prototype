/* ===== ASI:Create prototype interactions ===== */
(function(){
  // ---- theme ----
  var saved = localStorage.getItem('oc-theme');
  var _qt = new URLSearchParams(location.search).get('theme');
  var _useDark = _qt ? _qt==='dark' : (saved!==null ? saved==='dark' : true); /* dark by default */
  if(_useDark) document.documentElement.setAttribute('data-theme','dark');
  function syncThemeIcons(){
    var dark = document.documentElement.getAttribute('data-theme')==='dark';
    document.querySelectorAll('[data-themebtn] i').forEach(function(i){ i.className = dark? 'ti ti-sun':'ti ti-moon'; });
  }
  function toggleTheme(){
    var dark = document.documentElement.getAttribute('data-theme')==='dark';
    if(dark){ document.documentElement.removeAttribute('data-theme'); localStorage.setItem('oc-theme','light'); }
    else { document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('oc-theme','dark'); }
    syncThemeIcons();
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-themebtn]'); if(t){ toggleTheme(); }
  });
  syncThemeIcons();

  // ---- skin (Graphite · Pine · Oxblood) ----
  var savedSkin = localStorage.getItem('oc-skin');
  var _qsk = new URLSearchParams(location.search).get('skin');
  document.documentElement.setAttribute('data-skin', _qsk || savedSkin || 'violet');
  function syncSkins(){
    var s = document.documentElement.getAttribute('data-skin') || 'graphite';
    document.querySelectorAll('.sw-skin').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-skin')===s); });
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest('.sw-skin'); if(!b) return;
    var s = b.getAttribute('data-skin');
    document.documentElement.setAttribute('data-skin', s);
    localStorage.setItem('oc-skin', s); syncSkins();
  });
  syncSkins();

  // ---- drawer tabs ----
  document.querySelectorAll('[data-dtab]').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('[data-dtab]').forEach(function(x){x.classList.remove('active')});
      tab.classList.add('active');
      var name = tab.getAttribute('data-dtab');
      document.querySelectorAll('[data-dpane]').forEach(function(p){
        p.style.display = p.getAttribute('data-dpane')===name ? '' : 'none';
      });
    });
  });

  // open a specific drawer pane via ?pane=
  var _qpane = new URLSearchParams(location.search).get('pane');
  if(_qpane){ var _tb = document.querySelector('[data-dtab="'+_qpane+'"]'); if(_tb) _tb.click(); }

  // ---- connector toggles ----
  document.querySelectorAll('.drawer .toggle').forEach(function(tg){
    tg.addEventListener('click', function(){ tg.classList.toggle('on'); });
  });

  // ---- model dropdown ----
  var modelBtn = document.getElementById('modelBtn');
  var modelMenu = document.getElementById('modelMenu');
  if(modelBtn && modelMenu){
    modelBtn.addEventListener('click', function(e){ e.stopPropagation(); modelMenu.style.display = modelMenu.style.display==='block'?'none':'block'; });
    modelMenu.querySelectorAll('.dditem').forEach(function(it){
      it.addEventListener('click', function(){
        document.getElementById('modelName').textContent = it.getAttribute('data-model');
        modelMenu.querySelectorAll('.ck').forEach(function(c){c.style.visibility='hidden'});
        var ck = it.querySelector('.ck'); if(ck) ck.style.visibility='visible';
        modelMenu.style.display='none';
      });
    });
    document.addEventListener('click', function(){ modelMenu.style.display='none'; });
  }

  // ---- new agent ----
  var newBtn = document.getElementById('newAgent');
  if(newBtn){
    newBtn.addEventListener('click', function(){
      var name = prompt('Name your new agent'); if(!name) return;
      var list = document.getElementById('agentList');
      document.querySelectorAll('#agentList .agent').forEach(function(a){a.classList.remove('active')});
      var colors=['#5B50E8','#E07A4B','#3BA37A','#C24DEE','#2F7AE5'];
      var c = colors[(list.children.length)%colors.length];
      var el = document.createElement('div');
      el.className='agent active';
      el.innerHTML='<span class="ad" style="background:'+c+'">'+name.trim().charAt(0).toUpperCase()+'</span> '+name.trim()+' <small>now</small>';
      list.appendChild(el);
      var nm=document.getElementById('agentTitle'); if(nm) nm.firstChild.textContent = name.trim()+' ';
      var thread=document.getElementById('thread');
      if(thread){ thread.innerHTML='<div class="row"><div class="av claw">'+name.trim().charAt(0).toUpperCase()+'</div><div class="bub"><div class="who">'+name.trim()+'</div>Hi — I’m '+name.trim()+', freshly deployed. Give me a goal and switch on whatever I need in the drawer.</div></div>'; }
    });
    // clicking an existing agent activates it
    document.addEventListener('click', function(e){
      var a=e.target.closest('#agentList .agent'); if(!a) return;
      document.querySelectorAll('#agentList .agent').forEach(function(x){x.classList.remove('active')});
      a.classList.add('active');
    });
  }

  // ---- share modal ----
  var shareBtn=document.getElementById('shareBtn'), modal=document.getElementById('shareModal');
  if(shareBtn&&modal){
    shareBtn.addEventListener('click',function(){modal.classList.add('open')});
    modal.addEventListener('click',function(e){ if(e.target===modal||e.target.closest('[data-close]')) modal.classList.remove('open'); });
    modal.querySelectorAll('.seg button').forEach(function(b){
      b.addEventListener('click',function(){ b.parentElement.querySelectorAll('button').forEach(function(x){x.classList.remove('on')}); b.classList.add('on'); });
    });
  }

  // ---- send message ----
  var input=document.getElementById('composerInput'), sendBtn=document.getElementById('sendBtn'), thread=document.getElementById('thread');
  function send(){
    if(!input) return; var txt=(input.value||input.textContent||'').trim(); if(!txt) return;
    var nm=document.getElementById('agentTitle'); var an = nm?nm.firstChild.textContent.trim():'Omega'; var ai=an.charAt(0).toUpperCase();
    var u=document.createElement('div'); u.className='row me'; u.innerHTML='<div class="av me">K</div><div class="bub">'+txt.replace(/</g,'&lt;')+'</div>'; thread.appendChild(u);
    if(input.value!==undefined) input.value=''; else input.textContent='';
    setTimeout(function(){
      var r=document.createElement('div'); r.className='row';
      r.innerHTML='<div class="av claw">'+ai+'</div><div class="bub"><div class="who">'+an+'</div>On it — I’ll pull from the connectors you have switched on and report back with sources.</div>';
      thread.appendChild(r); thread.scrollTop=thread.scrollHeight;
    },420);
    thread.scrollTop=thread.scrollHeight;
  }
  if(sendBtn) sendBtn.addEventListener('click',send);
  if(input) input.addEventListener('keydown',function(e){ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } });

  // ---- onboarding ----
  var ob=document.getElementById('ob');
  if(ob){
    var step=1;
    function show(n){
      step=n;
      document.querySelectorAll('[data-step]').forEach(function(s){ s.style.display = (+s.getAttribute('data-step')===n)?'':'none'; });
      document.querySelectorAll('[data-dot]').forEach(function(d){
        var v=+d.getAttribute('data-dot'); d.classList.remove('on','done');
        if(v<n) d.classList.add('done'); else if(v===n) d.classList.add('on');
      });
      if(n===4){ // deploy
        var logs=['Provisioning runtime on ASI Cloud','Wiring default connectors','Loading model: '+(window._ocModel||'Claude Sonnet 4.6'),'Agent online'];
        var box=document.getElementById('deploylog'); box.innerHTML='';
        logs.forEach(function(l,idx){ setTimeout(function(){ box.innerHTML+='<div><i class="ti ti-check"></i> '+l+'</div>'; },500*(idx+1)); });
        setTimeout(function(){ window.location.href='app.html'; }, 500*(logs.length+1)+400);
      }
    }
    ob.addEventListener('click',function(e){
      var nx=e.target.closest('[data-next]'); var bk=e.target.closest('[data-back]');
      if(nx) show(step+1); if(bk) show(step-1);
      var ch=e.target.closest('.choice'); if(ch){ ch.parentElement.querySelectorAll('.choice').forEach(function(x){x.classList.remove('sel')}); ch.classList.add('sel'); }
      var mc=e.target.closest('.mchip'); if(mc){ mc.parentElement.querySelectorAll('.mchip').forEach(function(x){x.classList.remove('sel')}); mc.classList.add('sel'); window._ocModel=mc.getAttribute('data-m'); }
    });
    var _qs = new URLSearchParams(location.search).get('step');
    show(_qs ? Math.min(3, Math.max(1, +_qs)) : 1);
  }
})();
