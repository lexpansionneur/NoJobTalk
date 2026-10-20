import L from 'leaflet'

export const iconeTable = L.divIcon({
  className: '',
  html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:32px;height:32px;border-radius:9999px;
      background:#ea580c;border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
      font-size:16px;line-height:1;
    ">☕</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -14],
})
