document.addEventListener('DOMContentLoaded', function() {
    // URL-Parameter extrahieren
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('eventId'));

    fetch('events.json')
        .then(response => response.json())
        .then(events => {
            // Suchen des Events anhand der ID
            const event = events.find(event => event.id === eventId);
            if (event) {
                // Event-Daten anzeigen
                const detailContainer = document.getElementById('event-detail-container');
                detailContainer.innerHTML = `
                    <h1>${event.name}</h1>
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
                    <p>Beschreibung: ${event.description}</p>
                `;
            } else {
                document.getElementById('event-detail-container').innerHTML = 'Event nicht gefunden.';
            }
        })
        .catch(error => console.error('Fehler beim Laden der Events:', error));
});
