// Prometheus v6.4 - Preload Bridge
// Copyright 2026 Morpheus - Tous droits reserves
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('prometheus', {
  connectWifi:    (ip, port)    => ipcRenderer.invoke('ws-connect', { ip, port }),
  sendCmd:        (msg)         => ipcRenderer.invoke('ws-send', msg),
  netPing:        (ip, port, t) => ipcRenderer.invoke('net-ping', { ip, port, timeout: t }),
  fetchMeteo:     (lat, lon)    => ipcRenderer.invoke('fetch-meteo', { lat, lon }),
  exportConfig:   (data)        => ipcRenderer.invoke('export-config', data),
  importConfig:   ()            => ipcRenderer.invoke('import-config'),
  listUSB:        ()            => ipcRenderer.invoke('usb-list'),
  onWsData:       (cb) => ipcRenderer.on('ws-data',       (_, d) => cb(d)),
  onWsStatus:     (cb) => ipcRenderer.on('ws-status',     (_, s) => cb(s)),
  onNav:          (cb) => ipcRenderer.on('nav',           (_, p) => cb(p)),
  onScanNetwork:  (cb) => ipcRenderer.on('scan-network',  ()     => cb()),
  onExportConfig: (cb) => ipcRenderer.on('export-config', ()     => cb()),
  onImportConfig: (cb) => ipcRenderer.on('import-config', ()     => cb()),
  onUpdateCheck:  (cb) => ipcRenderer.on('update-check',  (_, u) => cb(u)),
  onSaveSession:  (cb) => ipcRenderer.on('save-session',  ()     => cb()),
  removeAll:      (ch) => ipcRenderer.removeAllListeners(ch),
});
