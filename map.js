// Initialize map when the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // IIIT Delhi coordinates
  const iiitdCoords = [28.5494, 77.2714];

  // Create map centered on IIIT Delhi with initial zoom level
  const map = L.map("map").setView(iiitdCoords, 13);

  // Add OpenStreetMap tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // Add a marker for IIIT Delhi location
  const marker = L.marker(iiitdCoords)
    .addTo(map)
    .bindPopup("IIIT Delhi, Okhla Phase 3")
    .openPopup();

  // Add hover effects to map container
  const mapContainer = document.getElementById("map-container");

  // When hovering over the map, zoom in to location
  mapContainer.addEventListener("mouseenter", function () {
    setTimeout(() => {
      map.setView(iiitdCoords, 16, {
        animate: true,
        duration: 1,
      });
    }, 200);
  });

  // When mouse leaves, zoom back out
  mapContainer.addEventListener("mouseleave", function () {
    setTimeout(() => {
      map.setView(iiitdCoords, 13, {
        animate: true,
        duration: 1,
      });
    }, 200);
  });

  // Fix for map rendering issues (Leaflet needs to recalculate size)
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
});
