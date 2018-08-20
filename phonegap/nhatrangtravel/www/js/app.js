// Dom7
var $$ = Dom7;
console.log(localStorage.user_id_save);
console.log(localStorage.user_name_save);
console.log(localStorage.user_image_save);
console.log(localStorage.typeuser_slug_save);
// Framework7 App main instance
var app = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  view: {
    // ex domCache
    stackPages: true,
    // looks better with js
    animateWithJS: true
  },
  touch: {
    // only in dev
    // true or remove in prod
    disableContextMenu: false
  },
  // App routes
  routes: routes,
});
//var mainView = app.addView('.view-main', {domCache: true});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var exploreView = app.views.create('#view-explore', {
  url: '/explore/'
});
var notificationView = app.views.create('#view-notification', {
  url: '/notification/'
});
var favoriteView = app.views.create('#view-favorite', {
  url: '/favorite/'
});
var menusView = app.views.create('#view-menus', {
  url: '/menus/'
});


// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});

/*=== Standalone Dark ===*/
var myPhotoBrowserDark = app.photoBrowser.create({
  photos: [{
      url: './img/banner.jpg',
      caption: 'Nha Trang'
    },
    {
      url: './img/banner.jpg',
      caption: 'Ninh Hòa'
    },
    // This one without caption
    {
      url: './img/banner.jpg',
      caption: 'Cam Ranh'
    },
  ],
  theme: 'dark'
});
$$('.pb-standalone-dark').on('click', function () {
  myPhotoBrowserDark.open();
});

var R = 6371;

if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function () {
    return this * Math.PI / 180;
  }
}

/*Show du lieu index*/

//du lieu slide
var template_home_slide = $$('#my-home-slide').html();
var compiled_home_slide = Template7.compile(template_home_slide);
app.request.json("http://toithichdoc.com/slides/index.json", function (slides) {
  slides_sort = slides.slides.sort(function (a, b) {
    return a.id < b.id;
  });
  for (var i = 0; i < slides_sort.length; i++) {
    if (slides_sort[i]["status"] == 1 && slides_sort[i]["featured"] == 1) {
      var html = compiled_home_slide({
        image_slide: slides_sort[i]["image"]
      });
      $$('.swiper-wrapper[data-page="page-home-slide"]').append(html);
    }
  }
});

//du lieu regions
var template_regions = $$('#my-regions').html();
var compiled_regions = Template7.compile(template_regions);
app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
  //regions_sort = regions.regions.sort(function (a, b) { return a.id < b.id; });  
  for (var i = 0; i < regions.regions.length; i++) {
    var html = compiled_regions({
      image_region: regions.regions[i]["image"],
      name_region: regions.regions[i]["name"],
      region_id: regions.regions[i]["id"]
    });
    $$('.swiper-wrapper[data-page="list-regions"]').append(html);
  }
});

//du lieu places
var template_index_place = $$('#my-home-place').html();
var compiled_index_place = Template7.compile(template_index_place);
app.request.json("http://toithichdoc.com/places/index.json", function (places) {
  if (navigator.geolocation) {

    // timeout at 60000 milliseconds (60 seconds)
    var options = {
      timeout: 60000
    };
    navigator.geolocation.getCurrentPosition(function (position) {

      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      // alert("Latitude : " + latitude + " Longitude: " + longitude);
      handleLocationError(latitude, longitude);
    }, function (err) {
      if (err.code == 1) {
        alert("Error: Access is denied!");
      } else if (err.code == 2) {
        alert("Error: Position is unavailable!");
      }
    }, {
      timeout: 60000
    });
  } else {
    alert("Sorry, browser does not support geolocation!");
  }

  function handleLocationError(latitude, longitude) {
    var dlat;
    var dlon;
    var dlat1;
    var dLat2;

    var avg_point;
    places_sort = places.places.sort(function (a, b) {
      return a.id < b.id;
    });
    for (var i = 0; i < places_sort.length; i++) {
      var sum_place = 0;
      dLat = (latitude - places_sort[i]["latitude"]).toRad();
      dLon = (longitude - places_sort[i]["longitude"]).toRad();
      dLat1 = (places_sort[i]["latitude"] - 0).toRad();
      dLat2 = (latitude - 0).toRad();
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(dLat1) * Math.cos(dLat1) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      var n = parseFloat(d);
      d = Math.round(n * 1000) / 1000;
      if (places_sort[i]["status"] == 1 && places_sort[i]["featured"] == 1) {
        if (places_sort[i].rateplaces.length > 0) {
          for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
            sum_place += places_sort[i].rateplaces[j]["point"];
          }
          avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);
        } else {
          avg_point = 0;
        }
        var html = compiled_index_place({
          image_place: places_sort[i]["image"],
          name_place: places_sort[i]["name"],
          place_id: places_sort[i]["id"],
          avg: avg_point,
          kc: d + ' km'
        });
        $$('.swiper-wrapper[data-page="page-home-place"]').append(html);
      }
    }
  }

});

//du lieu hotels
var template_index_hotel = $$('#my-index-hotel').html();
var compiled_index_hotel = Template7.compile(template_index_hotel);
app.request.json("http://toithichdoc.com/hotels/index.json", function (hotels) {

  if (navigator.geolocation) {

    // timeout at 60000 milliseconds (60 seconds)
    var options = {
      timeout: 60000
    };
    navigator.geolocation.getCurrentPosition(function (position) {

      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      // alert("Latitude : " + latitude + " Longitude: " + longitude);
      handleLocationError(latitude, longitude);
    }, function (err) {
      if (err.code == 1) {
        alert("Error: Access is denied!");
      } else if (err.code == 2) {
        alert("Error: Position is unavailable!");
      }
    }, {
      timeout: 60000
    });
  } else {
    alert("Sorry, browser does not support geolocation!");
  }

  function handleLocationError(latitude, longitude) {
    var dlat;
    var dlon;
    var dlat1;
    var dLat2;

    var avg_point;
    hotels_sort = hotels.hotels.sort(function (a, b) {
      return a.id < b.id;
    });
    for (var i = 0; i < hotels_sort.length; i++) {
      var sum_hotel = 0;
      dLat = (latitude - hotels_sort[i]["latitude"]).toRad();
      dLon = (longitude - hotels_sort[i]["longitude"]).toRad();
      dLat1 = (hotels_sort[i]["latitude"] - 0).toRad();
      dLat2 = (latitude - 0).toRad();
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(dLat1) * Math.cos(dLat1) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      var n = parseFloat(d);
      d = Math.round(n * 1000) / 1000;
      if (hotels_sort[i]["status"] == 1 && hotels_sort[i]["featured"] == 1) {

        if (hotels_sort[i].ratehotels.length > 0) {
          for (var j = 0; j < hotels_sort[i].ratehotels.length; j++) {
            sum_hotel += hotels_sort[i].ratehotels[j]["point"];
          }
          avg_point = (sum_hotel / hotels_sort[i].ratehotels.length).toFixed(1);
        } else {
          avg_point = 0;
        }
        var html = compiled_index_hotel({
          image_hotel: hotels_sort[i]["image"],
          name_hotel: hotels_sort[i]["name"],
          hotel_id: hotels_sort[i]["id"],
          avg: avg_point,
          kc: d + ' km'
        });
        $$('.swiper-wrapper[data-page="page-index-hotel"]').append(html);
      }
    }
  }
});

//du lieu restaurant
var template_index_restaurant = $$('#my-home-restaurant').html();
var compiled_index_restaurant = Template7.compile(template_index_restaurant);
app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurants) {
  if (navigator.geolocation) {

    // timeout at 60000 milliseconds (60 seconds)
    var options = {
      timeout: 60000
    };
    navigator.geolocation.getCurrentPosition(function (position) {

      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      // alert("Latitude : " + latitude + " Longitude: " + longitude);
      handleLocationError(latitude, longitude);
    }, function (err) {
      if (err.code == 1) {
        alert("Error: Access is denied!");
      } else if (err.code == 2) {
        alert("Error: Position is unavailable!");
      }
    }, {
      timeout: 60000
    });
  } else {
    alert("Sorry, browser does not support geolocation!");
  }

  function handleLocationError(latitude, longitude) {
    var dlat;
    var dlon;
    var dlat1;
    var dLat2;

    restaurants_sort = restaurants.restaurants.sort(function (a, b) {
      return a.id < b.id;
    });
  
    var avg_point;
    for (var i = 0; i < restaurants_sort.length; i++) {
      var sum_restaurant = 0;
      dLat = (latitude - restaurants_sort[i]["latitude"]).toRad();
      dLon = (longitude - restaurants_sort[i]["longitude"]).toRad();
      dLat1 = (restaurants_sort[i]["latitude"] - 0).toRad();
      dLat2 = (latitude - 0).toRad();
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(dLat1) * Math.cos(dLat1) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      var n = parseFloat(d);
      d = Math.round(n * 1000) / 1000;
      if (restaurants_sort[i]["status"] == 1 && restaurants_sort[i]["featured"] == 1) {
        if (restaurants_sort[i].raterestaurants.length > 0) {
          for (var j = 0; j < restaurants_sort[i].raterestaurants.length; j++) {
            sum_restaurant += restaurants_sort[i].raterestaurants[j]["point"];
          }
          avg_point = (sum_restaurant / restaurants_sort[i].raterestaurants.length).toFixed(1);
        } else {
          avg_point = 0;
        }
        var html = compiled_index_restaurant({
          image_restaurant: restaurants_sort[i]["image"],
          name_restaurant: restaurants_sort[i]["name"],
          restaurant_id: restaurants_sort[i]["id"],
          avg: avg_point,
          kc: d + ' km'
        });
        $$('.swiper-wrapper[data-page="page-home-restaurant"]').append(html);
      }
    }
  }

});

//du lieu vehicle
var template_index_vehicle = $$('#my-home-vehicle').html();
var compiled_index_vehicle = Template7.compile(template_index_vehicle);
app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicles) {
  vehicles_sort = vehicles.vehicles.sort(function (a, b) {
    return a.id < b.id;
  });
  var avg_point;
  for (var i = 0; i < vehicles_sort.length; i++) {
    var sum_vehicle = 0;
    if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {
      //console.log(vehicles_sort[i].ratevehicles.length);
      if (vehicles_sort[i].ratevehicles.length > 0) {
        for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
          sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];
        }
        avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);
      } else {
        avg_point = 0;
      }
      //console.log(avg_point);
      var html = compiled_index_vehicle({
        image_vehicle: vehicles_sort[i]["image"],
        name_vehicle: vehicles_sort[i]["name"],
        vehicle_id: vehicles_sort[i]["id"],
        avg: avg_point
      });

      $$('.swiper-wrapper[data-page="page-home-vehicle"]').append(html);
    }
  }
});

//du lieu tour
var template_index_tour = $$('#my-home-tour').html();
var compiled_index_tour = Template7.compile(template_index_tour);
app.request.json("http://toithichdoc.com/tours/index.json", function (tours) {
  var avg_point;
  tours_sort = tours.tours.sort(function (a, b) {
    return a.id < b.id;
  });
  for (var i = 0; i < tours_sort.length; i++) {
    var sum_tour = 0;
    if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {
      if (tours_sort[i].ratetours.length > 0) {
        for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
          sum_tour += tours_sort[i].ratetours[j]["point"];
        }
        avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);
      } else {
        avg_point = 0;
      }
      var html = compiled_index_tour({
        image_tour: tours_sort[i]["image"],
        name_tour: tours_sort[i]["name"],
        tour_id: tours_sort[i]["id"],
        avg: avg_point
      });
      $$('.swiper-wrapper[data-page="page-home-tour"]').append(html);
    }
  }
});
//remove load page
app.request.json("http://toithichdoc.com/tours/index.json", function (tours) {

  var lastItemIndex = $$('.swiper-wrapper[data-page="page-home-tour"] div').length;

  if (lastItemIndex) {
    $$('.infinite-scroll-preloader').remove();
  }
});
