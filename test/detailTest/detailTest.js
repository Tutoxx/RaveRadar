let wishList = [0, 1]; 


document.addEventListener('DOMContentLoaded', function() {
    fetch('detailTest.json')
        .then(response => response.json())
        .then(events => {
            const container = document.getElementById('events-container');
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