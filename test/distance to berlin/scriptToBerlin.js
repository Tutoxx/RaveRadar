const lonBerlin = 13.404954;
const latBerlin = 52.520007;

workWithPos(latBerlin, lonBerlin)
    .then(distance => {
        alert("distance to berlin (in km): " + distance);
    })
    .catch(error => {
        alert("Fehler:", error);
    });

async function workWithPos(latInput, lonInput) {
    try {
        const pos = await getPos();
        const distance = calculateDistance(pos.lat, pos.lon, latInput, lonInput);
        return distance;
    } catch (error) {
        throw new Error(error);
    }
}

function getPos(){
    const meinPromise = new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                resolve({ lat, lon });

            }, function(error) {
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

function CalculateDistanceToPosition(latPoint, lonPoint) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latUser = position.coords.latitude;
            const lonUser = position.coords.longitude;

            let distance = calculateDistance(latUser, lonUser, latPoint, lonPoint);
            return distance;
            alert(distance);

        }, function(error) {
            document.getElementById("status").textContent = "Fehler bei der Standortbestimmung.";
        });
    } else {
        document.getElementById("status").textContent = "Geolocation wird von diesem Browser nicht unterstützt.";
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
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