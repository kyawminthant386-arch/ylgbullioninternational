/* ═══════════════════════════════════════════
   notification-sw.js — YLG Bullion
   Service Worker: handles trade result
   notifications in background tabs / locked screen
   ═══════════════════════════════════════════ */

self.addEventListener('message', async (event) => {
    if (!event.data || event.data.type !== 'TRADE_RESULT') return;
    await self.registration.showNotification(event.data.title, {
        body:             event.data.body,
        icon:             '/logo.png',
        badge:            '/logo.png',
        tag:              'ylg-trade-result',
        renotify:         true,
        requireInteraction: false,
        vibrate:          event.data.isWin ? [100, 50, 100] : [200]
    });
});
