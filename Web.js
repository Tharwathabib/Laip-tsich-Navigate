const mapCanvas = document.getElementById("map-canvas");

if (mapCanvas && window.L) {
    const leipzigBounds = L.latLngBounds(
        [51.2381704, 12.2366519],
        [51.4481145, 12.5425373]
    );

    const map = L.map("map-canvas", {
        maxBounds: leipzigBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: false
    });

    map.fitBounds(leipzigBounds);
    map.setMinZoom(map.getZoom());

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    L.marker([51.3406321, 12.3747329]).addTo(map);

    // Leaflet base icons for category tints.
    const iconBase = "https://unpkg.com/leaflet@1.9.4/dist/images/";

    // Marker variants by hotspot type.
    const iconSet = {
        food: L.icon({
            iconUrl: `${iconBase}marker-icon.png`,
            shadowUrl: `${iconBase}marker-shadow.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }),
        shop: L.icon({
            iconUrl: `${iconBase}marker-icon-2x.png`,
            shadowUrl: `${iconBase}marker-shadow.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }),
        park: L.icon({
            iconUrl: `${iconBase}marker-icon.png`,
            shadowUrl: `${iconBase}marker-shadow.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "marker--park"
        }),
        culture: L.icon({
            iconUrl: `${iconBase}marker-icon.png`,
            shadowUrl: `${iconBase}marker-shadow.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "marker--culture"
        }),
        district: L.icon({
            iconUrl: `${iconBase}marker-icon.png`,
            shadowUrl: `${iconBase}marker-shadow.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "marker--district"
        }),
        default: L.icon({
            iconUrl: `${iconBase}marker-icon.png`,
            shadowUrl: `${iconBase}marker-shadow.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    };

    // Hotspots drive markers and the sidebar list.
    const hotspots = [
        { name: "Leipzig Hbf", lat: 51.3456, lon: 12.3810, type: "district", detail: "Transit hub" },
        { name: "Clara-Zetkin-Park", lat: 51.3339, lon: 12.3547, type: "park", detail: "Green escape" },
        { name: "Völkerschlachtdenkmal", lat: 51.3123, lon: 12.4134, type: "culture", detail: "Monument" },
        { name: "Markt (Old Town Square)", lat: 51.3397, lon: 12.3731, type: "district", detail: "Historic core" },
        { name: "St. Thomas Church", lat: 51.3405, lon: 12.3713, type: "culture", detail: "Landmark" },
        { name: "Augustusplatz", lat: 51.3393, lon: 12.3785, type: "district", detail: "City square" },
        { name: "Leipzig Zoo", lat: 51.3477, lon: 12.3798, type: "culture", detail: "Wildlife" },
        { name: "Plagwitz District", lat: 51.3236, lon: 12.3387, type: "district", detail: "Creative hub" },
        { name: "Connewitz District", lat: 51.3074, lon: 12.3736, type: "district", detail: "Alternative scene" },
        { name: "Karl-Liebknecht-Strasse (KarLi)", lat: 51.3196, lon: 12.3819, type: "food", detail: "Cafes + bars" },
        { name: "Specks Hof Shopping", lat: 51.3402, lon: 12.3749, type: "shop", detail: "Boutiques" },
        { name: "Hauptbahnhof Promenaden", lat: 51.3464, lon: 12.3814, type: "shop", detail: "Station shopping" },
        { name: "Cafe Kandler", lat: 51.3402, lon: 12.3734, type: "food", detail: "Coffee + cake" },
        { name: "Bayerischer Bahnhof", lat: 51.3324, lon: 12.3790, type: "food", detail: "Restaurant" },
        { name: "Mendelssohn House", lat: 51.3391, lon: 12.3848, type: "culture", detail: "Museum" },
        { name: "Palmengarten", lat: 51.3379, lon: 12.3512, type: "park", detail: "Park" },
        { name: "Karli Market Hall", lat: 51.3191, lon: 12.3812, type: "shop", detail: "Local goods" },
        { name: "Sachsen Bridge", lat: 51.3354, lon: 12.3475, type: "park", detail: "River walk" }
    ];

    // Cache sidebar controls and marker references.
    const listEl = document.getElementById("hotspot-list");
    const filterButtons = document.querySelectorAll(".map__filter");
    const markers = [];

    hotspots.forEach((spot) => {
        // Create a marker per hotspot and matching sidebar entry.
        const marker = L.marker([spot.lat, spot.lon], {
            icon: iconSet[spot.type] || iconSet.default
        })
            .addTo(map)
            .bindPopup(`<strong>${spot.name}</strong><br>${spot.detail}`);

        markers.push({ ...spot, marker });

        const listItem = document.createElement("li");
        listItem.className = "map__list-item";
        listItem.setAttribute("data-type", spot.type);
        listItem.tabIndex = 0;
        listItem.innerHTML = `
            <span class="map__list-title">${spot.name}</span>
            <span class="map__list-meta">${spot.type} · ${spot.detail}</span>
        `;

        // Zoom + open popup when a list item is activated.
        const focusSpot = () => {
            map.setView([spot.lat, spot.lon], 15, { animate: true });
            marker.openPopup();
        };

        listItem.addEventListener("click", focusSpot);
        listItem.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                focusSpot();
            }
        });

        listEl.appendChild(listItem);
    });

    // Filter markers and list items by category.
    const applyFilter = (type) => {
        markers.forEach((spot) => {
            const isVisible = type === "all" || spot.type === type;
            if (isVisible) {
                spot.marker.addTo(map);
            } else {
                map.removeLayer(spot.marker);
            }
        });

        document.querySelectorAll(".map__list-item").forEach((item) => {
            const matches = type === "all" || item.dataset.type === type;
            item.style.display = matches ? "grid" : "none";
        });
    };

    // Wire up filter buttons to toggle visibility.
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => btn.classList.remove("is-active"));
            button.classList.add("is-active");
            applyFilter(button.dataset.filter);
        });
    });
}
