let wishList = JSON.parse(localStorage.getItem('wishList')) || [];

document.addEventListener('DOMContentLoaded', function () {
    const wishListContainer = document.getElementById('wishList-container');
    const eventsContainer = document.getElementById('events-container');

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
                events.forEach(event => {
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

                    // Set checkbox state based on wishList
                    const eventId = parseInt(checkbox.getAttribute('data-event-id'));
                    if (wishList.includes(eventId)) {
                        checkbox.checked = true;
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching events:', error));
});