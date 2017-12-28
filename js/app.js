$(document).ready(function() {
  //  splash screen
  function splash() {
    var intervals = [];

    var appearPhase = true;
    var $text = $('.loading-text');

    function togglePhase() {
      appearPhase = !appearPhase;
    }

    intervals.push(setInterval(function() {
      var selector = appearPhase ? '.letter:not(.visible)' : '.letter.visible';
      var $letters = $text.find(selector);

      $letters.eq(~~(Math.random() * $letters.length)).toggleClass('visible', appearPhase);
    }, 300));

    function destroy() {
      $('.loading-splash').remove();
      intervals.forEach(function(interval) {
        clearInterval(interval);
      });
    }

    $(window).on('loadComplete.um', destroy);
  }

  splash();

  setTimeout(function() {
    $('#splash-screen').fadeOut(1500);
  }, 3000);
  // Obtenemos el value del input
  $('#input-filter').keypress(function() {
    $('#input-filter').autocomplete({
      lookup: currencies,
      onSelect: function(suggestion) {
        var inputFilter = $(this).val();
        // realizamos el filtro
        for (var i in data) {
          if (data[i].type === inputFilter) {
            var nameRestaurant = data[i].name;
            var infRestaurant = $('<p/>', {
                'class' : 'col-xs-12',
                'id'    : 'id_' + i
            });
            $('#suggestion').append(infRestaurant);
            $('#id_'+ i).append(nameRestaurant);
          }
        }
      }
    });
  });
});

// geolocalización

var coordinates = [];
var labels = [];

for (var i in data) {
  coordinates.push(data[i].location);
  labels.push(data[i].name);
}

var locations = coordinates;

function initMap() {
  var map = new google.maps.Map($('#map')[0], {
    center: { lat: -34.397,
      lng: 150.644},
    zoom: 10
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('You Are Here!');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  var markers = locations.map(function(location, i) {
    return new google.maps.Marker({
      position: location,
      label: labels[i]
    });
  });

  // Add a marker clusterer to manage the markers.
  var markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}
