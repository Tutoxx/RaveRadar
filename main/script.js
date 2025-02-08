let wishList = JSON.parse(localStorage.getItem('wishList')) || [];
let pos; 

// Event-ID für Detailansicht-Seite
const urlParams = new URLSearchParams(window.location.search);
const eventId = parseInt(urlParams.get('eventId'));

// Ermittelt die Position des Users beim Starten der Seite
async function startUp() {
    try {
        pos = await getPos();
    } catch (error) {
        throw new Error(error);
    }
}

// Ermittelt die Position des Users / gibt ein Objekt mit {lat, lon} zurück
function getPos() {
    const meinPromise = new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                resolve({ lat, lon });
            }, function (error) {
                console.log("Fehler bei der Standortbestimmung");
                reject("Fehler bei der Standortbestimmung");
            });
        } else {
            console.log("Geolocation wird von diesem Browser nicht unterstützt.");
            reject("Geolocation wird von diesem Browser nicht unterstützt.");
        }
    });
    return meinPromise;
}

// Berechnet die Entfernung zwischen dem User und einem beliebigen Punkt (mit turf.js)
function calculateDistance(lat1, lon1) {
    const lat2 = pos.lat;
    const lon2 = pos.lon;
    const point1 = turf.point([lon1, lat1]);  // [longitude, latitude]
    const point2 = turf.point([lon2, lat2]);
    const distance = turf.distance(point1, point2);
    return distance;
};

document.addEventListener('DOMContentLoaded', function () {
    // Container für die automatische Erstellung des Contents
    const wishListContainer = document.getElementById('wishList-container');
    const eventsContainer = document.getElementById('events-container');
    const filterButton = document.getElementById('filter-button');
    const resetButton = document.getElementById('reset-button');
    const eventDetailContainer = document.getElementById('event-detail-container');

    fetch('events.json')
        .then(response => response.json())
        .then(events => {
            // Lädt alle Elemente auf der Wishlist-Seite
            if (wishListContainer) {
                events.forEach(event => {
                    if (wishList.includes(event.id)) {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'event';
                        eventDiv.innerHTML = `
                        <img class="eventIMG" src="${event.img}">
                        <div class="eventText">
                        <h2 class="eventH2">${event.name}</h2>                        
                        <p class="eventP">Datum: ${event.date}</p>                        
                        <p class="eventP">Wo: ${event.city}</p>                        
                        <p class="eventP">Genre: ${event.genre}</p>                        
                        <a href="detail.html?eventId=${event.id}" id = "Link">Details</a>
                        </div>`;
                        wishListContainer.appendChild(eventDiv);
                    }
                });
            }

            // Lädt Events auf der Detailansicht-Seite
            if (eventDetailContainer) {
                const event = events.find(event => event.id === eventId);
                if (event) {
                    // Event-Daten anzeigen
                    const detailContainer = document.getElementById('event-detail-container');
                    detailContainer.innerHTML = `
                        <h2>${event.name}</h2>
                        <div id="event-img-text">
                        <img class="eventIMG"src="${event.img}">
                        <div id="event-text">                    
                        <p>Datum: ${event.date}</p>
                        <p>Adresse: ${event.street} ${event.houseNumber} ${event.city} (${event.zipcode})</p>
                        <p>Genre: ${event.genre}</p>
                        <p>Tickets ab: ${event.price}€</p>
                        <p>Koordinaten:</p>                   
                        <p>Längengrad: ${event.geoLocation.longitude}</p>
                        <p>Breitengrad: ${event.geoLocation.latitude}</p>
                        </div>
                        </div>
                        <p>Beschreibung:</p>
                        <p>${event.description}</p>
                    `;
                } else {
                    document.getElementById('event-detail-container').innerHTML = 'Event nicht gefunden.';
                }
            }

            // Lädt alle Elemente auf der Startseite
            if (eventsContainer) {
                const renderEvents = (filteredEvents) => {
                    eventsContainer.innerHTML = '';
                    filteredEvents.forEach(event => {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'event';
                        eventDiv.innerHTML = `
                        <img class="eventIMG" src="${event.img}">
                        <div class="eventText">
                        <h2 class="eventH2">${event.name}</h2>                        
                        <p class="eventP">Datum: ${event.date}</p>                        
                        <p class="eventP">Wo: ${event.city}</p>                        
                        <p class="eventP">Genre: ${event.genre}</p>
                        <a href="detail.html?eventId=${event.id}" id = "Link">Details</a>                        
                        <label>
                            <input type="checkbox" class="event-checkbox" data-event-id="${event.id}">
                            Zur Wishlist hinzufügen
                        </label>
                        </div>
                        `;
                        eventsContainer.appendChild(eventDiv);
                    });

                    // Wishlist-Checkboxen
                    document.querySelectorAll('.event-checkbox').forEach(checkbox => {
                        checkbox.addEventListener('change', function () {
                            const eventId = parseInt(this.getAttribute('data-event-id'));
                            if (this.checked) {
                                if (!wishList.includes(eventId)) {
                                    wishList.push(eventId);
                                }
                            } else {
                                wishList = wishList.filter(id => id !== eventId);
                            }
                            localStorage.setItem('wishList', JSON.stringify(wishList));
                        });

                        // Sorgt dafür, dass beim Neuladen der Startseite die Checkboxen der Wishlist entsprechen
                        const eventId = parseInt(checkbox.getAttribute('data-event-id'));
                        if (wishList.includes(eventId)) {
                            checkbox.checked = true;
                        }
                    });
                };
                renderEvents(events);

                // Filterfunktion
                filterButton.addEventListener('click', () => {
                    const maxPrice = parseFloat(document.getElementById('price').value);
                    const maxDistance = parseFloat(document.getElementById('distance').value);
                    const filteredEvents = events.filter(event => {
                        let matches = true;
                        // Preis
                        if (!isNaN(maxPrice) && event.price && event.price > maxPrice) {
                            matches = false;
                        }

                        // Entfernung
                        if (!isNaN(maxDistance) && event.geoLocation) {
                            const distance = calculateDistance(event.geoLocation.latitude, event.geoLocation.longitude);
                            if (distance > maxDistance) {
                                matches = false;
                            }
                        }
                        return matches;
                    });
                    renderEvents(filteredEvents);
                });
                
                // Reset-Button
                resetButton.addEventListener('click', () => {
                    document.getElementById('price').value = '';
                    document.getElementById('distance').value = '';
                    renderEvents(events);
                });
            }
        })
        .catch(error => console.error('Error fetching events:', error));
});

// Lädt die Position des Users beim Laden der Website
startUp();