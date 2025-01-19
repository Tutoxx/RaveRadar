let wishList = []; 


document.addEventListener('DOMContentLoaded', function() {
    fetch('detailTest.json')
        .then(response => response.json())
        .then(events => {
            const container = document.getElementById('wishList-container');
            events.forEach(event => {
                
                wishList.forEach(element => {
                    if(event.id == element){
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'event';
                        eventDiv.innerHTML = 
                            `<h2>${event.name}</h2>
                            <p>${event.date}</p>
                            <p>${event.description}</p>
                            <p>${event.location}</p>`;
                            
                        container.appendChild(eventDiv);
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching events:', error));
});


document.addEventListener('DOMContentLoaded', function() {
    fetch('detailTest.json')
        .then(response => response.json())
        .then(events => {
            const container = document.getElementById('events-container');
            events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event';
                eventDiv.innerHTML = 
                    `<h2>${event.name}</h2>
                    <p>${event.date}</p>
                    <p>${event.description}</p>
                    <p>${event.location}</p>
                    <label>
                        <input type="checkbox" class="event-checkbox" data-event-id="${event.id}">
                        wishlist
                    </label>`;

                container.appendChild(eventDiv);
            });

            // Event-Listener für die Checkboxen
            const checkboxes = document.querySelectorAll('.event-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const eventId = this.getAttribute('data-event-id');
                    const isChecked = this.checked;
                    if (this.checked) {
                        wishList.push(eventId)
                        alert(eventId)
                    }
                                        
                });
            });
        })
        .catch(error => console.error('Error fetching events:', error));
});


