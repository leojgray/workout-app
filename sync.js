// Pushes finished sessions to a private, data-only GitHub repo so they can be
// pulled into Obsidian. The token is entered once on this phone and kept only
// in this browser's local storage — it is never part of this app's code, so
// it never sits in a public repo (GitHub itself blocks that).
const Sync=(function(){
  const REPO="leojgray/workout-data";
  const API="https://api.github.com/repos/"+REPO+"/contents/sessions/";

  function getToken(){ try{ return localStorage.getItem("wk_gh_token")||""; }catch(e){ return ""; } }
  function setToken(t){ try{ localStorage.setItem("wk_gh_token",(t||"").trim()); }catch(e){} }
  function hasToken(){ return !!getToken(); }

  function getQueue(){ try{ return JSON.parse(localStorage.getItem("wk_sync_q")||"[]"); }catch(e){ return []; } }
  function setQueue(q){ try{ localStorage.setItem("wk_sync_q",JSON.stringify(q)); }catch(e){} }
  function getStatus(){ try{ return JSON.parse(localStorage.getItem("wk_sync_status")||"{}"); }catch(e){ return {}; } }
  function setStatus(s){ try{ localStorage.setItem("wk_sync_status",JSON.stringify(Object.assign(getStatus(),s))); }catch(e){} }

  function b64(str){
    // UTF-8 safe base64 encode
    return btoa(unescape(encodeURIComponent(str)));
  }

  function rid(){ return Math.random().toString(36).slice(2,8); }

  function queue(rec){
    const q=getQueue();
    const name=rec.date+"-"+rid()+".json";
    q.push({name, rec, tries:0});
    setQueue(q);
    flush();
  }

  async function putOne(item){
    const body={
      message:"session "+item.rec.date,
      content:b64(JSON.stringify(item.rec,null,2))
    };
    const res=await fetch(API+item.name,{
      method:"PUT",
      headers:{
        "Authorization":"Bearer "+getToken(),
        "Accept":"application/vnd.github+json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify(body)
    });
    if(!res.ok){
      let detail="";
      try{ detail=(await res.json()).message||""; }catch(e){}
      throw new Error("HTTP "+res.status+(detail?": "+detail:""));
    }
  }

  let flushing=false;
  async function flush(){
    if(flushing) return; flushing=true;
    if(!hasToken()){ flushing=false; return; }
    let q=getQueue();
    if(!q.length){ flushing=false; return; }
    const remaining=[];
    for(const item of q){
      try{
        await putOne(item);
        setStatus({lastOk:Date.now(),lastErr:null});
      }catch(e){
        item.tries=(item.tries||0)+1;
        remaining.push(item);
        setStatus({lastErr:String(e.message||e),lastErrAt:Date.now()});
      }
    }
    setQueue(remaining);
    flushing=false;
  }

  // Retry whatever didn't make it last time, once on load and then
  // periodically in case the phone had no signal at the gym.
  if(typeof window!=="undefined"){
    window.addEventListener("load",()=>setTimeout(flush,1000));
    setInterval(flush,5*60*1000);
  }

  return {
    queue,
    flush,
    hasToken,
    setToken,
    pendingCount(){ return getQueue().length; },
    status(){ return getStatus(); }
  };
})();
