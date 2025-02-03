let wishList = JSON.parse(localStorage.getItem('wishList')) || []; //Holt sich aus dem localSTorage (Speicherbereich im Browser) die gespeicherten Schlüssel-Wert-Paare unter dem Schlüssel Wishlist , wandelt mit Json.parse die als String gespeicherten Daten in ein JS Objekt/Array und speiccheert in wishlist ab. ||[] :Fallback falls localstorgae leer und somit null
let pos; // deklariewre Variable für pos

//gets position data for further calculation on startup
async function startUp() { // asynchrone funktion Startup ertsellen -> durch async kann await verwendet werden
    try { // es wird versucht getPos auszuführen und den return in pos zu speichern 
        pos = await getPos(); // durch das await wird der code pausiert, bis das Promise welches von getPose returned wurde erfüllt (resolved) oder abgelehnt (reject) wird.
    } catch (error) { // Ist das zurückgegebene Promise abgelehnt, wird der catch Block ausgeführt 
        throw new Error(error);// es wird fehler geworfen um den Fehler zu beschreiben
    }
}

//gets position data from browser (bodenlose fickerei, weil js asynchron ist)
function getPos() { // getPos funktion erstellen
    const meinPromise = new Promise((resolve, reject) => { // Promise wird erstellt und es wird eine Arrow-Funktion mit Parametern resolve und reject übergeben
        if ("geolocation" in navigator) { // prüft ob Browser Standortbestimmung unterstützt, falls ja direkt weiter, falls nein weiter in Z.25
            navigator.geolocation.getCurrentPosition(function (position) { //eine Methode der geolocation API zur Standortbestimmung wird aufgerufen und der Standort bestimmt. Wurde der Standort erfolgreich bestimmt, wird die erste funktion mit dem position Objekt aufgerufen, aandernfalls wird die zweite Funktion in Z. 21 mit dem error aufgerufen
                const lat = position.coords.latitude; // position ist Objekt welches als Attribut ein weiteres Objekt coords hat, welches als Attribute unter anderem latitude und longitude enthält
                const lon = position.coords.longitude; // speciher latitude und longitude 
                resolve({ lat, lon }); // Das Priomise wurde erfolgreich aufgelöst und die werte lon und last werden in meinPromise gespeichert 
            }, function (error) { // die funktion falls navigator.geolocation.getCurrentPosition nicht erfolgreich war 
                console.log("Fehler bei der Standortbestimmung");
                reject("Fehler bei der Standortbestimmung"); // Das Promise wurde nicht erfolgfreich aufgelöst uhnd Der String wird als error in meinPromise gespeichert -> auch das was an catch block oben übergeben wird
            });
        } else { // Falls geolocation vom Browser nicht unterstützt wird
            console.log("Geolocation wird von diesem Browser nicht unterstützt.");
            reject("Geolocation wird von diesem Browser nicht unterstützt."); // Promise wurde nicht erfolgreich aufgelöst
        }
    });
    return meinPromise; // meinPromise, das entweder werte enthält (wenn erfolgreich) oder einen error als String, wird zurückgegeben
}

//berechnet entfernung zwischen der position des Users und einer angegbenen position
function calculateDistance(lat1, lon1) { //funktion wird erstellt
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

document.addEventListener('DOMContentLoaded', function () { // code wartet bis das DOM vollsändig geladen wurde -> damit DOM Manipulatuon ohne Prioobleme abläuft
    const wishListContainer = document.getElementById('wishList-container'); //  holt sich die element nach ID
    const eventsContainer = document.getElementById('events-container');
    const filterButton = document.getElementById('filter-button');

    fetch('events.json') // fetch holt die Events aus der events,json und gibt einen Promise zurück. Ist dder Promise erfolgreich wird der then block ausgeführt, ist es nicht erfolgreich wird der catch block in Z. 150 ausgeführt
        .then(response => response.json()) // Das Response-Objekt (Antwort der fetch Anfrage) wird einer Arrowfunktion übergeben, die das Response Objekt mit response.JSON in ein JS-Array aus objekten umwandelt
        .then(events => { // events ist der Parameter, der das Array mit alllen Objekten enthält, wird in Arrowfunktion übergebn
            //läd alle Elemente auf der wishlist seite
            if (wishListContainer) { // prüft ob wishListContainer Elemente existiert -> sorgt dafür, dass code nicht abstürzt, falls element aus irgendeinem grund nicht vorhanden
                events.forEach(event => { // geht alle Objekte des Arrays durch 
                    if (wishList.includes(event.id)) {
                        const eventDiv = document.createElement('div'); // erstellt div
                        eventDiv.className = 'event'; // weist div klasse zu
                        eventDiv.innerHTML = ` 
                            <h2>${event.name}</h2>
                            <p>${event.date}</p>
                            <p>${event.description}</p>
                            <a href="detail.html?eventId=${event.id}">details</a>
                            <p>${event.location}</p>`; // hat div mit den einzelnen Attributen des Objektes gefüllt
                        wishListContainer.appendChild(eventDiv); // hängt div an wishlist dran
                    }
                });
            }
            //läd alle elemente auf der startseite
            if (eventsContainer) { // prüft ob vbents COntainer existiert
                const renderEvents = (filteredEvents) => { //weißt renderEvents folgende Funktion zu mit filteredevents parameter
                    eventsContainer.innerHTML = ''; //füllt evnetCOntainer mit nichts
                    filteredEvents.forEach(event => { // parameter wird mit for each durchlaufen
                        const eventDiv = document.createElement('div'); //erstellt div
                        eventDiv.className = 'event'; //weist klassenamen zu 
                        eventDiv.innerHTML = `
                        <img class="eventIMG" src="${event.img}">
                        <h2 class="eventH2">${event.name}</h2>
                        
                        <p class="eventP">${event.date}</p>
                        
                        <p class="eventP">${event.city}</p>
                        
                        <p class="eventP">${event.genre}</p>
                        <a href="detail.html?eventId=${event.id}">details</a>
                        <br>
                        <label>
                            <input type="checkbox" class="event-checkbox" data-event-id="${event.id}">
                            Add to Wishlist
                        </label>`; // füllt div mit Attributen der Objekte
                        eventsContainer.appendChild(eventDiv); // hängt div an
                    });

                    //handle checkbox changes
                    document.querySelectorAll('.event-checkbox').forEach(checkbox => { // wählt alle input mit der klasse und wendet for each drauf an
                        checkbox.addEventListener('change', function () { // für checkbox (aktuelle ausgewählte in der schleife), wird eine Funktiion hinzugefügt, die beim ändern der checkbox ausgeführt wird
                            const eventId = parseInt(this.getAttribute('data-event-id')); // holt die data-event-id der checkbox welche die id des events is und wandelt sie in int
                            if (this.checked) { // prüft ob checkbox checked ist
                                if (!wishList.includes(eventId)) { // prüft ob wishList die eventID (date-event-id der checkbox) NICHT enthält -> da diese eventId diesselbe ist wie die event-Id der Events in der Json wird geprüft ob das event in der wishList ist
                                    wishList.push(eventId);// wenn es nicht drin ist wird das event hinzugefügt
                                }
                            } else { // die checkbox ist nicht abgehakt
                                wishList = wishList.filter(id => id !== eventId); // wishList wird kopiert nur ohne das aktuelle Event
                            }
                            localStorage.setItem('wishList', JSON.stringify(wishList)); //speichert wishList als String im Local Storage
                        });

                        //sorgt dafür das beim neuladen der Startseite die checkboxen der wishlist entsprechen
                        const eventId = parseInt(checkbox.getAttribute('data-event-id')); // holt sich data-event-id
                        if (wishList.includes(eventId)) { //checkt ob diese data-eventid bereits in der wishlist ist
                            checkbox.checked = true; // wenn drin setzt es diese checkbox auf true
                        }
                    });
                };

                renderEvents(events);  //ruft renderEvents funktion aus Z. 74 mit events auf


                //filterfunktion
                filterButton.addEventListener('click', () => { // filterbutton bekommt funktion
                    const maxPrice = parseFloat(document.getElementById('price').value); // holt sich vom Nutzer eingegebenen wert aus dem preis input und wandelt zu float
                    const maxDistance = parseFloat(document.getElementById('distance').value); // selbe mit distance

                    const filteredEvents = events.filter(event => { // filtert events
                        let matches = true; // setzt auf true -> nimmt erstmal an event entspricht dem Filter

                        //preis
                        if (!isNaN(maxPrice) && event.price && event.price > maxPrice) { // prüft ob event price > vom nutzer eingegebn
                            matches = false; // wenn event preis größer-> soll nicht angezeigt werden -> matches auf false
                        }

                        //distance
                        if (!isNaN(maxDistance) && event.geoLocation) { // selbe wie bei preis
                            const distance = calculateDistance(event.geoLocation.latitude, event.geoLocation.longitude);
                            if (distance > maxDistance) {
                                matches = false;
                            }
                        }

                        return matches; //returns ein true (wenn event die Filter bestanden hat), anderfalls false -> true sorgt dafür, dass events.filter das event beibehäkt und in filteredEvents speichert
                    });

                    renderEvents(filteredEvents); // lädt die gefilterten Events mit Funktion aus Z.74
                });
            }
        })
        .catch(error => console.error('Error fetching events:', error)); // code der ausgeführt wird wenn das Rückgabe Promise von fetch nicht erfüllt wird
});

//läd die Position des Users beim lader der Website
startUp(); //ausführen Startup Methode