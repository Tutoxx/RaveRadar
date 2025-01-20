const lonBerlin = 13.404954;
const latBerlin = 52.520007;
let pos;

//gets position data for further calculation on startup
async function startUp(){
    try {
        pos = await getPos();
    } catch (error) {
        throw new Error(error);
    }
}

//gets position data from browser (bodenlose fickerei, weil js asynchron ist)
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


function alertDistance() {
    let distance = calculateDistance(latBerlin, lonBerlin)
    alert(distance);
}



startUp();


document.getElementById("button").onclick = alertDistance;


