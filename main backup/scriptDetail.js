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
                    <p>${event.date}</p>
                    <p>${event.description}</p>
                    <p>${event.location}</p>
                `;
            } else {
                document.getElementById('event-detail-container').innerHTML = 'Event nicht gefunden.';
            }
        })
        .catch(error => console.error('Fehler beim Laden der Events:', error));
});
