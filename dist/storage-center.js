class HAStorageCenter extends HTMLElement {
  constructor(){super();this.attachShadow({mode:"open"});}
  set hass(h){this._hass=h;this.render();}
  num(id){
    const st=this._hass?.states[id];
    if(!st) return 0;
    const value=String(st.state??"");
    if(value==="unknown"||value==="unavailable") return 0;
    const unit=String(st.attributes?.unit_of_measurement||"").toLowerCase();
    let n=parseFloat(value.replace(",",".").replace(/[^\d.-]/g,""));
    if(!Number.isFinite(n)) return 0;
    if(id.includes("eth0_de_ag_verimi")&&unit.includes("kb")) n/=1024;
    return n;
  }
  state(id){return this._hass?.states[id]?.state||"-";}
  render(){
    const used=this.num("sensor.system_monitor_disk_kullanimi");
    const free=this.num("sensor.system_monitor_bos_disk");
    const total=used+free;
    const pct=this.num("sensor.system_monitor_disk_kullanimi_2");
    const cpu=this.num("sensor.system_monitor_islemci_kullanimi");
    const ramMB=this.num("sensor.system_monitor_hafiza_kullanimi");
    const ramPct=this.num("sensor.system_monitor_hafiza_kullanimi_2");
    const net=this.num("sensor.system_monitor_eth0_de_ag_verimi");
    const frig=this.num("sensor.frigate_kayit_boyutu")/1024/1024/1024;
    const dash=440-(440*pct/100);
    this.shadowRoot.innerHTML=`<style>:host{display:block;font-family:Inter,system-ui}.card{background:radial-gradient(circle at top left,#1d36ff55,transparent 45%),linear-gradient(145deg,#0a0f1f,#152342);color:#fff;border-radius:30px;padding:24px;box-shadow:0 20px 45px rgba(0,0,0,.45)}.head{display:flex;justify-content:space-between;align-items:center}.live{background:#123626;color:#6cf59a;padding:8px 14px;border-radius:999px;font-weight:bold}.grid{display:grid;grid-template-columns:220px 1fr;gap:20px;margin-top:16px}.ring{position:relative;display:flex;justify-content:center;align-items:center}svg{width:190px;height:190px;transform:rotate(-90deg)}.center{position:absolute;text-align:center}.num{font-size:48px;font-weight:800}.stats{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.box{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:18px}.box small{display:block;color:#a7b0cf}.box b{font-size:22px}.list{margin-top:22px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:22px;padding:8px 18px}.row{display:flex;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.06)}.row:last-child{border-bottom:none}@media(max-width:640px){.grid{grid-template-columns:1fr}}</style><div class=card><div class=head><div><div style="font-size:30px;font-weight:800">💽 Storage Center</div><div style="color:#97a3c8">Murat Edition · v0.3 Stable</div></div><div class=live>● CANLI</div></div><div class=grid><div class=ring><svg viewBox="0 0 180 180"><defs><linearGradient id=g><stop offset="0%" stop-color="#5a6cff"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient></defs><circle cx=90 cy=90 r=70 stroke="#24304a" stroke-width=14 fill=none/><circle cx=90 cy=90 r=70 stroke="url(#g)" stroke-width=14 fill=none stroke-linecap=round stroke-dasharray=440 stroke-dashoffset="${dash}"/></svg><div class=center><div class=num>${pct.toFixed(0)}%</div><div>Kullanılıyor</div></div></div><div class=stats><div class=box><small>🎥 Frigate</small><b>${frig.toFixed(1)} GB</b></div><div class=box><small>⚙️ CPU</small><b>${cpu.toFixed(0)}%</b></div><div class=box><small>🧠 RAM</small><b>${ramPct.toFixed(0)}%</b></div><div class=box><small>🌐 Ağ</small><b>${net.toFixed(3)} MB/s</b></div></div></div><div class=list><div class=row><span>Kullanılan Disk</span><span>${used.toFixed(1)} GB</span></div><div class=row><span>Boş Disk</span><span>${free.toFixed(1)} GB</span></div><div class=row><span>Toplam Disk</span><span>${total.toFixed(1)} GB</span></div><div class=row><span>RAM</span><span>${ramMB.toFixed(0)} MB (${ramPct.toFixed(1)}%)</span></div><div class=row><span>Uptime</span><span>${this.state("sensor.system_monitor_uptime")} gün</span></div></div></div>`;}
  static getStubConfig(){return{type:"custom:ha-storage-center"};}
}
customElements.get("ha-storage-center")||customElements.define("ha-storage-center",HAStorageCenter);
window.customCards=window.customCards||[];
window.customCards.push({type:"ha-storage-center",name:"Storage Center",preview:true,description:"Premium Storage Dashboard"});