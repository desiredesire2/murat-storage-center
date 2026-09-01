
class HAStorageCenter extends HTMLElement{
constructor(){super();this.attachShadow({mode:"open"});}
set hass(h){this._hass=h;this.render();}
num(id){return Number(this._hass?.states[id]?.state||0);}
state(id){return this._hass?.states[id]?.state||"-";}
render(){
const used=this.num("sensor.system_monitor_disk_kullanimi");
const free=this.num("sensor.system_monitor_bos_disk");
const pct=this.num("sensor.system_monitor_disk_kullanimi_2");
const cpu=this.num("sensor.system_monitor_islemci_kullanimi");
const ram=this.num("sensor.system_monitor_hafiza_kullanimi_2");
const net=this.num("sensor.system_monitor_eth0_de_ag_verimi");
const frig=this.num("sensor.frigate_kayit_boyutu")/1048576;
const dash=440-(440*pct/100);
this.shadowRoot.innerHTML=`
<style>
:host{display:block;font-family:Inter,system-ui}
.card{background:linear-gradient(145deg,#0b1020,#17213b);color:#fff;border-radius:26px;padding:24px;box-shadow:0 15px 40px rgba(0,0,0,.35)}
.head{display:flex;justify-content:space-between;align-items:center}
.live{background:#123626;color:#6cf59a;padding:8px 14px;border-radius:999px;font-weight:bold}
.grid{display:grid;grid-template-columns:220px 1fr;gap:20px;margin-top:18px}
.ring{position:relative;display:flex;justify-content:center;align-items:center}
svg{width:190px;height:190px;transform:rotate(-90deg)}
.center{position:absolute;text-align:center}.num{font-size:46px;font-weight:800}
.stats{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.box{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:16px}
.box small{display:block;color:#a7b0cf}.box b{font-size:22px}
.row{display:flex;justify-content:space-between;padding:14px 0;border-top:1px solid rgba(255,255,255,.08)}
@media(max-width:640px){.grid{grid-template-columns:1fr}}
</style>
<div class=card>
<div class=head><div><div style="font-size:30px;font-weight:800">💽 Storage Center</div><div style="color:#97a3c8">Murat Edition · Alpha</div></div><div class=live>● CANLI</div></div>
<div class=grid>
<div class=ring><svg viewBox="0 0 180 180"><defs><linearGradient id=g><stop offset="0%" stop-color="#5a6cff"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient></defs><circle cx=90 cy=90 r=70 stroke="#24304a" stroke-width=14 fill=none/><circle cx=90 cy=90 r=70 stroke="url(#g)" stroke-width=14 fill=none stroke-linecap=round stroke-dasharray=440 stroke-dashoffset="${dash}"/></svg><div class=center><div class=num>${Math.round(pct)}%</div><div>Disk</div></div></div>
<div class=stats>
<div class=box><small>🎥 Frigate</small><b>${frig.toFixed(1)} GB</b></div>
<div class=box><small>⚙️ CPU</small><b>${Math.round(cpu)}%</b></div>
<div class=box><small>🧠 RAM</small><b>${Math.round(ram)}%</b></div>
<div class=box><small>🌐 Ağ</small><b>${net.toFixed(2)} MB/s</b></div>
</div></div>
<div class=row><span>Kullanılan Disk</span><b>${used.toFixed(1)} GB</b></div>
<div class=row><span>Boş Disk</span><b>${free.toFixed(1)} GB</b></div>
<div class=row><span>Uptime</span><b>${this.state("sensor.system_monitor_uptime")} gün</b></div>
</div>`;}
static getStubConfig(){return{type:"custom:ha-storage-center"};}
}
customElements.get("ha-storage-center")||customElements.define("ha-storage-center",HAStorageCenter);
window.customCards=window.customCards||[];
window.customCards.push({type:"ha-storage-center",name:"Storage Center",preview:true,description:"Premium Storage Dashboard"});
