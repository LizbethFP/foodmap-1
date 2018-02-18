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
  for (var i in data) {
    var imgContainer = $('<div/>', {
      'class': 'col-6 col-md-4 cont-img cont-sugg',
      'id': 'img-container_' + i
    });

    var imgFood = $('<img>', {
      'class': 'img-fluid food-imgs',
      'src': data[i].photo
    });

    var overFood = $('<div/>', {
      'class': 'overlay',
      'data-toggle': 'modal',
      'data-target': '#name-food',
      'data-namerest': data[i].name,
      'data-price': data[i].menu[2].price,
      'data-direction': data[i].direction,
      'data-menu1': data[i].menu[0].name,
      'data-menu2': data[i].menu[1].name,
      'data-menu3': data[i].menu[2].name,
    });

    var txtFood = $('<p/>', {
      'class': 'text',
    }).text(data[i].name);

    overFood.append(txtFood);

    $('#suggestion').append(imgContainer);
    $('#img-container_' + i).append(imgFood);
    $('#img-container_' + i).append(overFood);
    $('.name-rest').attr('id', 'name-rest');

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
              'class': 'col-6 col-md-4 cont-img cont-sugg',
              'id': 'img-container_' + i
            });

            var imgFood = $('<img>', {
              'class': 'img-fluid food-imgs',
              'src': data[i].photo
            });

            var overFood = $('<div/>', {
              'class': 'overlay',
              'data-toggle': 'modal',
              'data-target': '#name-food',
              'data-namerest': data[i].name,
              'data-price': data[i].menu[2].price,
              'data-direction': data[i].direction,
              'data-menu1': data[i].menu[0].name,
              'data-menu2': data[i].menu[1].name,
              'data-menu3': data[i].menu[2].name,
            });

            var txtFood = $('<p/>', {
              'class': 'text',
            }).text(data[i].name);

            overFood.append(txtFood);

            $('#suggestion').append(imgContainer);
            $('#img-container_' + i).append(imgFood);
            $('#img-container_' + i).append(overFood);
            $('.name-rest').attr('id', 'name-rest');
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


  $('#name-food').on('show.bs.modal', function(event) {
    var restaurante = $(event.relatedTarget); // activa modal
    var nombre = restaurante.data('namerest'); // Extraer la información de atributos de datos
    var direction = restaurante.data('direction');
    var modal = $(this);
    modal.find('#name-rest').text(nombre);
    $('#direction').text(direction);
    modal.find('#price').text(restaurante.data('price'));
    modal.find('#menu1').text(restaurante.data('menu1'));
    modal.find('#menu2').text(restaurante.data('menu2'));
    modal.find('#menu3').text(restaurante.data('menu3'));
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
    zoom: 15
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(pos);

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
