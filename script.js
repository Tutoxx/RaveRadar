const lonBerlin = 13.404954;
const latBerlin = 52.520007;



const button = document.getElementById("button");
let distance = button.addEventListener('click', alertPos);




/*
let distance = CalculateDistanceToPosition(latBerlin, lonBerlin);
document.getElementById("distance").textContent = 'test ' + distance;
*/


function alertPos(){
    let distance = CalculateDistanceToPosition(latBerlin, lonBerlin);
    //document.getElementById("distance").textContent = 'distance to berlin:  ' + distance;

};

function CalculateDistanceToPosition(latPoint, lonPoint) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latUser = position.coords.latitude;
            const lonUser = position.coords.longitude;

            let distance = calculateDistance(latUser, lonUser, latPoint, lonPoint);
            document.getElementById("distance").textContent = 'test' + distance;
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

//useless rn
//returns the coordiantes of the user in an object {lat: x, lon: y}
function getPos() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {lat: position.coords.latitude, lon: position.coords.longitude};
            return pos;
    
        }, function(error) {
            document.getElementById("status").textContent = "Fehler bei der Standortbestimmung.";
        });
    } else {
        document.getElementById("status").textContent = "Geolocation wird von diesem Browser nicht unterstützt.";
    }
};