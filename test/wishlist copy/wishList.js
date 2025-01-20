let wishList = JSON.parse(localStorage.getItem('wishList')) || [];

document.addEventListener('DOMContentLoaded', function() {
    const wishListContainer = document.getElementById('wishList-container');
    const eventsContainer = document.getElementById('events-container');
    const filterButton = document.getElementById('filter-button');

    fetch('detailTest.json')
        .then(response => response.json())
        .then(events => {
            if (wishListContainer) {
                // Populate wishlist page
                events.forEach(event => {
                    if (wishList.includes(event.id)) {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'event';
                        eventDiv.innerHTML = `
                            <h2>${event.name}</h2>
                            <p>${event.date}</p>
                            <p>${event.description}</p>
                            <p>${event.location}</p>`;
                        wishListContainer.appendChild(eventDiv);
                    }
                });
            }

            if (eventsContainer) {
                // Populate events page
                const renderEvents = (filteredEvents) => {
                    eventsContainer.innerHTML = '';
                    filteredEvents.forEach(event => {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'event';
                        eventDiv.innerHTML = `
                            <h2>${event.name}</h2>
                            <p>${event.date}</p>
                            <p>${event.description}</p>
                            <p>${event.location}</p>
                            <label>
                                <input type="checkbox" class="event-checkbox" data-event-id="${event.id}">
                                Add to Wishlist
                            </label>`;
                        eventsContainer.appendChild(eventDiv);
                    });

                    // Handle checkbox changes
                    document.querySelectorAll('.event-checkbox').forEach(checkbox => {
                        checkbox.addEventListener('change', function() {
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

                        // Set checkbox state based on wishList
                        const eventId = parseInt(checkbox.getAttribute('data-event-id'));
                        if (wishList.includes(eventId)) {
                            checkbox.checked = true;
                        }
                    });
                };

                renderEvents(events);

                filterButton.addEventListener('click', () => {
                    const genre = document.getElementById('genre').value.toLowerCase();
                    const maxPrice = parseFloat(document.getElementById('price').value);
                    const maxDistance = parseFloat(document.getElementById('distance').value);

                    const filteredEvents = events.filter(event => {
                        let matches = true;

                        if (genre && event.genre && !event.genre.toLowerCase().includes(genre)) {
                            matches = false;
                        }

                        if (!isNaN(maxPrice) && event.price && event.price > maxPrice) {
                            matches = false;
                        }

                        if (!isNaN(maxDistance) && event.geoLocation) {
                            const userLocation = { latitude: 52.5200, longitude: 13.4050 }; // Example user location (Berlin)
                            const distance = calculateDistance(userLocation, event.geoLocation);
                            if (distance > maxDistance) {
                                matches = false;
                            }
                        }

                        return matches;
                    });

                    renderEvents(filteredEvents);
                });
            }
        })
        .catch(error => console.error('Error fetching events:', error));
});

function calculateDistance(loc1, loc2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) * 
        (1 - Math.cos(dLon))/2;

    return R * 2 * Math.asin(Math.sqrt(a));
}