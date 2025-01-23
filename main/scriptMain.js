let wishList = JSON.parse(localStorage.getItem('wishList')) || [];
let pos; //user position

//gets position data for further calculation on startup
async function startUp() {
    try {
        pos = await getPos();
    } catch (error) {
        throw new Error(error);
    }
}

//gets position data from browser (bodenlose fickerei, weil js asynchron ist)
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

//berechnet entfernung zwischen der position des Users und einer angegbenen position
function calculateDistance(lat1, lon1) {
    const lat2 = pos.lat;
    const lon2 = pos.lon;
    const R = 6371; // Erdradius in Kilometern
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Entfernung in Kilometern
};

document.addEventListener('DOMContentLoaded', function () {
    const wishListContainer = document.getElementById('wishList-container');
    const eventsContainer = document.getElementById('events-container');
    const filterButton = document.getElementById('filter-button');
    const resetButton = document.getElementById('reset-button');

    fetch('events.json')
        .then(response => response.json())
        .then(events => {
            //läd alle Elemente auf der wishlist seite
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
                        </div>

                        <div id="Link">                        
                        <a href="detail.html?eventId=${event.id}">Details</a>
                        </div>`;
                        wishListContainer.appendChild(eventDiv);
                    }
                });
            }
            //läd alle elemente auf der startseite
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

                    //handle checkbox changes
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

                        //sorgt dafür das beim neuladen der Startseite die checkboxen der wishlist entsprechen
                        const eventId = parseInt(checkbox.getAttribute('data-event-id'));
                        if (wishList.includes(eventId)) {
                            checkbox.checked = true;
                        }
                    });
                };

                renderEvents(events);


                //filterfunktion
                filterButton.addEventListener('click', () => {
                    const maxPrice = parseFloat(document.getElementById('price').value);
                    const maxDistance = parseFloat(document.getElementById('distance').value);

                    const filteredEvents = events.filter(event => {
                        let matches = true;

                        //preis
                        if (!isNaN(maxPrice) && event.price && event.price > maxPrice) {
                            matches = false;
                        }

                        //distance
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
                resetButton.addEventListener('click', () => {
                    document.getElementById('price').value = '';
                    document.getElementById('distance').value = '';
                    renderEvents(events);
                });
            }
        })
        .catch(error => console.error('Error fetching events:', error));
});

//läd die Position des Users beim lader der Website
startUp();