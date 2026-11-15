// ===== CIRCUIT TIMER =====
// Builds a schedule of segments (prep → work → rest … → round rest …) and plays voice + buzzer cues.
// Time is computed from timestamps, so it stays accurate even if the page is briefly backgrounded.
const NOSLEEP_SRC = "data:video/mp4;base64,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bWU9MSB0cmVsbGlzPTAgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9MCB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0wIHdlaWdodHA9MCBrZXlpbnQ9MjUwIGtleWludF9taW49MSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTEwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAA5liIQFv///D0UAAU9/gAEYIAcBGCAHARggBwEYIAcBGCAHARggBwEYIAcBGCAHAAAABUGaIBX1ARggBwEYIAcBGCAHARggBwEYIAcBGCAHARggBwEYIAc=";
const Timer = (() => {
  let cfg=null, segs=[], t0=0, pausedAt=0, pausedTotal=0, running=false, done=false, lastIdx=-1, lastRem=-1, iv=null, ctx=null, wake=null, vid=null, onUpdate=()=>{}, onDone=()=>{};

  function build(stations, c){
    const s=[{type:"prep",dur:3,next:stations[0],round:1,station:0}];
    for(let r=1;r<=c.rounds;r++) stations.forEach((name,i)=>{
      const last=i===stations.length-1;
      s.push({type:"work",dur:c.work,name,round:r,station:i,next:!last?stations[i+1]:(r<c.rounds?"Round rest":"Finish")});
      if(last && r===c.rounds) return;
      s.push(last ? {type:"roundrest",dur:c.roundRest,next:stations[0],round:r+1,station:0,doneRound:r}
                  : {type:"rest",dur:c.rest,next:stations[i+1],round:r,station:i+1});
    });
    return s;
  }
  // ---- audio ----
  let sessionSet=false;
  function setAmbientSession(){
    // Outside a sandboxed frame this tells iOS: mix with other apps' audio
    // instead of pausing it (the "ambient" category never interrupts playback).
    if(sessionSet) return; sessionSet=true;
    try{ if("audioSession" in navigator) navigator.audioSession.type="ambient"; }catch(e){}
  }
  function audio(){ setAmbientSession(); if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(ctx&&ctx.state==="suspended") ctx.resume(); return ctx; }
  function tone(freq,dur,type,vol,when){ const a=audio(); if(!a) return; const o=a.createOscillator(), g=a.createGain(); o.type=type||"sine"; o.frequency.value=freq;
    const t=a.currentTime+(when||0); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol||0.5,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t+dur+0.05); }
  function buzzer(){ tone(220,0.7,"square",0.35); tone(277,0.7,"square",0.25); }
  function chime(){ tone(880,0.18,"sine",0.5); tone(1320,0.25,"sine",0.4,0.15); }
  function getVoiceOn(){ try{ const v=localStorage.getItem("wk_voice"); return v===null?true:v==="1"; }catch(e){ return true; } }
  function setVoiceOn(on){ try{ localStorage.setItem("wk_voice",on?"1":"0"); }catch(e){} }
  let voice=null;
  function pickVoice(){ try{ const v=speechSynthesis.getVoices().filter(x=>/^en/i.test(x.lang)); voice=v.find(x=>/Samantha|Alex|Daniel|Google US/i.test(x.name))||v[0]||null; }catch(e){} }
  try{ speechSynthesis.onvoiceschanged=pickVoice; pickVoice(); }catch(e){}
  function say(text, interrupt, toneFallback){
    setAmbientSession();
    if(!getVoiceOn()){ (toneFallback||(()=>tone(880,0.12,"sine",0.45)))(); return; }
    try{ if(!("speechSynthesis" in window)) { tone(1000,0.12,"sine",0.5); return; }
      if(interrupt) speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text); if(voice) u.voice=voice; u.rate=1.05; u.volume=1; speechSynthesis.speak(u);
    }catch(e){ tone(1000,0.12,"sine",0.5); }
  }
  // ---- keep phone awake ----
  async function keepAwake(on){
    if(on){
      try{ if("wakeLock" in navigator){ wake=await navigator.wakeLock.request("screen"); } }catch(e){ wake=null; }
      try{ if(!vid){ vid=document.createElement("video"); vid.setAttribute("playsinline",""); vid.muted=true; vid.loop=true; vid.src=NOSLEEP_SRC;
             vid.style.cssText="position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;bottom:0;left:0"; document.body.appendChild(vid); }
           vid.play().catch(()=>{}); }catch(e){}
    } else { try{ wake&&wake.release(); }catch(e){} wake=null; try{ vid&&vid.pause(); }catch(e){} }
  }
  document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"&&running) keepAwake(true); });

  // ---- engine ----
  const elapsed=()=>((running?performance.now():pausedAt)-t0-pausedTotal)/1000;
  function locate(e){ let acc=0; for(let i=0;i<segs.length;i++){ if(e<acc+segs[i].dur) return {i,rem:acc+segs[i].dur-e}; acc+=segs[i].dur; } return {i:segs.length,rem:0}; }
  function cue(i,remS,isStart){
    const s=segs[i];
    if(isStart){
      if(s.type==="work") say("Go",true,()=>tone(1046,0.18,"sine",0.5));
      else if(s.type==="rest") say("Rest. Next, "+s.next,true,()=>{tone(523,0.15,"sine",0.4);tone(659,0.15,"sine",0.4,0.15);});
      else if(s.type==="roundrest") say("Round "+s.doneRound+" complete. "+s.dur+" seconds rest. Next, "+s.next,true,()=>{tone(523,0.15,"sine",0.4);tone(659,0.15,"sine",0.4,0.15);tone(784,0.2,"sine",0.4,0.3);});
      return;
    }
    if(s.type==="work"){ if(remS===5) say("5 seconds",true,()=>tone(700,0.1,"sine",0.4)); }
    else if(remS<=3&&remS>=1) say(String(remS),true,()=>tone(600,0.08,"sine",0.4));
  }
  function tick(){
    if(!segs.length) return;
    const {i,rem}=locate(elapsed()); const remS=Math.ceil(rem-1e-6);
    if(i>=segs.length){ if(!done){ done=true; running=false; clearInterval(iv); buzzer(); setTimeout(()=>{chime(); say("Circuit complete. Nice work.",true);},700); keepAwake(false); onDone(); } onUpdate(state()); return; }
    if(i!==lastIdx){
      const natural = i===lastIdx+1;
      if(lastIdx>=0 && natural && segs[lastIdx].type==="work") buzzer();
      if(natural||lastIdx<0) cue(i,remS,true);
      if(segs[i].type==="prep") cue(i,remS,false);
      lastIdx=i; lastRem=remS;
    } else if(remS!==lastRem){
      if(remS===lastRem-1) cue(i,remS,false);
      lastRem=remS;
    }
    onUpdate(state());
  }
  function state(){
    if(!segs.length) return {idle:true};
    const {i,rem}=locate(elapsed()); if(i>=segs.length) return {done:true,rounds:cfg.rounds};
    const s=segs[i]; return {seg:s,rem,remS:Math.ceil(rem-1e-6),frac:1-rem/s.dur,running,rounds:cfg.rounds,stations:cfg.stations};
  }
  return {
    start(stations,c,upd,fin){ cfg=Object.assign({stations:stations.length},c); segs=build(stations,c); onUpdate=upd; onDone=fin;
      audio();
      t0=performance.now(); pausedTotal=0; running=true; done=false; lastIdx=-1; lastRem=-1; keepAwake(true);
      clearInterval(iv); iv=setInterval(tick,100); tick(); },
    pause(){ if(!running||done) return; running=false; pausedAt=performance.now(); clearInterval(iv); try{speechSynthesis.cancel();}catch(e){} say("Paused",true,()=>tone(440,0.12,"sine",0.4)); onUpdate(state()); },
    resume(){ if(running||done||!segs.length) return; audio(); pausedTotal+=performance.now()-pausedAt; running=true; keepAwake(true); clearInterval(iv); iv=setInterval(tick,100); say("Resume",true,()=>tone(880,0.12,"sine",0.4)); tick(); },
    reset(){ clearInterval(iv); running=false; done=false; segs=[]; lastIdx=-1; try{speechSynthesis.cancel();}catch(e){} keepAwake(false); onUpdate({idle:true}); },
    test(){ audio(); say("3, 2, 1, Go",true,()=>{tone(600,0.1,"sine",0.4);tone(600,0.1,"sine",0.4,0.3);tone(600,0.1,"sine",0.4,0.6);tone(1046,0.18,"sine",0.5,0.9);}); setTimeout(buzzer,1600); },
    get voiceOn(){ return getVoiceOn(); },
    setVoiceOn(on){ setVoiceOn(on); },
    get active(){ return segs.length>0; }, get running(){ return running; }, state
  };
})();
