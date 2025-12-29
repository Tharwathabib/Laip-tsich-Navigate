const mapCanvas = document.getElementById("map-canvas");

if (mapCanvas && window.L) {
    const leipzigBounds = L.latLngBounds(
        [51.2381704, 12.2366519],
        [51.4481145, 12.5425373]
    );

    const map = L.map("map-canvas", {
        maxBounds: leipzigBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: true
    });

    map.fitBounds(leipzigBounds);
    map.setMinZoom(map.getZoom());

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    L.marker([51.3406321, 12.3747329]).addTo(map);

    const hotspots = [
        { name: "Leipzig Hbf", lat: 51.3456, lon: 12.3810 },
        { name: "Clara-Zetkin-Park", lat: 51.3339, lon: 12.3547 },
        { name: "Völkerschlachtdenkmal", lat: 51.3123, lon: 12.4134 }
    ];

    hotspots.forEach((spot) => {
        L.marker([spot.lat, spot.lon])
            .addTo(map)
            .bindPopup(`<strong>${spot.name}</strong>`);
    });
}
