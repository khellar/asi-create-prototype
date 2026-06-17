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

  // ===== toast =====
  var _tt;
  function toast(msg){ var el=document.getElementById('toast'); if(!el) return; document.getElementById('toastMsg').textContent=msg; el.classList.add('show'); clearTimeout(_tt); _tt=setTimeout(function(){el.classList.remove('show')},2800); }

  // ===== per-agent threads =====
  var THREADS = {
    "Omega":
      '<div class="row"><div class="av claw">O</div><div class="bub"><div class="who">Omega</div>Hey khellar — I’m set up and ready. I can read files, browse, and run any tools you switch on in the drawer. What should we work on first?</div></div>'+
      '<div class="row me"><div class="av me">K</div><div class="bub">Find promising new web3 projects and draft a short memo on the top 3.</div></div>'+
      '<div class="row"><div class="av claw">O</div><div class="bub"><div class="who">Omega</div>Searching now and cross-checking on-chain activity. I’ll use Perplexity + your Drive notes.<div class="callout" style="margin-top:10px"><i class="ti ti-puzzle"></i> Suggested skill — <b>Token-spend tracker</b> by John Grove. Want me to install it so you can watch cost live? <span style="text-decoration:underline;cursor:pointer">Install</span></div></div></div>',
    "Research scout":
      '<div class="row"><div class="av claw">R</div><div class="bub"><div class="who">Research scout</div>Morning — I ran today’s scan and turned it into a reusable flow so it repeats on its own every day at 7am. Here’s the automation I wrote for you:'+
      '<div class="artifact" data-flow="research-scout"><span class="ai"><i class="ti ti-subtask"></i></span><div><div class="at">research-scout.flow</div><div class="as">5 steps · built by Research scout · runs daily 7:00am</div></div><span class="open">Open <i class="ti ti-arrow-up-right"></i></span></div></div></div>'+
      '<div class="row me"><div class="av me">K</div><div class="bub">nice. can you also have it skip anything under $1M daily volume?</div></div>'+
      '<div class="row"><div class="av claw">R</div><div class="bub"><div class="who">Research scout</div>Done — I added an on-chain filter step. Open the flow to fine-tune the threshold yourself, or just tell me a number.</div></div>',
    "Genome explorer":
      '<div class="row"><div class="av claw">G</div><div class="bub"><div class="who">Genome explorer</div>I can answer genomics questions, but I’m far more accurate with a knowledge graph connected. The <b>Genomics KG</b> is in your drawer.'+
      '<div class="artifact" data-subscribe="genomics"><span class="ai"><i class="ti ti-dna-2"></i></span><div><div class="at">Genomics Knowledge Graph</div><div class="as">180M curated edges · $199/mo · not subscribed</div></div><span class="open">Subscribe <i class="ti ti-arrow-up-right"></i></span></div></div></div>'+
      '<div class="row me"><div class="av me">K</div><div class="bub">which genes are linked to early-onset Parkinson’s?</div></div>'+
      '<div class="row"><div class="av claw">G</div><div class="bub"><div class="who">Genome explorer</div>Subscribe to the Genomics KG and I’ll return ranked gene–disease associations with citations and a subgraph you can explore.</div></div>',
    "Rent tracker":
      '<div class="row"><div class="av claw">$</div><div class="bub"><div class="who">Rent tracker</div>3 of 4 units have paid this month. I drafted a friendly reminder for unit 2B — want me to send it?</div></div>'
  };
  var DRAWER_TAB = { "Genome explorer":"Knowledge" };
  function renderAgent(name){
    var t=document.getElementById('thread'); if(!t) return;
    document.querySelectorAll('#agentList .agent').forEach(function(a){ a.classList.toggle('active', a.getAttribute('data-agent')===name); });
    var title=document.getElementById('agentTitle'); if(title && title.firstChild) title.firstChild.textContent=name+' ';
    var ci=document.getElementById('composerInput'); if(ci) ci.placeholder='Message '+name+'…';
    t.innerHTML = THREADS[name] || THREADS["Omega"]; t.scrollTop=0;
    var tb=document.querySelector('[data-dtab="'+(DRAWER_TAB[name]||'Connectors')+'"]'); if(tb) tb.click();
  }
  document.addEventListener('click', function(e){ var a=e.target.closest('#agentList .agent'); if(a) renderAgent(a.getAttribute('data-agent')); });

  // ===== inline flow editor =====
  var NODE_CFG = {
    schedule:{t:'Schedule',ic:'ti-clock',ttl:'When it runs',html:'<label class="lbl">Cron</label><input class="field" value="0 7 * * *"><p class="hint">Runs every day at 7:00am.</p>'},
    search:{t:'Web search',ic:'ti-world-search',ttl:'Search query',html:'<label class="lbl">Query</label><input class="field" value="new web3 projects this week"><label class="lbl" style="margin-top:12px">Provider</label><input class="field" value="Perplexity">'},
    filter:{t:'On-chain filter',ic:'ti-filter',ttl:'Minimum 24h volume',html:'<label class="lbl">Threshold (USD)</label><input class="field" id="filterThreshold" value="1,000,000"><p class="hint">Projects below this are skipped before summarizing. Edit and Save — applies to tomorrow’s 7:00am run.</p>'},
    summarize:{t:'Summarize',ic:'ti-sparkles',ttl:'Prompt',html:'<label class="lbl">Instruction</label><textarea class="field">3-bullet memo per project, focus on traction and team.</textarea><label class="lbl" style="margin-top:12px">Model</label><input class="field" value="Claude Sonnet 4.6">'},
    deliver:{t:'Deliver',ic:'ti-send',ttl:'Delivery',html:'<label class="lbl">Channel</label><input class="field" value="Email — khellar@singularitynet.io"><p class="hint">Sent right after the run completes.</p>'}
  };
  function selectNode(n){
    document.querySelectorAll('.fnode').forEach(function(x){ x.classList.toggle('sel', x.getAttribute('data-node')===n); });
    var c=NODE_CFG[n], ins=document.getElementById('inspector');
    if(c&&ins) ins.innerHTML='<div class="ih"><i class="ti '+c.ic+'"></i> '+c.t+' · node config</div><div class="ttl">'+c.ttl+'</div>'+c.html;
  }
  function openFlow(){ document.getElementById('flowPanel').classList.add('open'); document.getElementById('scrim').classList.add('open'); selectNode('filter'); }
  function closeFlow(){ document.getElementById('flowPanel').classList.remove('open'); document.getElementById('scrim').classList.remove('open'); }

  // ===== knowledge graph subscribe =====
  function geneRow(n,d,s){ return '<div class="gene"><span class="gn">'+n+'</span><span style="color:var(--faint);font-size:11.5px">'+d+'</span><span class="gs">'+s+'</span><span class="bar"><i style="width:'+s+'%"></i></span></div>'; }
  function appendGenomeResult(){
    var t=document.getElementById('thread'); if(!t) return;
    t.insertAdjacentHTML('beforeend',
      '<div class="row"><div class="av claw">G</div><div class="bub"><div class="who">Genome explorer</div>Querying the Genomics KG for early-onset Parkinson’s associations…'+
      '<div class="kgresult"><div class="gh"><i class="ti ti-dna-2"></i> gene → disease · ranked by evidence</div>'+
      geneRow('PRKN','recessive · PARK2',95)+geneRow('PINK1','mitophagy',88)+geneRow('SNCA','α-synuclein',72)+geneRow('LRRK2','kinase',61)+
      '<div style="font-size:11px;color:var(--faint);margin-top:10px;font-family:var(--mono)">4 of 27 results · sources: ClinVar, OMIM, DisGeNET</div></div>'+
      'Connected. Want the variant-level view or known drug interactions next?</div></div>');
    t.scrollTop=t.scrollHeight;
  }
  function subscribeGenomics(){
    var card=document.getElementById('kg-genomics');
    if(card){ card.classList.add('active'); var row=card.querySelector('.krow');
      if(row) row.innerHTML='<span class="kactive"><i class="ti ti-check"></i> Active · $199/mo</span><span style="font-size:12px;color:var(--faint);cursor:pointer">Manage</span>'; }
    toast('Subscribed to Genomics KG — your agent can now query it');
    var ttl=document.getElementById('agentTitle');
    if(ttl && /Genome/.test(ttl.textContent)) appendGenomeResult();
  }

  // ===== global click wiring for new components =====
  document.addEventListener('click', function(e){
    if(e.target.closest('[data-flow]')) openFlow();
    var fn=e.target.closest('.fnode'); if(fn) selectNode(fn.getAttribute('data-node'));
    if(e.target.closest('#flowClose')||e.target.closest('#scrim')) closeFlow();
    if(e.target.closest('#flowSave')) toast('Flow saved · next run tomorrow 7:00am');
    if(e.target.closest('#flowRun')) toast('Running flow… 5 projects found, memo sent');
    var fv=e.target.closest('[data-fpview]');
    if(fv){ var v=fv.getAttribute('data-fpview');
      document.querySelectorAll('[data-fpview]').forEach(function(b){ b.classList.toggle('on', b===fv); });
      document.querySelectorAll('[data-fppane]').forEach(function(p){ p.style.display = p.getAttribute('data-fppane')===v ? '' : 'none'; });
    }
    if(e.target.closest('[data-subscribe]')){ var m=document.getElementById('kgModal'); if(m) m.classList.add('open'); }
    var km=document.getElementById('kgModal');
    if(km && e.target.closest('#kgModal') && (e.target===km || e.target.closest('[data-close]'))) km.classList.remove('open');
    if(e.target.closest('#kgConfirm')){ if(km) km.classList.remove('open'); subscribeGenomics(); }
  });

  // ===== deep links: ?agent= , ?flow= =====
  if(document.getElementById('thread')){
    var _qag=new URLSearchParams(location.search).get('agent'); if(_qag) renderAgent(_qag);
    if(new URLSearchParams(location.search).get('flow')) openFlow();
  }
})();
