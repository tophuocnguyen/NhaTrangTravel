$$(document).on('page:init', '.page[data-name="add-hotel"]', function (e, page) {
    var $$ = Dom7;
    var app = new Framework7();
    var map;
    var markers = [];
    var dt;
    var centerMap = {
        lat: 12.267874,
        lng: 109.202376
    };
    var t;
    var directionsService;
    var directionsDisplay;
    var stepDisplay;
    var markersDirection = [];
    var spLuongMarkerTrongCSDL;
    var $$ = Dom7;
    var lat_dau = '';
    var lng_dau = '';
    var lat_cuoi = '';
    var lng_cuoi = '';
    var geocoder = new google.maps.Geocoder();
    var lat_hientai;
    var lng_hientai;
    var pos;
    var srcData;
    var region;



    var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
        inputEl: '#autocomplete-dropdown-ajax-typeahead',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        /* If we set valueProperty to "id" then input value on select will be set according to this property */
        valueProperty: 'name', //object's "value" property name
        textProperty: 'name', //object's "text" property name
        limit: 20, //limit to 20 results
        typeahead: true,
        dropdownPlaceholderText: 'Try "JavaScript"',
        source: function (query, render) {
            var autocomplete = this;
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Show Preloader
            autocomplete.preloaderShow();

            // Do Ajax request to Autocomplete data
            app.request({
                url: 'http://toithichdoc.com/regions/index.json',
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query,
                },
                success: function (regions) {
                    var g = regions.regions;
                    // Find matched items
                    for (var i = 0; i < g.length; i++) {
                        if (g[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(g[i]);
                    }
                    // Hide Preoloader
                    autocomplete.preloaderHide();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        }
    });

    function myMap() {
        map = new google.maps.Map(document.getElementById('googleMap'), {
            zoom: 13,
            center: centerMap,

            mapTypeId: google.maps.MapTypeId.ROADMAP

        });




        // google.maps.event.addListener(map, 'click', function(event) {

        // });


        google.maps.event.addListener(map, 'click', function (e) {
            document.getElementById("latitude").value = e.latLng.lat();
            document.getElementById("longitude").value = e.latLng.lng();
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            marker = new google.maps.Marker({
                position: e.latLng,
                map: map
            });
            markers.push(marker);

        });



        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        var rendererOptions = {
            map: map,
            suppressMarkers: true
        }





        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

        stepDisplay = new google.maps.InfoWindow();

        infoWindow = new google.maps.InfoWindow;

        navigator.geolocation.getCurrentPosition(function (position) {

            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var infowindow = new google.maps.InfoWindow;
            //  infowindow.open(map,marker);
            var marker = new google.maps.Marker({
                // position: 
                //    {
                //        lat: 12.268144,
                //        lng: 109.202376
                //    },
                position: pos,
                // position: latlng,
                // position: 
                //    {
                //        lat: parseFloat(position.coords.latitude),
                //        lng: parseFloat(position.coords.longitude)
                //    },
                map: map,
                animation: google.maps.Animation.BOUNCE
            });
            var infowindow = new google.maps.InfoWindow(
                {
                    content: "You are here!"
                }
            );

            infowindow.open(map, marker);
            //  markers.push(marker);


            infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            // infowindow.open(map, marker);
            map.setCenter(pos);




        }, function () {
            handleLocationError(infoWindow, map.getCenter());
        });

    }
    myMap();

    var formData = app.form.convertToData('#my-form');
    var k;
    var n = 0;

    var element = document.getElementById("myDIV");

    $$('table').on('click', '.addVote, .subVote', function () {
        var _vote = document.getElementById("hi");
        var _vote = $(this).closest('tr').find('td.vote');
        // var change = $(this).hasClass('addVote') ? 1 : -1;
        /* _vote.text((parseInt(_vote.text())+change));  */

        if (n == 0) {
            _vote.text((parseInt(_vote.text()) + 1));
            k = (parseInt(_vote.text()));
            n = 1;
            // alert(k);
        }
        else {
            _vote.text((parseInt(_vote.text()) - 1));
            n = 0
            k = (parseInt(_vote.text()));
            //  alert(k);
            // element.classList.toggle("mystyle");
        }
    });



    $(document).ready(function () {

        $('#inputFileToLoad').change(function (evt) {

          var files = evt.target.files;
          var file = files[0];

          if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
              document.getElementById('image1').src = e.target.result;
            };
            reader.readAsDataURL(file);

            var formData = app.form.convertToData('#my-form');

            var filesSelected = document.getElementById("inputFileToLoad").files;

            if (filesSelected.length > 0) {
              var fileToLoad = filesSelected[0];

              var fileReader = new FileReader();

              fileReader.onload = function (fileLoadedEvent) {
                srcData = fileLoadedEvent.target.result; // <--- data: base64

              }
              fileReader.readAsDataURL(fileToLoad);
            }

          }
        });


      });

    $$('.add-hotel').on('click', function () {

        var formData = app.form.convertToData('#my-form');

        var region;
        app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
            a = regions.regions;

            for (var i = 0; i < a.length; i++) {
                if (formData.tp == a[i]["name"] && localStorage.user_id_save != "") {

                    region = a[i]["id"];
                    app.request({
                        // url: 'http://toithichdoc.com/hotels/delete/4.json',
                        url: 'http://toithichdoc.com/hotels/edit/7.json',
                        method: 'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({ "user_id": localStorage.user_id_save, "region_id": region, "name": formData.name, "typehotel_id": formData.type, "standard": formData.standard, "address": formData.address, "open": formData.open, "close": formData.close, "latitude": formData.lat, "longitude": formData.lng, "descripton": formData.descripton, "web": formData.web, "image": srcData, "status": "0", "featured": "0" }),
                        success: function (data) {
                            alert(JSON.stringify(data));
                        },
                        error: function (xhr, status) {
                            alert('Error: ' + JSON.stringify(xhr));
                            alert('ErrorStatus: ' + JSON.stringify(status));
                        }
                    });
                }
            }
        });
    });
});