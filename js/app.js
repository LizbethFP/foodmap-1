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
  $(function() {
    $('#input-filter').autocomplete({
      source: currencies,
      autoFocus: true,
      select: function(event, ui) {
        var inputFilter = ui.item.value;
        $('#suggestion').html('');
        // realizamos el filtro
        for (var i in data) {
          if (data[i].type === inputFilter) {
            var imgContainer = $('<div/>', {
              'class': 'col-xs-6 cont-img cont-sugg',
              'id': 'img-container_' + i
            });

            var imgFood = $('<img>', {
              'class': 'img-responsive food-imgs',
              'src': data[i].photo
            });

            var overFood = $('<div/>', {
              'class': 'overlay',
              'data-toggle': 'modal',
              'data-target': '#name-food'
            });

            var txtFood = $('<p/>', {
              'class': 'text',
            }).text(data[i].name);

            overFood.append(txtFood);

            $('#suggestion').append(imgContainer);
            $('#img-container_' + i).append(imgFood);
            $('#img-container_' + i).append(overFood);

            // modal
            $('.name-rest').attr('id','title_' + i);
            $('#title_' + i).text(data[i].name);
            $('.diretion').text(data[i].direction);
            $('.price').text(data[i].menu[2].price);
            $('#menu1').text(data[i].menu[0].name);
            $('#menu2').text(data[i].menu[1].name);
            $('#menu3').text(data[i].menu[2].name);
          }        
        }
        // mouseout y mouseover
        $('.cont-sugg').mouseover(function() {
          var overlay = $(this).children()[1];
          overlay.style.display = 'block';
        });

        $('.cont-sugg').mouseout(function() {
          var overlay = $(this).children()[1];
          overlay.style.display = 'none';
        });
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

  //  marker clusterer
  var markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}
