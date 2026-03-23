// Prometheus v6.4 - Electron Main Process
// Copyright 2026 Morpheus - Tous droits reserves
const { app, BrowserWindow, Menu, ipcMain, dialog, shell, nativeTheme } = require('electron');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

let mainWindow, wsClient=null, serialClient=null, autoUpdateTimer=null;

function createWindow(){
  mainWindow=new BrowserWindow({
    width:1380, height:880, minWidth:900, minHeight:620,
    titleBarStyle: process.platform==='darwin'?'hiddenInset':'default',
    trafficLightPosition: {x:16,y:16},
    vibrancy: process.platform==='darwin'?'under-window':undefined,
    backgroundColor: nativeTheme.shouldUseDarkColors?'#0d1117':'#f6f8fa',
    webPreferences:{
      preload:path.join(__dirname,'preload.js'),
      contextIsolation:true, nodeIntegration:false, sandbox:false
    },
    icon: path.join(__dirname,'..','assets',process.platform==='win32'?'icon.ico':'icon.icns'),
  });
  mainWindow.loadFile(path.join(__dirname,'..','public','index.html'));
  if(process.argv.includes('--dev')) mainWindow.webContents.openDevTools({mode:'detach'});
  mainWindow.on('closed',()=>{mainWindow=null;});
  autoUpdateTimer=setInterval(()=>checkUpdates(false),6*60*60*1000);
  setTimeout(()=>checkUpdates(false),8000);
}

function buildMenu(){
  const isMac=process.platform==='darwin';
  const template=[
    ...(isMac?[{label:'Prometheus',submenu:[
      {label:'A propos',click:showAbout},{type:'separator'},
      {role:'services'},{type:'separator'},
      {role:'hide'},{role:'hideOthers'},{role:'unhide'},{type:'separator'},
      {role:'quit',label:'Quitter Prometheus'}
    ]}]:[]),
    {label:'Session',submenu:[
      {label:'Exporter config JSON',accelerator:'CmdOrCtrl+E',click:()=>mainWindow&&mainWindow.webContents.send('export-config')},
      {label:'Importer config JSON',accelerator:'CmdOrCtrl+I',click:()=>mainWindow&&mainWindow.webContents.send('import-config')},
      {type:'separator'},
      {label:'Enregistrer session',accelerator:'CmdOrCtrl+S',click:()=>mainWindow&&mainWindow.webContents.send('save-session')},
      ...(!isMac?[{label:'Quitter',accelerator:'Alt+F4',role:'quit'}]:[]),
    ]},
    {label:'Connexion',submenu:[
      {label:'Connecter ASIAIR WiFi',accelerator:'CmdOrCtrl+K',click:()=>mainWindow&&mainWindow.webContents.send('nav','net')},
      {label:'Scanner reseau',accelerator:'CmdOrCtrl+Shift+R',click:()=>mainWindow&&mainWindow.webContents.send('scan-network')},
      {type:'separator'},
      {label:'USB / Serial',click:()=>mainWindow&&mainWindow.webContents.send('nav','usb')},
      {label:'Deconnecter tout',click:disconnectAll},
    ]},
    {label:'Affichage',submenu:[
      {label:'Tableau de bord',accelerator:'CmdOrCtrl+1',click:()=>mainWindow&&mainWindow.webContents.send('nav','dash')},
      {label:'Live View',accelerator:'CmdOrCtrl+2',click:()=>mainWindow&&mainWindow.webContents.send('nav','liveview')},
      {label:'Mes equipements',accelerator:'CmdOrCtrl+M',click:()=>mainWindow&&mainWindow.webContents.send('nav','myequip')},
      {type:'separator'},
      {role:'togglefullscreen',label:'Plein ecran'},
      {role:'reload',label:'Recharger'},
    ]},
    {label:'Aide',submenu:[
      {label:'Documentation',click:()=>shell.openExternal('https://github.com/morpheus-astro/prometheus#readme')},
      {label:'Signaler un probleme',click:()=>shell.openExternal('https://github.com/morpheus-astro/prometheus/issues/new')},
      {label:'Verifier les mises a jour',click:()=>checkUpdates(true)},
      {type:'separator'},
      {label:'A propos',click:showAbout},
    ]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

ipcMain.handle('ws-connect',async(_,{ip,port})=>new Promise(resolve=>{
  if(wsClient){try{wsClient.close();}catch{}wsClient=null;}
  wsClient=new WebSocket('ws://'+ip+':'+(port||4400));
  const t=setTimeout(()=>{try{wsClient.close();}catch{}resolve({ok:false,error:'timeout'});},5000);
  wsClient.on('open',()=>{clearTimeout(t);resolve({ok:true});});
  wsClient.on('message',d=>mainWindow&&mainWindow.webContents.send('ws-data',d.toString()));
  wsClient.on('error',e=>{clearTimeout(t);resolve({ok:false,error:e.message});});
  wsClient.on('close',()=>{mainWindow&&mainWindow.webContents.send('ws-status','disconnected');wsClient=null;});
}));

ipcMain.handle('ws-send',async(_,msg)=>{
  if(!wsClient||wsClient.readyState!==WebSocket.OPEN)return{ok:false};
  wsClient.send(typeof msg==='string'?msg:JSON.stringify(msg));
  return{ok:true};
});

ipcMain.handle('net-ping',async(_,{ip,port,timeout})=>new Promise(resolve=>{
  const req=http.request({hostname:ip,port:port||4400,path:'/',method:'HEAD',timeout:timeout||800},()=>resolve({ok:true}));
  req.on('error',()=>resolve({ok:false}));
  req.on('timeout',()=>{req.destroy();resolve({ok:false});});
  req.end();
}).catch(()=>({ok:false})));

ipcMain.handle('fetch-meteo',async(_,{lat,lon})=>new Promise(resolve=>{
  const url='https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&hourly=temperature_2m,cloudcover,windspeed_10m&timezone=auto&forecast_days=1';
  https.get(url,{headers:{'User-Agent':'Prometheus/6.4'}},(res)=>{
    let data='';res.on('data',c=>data+=c);
    res.on('end',()=>{try{resolve({ok:true,data:JSON.parse(data)});}catch{resolve({ok:false});}});
  }).on('error',e=>resolve({ok:false,error:e.message}));
}));

ipcMain.handle('export-config',async(_,jsonData)=>{
  const{filePath}=await dialog.showSaveDialog(mainWindow,{
    title:'Exporter la configuration Prometheus',
    defaultPath:'prometheus-config-'+new Date().toISOString().slice(0,10)+'.json',
    filters:[{name:'JSON',extensions:['json']}]
  });
  if(!filePath)return{ok:false};
  fs.writeFileSync(filePath,JSON.stringify(jsonData,null,2),'utf8');
  return{ok:true,filePath};
});

ipcMain.handle('import-config',async()=>{
  const{filePaths}=await dialog.showOpenDialog(mainWindow,{
    title:'Importer configuration Prometheus',
    filters:[{name:'JSON',extensions:['json']}],
    properties:['openFile']
  });
  if(!filePaths||!filePaths[0])return{ok:false};
  try{return{ok:true,data:JSON.parse(fs.readFileSync(filePaths[0],'utf8'))};}
  catch{return{ok:false,error:'JSON invalide'};}
});

ipcMain.handle('usb-list',async()=>{
  try{const{SerialPort}=require('serialport');return{ok:true,ports:await SerialPort.list()};}
  catch{return{ok:true,ports:[]};}
});

function checkUpdates(show){
  https.get('https://api.github.com/repos/morpheus-astro/prometheus/releases/latest',{headers:{'User-Agent':'Prometheus/6.4'}},(res)=>{
    let data='';res.on('data',c=>data+=c);
    res.on('end',()=>{
      try{
        const rel=JSON.parse(data);
        const latest=(rel.tag_name||'v6.4.0').replace('v','');
        const current=app.getVersion();
        const hasUpdate=latest>current;
        mainWindow&&mainWindow.webContents.send('update-check',{hasUpdate,latest,current,url:rel.html_url});
        if(show&&!hasUpdate)dialog.showMessageBox(mainWindow,{type:'info',title:'Prometheus est a jour',message:'Version '+current+' - aucune mise a jour.'});
      }catch{}
    });
  }).on('error',()=>{});
}

function disconnectAll(){
  if(wsClient){try{wsClient.close();}catch{}wsClient=null;}
  if(serialClient){try{serialClient.close();}catch{}serialClient=null;}
  mainWindow&&mainWindow.webContents.send('ws-status','disconnected');
}

function showAbout(){
  dialog.showMessageBox(mainWindow,{
    type:'none',title:'Prometheus',message:'Prometheus v6.4',
    detail:'Application astrophotographie\n\nCopyright 2026 Morpheus\nTous droits reserves\n\nhttps://github.com/morpheus-astro/prometheus',
    buttons:['Fermer','GitHub']
  }).then(({response})=>{if(response===1)shell.openExternal('https://github.com/morpheus-astro/prometheus');});
}

app.whenReady().then(()=>{
  createWindow();buildMenu();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on('window-all-closed',()=>{if(autoUpdateTimer)clearInterval(autoUpdateTimer);disconnectAll();if(process.platform!=='darwin')app.quit();});
app.on('before-quit',()=>{disconnectAll();});
