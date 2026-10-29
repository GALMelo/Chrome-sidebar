(() => {
  if (document.getElementById('chrome-plus-floating-host')) return;
  const DEFAULTS = [
    {id:'whatsapp',name:'WhatsApp',url:'https://web.whatsapp.com/',kind:'whatsapp',image:null},
    {id:'instagram',name:'Instagram',url:'https://www.instagram.com/',kind:'instagram',image:null}
  ];
  const icon = {
    whatsapp:'<svg viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.1 11.8a8.1 8.1 0 0 1-12 7.1L3.2 20l1.1-4.8a8.1 8.1 0 1 1 15.8-3.4Z"/><path d="M8.4 8.1c-.6.5-.6 1.5-.2 2.5.7 1.9 2.5 3.8 4.5 4.5 1 .4 2 .3 2.5-.3l.5-.7-2.1-1.1-1 1c-1.2-.6-2.2-1.6-2.8-2.8l1-1-1.1-2.1Z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="#e16bac" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.6" cy="6.5" r="1" fill="#e16bac" stroke="none"/></svg>'
  };
  const host = document.createElement('div');
  host.id = 'chrome-plus-floating-host';
  host.style.cssText = 'all:initial!important;position:fixed!important;right:0!important;top:50%!important;transform:translateY(-50%)!important;width:48px!important;height:auto!important;max-height:90vh!important;z-index:2147483647!important;pointer-events:auto!important;';
  const shadow = host.attachShadow({mode:'closed'});
  shadow.innerHTML = `<style>
    :host{color-scheme:dark}*{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer}
    #rail{width:48px;max-height:90vh;display:flex;flex-direction:column;align-items:center;gap:7px;padding:9px 4px;background:#15161b;border:1px solid #373942;border-right:0;border-radius:13px 0 0 13px;box-shadow:0 5px 28px #0008;font-family:system-ui,Arial,sans-serif;overflow-y:auto;scrollbar-width:none}
    #rail::-webkit-scrollbar{display:none}.item{display:grid;place-items:center;flex:0 0 38px;width:38px;height:38px;padding:5px;border:0;border-radius:10px;background:transparent;color:#e9e9f0}.item:hover,.item:focus-visible{background:#353540;outline:none}.item svg{width:27px;height:27px}.item img{max-width:100%;max-height:100%;width:28px;height:28px;object-fit:contain;border-radius:6px}.initial{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:#6551b8;font-size:14px;font-weight:700;color:white}.sep{width:26px;height:1px;background:#393a43;margin:1px}.add{color:#c7a9ff;font-size:26px;font-weight:500;line-height:1}.settings{color:#aaa;font-size:22px}.handle{color:#bbb;font-size:15px}.hidden{display:none!important}
    #editor{position:absolute;right:55px;top:50%;transform:translateY(-50%);width:min(300px,calc(100vw - 65px));max-height:min(590px,90vh);overflow-y:auto;padding:16px;background:#191b23;border:1px solid #454652;border-radius:14px;box-shadow:0 14px 50px #0009;color:#f4f4f7;font:12px system-ui,Arial,sans-serif}
    .head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}.head strong{font-size:15px}.close{background:none;color:#bbb;border:0;font-size:22px}.field{display:block;margin-bottom:12px;color:#c3c4cf}.field input:not([type=file]){display:block;width:100%;margin-top:5px;padding:9px;border-radius:8px;background:#0e1016;border:1px solid #444651;color:white;outline:none}.field input:focus{border-color:#9570f6}.field input[type=file]{display:block;margin-top:8px;max-width:100%;font-size:11px}.actions{display:flex;flex-wrap:wrap;gap:7px}.btn{border:1px solid #484953;border-radius:8px;background:#30323c;color:white;padding:8px 11px}.primary{background:#7451d1;border-color:#7451d1}.danger{color:#ffb4b4}.msg{color:#ffbd99;line-height:1.5;min-height:14px}.preview{width:40px;height:40px;object-fit:contain;display:block;margin:5px 0 8px}.manage-list{display:flex;flex-direction:column;gap:6px}.manage-row{display:flex;align-items:center;justify-content:space-between;gap:8px}.manage-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tip{color:#a5a6b1;line-height:1.5;margin-top:0}
  </style>
  <div id="rail" aria-label="Chrome Sidebar - atalhos"></div>
  <div id="editor" class="hidden" role="dialog" aria-label="Configurar atalho">
    <div class="head"><strong id="editor-title">Adicionar atalho</strong><button id="close" class="close" title="Fechar">×</button></div>
    <div id="form-area">
      <form id="form">
        <label class="field">Nome<input id="name" maxlength="50" required placeholder="Ex.: YouTube"></label>
        <label class="field">Link<input id="url" type="url" required placeholder="https://exemplo.com"></label>
        <label class="field">Imagem personalizada (opcional)<input id="image" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label>
        <img id="preview" class="preview hidden" alt="Prévia da imagem">
        <div class="actions"><button type="button" id="remove-image" class="btn">Remover imagem</button><button type="submit" class="btn primary">Salvar</button><button type="button" id="delete" class="btn danger">Excluir</button></div>
      </form>
    </div>
    <div id="manage-area" class="hidden"><p class="tip">Selecione um atalho para editar ou excluir.</p><div id="manage-list" class="manage-list"></div></div>
    <p id="message" class="msg" aria-live="polite"></p>
  </div>`;
  const $ = id => shadow.getElementById(id);
  let shortcuts = DEFAULTS, editingId = null, currentImage = null, hidden = false;
  const safeUrl = raw => { try { const u = new URL(raw); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch {return null;} };
  const button = (label, title, className, handler) => {const el=document.createElement('button');el.type='button';el.className=className;el.title=title;el.setAttribute('aria-label',title);el.addEventListener('click',handler);el.textContent=label;return el;};
  const openUrl = url => {
    const safe = safeUrl(url);
    if (!safe) return;
    chrome.runtime.sendMessage({type:'CHROME_PLUS_OPEN_OR_FOCUS',url:safe}).catch(error => {
      console.warn('Chrome Sidebar: não foi possível acessar a aba:', error);
    });
  };
  function makeIcon(item){
    if(item.image){const img=document.createElement('img');img.src=item.image;img.alt='';return img;}
    if(icon[item.kind]){const span=document.createElement('span');span.innerHTML=icon[item.kind];return span;}
    const span=document.createElement('span');span.className='initial';span.textContent=(item.name||'?').slice(0,1).toUpperCase();return span;
  }
  async function persist(){await chrome.storage.local.set({shortcuts});}
  function render(){
    const rail=$('rail');rail.replaceChildren();
    shortcuts.forEach(item=>{
      const el=button('','Abrir '+item.name,'item',()=>openUrl(item.url));el.appendChild(makeIcon(item));rail.appendChild(el);
    });
    rail.appendChild(Object.assign(document.createElement('div'),{className:'sep'}));
    rail.appendChild(button('＋','Adicionar atalho','item add',()=>toggleEditor('add')));
    rail.appendChild(button('⚙','Gerenciar atalhos','item settings',()=>toggleEditor('manage')));
    rail.appendChild(button('‹','Recolher barra','item handle',()=>setHidden(true)));
    const list=$('manage-list');list.replaceChildren();
    shortcuts.forEach(item=>{
      const row=document.createElement('div');row.className='manage-row';
      const name=document.createElement('span');name.textContent=item.name;
      row.append(name,button('Editar','Editar '+item.name,'btn',()=>toggleEditor('edit',item.id)));list.appendChild(row);
    });
  }
  function toggleEditor(mode,id=null){
    editingId=id;currentImage=null;$('message').textContent='';$('image').value='';
    $('editor').classList.remove('hidden');$('manage-area').classList.toggle('hidden',mode!=='manage');$('form-area').classList.toggle('hidden',mode==='manage');
    $('editor-title').textContent=mode==='manage'?'Gerenciar atalhos':mode==='edit'?'Editar atalho':'Adicionar atalho';
    const item=shortcuts.find(s=>s.id===id);
    $('name').value=item?.name||'';$('url').value=item?.url||'';currentImage=item?.image||null;
    $('delete').classList.toggle('hidden',!item);updatePreview();
  }
  function updatePreview(){ $('preview').classList.toggle('hidden',!currentImage);$('remove-image').classList.toggle('hidden',!currentImage);if(currentImage)$('preview').src=currentImage;else $('preview').removeAttribute('src'); }
  function setHidden(value){hidden=value;$('rail').classList.toggle('hidden',value);$('editor').classList.add('hidden');
    if(value){
      const handle=button('›','Expandir Chrome Sidebar','item handle',()=>setHidden(false));handle.id='collapsed';
      handle.style.cssText='position:absolute;right:0;top:50%;transform:translateY(-50%);width:20px;height:52px;background:#282431;border:1px solid #514c5b;border-radius:8px 0 0 8px;color:#fff;';shadow.appendChild(handle);
      host.style.width='20px';
    }else{shadow.getElementById('collapsed')?.remove();host.style.width='48px';}
  }
  $('close').addEventListener('click',()=> $('editor').classList.add('hidden'));
  $('remove-image').addEventListener('click',()=>{currentImage=null;$('image').value='';updatePreview();});
  $('image').addEventListener('change',async event=>{
    const file=event.target.files?.[0];if(!file)return;
    if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)||file.size>5*1024*1024){$('message').textContent='Use PNG, JPG, WebP ou GIF de até 5 MB.';return;}
    try {const bitmap=await createImageBitmap(file);const canvas=document.createElement('canvas');canvas.width=96;canvas.height=96;
      const ctx=canvas.getContext('2d');const scale=Math.min(96/bitmap.width,96/bitmap.height);const w=bitmap.width*scale,h=bitmap.height*scale;
      ctx.drawImage(bitmap,(96-w)/2,(96-h)/2,w,h);bitmap.close();currentImage=canvas.toDataURL('image/png');$('message').textContent='';updatePreview();
    }catch{$('message').textContent='Não foi possível ler essa imagem.';}
  });
  $('form').addEventListener('submit',async e=>{
    e.preventDefault();const name=$('name').value.trim(),url=safeUrl($('url').value.trim());
    if(!name||!url){$('message').textContent='Informe nome e link http:// ou https:// válido.';return;}
    const original=shortcuts.find(s=>s.id===editingId);
    const item={id:original?.id||crypto.randomUUID(),name,url,kind:original?.kind||null,image:currentImage};
    const next=original?shortcuts.map(s=>s.id===item.id?item:s):[...shortcuts,item];
    try{await chrome.storage.local.set({shortcuts:next});shortcuts=next;render();$('editor').classList.add('hidden');}
    catch{$('message').textContent='Não foi possível salvar no armazenamento da extensão.';}
  });
  $('delete').addEventListener('click',async()=>{
    if(!editingId)return;const next=shortcuts.filter(s=>s.id!==editingId);
    try{await chrome.storage.local.set({shortcuts:next});shortcuts=next;render();$('editor').classList.add('hidden');}
    catch{$('message').textContent='Não foi possível excluir.';}
  });
  document.documentElement.appendChild(host);
  setHidden(true); // Começa recolhida em cada página; expanda pela alça.
  chrome.runtime.onMessage.addListener(message=>{if(message?.type==='CHROME_PLUS_TOGGLE')setHidden(!hidden);});
  chrome.storage.onChanged.addListener((changes,area)=>{
    if(area==='local'&&changes.shortcuts){shortcuts=Array.isArray(changes.shortcuts.newValue)?changes.shortcuts.newValue:DEFAULTS;render();}
  });
  chrome.storage.local.get('shortcuts').then(result=>{shortcuts=Array.isArray(result.shortcuts)?result.shortcuts:DEFAULTS;render();}).catch(()=>render());
})();
