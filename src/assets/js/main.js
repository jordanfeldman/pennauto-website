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
