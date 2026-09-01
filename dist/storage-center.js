
class HAStorageCenter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  getNum(entity) {
    return Number(this._hass?.states[entity]?.state || 0);
  }

  getState(entity) {
    return this._hass?.states[entity]?.state || "-";
  }

  render() {
    const used = this.getNum("sensor.system_monitor_disk_kullanimi");
    const free = this.getNum("sensor.system_monitor_bos_disk");
    const percent = this.getNum("sensor.system_monitor_disk_kullanimi_2");

    const cpu = this.getNum("sensor.system_monitor_islemci_kullanimi");
    const ramPercent = this.getNum("sensor.system_monitor_hafiza_kullanimi_2");
    const ramMB = this.getNum("sensor.system_monitor_hafiza_kullanimi");

    const network = this.getNum("sensor.system_monitor_eth0_de_ag_verimi");
    const frigate = this.getNum("sensor.frigate_kayit_boyutu") / 1048576;

    const dash = 440 - (440 * percent / 100);

    this.shadowRoot.innerHTML = `
      <style>
        :host{
          display:block;
          font-family:Inter,system-ui,sans-serif;
        }

        .card{
          background:linear-gradient(145deg,#0b1020,#17213b);
          border-radius:26px;
          color:white;
          padding:24px;
          box-shadow:0 15px 40px rgba(0,0,0,.35);
        }

        .header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:20px;
        }

        .live{
          background:#123626;
          color:#6cf59a;
          padding:8px 14px;
          border-radius:999px;
          font-weight:bold;
        }

        .grid{
          display:grid;
          grid-template-columns:220px 1fr;
          gap:20px;
        }

        .ring{
          position:relative;
          display:flex;
          justify-content:center;
          align-items:center;
        }

        svg{
          width:190px;
          height:190px;
          transform:rotate(-90deg);
        }

        .center{
          position:absolute;
          text-align:center;
        }

        .center .num{
          font-size:46px;
          font-weight:800;
        }

        .stats{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:12px;
        }

        .box{
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.08);
          border-radius:18px;
          padding:16px;
        }

        .box small{
          color:#a7b0cf;
          display:block;
          margin-bottom:8px;
        }

        .box b{
          font-size:24px;
        }

        .list{
          margin-top:20px;
          border-top:1px solid rgba(255,255,255,.08);
        }

        .row{
          display:flex;
          justify-content:space-between;
          padding:14px 0;
          border-bottom:1px solid rgba(255,255,255,.06);
        }

        @media(max-width:640px){
          .grid{
            grid-template-columns:1fr;
          }
        }
      </style>

      <div class="card">

        <div class="header">
          <div>
            <div style="font-size:30px;font-weight:800">
              💽 Storage Center
            </div>
            <div style="color:#97a3c8">
              Murat Edition · Alpha v0.1
            </div>
          </div>

          <div class="live">● CANLI</div>
        </div>

        <div class="grid">

          <div class="ring">
            <svg viewBox="0 0 180 180">

              <defs>
                <linearGradient id="g">
                  <stop offset="0%" stop-color="#5a6cff"/>
                  <stop offset="100%" stop-color="#8b5cf6"/>
                </linearGradient>
              </defs>

              <circle
                cx="90"
                cy="90"
                r="70"
                stroke="#24304a"
                stroke-width="14"
                fill="none"/>

              <circle
                cx="90"
                cy="90"
                r="70"
                stroke="url(#g)"
                stroke-width="14"
                fill="none"
                stroke-linecap="round"
                stroke-dasharray="440"
                stroke-dashoffset="${dash}"/>

            </svg>

            <div class="center">
              <div class="num">${Math.round(percent)}%</div>
              <div>Disk</div>
            </div>
          </div>

          <div class="stats">

            <div class="box">
              <small>🎥 Frigate</small>
              <b>${frigate.toFixed(1)} GB</b>
            </div>

            <div class="box">
              <small>⚙️ CPU</small>
              <b>${Math.round(cpu)}%</b>
            </div>

            <div class="box">
              <small>🧠 RAM</small>
              <b>${Math.round(ramPercent)}%</b>
            </div>

            <div class="box">
              <small>🌐 Ağ</small>
              <b>${network.toFixed(2)} MB/s</b>
            </div>

          </div>

        </div>

        <div class="list">

          <div class="row">
            <span>💽 Kullanılan Disk</span>
            <b>${used.toFixed(1)} GB</b>
          </div>

          <div class="row">
            <span>📂 Boş Disk</span>
            <b>${free.toFixed(1)} GB</b>
          </div>

          <div class="row">
            <span>🧠 RAM Kullanımı</span>
            <b>${Math.round(ramMB)} MB</b>
          </div>

          <div class="row">
            <span>⏱️ Uptime</span>
            <b>${this.getState("sensor.system_monitor_uptime")} gün</b>
          </div>

        </div>

      </div>
    `;
  }

  static getStubConfig() {
    return { type: "custom:ha-storage-center" };
  }
}

if (!customElements.get("ha-storage-center")) {
  customElements.define("ha-storage-center", HAStorageCenter);
}

window.customCards = window.customCards || [];

window.customCards.push({
  type: "ha-storage-center",
  name: "Storage Center",
  preview: true,
  description: "Premium Storage Dashboard"
});
