self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Новое уведомление!',
        icon: 'icon.png',
        vibrate: [200, 100, 200],
    };
    event.waitUntil(
        self.registration.showNotification('Уведомление с сайта', options)
    );
});
