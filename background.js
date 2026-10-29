chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try { await chrome.tabs.sendMessage(tab.id, {type: 'CHROME_PLUS_TOGGLE'}); }
  catch (e) { console.debug('Chrome Sidebar não pode aparecer nesta página:', e.message); }
});

// Reutiliza abas já abertas, priorizando abas fixadas na janela atual.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'CHROME_PLUS_OPEN_OR_FOCUS') return;
  (async () => {
    const target = new URL(message.url);
    if (!['http:', 'https:'].includes(target.protocol)) throw new Error('URL inválida');
    const tabs = await chrome.tabs.query({});
    const sameSite = tabs.filter(tab => {
      try {
        const url = new URL(tab.url);
        // Para WhatsApp e Instagram, qualquer caminho no mesmo domínio serve.
        // Para atalhos personalizados, exige a mesma origem e o mesmo caminho.
        const commonService = ['web.whatsapp.com', 'www.instagram.com', 'instagram.com'].includes(target.hostname);
        return commonService
          ? url.hostname.replace(/^www\./, '') === target.hostname.replace(/^www\./, '')
          : url.origin === target.origin && url.pathname.replace(/\/$/, '') === target.pathname.replace(/\/$/, '');
      } catch { return false; }
    });
    const sourceWindow = sender.tab?.windowId;
    sameSite.sort((a, b) =>
      Number(b.windowId === sourceWindow) - Number(a.windowId === sourceWindow) ||
      Number(b.pinned) - Number(a.pinned) ||
      Number(b.active) - Number(a.active)
    );
    if (sameSite.length) {
      const chosen = sameSite[0];
      await chrome.tabs.update(chosen.id, {active:true});
      await chrome.windows.update(chosen.windowId, {focused:true});
      return {reused:true};
    }
    await chrome.tabs.create({url:target.href, windowId:sourceWindow});
    return {reused:false};
  })().then(sendResponse).catch(error => sendResponse({error:error.message}));
  return true;
});
