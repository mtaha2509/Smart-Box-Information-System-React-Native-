const haversine = require('haversine');

   exports.calculateDistance = (start, end) => {
       const startCoords = { latitude: start.lat, longitude: start.lng };
       const endCoords = { latitude: end.lat, longitude: end.lng };

       return haversine(startCoords, endCoords); // Returns distance in kilometers
   };