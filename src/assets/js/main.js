// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
}

// Use Apple Maps on Apple devices, Google Maps elsewhere
const address = '243 West 8th Ave, West Homestead, PA 15120';
const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
const mapsUrl = isApple
  ? 'https://maps.apple.com/?q=' + encodeURIComponent(address)
  : 'https://maps.google.com/?q=' + encodeURIComponent(address);

document.querySelectorAll('a[data-map]').forEach(el => {
  el.href = mapsUrl;
});

// Tekmetric online booking — only loaded on pages with a booking button,
// after the page finishes loading so it doesn't slow down first paint
const bookingButtons = document.querySelectorAll('[data-booking]');
if (bookingButtons.length) {
  const shopId = bookingButtons[0].dataset.booking;
  window.tekmetricBooking = { shopId, orgId: undefined };

  let bookingReady;
  const loadBooking = () => {
    if (bookingReady) return bookingReady;
    const cacheBust = Date.now();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://booking.tekmetric.com/iframe/modal.css?time=' + cacheBust;
    document.head.appendChild(link);

    bookingReady = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://booking.tekmetric.com/iframe/modal.js?time=' + cacheBust;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
    return bookingReady;
  };

  window.addEventListener('load', loadBooking);
  bookingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadBooking().then(() => window.onShowBooking(btn.dataset.booking));
    });
  });
}
