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

// Contact page map: show an Apple map on Apple devices when a MapKit token is
// set; otherwise (or if MapKit fails to load) keep the Google embed
const mapEmbed = document.querySelector('.map-embed[data-mapkit-token]');
if (mapEmbed && mapEmbed.dataset.mapkitToken && isApple) {
  const googleMap = mapEmbed.querySelector('iframe');
  const appleMap = document.createElement('div');
  appleMap.className = 'apple-map';
  appleMap.setAttribute('role', 'region');
  appleMap.setAttribute('aria-label', 'Penn Automotive location map');
  mapEmbed.replaceChild(appleMap, googleMap);

  let fellBack = false;
  const useGoogleMap = () => {
    if (fellBack) return;
    fellBack = true;
    mapEmbed.replaceChild(googleMap, appleMap);
  };

  window.initPennMapKit = () => {
    mapkit.addEventListener('error', useGoogleMap);
    const coord = new mapkit.Coordinate(Number(mapEmbed.dataset.lat), Number(mapEmbed.dataset.lng));
    const map = new mapkit.Map(appleMap, {
      region: new mapkit.CoordinateRegion(coord, new mapkit.CoordinateSpan(0.008, 0.008)),
      showsPointsOfInterest: true,
    });
    map.addAnnotation(new mapkit.MarkerAnnotation(coord, {
      title: 'Penn Automotive',
      subtitle: address,
      color: '#c0392b',
      selected: true,
    }));
  };

  const script = document.createElement('script');
  script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js';
  script.crossOrigin = 'anonymous';
  script.async = true;
  script.dataset.callback = 'initPennMapKit';
  script.dataset.libraries = 'map,annotations';
  script.dataset.initialToken = mapEmbed.dataset.mapkitToken;
  script.onerror = useGoogleMap;
  document.head.appendChild(script);
}
