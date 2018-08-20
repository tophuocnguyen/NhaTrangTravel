routes = [{
    path: '/',
    url: './index.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
      },
    }
  },

  {
    path: '/manage_edit_hotel/',
    url: './pages/manage_edit_hotel.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
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
        var lat_dau = '';
        var lng_dau = '';
        var lat_cuoi = '';
        var lng_cuoi = '';
        var geocoder = new google.maps.Geocoder();
        var lat_hientai;
        var lng_hientai;
        var pos;
        var srcData;
        var link_hotel_edit = 'http://toithichdoc.com/hotels/edit/' + page.route.query.hotel_id + '.json';
        //du lieu regions
        var template_regions_edit_hotel = $$('#my-regionsedithotel').html();
        var compiled_regions_edit_hotel = Template7.compile(template_regions_edit_hotel);
        app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
          //hotels_sort = hotel_feature.hotels.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < regions.regions.length; i++) {
            //console.log(regions.regions[i]);
            var html = compiled_regions_edit_hotel({
              regions_id: regions.regions[i]["id"],
              regions_name: regions.regions[i]["name"]
            });
            $$('.regionsedithotel select').append(html);
          }
        });


        //du lieu hotel theo loai
        var template_typehotel = $$('#my-typehotel').html();
        var compiled_typehotel = Template7.compile(template_typehotel);
        app.request.json("http://toithichdoc.com/typehotels/index.json", function (typehotels) {
          //hotels_sort = hotel_feature.hotels.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typehotels.typehotels.length; i++) {
            var html = compiled_typehotel({
              typehotel_id: typehotels.typehotels[i]["id"],
              typehotel_name: typehotels.typehotels[i]["name"]
            });
            $$('.typehotel select').append(html);
          }
        });

        var link_hotel = 'http://toithichdoc.com/hotels/view/' + page.route.query.hotel_id + '.json';
        app.request.json(link_hotel, function (hotel) {
          a = hotel.hotel;
          //console.log(a);
          document.getElementById("regionsedithotel").value = a["region_id"];
          document.getElementById("typehotel").value = a["typehotel_id"];
          document.getElementById("name").value = a["name"];
          document.getElementById("standard").value = a["standard"];
          document.getElementById("address").value = a["address"];
          document.getElementById("price").value = a["price"];
          document.getElementById("web").value = a["web"];
          if (a["status"]) {
            document.getElementById("status").value = 1;
          } else {
            document.getElementById("status").value = 0;
          }
          document.getElementById("latitude").value = a["latitude"];
          document.getElementById("longitude").value = a["longitude"];
          document.getElementById("descripton").value = a["descripton"];
          

        });

        //map
        function myMap() {
          map = new google.maps.Map(document.getElementById('googleMap4'), {
            zoom: 13,
            center: centerMap,

            mapTypeId: google.maps.MapTypeId.ROADMAP

          });

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
            var marker = new google.maps.Marker({
              position: pos,
              map: map,
              animation: google.maps.Animation.BOUNCE
            });
            var infowindow = new google.maps.InfoWindow({
              content: "You are here!"
            });

            infowindow.open(map, marker);
            infoWindow.setPosition(pos);
            map.setCenter(pos);

          }, function () {
            handleLocationError(infoWindow, map.getCenter());
          });

        }
        myMap();

        

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

        if (srcData) {

          $$('.manage-edit-hotel').on('click', function () {
            var formData = app.form.convertToData('#my-form-edit-hotel');
            app.request({
              url: link_hotel_edit,
              method: 'PUT',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "user_id": localStorage.user_id_save,
                "region_id": formData.regionsedithotel,
                "name": formData.name,
                "image": srcData,
                "desctipton": formData.desctipton,
                "price": formData.price,
                "standard": formData.standard,
                "address": formData.address,
                "longitude": formData.longitude,
                "latitude": formData.latitude,
                "open": formData.open,
                "close": formData.close,
                "web": formData.web,
                "status": formData.status
              }),
              success: function (data) {
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Sửa thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();
                page.view.router.back({
                  url: '/',
                  force: true,
                  ignoreCache: true
                });
              },
              error: function (xhr, status) {
                alert('Error: ' + JSON.stringify(xhr));
                alert('ErrorStatus: ' + JSON.stringify(status));
              }
            });


          });
        } else {

          $$('.manage-edit-hotel').on('click', function () {
            var formData = app.form.convertToData('#my-form-edit-hotel');
            app.request({
              url: link_hotel_edit,
              method: 'PUT',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "user_id": localStorage.user_id_save,
                "region_id": formData.regionsedithotel,
                "typehotel_id": formData.typehotel,
                "name": formData.name,
                "desctipton": formData.desctipton,
                "price": formData.price,
                "standard": formData.standard,
                "address": formData.address,
                "longitude": formData.longitude,
                "latitude": formData.latitude,
                "open": formData.open,
                "close": formData.close,
                "web": formData.web,
                "status": formData.status
              }),
              success: function (data) {
                console.log(data);
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Sửa thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();
                page.view.router.back({
                  url: '/',
                  force: true,
                  ignoreCache: true
                });
              },
              error: function (xhr, status) {
                alert('Error: ' + JSON.stringify(xhr));
                alert('ErrorStatus: ' + JSON.stringify(status));
              }
            });


          });
        }




      }
    }
  },
  {
    path: '/manage_add_hotel_room/',
    url: './pages/manage_add_hotel_room.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        //du lieu hotel theo loai
        var template_typehotel = $$('#my-typehotel').html();
        var compiled_typehotel = Template7.compile(template_typehotel);
        app.request.json("http://toithichdoc.com/typerooms/index.json", function (typerooms) {
          //rooms_sort = room_feature.rooms.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typerooms.typerooms.length; i++) {
            var html = compiled_typehotel({
              typehotel_id: typerooms.typerooms[i]["id"],
              typehotel_name: typerooms.typerooms[i]["name"]
            });
            $$('.typehotel select').append(html);
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

        $$('.add-room').on('click', function () {
          var formData = app.form.convertToData('#my-form-room');
          app.request({
            url: 'http://toithichdoc.com/rooms/add.json',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              "hotel_id": page.route.query.hotel_id,
              "typeroom_id": formData.typehotel,
              "name": formData.name,
              "image": srcData,
              "people": formData.people,
              "price": formData.price,
              "directions": formData.directions,
              "acreage": formData.acreage,
              "bedroom": formData.bedroom,
              "bathroom": formData.bathroom,
              "smokingroom": formData.smokingroom,
              "bathtub": formData.bathtub,
              "balcony": formData.balcony,
              "wifi": formData.wifi,
              "status": formData.status
            }),
            success: function (data) {
              app.dialog.create({
                title: 'Thông báo',
                text: 'Thêm phòng thành công',
                buttons: [{
                  text: 'Ok',
                }, ],
                verticalButtons: true,
              }).open();
              page.view.router.back({
                url: '/',
                force: true,
                ignoreCache: true
              });
            },
            error: function (xhr, status) {
              alert('Error: ' + JSON.stringify(xhr));
              alert('ErrorStatus: ' + JSON.stringify(status));
            }
          });


        });

      }
    }
  },
  {
    path: '/manage_edit_hotel_room/',
    url: './pages/manage_edit_hotel_room.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var srcData;
        var link_view_room = "http://toithichdoc.com/rooms/view/" + page.route.query.room_id + ".json";
        app.request.json(link_view_room, function (room) {
          document.getElementById("name").value = room.room["name"];
          document.getElementById("people").value = room.room["people"];
          document.getElementById("directions").value = room.room["directions"];
          document.getElementById("price").value = room.room["price"];
          document.getElementById("bedroom").value = room.room["bedroom"];
          document.getElementById("bathroom").value = room.room["bathroom"];
          document.getElementById("acreage").value = room.room["acreage"];
        });

        //du lieu hotel theo loai
        var template_typehotel = $$('#my-typehotel').html();
        var compiled_typehotel = Template7.compile(template_typehotel);
        app.request.json("http://toithichdoc.com/typerooms/index.json", function (typerooms) {
          //rooms_sort = room_feature.rooms.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typerooms.typerooms.length; i++) {
            var html = compiled_typehotel({
              typehotel_id: typerooms.typerooms[i]["id"],
              typehotel_name: typerooms.typerooms[i]["name"]
            });
            $$('.typehotel select').append(html);
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
        var link_edit_room = "http://toithichdoc.com/rooms/edit/" + page.route.query.room_id + ".json";
        if(srcData){
          $$('.edit-room').on('click', function () {
            var formData = app.form.convertToData('#my-form-edit-room');
            app.request({
              url: link_edit_room,
              method: 'POST',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "hotel_id": page.route.query.hotel_id,
                "typeroom_id": formData.typehotel,
                "name": formData.name,
                "image": srcData,
                "people": formData.people,
                "price": formData.price,
                "directions": formData.directions,
                "acreage": formData.acreage,
                "bedroom": formData.bedroom,
                "bathroom": formData.bathroom,
                "smokingroom": formData.smokingroom,
                "bathtub": formData.bathtub,
                "balcony": formData.balcony,
                "wifi": formData.wifi,
                "status": formData.status
              }),
              success: function (data) {
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Sửa phòng thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();
                page.view.router.back({
                  url: '/',
                  force: true,
                  ignoreCache: true
                });
              },
              error: function (xhr, status) {
                alert('Error: ' + JSON.stringify(xhr));
                alert('ErrorStatus: ' + JSON.stringify(status));
              }
            });
  
  
          });
        }
        else{
          $$('.edit-room').on('click', function () {
            var formData = app.form.convertToData('#my-form-edit-room');
            app.request({
              url: link_edit_room,
              method: 'POST',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "hotel_id": page.route.query.hotel_id,
                "typeroom_id": formData.typehotel,
                "name": formData.name,
                "people": formData.people,
                "price": formData.price,
                "directions": formData.directions,
                "acreage": formData.acreage,
                "bedroom": formData.bedroom,
                "bathroom": formData.bathroom,
                "smokingroom": formData.smokingroom,
                "bathtub": formData.bathtub,
                "balcony": formData.balcony,
                "wifi": formData.wifi,
                "status": formData.status
              }),
              success: function (data) {
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Sửa phòng thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();
                page.view.router.back({
                  url: '/',
                  force: true,
                  ignoreCache: true
                });
              },
              error: function (xhr, status) {
                alert('Error: ' + JSON.stringify(xhr));
                alert('ErrorStatus: ' + JSON.stringify(status));
              }
            });
  
  
          });
        }
        

      }
    }
  },
  {
    path: '/manage_add_hotel_image/',
    url: './pages/manage_add_hotel_image.html',
    on: {

      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

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

        $$('.add-image').on('click', function () {
          var formData = app.form.convertToData('#my-form-image');
          app.request({
            url: 'http://toithichdoc.com/imagehotels/add.json',
            // url: 'http://toithichdoc.com/users/delete/4.json',
            // http://toithichdoc.com/regions/index.json
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              "name": formData.name,
              "hotel_id": page.route.query.hotel_id,
              "image": srcData,
            }),
            success: function (data) {
              app.dialog.create({
                title: 'Thông báo',
                text: 'Thêm hình ảnh thành công',
                buttons: [{
                  text: 'Ok',
                }, ],
                verticalButtons: true,
              }).open();
              page.view.router.back({
                url: '/',
                force: true,
                ignoreCache: true
              });
            },
            error: function (xhr, status) {
              alert('Error: ' + JSON.stringify(xhr));
              alert('ErrorStatus: ' + JSON.stringify(status));
            }
          });


        });



      },
    }
  },
  {
    path: '/manage_edit_hotel_image/',
    url: './pages/manage_edit_hotel_image.html',
    on: {

      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var srcData;
        var link_view_image = "http://toithichdoc.com/imagehotels/view/" + page.route.query.image_id + ".json";
        app.request.json(link_view_image, function (imagehotels) {
          document.getElementById("name").value = imagehotels.imagehotels["name"];
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
        var link_edit_image = "http://toithichdoc.com/imagehotels/edit/" + page.route.query.image_id + ".json";
        if(srcData){
          $$('.edit-image-hotel').on('click', function () {
            var formData = app.form.convertToData('#my-form-edit-image-hotel');
            app.request({
              url: link_edit_image,
              method: 'POST',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "name": formData.name,
                "hotel_id": page.route.query.hotel_id,
                "image": srcData,
              }),
              success: function (data) {
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Sửa hình ảnh thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();
                page.view.router.back({
                  url: '/',
                  force: true,
                  ignoreCache: true
                });
              },
              error: function (xhr, status) {
                alert('Error: ' + JSON.stringify(xhr));
                alert('ErrorStatus: ' + JSON.stringify(status));
              }
            });
  
  
          });
        }
        else{
          $$('.edit-image-hotel').on('click', function () {
            var formData = app.form.convertToData('#my-form-edit-image-hotel');
            app.request({
              url: link_edit_image,
              method: 'POST',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "name": formData.name,
                "hotel_id": page.route.query.hotel_id,
              }),
              success: function (data) {
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Sửa hình ảnh thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();
                page.view.router.back({
                  url: '/',
                  force: true,
                  ignoreCache: true
                });
              },
              error: function (xhr, status) {
                alert('Error: ' + JSON.stringify(xhr));
                alert('ErrorStatus: ' + JSON.stringify(status));
              }
            });
  
  
          });
        }
        



      },
    }
  },

  {
    path: '/manage_list_room/',
    url: './pages/manage_list_room.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();


        var template_typeroom_content = $$('#my-typeroom-content').html();
        var compiled_typeroom_content = Template7.compile(template_typeroom_content);
        app.request.json("http://toithichdoc.com/rooms/index.json", function (room_feature) {
          rooms_sort = room_feature.rooms.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < rooms_sort.length; i++) {
            //if (rooms_sort[i]["typeroom_id"] == 1) {

            if (rooms_sort[i]["status"] == 1 && rooms_sort[i]["featured"] == 1) {
              if (rooms_sort[i]["hotel_id"] == page.route.query.hotel_id) {

                var html = compiled_typeroom_content({
                  hotel_id: page.route.query.hotel_id,
                  created_room_feature: rooms_sort[i]["created"],
                  name_room_feature: rooms_sort[i]["name"],
                  image_room_feature: rooms_sort[i]["image"],
                  id_room_feature: rooms_sort[i]["id"],
                  price: rooms_sort[i]["price"],
                  description_room_feature: rooms_sort[i]["directions"],
                });

                $$('.typeroom-content[data-page="page-typeroom-content"]').append(html);
              }
            }
            //}
          }
        });

      }
    }
  },
  {
    path: '/manage_list_image/',
    url: './pages/manage_list_image.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();


        var template_typeimage_content = $$('#my-typeimage-content').html();
        var compiled_typeimage_content = Template7.compile(template_typeimage_content);
        app.request.json("http://toithichdoc.com/imagehotels/index.json", function (image_feature) {
          images_sort = image_feature.imagehotels.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < images_sort.length; i++) {
            //if (images_sort[i]["typeimage_id"] == 1) {

            if (images_sort[i]["status"] == 1 && images_sort[i]["featured"] == 1) {
              if (images_sort[i]["hotel_id"] == page.route.query.hotel_id) {
                //console.log('da vo');
                var html = compiled_typeimage_content({
                  hotel_id: page.route.query.hotel_id,
                  created_image_feature: images_sort[i]["created"],
                  image_image_feature: images_sort[i]["image"],
                  id_image_feature: images_sort[i]["id"],
                  description_image_feature: images_sort[i]["name"],
                });

                $$('.typeimage-content[data-page="page-typeimage-content"]').append(html);
              }
            }
            //}
          }
        });

      }
    }
  },

  {
    path: '/list_rooms/',
    url: './pages/list_rooms.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        //du lieu place theo loai
        var template_typeroom = $$('#my-typeroom').html();
        var compiled_typeroom = Template7.compile(template_typeroom);
        app.request.json("http://toithichdoc.com/typerooms/index.json", function (typerooms) {
          //rooms_sort = room_feature.rooms.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typerooms.typerooms.length; i++) {
            var html = compiled_typeroom({
              typeroom_id: typerooms.typerooms[i]["id"],
              typeroom_name: typerooms.typerooms[i]["name"]
            });
            $$('.typeroom select').append(html);
          }
        });

        var template_typeroom_content = $$('#my-typeroom-content').html();
        var compiled_typeroom_content = Template7.compile(template_typeroom_content);
        app.request.json("http://toithichdoc.com/rooms/index.json", function (room_feature) {
          rooms_sort = room_feature.rooms.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < rooms_sort.length; i++) {
            //if (rooms_sort[i]["typeroom_id"] == 1) {

            if (rooms_sort[i]["status"] == 1 && rooms_sort[i]["featured"] == 1) {
              if (rooms_sort[i]["hotel_id"] == page.route.query.hotel_id) {

                var html = compiled_typeroom_content({
                  created_room_feature: rooms_sort[i]["created"],
                  name_room_feature: rooms_sort[i]["name"],
                  image_room_feature: rooms_sort[i]["image"],
                  id_room_feature: rooms_sort[i]["id"],
                  price: rooms_sort[i]["price"],
                  description_room_feature: rooms_sort[i]["directions"],
                });

                $$('.typeroom-content[data-page="page-typeroom-content"]').append(html);
              }
            }
            //}
          }
        });

        $$('#typeroom').on('change', function () {
          $$('.typeroom-content[data-page="page-typeroom-content"]').html('');
          app.request.json("http://toithichdoc.com/rooms/index.json", function (room_feature) {
            rooms_sort = room_feature.rooms.sort(function (a, b) {
              return a.id < b.id;
            });
            for (var i = 0; i < rooms_sort.length; i++) {

              if (rooms_sort[i]["typeroom_id"] == $$('#typeroom').val()) {

                if (rooms_sort[i]["status"] == 1 && rooms_sort[i]["featured"] == 1) {
                  if (rooms_sort[i]["hotel_id"] == page.route.query.hotel_id) {
                    var html = compiled_typeroom_content({
                      created_room_feature: rooms_sort[i]["created"],
                      name_room_feature: rooms_sort[i]["name"],
                      image_room_feature: rooms_sort[i]["image"],
                      id_room_feature: rooms_sort[i]["id"],
                      price: rooms_sort[i]["price"],
                      description_room_feature: rooms_sort[i]["descripton"],
                    });

                    $$('.typeroom-content[data-page="page-typeroom-content"]').append(html);
                  }
                }
              }
            }
          });

        });

        $$('#typeprice').on('change', function () {
          $$('.typeroom-content[data-page="page-typeroom-content"]').html('');

          if ($$('#typeprice').val() == '500') {
            app.request.json("http://toithichdoc.com/rooms/index.json", function (room_feature) {
              rooms_sort = room_feature.rooms.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < rooms_sort.length; i++) {

                if (rooms_sort[i]["status"] == 1 && rooms_sort[i]["featured"] == 1) {
                  if (rooms_sort[i]["hotel_id"] == page.route.query.hotel_id) {
                    if (rooms_sort[i]['price'] < 500000) {

                      var html = compiled_typeroom_content({
                        created_room_feature: rooms_sort[i]["created"],
                        name_room_feature: rooms_sort[i]["name"],
                        image_room_feature: rooms_sort[i]["image"],
                        id_room_feature: rooms_sort[i]["id"],
                        price: rooms_sort[i]["price"],
                        description_room_feature: rooms_sort[i]["descripton"],
                      });

                      $$('.typeroom-content[data-page="page-typeroom-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '500-1000') {
            app.request.json("http://toithichdoc.com/rooms/index.json", function (room_feature) {
              rooms_sort = room_feature.rooms.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < rooms_sort.length; i++) {

                if (rooms_sort[i]["status"] == 1 && rooms_sort[i]["featured"] == 1) {
                  if (rooms_sort[i]["hotel_id"] == page.route.query.hotel_id) {
                    if (rooms_sort[i]['price'] > 499999 && rooms_sort[i]['price'] < 1000000) {

                      var html = compiled_typeroom_content({
                        created_room_feature: rooms_sort[i]["created"],
                        name_room_feature: rooms_sort[i]["name"],
                        image_room_feature: rooms_sort[i]["image"],
                        id_room_feature: rooms_sort[i]["id"],
                        price: rooms_sort[i]["price"],
                        description_room_feature: rooms_sort[i]["descripton"],
                      });

                      $$('.typeroom-content[data-page="page-typeroom-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }

          if ($$('#typeprice').val() == '1000-1500') {
            app.request.json("http://toithichdoc.com/rooms/index.json", function (room_feature) {
              rooms_sort = room_feature.rooms.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < rooms_sort.length; i++) {

                if (rooms_sort[i]["status"] == 1 && rooms_sort[i]["featured"] == 1) {
                  if (rooms_sort[i]["hotel_id"] == page.route.query.hotel_id) {
                    if (rooms_sort[i]['price'] > 999999 && rooms_sort[i]['price'] < 1500000) {

                      var html = compiled_typeroom_content({
                        created_room_feature: rooms_sort[i]["created"],
                        name_room_feature: rooms_sort[i]["name"],
                        image_room_feature: rooms_sort[i]["image"],
                        id_room_feature: rooms_sort[i]["id"],
                        price: rooms_sort[i]["price"],
                        description_room_feature: rooms_sort[i]["descripton"],
                      });

                      $$('.typeroom-content[data-page="page-typeroom-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '1500-2000') {
            app.request.json("http://toithichdoc.com/rooms/index.json", function (room_feature) {
              rooms_sort = room_feature.rooms.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < rooms_sort.length; i++) {

                if (rooms_sort[i]["status"] == 1 && rooms_sort[i]["featured"] == 1) {
                  if (rooms_sort[i]["hotel_id"] == page.route.query.hotel_id) {
                    if (rooms_sort[i]['price'] > 1499999 && rooms_sort[i]['price'] < 2000000) {

                      var html = compiled_typeroom_content({
                        created_room_feature: rooms_sort[i]["created"],
                        name_room_feature: rooms_sort[i]["name"],
                        image_room_feature: rooms_sort[i]["image"],
                        id_room_feature: rooms_sort[i]["id"],
                        price: rooms_sort[i]["price"],
                        description_room_feature: rooms_sort[i]["descripton"],
                      });

                      $$('.typeroom-content[data-page="page-typeroom-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '2000') {
            app.request.json("http://toithichdoc.com/rooms/index.json", function (room_feature) {
              rooms_sort = room_feature.rooms.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < rooms_sort.length; i++) {

                if (rooms_sort[i]["status"] == 1 && rooms_sort[i]["featured"] == 1) {
                  if (rooms_sort[i]["hotel_id"] == page.route.query.hotel_id) {
                    if (rooms_sort[i]['price'] > 1999999) {

                      var html = compiled_typeroom_content({
                        created_room_feature: rooms_sort[i]["created"],
                        name_room_feature: rooms_sort[i]["name"],
                        image_room_feature: rooms_sort[i]["image"],
                        id_room_feature: rooms_sort[i]["id"],
                        price: rooms_sort[i]["price"],
                        description_room_feature: rooms_sort[i]["descripton"],
                      });

                      $$('.typeroom-content[data-page="page-typeroom-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }

        });
      }
    }
  },
  {
    path: '/list_foods/',
    url: './pages/list_foods.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        //du lieu place theo loai
        var template_typefood = $$('#my-typefood').html();
        var compiled_typefood = Template7.compile(template_typefood);
        app.request.json("http://toithichdoc.com/typefoods/index.json", function (typefoods) {
          //foods_sort = food_feature.foods.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typefoods.typefoods.length; i++) {
            var html = compiled_typefood({
              typefood_id: typefoods.typefoods[i]["id"],
              typefood_name: typefoods.typefoods[i]["name"]
            });
            $$('.typefood select').append(html);
          }
        });

        var template_typefood_content = $$('#my-typefood-content').html();
        var compiled_typefood_content = Template7.compile(template_typefood_content);
        app.request.json("http://toithichdoc.com/foods/index.json", function (food_feature) {
          foods_sort = food_feature.foods.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < foods_sort.length; i++) {
            //if (foods_sort[i]["typefood_id"] == 1) {

            if (foods_sort[i]["status"] == 1 && foods_sort[i]["featured"] == 1) {
              if (foods_sort[i]["restaurant_id"] == page.route.query.restaurant_id) {

                var html = compiled_typefood_content({
                  created_food_feature: foods_sort[i]["created"],
                  name_food_feature: foods_sort[i]["name"],
                  image_food_feature: foods_sort[i]["image"],
                  id_food_feature: foods_sort[i]["id"],
                  price: foods_sort[i]["price"],
                  description_food_feature: foods_sort[i]["directions"],
                });

                $$('.typefood-content[data-page="page-typefood-content"]').append(html);
              }
            }
            //}
          }
        });

        $$('#typefood').on('change', function () {
          $$('.typefood-content[data-page="page-typefood-content"]').html('');
          app.request.json("http://toithichdoc.com/foods/index.json", function (food_feature) {
            foods_sort = food_feature.foods.sort(function (a, b) {
              return a.id < b.id;
            });
            for (var i = 0; i < foods_sort.length; i++) {

              if (foods_sort[i]["typefood_id"] == $$('#typefood').val()) {

                if (foods_sort[i]["status"] == 1 && foods_sort[i]["featured"] == 1) {
                  if (foods_sort[i]["restaurant_id"] == page.route.query.restaurant_id) {
                    var html = compiled_typefood_content({
                      created_food_feature: foods_sort[i]["created"],
                      name_food_feature: foods_sort[i]["name"],
                      image_food_feature: foods_sort[i]["image"],
                      id_food_feature: foods_sort[i]["id"],
                      price: foods_sort[i]["price"],
                      description_food_feature: foods_sort[i]["descripton"],
                    });

                    $$('.typefood-content[data-page="page-typefood-content"]').append(html);
                  }
                }
              }
            }
          });

        });

        $$('#typeprice').on('change', function () {
          $$('.typefood-content[data-page="page-typefood-content"]').html('');

          if ($$('#typeprice').val() == '250') {
            app.request.json("http://toithichdoc.com/foods/index.json", function (food_feature) {
              foods_sort = food_feature.foods.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < foods_sort.length; i++) {

                if (foods_sort[i]["status"] == 1 && foods_sort[i]["featured"] == 1) {
                  if (foods_sort[i]["restaurant_id"] == page.route.query.restaurant_id) {
                    if (foods_sort[i]['price'] < 250000) {

                      var html = compiled_typefood_content({
                        created_food_feature: foods_sort[i]["created"],
                        name_food_feature: foods_sort[i]["name"],
                        image_food_feature: foods_sort[i]["image"],
                        id_food_feature: foods_sort[i]["id"],
                        price: foods_sort[i]["price"],
                        description_food_feature: foods_sort[i]["descripton"],
                      });

                      $$('.typefood-content[data-page="page-typefood-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '250-500') {
            app.request.json("http://toithichdoc.com/foods/index.json", function (food_feature) {
              foods_sort = food_feature.foods.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < foods_sort.length; i++) {

                if (foods_sort[i]["status"] == 1 && foods_sort[i]["featured"] == 1) {
                  if (foods_sort[i]["restaurant_id"] == page.route.query.restaurant_id) {
                    if (foods_sort[i]['price'] > 249999 && foods_sort[i]['price'] < 500000) {

                      var html = compiled_typefood_content({
                        created_food_feature: foods_sort[i]["created"],
                        name_food_feature: foods_sort[i]["name"],
                        image_food_feature: foods_sort[i]["image"],
                        id_food_feature: foods_sort[i]["id"],
                        price: foods_sort[i]["price"],
                        description_food_feature: foods_sort[i]["descripton"],
                      });

                      $$('.typefood-content[data-page="page-typefood-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }

          if ($$('#typeprice').val() == '500-750') {
            app.request.json("http://toithichdoc.com/foods/index.json", function (food_feature) {
              foods_sort = food_feature.foods.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < foods_sort.length; i++) {

                if (foods_sort[i]["status"] == 1 && foods_sort[i]["featured"] == 1) {
                  if (foods_sort[i]["restaurant_id"] == page.route.query.restaurant_id) {
                    if (foods_sort[i]['price'] > 499999 && foods_sort[i]['price'] < 750000) {

                      var html = compiled_typefood_content({
                        created_food_feature: foods_sort[i]["created"],
                        name_food_feature: foods_sort[i]["name"],
                        image_food_feature: foods_sort[i]["image"],
                        id_food_feature: foods_sort[i]["id"],
                        price: foods_sort[i]["price"],
                        description_food_feature: foods_sort[i]["descripton"],
                      });

                      $$('.typefood-content[data-page="page-typefood-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '750-1000') {
            app.request.json("http://toithichdoc.com/foods/index.json", function (food_feature) {
              foods_sort = food_feature.foods.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < foods_sort.length; i++) {

                if (foods_sort[i]["status"] == 1 && foods_sort[i]["featured"] == 1) {
                  if (foods_sort[i]["restaurant_id"] == page.route.query.restaurant_id) {
                    if (foods_sort[i]['price'] > 7499999 && foods_sort[i]['price'] < 1000000) {

                      var html = compiled_typefood_content({
                        created_food_feature: foods_sort[i]["created"],
                        name_food_feature: foods_sort[i]["name"],
                        image_food_feature: foods_sort[i]["image"],
                        id_food_feature: foods_sort[i]["id"],
                        price: foods_sort[i]["price"],
                        description_food_feature: foods_sort[i]["descripton"],
                      });

                      $$('.typefood-content[data-page="page-typefood-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '1000') {
            app.request.json("http://toithichdoc.com/foods/index.json", function (food_feature) {
              foods_sort = food_feature.foods.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < foods_sort.length; i++) {

                if (foods_sort[i]["status"] == 1 && foods_sort[i]["featured"] == 1) {
                  if (foods_sort[i]["restaurant_id"] == page.route.query.restaurant_id) {
                    if (foods_sort[i]['price'] > 999999) {

                      var html = compiled_typefood_content({
                        created_food_feature: foods_sort[i]["created"],
                        name_food_feature: foods_sort[i]["name"],
                        image_food_feature: foods_sort[i]["image"],
                        id_food_feature: foods_sort[i]["id"],
                        price: foods_sort[i]["price"],
                        description_food_feature: foods_sort[i]["descripton"],
                      });

                      $$('.typefood-content[data-page="page-typefood-content"]').append(html);
                    }
                  }
                }
                //}
              }
            });
          }

        });
      }
    }
  },
  {
    path: '/add_rate_hotel/',
    url: './pages/add_rate_hotel.html',
  },

  {
    path: '/messages/',
    url: './pages/messages.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var template_list_user_messages = $$('#my-user-messages').html();
        var compiled_list_user_messages = Template7.compile(template_list_user_messages);
        app.request.json("http://toithichdoc.com/followings/index.json", function (user_messages) {
          for (var i = 0; i < user_messages.followings.length; i++) {
            if (user_messages.followings[i]["followings_id"] == localStorage.user_id_save) {
              var html = compiled_list_user_messages({
                image_user_messages: user_messages.followings[i].users_following["image"],
                name_user_messages: user_messages.followings[i].users_following["username"],
                description_user_messages: user_messages.followings[i].users_following["name"],
                user_id: user_messages.followings[i].users_following["id"],
              });
              $$('.user-messages[data-page="list-user-messages"] ul').append(html);
            }
          }
        });
      }
    }
  },

  {
    path: '/messages_chat/',
    url: './pages/messages_chat.html',
    on: {
      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        var template_messages_sent = $$('#my-messages-sent').html();
        var compiled_messages_sent = Template7.compile(template_messages_sent);
        var template_messages_received = $$('#my-messages-received').html();
        var compiled_messages_received = Template7.compile(template_messages_received);
        app.request.json("http://toithichdoc.com/messages/index.json", function (messages) {
          for (var i = 0; i < messages.messages.length; i++) {
            if (messages.messages[i]['user_to'] == page.route.query.user_id && messages.messages[i]['user_from'] == localStorage.user_id_save) {
              var html = compiled_messages_sent({
                user_from_image: messages.messages[i].users_from["image"],
                user_from_name: messages.messages[i].users_from["username"],
                user_from_content: messages.messages[i]["name"],
                user_from_created: messages.messages[i]["created"],
              });
              $$('.messages[data-page="my-messages"]').append(html);
            }
            if (messages.messages[i]['user_to'] == localStorage.user_id_save && messages.messages[i]['user_from'] == page.route.query.user_id) {
              var html = compiled_messages_received({
                user_to_image: messages.messages[i].users_from["image"],
                user_to_name: messages.messages[i].users_from["username"],
                user_to_content: messages.messages[i]["name"],
                user_to_created: messages.messages[i]["created"],
              });
              $$('.messages[data-page="my-messages"]').append(html);
            }
          }
        });


        app.request.json("http://toithichdoc.com/messages/index.json", function (messages_chat) {
          // Init Messages
          var messages = app.messages.create({
            el: '.messages',

            // First message rule
            firstMessageRule: function (message, previousMessage, nextMessage) {
              // Skip if title
              if (message.isTitle) return false;
              /* if:
                - there is no previous message
                - or previous message type (send/received) is different
                - or previous message sender name is different
              */
              if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
              return false;
            },
            // Last message rule
            lastMessageRule: function (message, previousMessage, nextMessage) {
              // Skip if title
              if (message.isTitle) return false;
              /* if:
                - there is no next message
                - or next message type (send/received) is different
                - or next message sender name is different
              */
              if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
              return false;
            },
            // Last message rule
            tailMessageRule: function (message, previousMessage, nextMessage) {
              // Skip if title
              if (message.isTitle) return false;
              /* if (bascially same as lastMessageRule):
              - there is no next message
              - or next message type (send/received) is different
              - or next message sender name is different
            */
              if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
              return false;
            }
          });

          // Init Messagebar
          var messagebar = app.messagebar.create({
            el: '.messagebar'
          });

          // Response flag
          var responseInProgress = false;

          // Send Message
          $$('.send-link').on('click', function () {
            var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
            // return if empty message
            if (!text.length) return;

            // Clear area
            messagebar.clear();

            // Return focus to area
            messagebar.focus();

            // Add message to messages
            messages.addMessage({
              text: text,
            });

            if (responseInProgress) return;
            // Receive dummy message
            receiveMessage();
            console.log(text);
            app.request({
              url: 'http://toithichdoc.com/messages/add.json',
              method: 'POST',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "user_from": localStorage.user_id_save,
                "user_to": page.route.query.user_id,
                "name": text
              }),
              success: function (data) {
                console.log('thanh cong');

              },
              error: function (xhr, status) {
                alert('Lỗi: ' + JSON.stringify(xhr));
                alert('Thông báo lỗi: ' + JSON.stringify(status));
              }
            });

          });


          messages_sort = messages_chat.messages.sort(function (a, b) {
            return a.id < b.id;
          });
          //console.log(messages_sort[0]);
          var mang = [];
          var mang2 = [];
          for (var i = 0; i < messages_sort.length; i++) {
            if (messages_sort[i]['user_to'] == localStorage.user_id_save && messages_sort[i]['user_from'] == page.route.query.user_id) {
              mang.push(messages_sort[i]);
            }
            if (messages_sort[i]['user_to'] == page.route.query.user_id && messages_sort[i]['user_from'] == localStorage.user_id_save) {
              mang2.push(messages_sort[i]);
            }
          }

          mag_sort = mang.sort(function (a, b) {
            return a.id < b.id;
          });
          mag_sort2 = mang2.sort(function (a, b) {
            return a.id < b.id;
          });

          for (var j = 0; j < mag_sort.length; j++) {
            console.log(mag_sort[j]);
            var answers = [
              mag_sort[0]['name'],
            ];
            var people = [{
              name: mag_sort[0].users_to['username'],
              avatar: mag_sort[0].users_to['image']
            }, ];
          }



          function receiveMessage() {
            responseInProgress = true;
            setTimeout(function () {
              // Get random answer and random person
              var answer = answers;
              var person = people;

              // Show typing indicator
              messages.showTyping({
                header: person.name + ' is typing',
                avatar: person.avatar
              });

              setTimeout(function () {
                // Add received dummy message
                messages.addMessage({
                  text: answer,
                  type: 'received',
                  name: person.name,
                  avatar: person.avatar
                });
                // Hide typing indicator
                messages.hideTyping();
                responseInProgress = false;
              }, 4000);
            }, 1000);
          }

        });


      }
    }
  },
  {
    path: '/content_food/',
    url: './pages/content_food.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        var link_food = 'http://toithichdoc.com/foods/view/' + page.route.query.food_id + '.json';


        //du lieu title
        var template_my_name_content_foods = $$('#my-name-food-header').html();
        var compiled_my_name_content_foods = Template7.compile(template_my_name_content_foods);
        app.request.json(link_food, function (food) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_my_name_content_foods({
            name_title: food.food["name"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-name-food-header"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_food_image = $$('#my-name-food-image').html();
        var compiled_food_image = Template7.compile(template_food_image);
        app.request.json(link_food, function (food_image) {
          //console.log(food_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_food_image({
            image: food_image.food["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-name-food-image"]').append(html);
          //}

        });

        //du lieu food content
        var template_food_content = $$('#my-name-food-content').html();
        var compiled_food_content = Template7.compile(template_food_content);
        app.request.json(link_food, function (food_content) {
          //console.log(parseFloat(food_content.avg));
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_food_content({
            name: food_content.food["name"],
          });
          $$('.item-inner[data-page="page-name-food-content"]').append(html);
          //}

        });
        //du lieu gioi thieu
        var template_food_introduce = $$('#my-name-food-introduce').html();
        var compiled_food_introduce = Template7.compile(template_food_introduce);
        app.request.json(link_food, function (food_introduce) {
          //console.log(food_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_food_introduce({
            price: food_introduce.food["price"],
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-food-introduce"]').append(html);
          //}

        });

        //du lieu noi dung
        var template_food_description = $$('#my-name-food-description').html();
        var compiled_food_description = Template7.compile(template_food_description);
        app.request.json(link_food, function (food_description) {
          //console.log(food_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_food_description({
            descripton: food_description.food["descripton"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-food-description"]').append(html);
          //}

        });



        //remove load page
        app.request.json(link_food, function (count) {
          //console.log(event_content);
          var lastItemIndex = $$('.list .list-form-rate li').length;
          if (count.comments.length == lastItemIndex) {
            $$('.infinite-scroll-preloader').remove();
          }
        });

      },
    }
  },
  {
    path: '/content_room/',
    url: './pages/content_room.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        var link_room = 'http://toithichdoc.com/rooms/view/' + page.route.query.room_id + '.json';


        //du lieu title
        var template_my_name_content_rooms = $$('#my-name-room-header').html();
        var compiled_my_name_content_rooms = Template7.compile(template_my_name_content_rooms);
        app.request.json(link_room, function (room) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_my_name_content_rooms({
            name_title: room.room["name"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-name-room-header"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_room_image = $$('#my-name-room-image').html();
        var compiled_room_image = Template7.compile(template_room_image);
        app.request.json(link_room, function (room_image) {
          //console.log(room_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_room_image({
            image: room_image.room["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-name-room-image"]').append(html);
          //}

        });

        //du lieu room content
        var template_room_content = $$('#my-name-room-content').html();
        var compiled_room_content = Template7.compile(template_room_content);
        app.request.json(link_room, function (room_content) {
          //console.log(parseFloat(room_content.avg));
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_room_content({
            name: room_content.room["name"],
          });
          $$('.item-inner[data-page="page-name-room-content"]').append(html);
          //}

        });
        //du lieu gioi thieu
        var template_room_introduce = $$('#my-name-room-introduce').html();
        var compiled_room_introduce = Template7.compile(template_room_introduce);
        app.request.json(link_room, function (room_introduce) {
          //console.log(room_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_room_introduce({
            price: room_introduce.room["price"],
            people: room_introduce.room["people"],
            acreage: room_introduce.room["acreage"],
            bedroom: room_introduce.room["bedroom"],
            bathroom: room_introduce.room["bathroom"],
            smokingroom: room_introduce.room["smokingroom"],
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-room-introduce"]').append(html);
          //}

        });

        //du lieu noi dung
        var template_room_description = $$('#my-name-room-description').html();
        var compiled_room_description = Template7.compile(template_room_description);
        app.request.json(link_room, function (room_description) {
          //console.log(room_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_room_description({
            content: room_description.room["directions"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-room-description"]').append(html);
          //}

        });



        //remove load page
        app.request.json(link_room, function (count) {
          //console.log(event_content);
          var lastItemIndex = $$('.list .list-form-rate li').length;
          if (count.comments.length == lastItemIndex) {
            $$('.infinite-scroll-preloader').remove();
          }
        });

      },
    }
  },

  {
    path: '/content_events/',
    url: './pages/content_events.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        var link_event = 'http://toithichdoc.com/events/view/' + page.route.query.event_id + '.json';

        var id_event = page.route.query.event_id;
        //du lieu title name
        // DOM events for About popup
        $$('.popup-rate-event').on('popup:open', function (e, popup, page) {
          $$('.link-rate-event').on('click', function (e, page) {
            if (localStorage.user_id_save) {
              var formData = app.form.convertToData('#form-rate-event');
              var star = $$("div input[type='radio']:checked").val();
              //alert(star);
              app.request({
                url: 'http://toithichdoc.com/rateevents/add.json',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                  "user_id": localStorage.user_id_save,
                  "event_id": id_event,
                  "point": star,
                  "name": formData.name,
                  "description": formData.descripton
                }),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Thêm đánh giá thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();

                  var date_time = timestamp.getFullYear() + '-' + timestamp.getMonth() + '-' + timestamp.getDate() + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes();
                  var star_comment = '';
                  if (star == '1') {
                    star_comment = '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>';
                  }
                  if (star == '2') {
                    star_comment = '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>';
                  }
                  if (star == '3') {
                    star_comment = '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>';
                  }
                  if (star == '4') {
                    star_comment = '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star_border</i>';
                  }
                  if (star == '5') {
                    star_comment = '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>' +
                      '<i class="material-icons" style="width: 11px; color: gold; font-size: 17px;">star</i>';
                  }
                  var html = '<li>' +
                    '<a class="item-content">' +
                    '<div class="item-media">' +
                    '<img src="' + localStorage.user_image_save + '" width="50" />' +
                    '</div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title" style="font-size: 14px;">' + localStorage.user_name_save + '</div>' +
                    '<div class="item-after" style="font-size: 12px;">' + date_time + '</div>' +
                    '</div>' +
                    '<div class="item-subtitle">' +
                    star_comment +
                    '</div>' +
                    '<div class="item-subtitle" style="font-size: 12px; color: #757575;">' +
                    formData.name +
                    '</div>' +
                    '<div class="item-text" style="font-size: 11px;">' + formData.descripton + '</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>';
                  //document.getElementById("list-content-event-rate").innerHTML += html;
                  //page.view.router.navigate(url_refesh);
                  //$$('.page-content').scrollTop(5000);

                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });
            } else {
              app.dialog.create({
                title: 'Thông báo',
                text: 'Vui lòng đăng nhập',
                buttons: [{
                  text: 'Yes',
                }],
                verticalButtons: true,
              }).open();
            }

          });
        });

        var template_button_save = $$('#button-save').html();
        var compiled_button_save = Template7.compile(template_button_save);

        app.request.json(link_event, function (event) {
          var status = false;
          for (var i = 0; i < event.event.likeevents.length; i++) {
            if (event.event.likeevents[i]['user_id'] == localStorage.user_id_save) {
              status = true;
            } else {
              status = false;
            }
          }
          //console.log(status);
          var html = compiled_button_save({
            status: status
          });
          $$('.button-save-event').append(html);

        });

        $$('.button-save-event').on('click', function () {

          $$('.button-save-event').html('');
          app.request.json(link_event, function (event) {
            var status1 = false;
            for (var i = 0; i < event.event.likeevents.length; i++) {
              if (event.event.likeevents[i]['user_id'] == localStorage.user_id_save) {
                var link = 'http://toithichdoc.com/likeevents/delete/' + event.event.likeevents[i]['id'] + '.json';
                status1 = true;
              } else {
                status1 = false;
              }
            }
            if (status1) {

              alert(link);
              app.request({
                url: link,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Hủy lưu thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });

              var html = compiled_button_save({
                status: false
              });
              $$('.button-save-event').append(html);

            } else {
              //console.log(likehotels.likehotels[i]);
              var link = 'http://toithichdoc.com/likeevents/add.json';
              app.request({
                url: link,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                  "user_id": localStorage.user_id_save,
                  "event_id": page.route.query.event_id
                }),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Lưu thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });
              var html = compiled_button_save({
                status: true
              });
              $$('.button-save-event').append(html);

            }
          });

        });


        //du lieu title
        var template_my_name_content_events = $$('#my-name-event-header').html();
        var compiled_my_name_content_events = Template7.compile(template_my_name_content_events);
        app.request.json(link_event, function (event) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_my_name_content_events({
            name_title: event.event["title"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-name-event-header"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_event_image = $$('#my-name-event-image').html();
        var compiled_event_image = Template7.compile(template_event_image);
        app.request.json(link_event, function (event_image) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_event_image({
            image: event_image.event["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-name-event-image"]').append(html);
          //}

        });

        //du lieu event content
        var template_event_content = $$('#my-name-event-content').html();
        var compiled_event_content = Template7.compile(template_event_content);
        app.request.json(link_event, function (event_content) {
          //console.log(parseFloat(event_content.avg));
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_event_content({
            name: event_content.event["title"],
            count_rate: event_content.count_rate,
            avg: event_content.avg,
          });
          $$('.item-inner[data-page="page-name-event-content"]').append(html);
          //}

        });
        //Du lieu rate
        var template_event_rate = $$('#my-name-event-rate').html();
        var compiled_event_rate = Template7.compile(template_event_rate);
        app.request.json(link_event, function (event_rate) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_event_rate({
            avg: event_rate.avg,
            count_rate: event_rate.count_rate,
            count_rate_5: event_rate.count_rate_5,
            count_rate_4: event_rate.count_rate_4,
            count_rate_3: event_rate.count_rate_3,
            count_rate_2: event_rate.count_rate_2,
            count_rate_1: event_rate.count_rate_1,
            percent_rate_5: event_rate.percent_rate_5,
            percent_rate_4: event_rate.percent_rate_4,
            percent_rate_3: event_rate.percent_rate_3,
            percent_rate_2: event_rate.percent_rate_2,
            percent_rate_1: event_rate.percent_rate_1
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-event-rate"]').append(html);
          //}

        });
        //du lieu gioi thieu
        var template_event_introduce = $$('#my-name-event-introduce').html();
        var compiled_event_introduce = Template7.compile(template_event_introduce);
        app.request.json(link_event, function (event_introduce) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_event_introduce({
            start: event_introduce.event["start"],
            end: event_introduce.event["end"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-event-introduce"]').append(html);
          //}

        });

        //du lieu noi dung
        var template_event_description = $$('#my-name-event-description').html();
        var compiled_event_description = Template7.compile(template_event_description);
        app.request.json(link_event, function (event_description) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_event_description({
            content: event_description.event["content"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-event-description"]').append(html);
          //}

        });

        //du lieu slide
        var template_event_slide = $$('#my-name-event-slide').html();
        var compiled_event_slide = Template7.compile(template_event_slide);
        app.request.json(link_event, function (event_slide) {
          //console.log(event_slide.event.imageevents);
          for (var i = 0; i < event_slide.event.imageevents.length; i++) {

            var html = compiled_event_slide({
              image_slide: event_slide.event.imageevents[i]["image"]
            });
            //console.log(html);
            $$('.swiper-wrapper[data-page="page-name-event-slide"]').append(html);
          }

        });

        //du lieu comment
        var template_event_form_rate = $$('#my-name-event-form-rate').html();
        var compiled_event_form_rate = Template7.compile(template_event_form_rate);
        app.request.json(link_event, function (event_form_rate) {
          //console.log(event_form_rate.rateevents.user);
          for (var i = 0; i < event_form_rate.rateevents.length; i++) {

            var html = compiled_event_form_rate({
              star: event_form_rate.rateevents[i]["point"],
              image: event_form_rate.rateevents[i].user["image"],
              username: event_form_rate.rateevents[i].user["username"],
              created: event_form_rate.rateevents[i]["created"],
              name: event_form_rate.rateevents[i]["name"],
              description: event_form_rate.rateevents[i]["description"]
            });
            //console.log(html);
            $$('.list-form-rate[data-page="page-name-event-form-rate"]').append(html);
          }

        });

        //remove load page
        app.request.json(link_event, function (count) {
          //console.log(event_content);
          var lastItemIndex = $$('.list .list-form-rate li').length;
          if (count.comments.length == lastItemIndex) {
            $$('.infinite-scroll-preloader').remove();
          }
        });

      },
    }
  },
  {
    path: '/map_content_hotel/',
    url: './pages/map_content_hotel.html',
    on: {

      pageAfterIn: function (e, page) {


        var map;
        var centerMap = {
          lat: parseFloat(page.route.query.lat_content_hotel),
          lng: parseFloat(page.route.query.lng_content_hotel)
        };
        var markers = [];
        var directionsService;
        var directionsDisplay;
        var stepDisplay;
        var markersDirection = [];
        var spLuongMarkerTrongCSDL;
        var $$ = Dom7;
        var lat_cuoi = '';
        var lng_cuoi = '';
        var geocoder = new google.maps.Geocoder();
        var pos;


        function myMap() {
          map = new google.maps.Map(document.getElementById('googleMap2'), {
            zoom: 13,
            center: centerMap,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          directionsService = new google.maps.DirectionsService;
          directionsDisplay = new google.maps.DirectionsRenderer;
          var rendererOptions = {
            map: map,
            suppressMarkers: true
          }
          // infowindow. open(myMap, marker);
          directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

          // Instantiate an info window to hold step text.
          stepDisplay = new google.maps.InfoWindow();

          infoWindow = new google.maps.InfoWindow;

          sync();
        }
        myMap();

        function sync() {
          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }

          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }
          for (i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
          }
          directionsDisplay.setMap(null);

          markersDirection = [];




          lat_cuoi = page.route.query.lat_content_hotel;
          lng_cuoi = page.route.query.lng_content_hotel;


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
            directionsService.route({
              origin: {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
              },
              destination: {
                lat: parseFloat(lat_cuoi),
                lng: parseFloat(lng_cuoi)
              },
              travelMode: 'WALKING'
            }, function (response, status) {
              if (status === 'OK') {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                if (markers.length > 0)
                  for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                  }
                showSteps(response);
              } else {
                directionsDisplay.setMap(null);
                window.alert("Không tìm được đường đi!");
              }
            });
          }

        }

        function showSteps(directionResult) {
          var myRoute = directionResult.routes[0].legs[0];

          for (var i = 0; i < myRoute.steps.length; i++) {
            var icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + i + "|FF0000|000000";
            if (i == 0) {
              icon = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|car-dealer|00FFFF|FF0000";
            }
            var marker = new google.maps.Marker({
              position: myRoute.steps[i].start_point,
              map: map,
              icon: icon
            });
            attachInstructionText(marker, myRoute.steps[i].instructions);
            markersDirection.push(marker);
          }
          var marker = new google.maps.Marker({
            position: myRoute.steps[i - 1].end_point,
            map: map,
            icon: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|ADDE63"
          });
          markersDirection.push(marker);

          google.maps.event.trigger(markersDirection[0], "click");
        }

        function attachInstructionText(marker, text) {
          google.maps.event.addListener(marker, 'click', function () {
            // Open an info window when the marker is clicked on,
            // containing the text of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
          });
        }

      },
      pageInit: function (e, page) {
        // do something when page initialized
      },
    }
  },
  {
    path: '/map_content_place/',
    url: './pages/map_content_place.html',
    on: {

      pageAfterIn: function (e, page) {


        var map;
        var centerMap = {
          lat: parseFloat(page.route.query.lat_content_place),
          lng: parseFloat(page.route.query.lng_content_place)
        };
        var markers = [];
        var directionsService;
        var directionsDisplay;
        var stepDisplay;
        var markersDirection = [];
        var spLuongMarkerTrongCSDL;
        var $$ = Dom7;
        var lat_cuoi = '';
        var lng_cuoi = '';
        var geocoder = new google.maps.Geocoder();
        var pos;


        function myMap() {
          map = new google.maps.Map(document.getElementById('googleMap2'), {
            zoom: 13,
            center: centerMap,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          directionsService = new google.maps.DirectionsService;
          directionsDisplay = new google.maps.DirectionsRenderer;
          var rendererOptions = {
            map: map,
            suppressMarkers: true
          }
          // infowindow. open(myMap, marker);
          directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

          // Instantiate an info window to hold step text.
          stepDisplay = new google.maps.InfoWindow();

          infoWindow = new google.maps.InfoWindow;

          sync();
        }
        myMap();

        function sync() {
          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }

          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }
          for (i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
          }
          directionsDisplay.setMap(null);

          markersDirection = [];




          lat_cuoi = page.route.query.lat_content_place;
          lng_cuoi = page.route.query.lng_content_place;


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
            directionsService.route({
              origin: {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
              },
              destination: {
                lat: parseFloat(lat_cuoi),
                lng: parseFloat(lng_cuoi)
              },
              travelMode: 'WALKING'
            }, function (response, status) {
              if (status === 'OK') {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                if (markers.length > 0)
                  for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                  }
                showSteps(response);
              } else {
                directionsDisplay.setMap(null);
                window.alert("Không tìm được đường đi!");
              }
            });
          }

        }

        function showSteps(directionResult) {
          var myRoute = directionResult.routes[0].legs[0];

          for (var i = 0; i < myRoute.steps.length; i++) {
            var icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + i + "|FF0000|000000";
            if (i == 0) {
              icon = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|car-dealer|00FFFF|FF0000";
            }
            var marker = new google.maps.Marker({
              position: myRoute.steps[i].start_point,
              map: map,
              icon: icon
            });
            attachInstructionText(marker, myRoute.steps[i].instructions);
            markersDirection.push(marker);
          }
          var marker = new google.maps.Marker({
            position: myRoute.steps[i - 1].end_point,
            map: map,
            icon: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|ADDE63"
          });
          markersDirection.push(marker);

          google.maps.event.trigger(markersDirection[0], "click");
        }

        function attachInstructionText(marker, text) {
          google.maps.event.addListener(marker, 'click', function () {
            // Open an info window when the marker is clicked on,
            // containing the text of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
          });
        }

      },
      pageInit: function (e, page) {
        // do something when page initialized
      },
    }
  },
  {
    path: '/map_content_restaurant/',
    url: './pages/map_content_restaurant.html',
    on: {

      pageAfterIn: function (e, page) {


        var map;
        var centerMap = {
          lat: parseFloat(page.route.query.lat_content_restaurant),
          lng: parseFloat(page.route.query.lng_content_restaurant)
        };
        var markers = [];
        var directionsService;
        var directionsDisplay;
        var stepDisplay;
        var markersDirection = [];
        var spLuongMarkerTrongCSDL;
        var $$ = Dom7;
        var lat_cuoi = '';
        var lng_cuoi = '';
        var geocoder = new google.maps.Geocoder();
        var pos;


        function myMap() {
          map = new google.maps.Map(document.getElementById('googleMapContentRestaurant'), {
            zoom: 13,
            center: centerMap,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          directionsService = new google.maps.DirectionsService;
          directionsDisplay = new google.maps.DirectionsRenderer;
          var rendererOptions = {
            map: map,
            suppressMarkers: true
          }
          // infowindow. open(myMap, marker);
          directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

          // Instantiate an info window to hold step text.
          stepDisplay = new google.maps.InfoWindow();

          infoWindow = new google.maps.InfoWindow;

          sync();
        }
        myMap();

        function sync() {
          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }

          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }
          for (i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
          }
          directionsDisplay.setMap(null);

          markersDirection = [];




          lat_cuoi = page.route.query.lat_content_restaurant;
          lng_cuoi = page.route.query.lng_content_restaurant;


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
            directionsService.route({
              origin: {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
              },
              destination: {
                lat: parseFloat(lat_cuoi),
                lng: parseFloat(lng_cuoi)
              },
              travelMode: 'WALKING'
            }, function (response, status) {
              if (status === 'OK') {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                if (markers.length > 0)
                  for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                  }
                showSteps(response);
              } else {
                directionsDisplay.setMap(null);
                window.alert("Không tìm được đường đi!");
              }
            });
          }

        }

        function showSteps(directionResult) {
          var myRoute = directionResult.routes[0].legs[0];

          for (var i = 0; i < myRoute.steps.length; i++) {
            var icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + i + "|FF0000|000000";
            if (i == 0) {
              icon = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|car-dealer|00FFFF|FF0000";
            }
            var marker = new google.maps.Marker({
              position: myRoute.steps[i].start_point,
              map: map,
              icon: icon
            });
            attachInstructionText(marker, myRoute.steps[i].instructions);
            markersDirection.push(marker);
          }
          var marker = new google.maps.Marker({
            position: myRoute.steps[i - 1].end_point,
            map: map,
            icon: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|ADDE63"
          });
          markersDirection.push(marker);

          google.maps.event.trigger(markersDirection[0], "click");
        }

        function attachInstructionText(marker, text) {
          google.maps.event.addListener(marker, 'click', function () {
            // Open an info window when the marker is clicked on,
            // containing the text of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
          });
        }

      },
      pageInit: function (e, page) {
        // do something when page initialized
      },
    }
  },
  {
    path: '/content_region/',
    url: './pages/content_region.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var link_region = 'http://toithichdoc.com/regions/view/' + page.route.query.region_id + '.json';


        //du lieu title name
        var template_my_name_content_regions = $$('#my-name-region-header').html();
        var compiled_my_name_content_regions = Template7.compile(template_my_name_content_regions);
        app.request.json(link_region, function (region) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_my_name_content_regions({
            name_title: region.region["name"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-name-region-header"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_region_image = $$('#my-name-region-image').html();
        var compiled_region_image = Template7.compile(template_region_image);
        app.request.json(link_region, function (region_image) {
          //console.log(region_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_region_image({
            image: region_image.region["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-name-region-image"]').append(html);
          //}

        });



        //du lieu noi dung
        var template_region_description = $$('#my-name-region-description').html();
        var compiled_region_description = Template7.compile(template_region_description);
        app.request.json(link_region, function (region_description) {
          //console.log(region_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_region_description({
            content: region_description.region["descripton"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-region-description"]').append(html);
          //}

        });

        //du lieu slide
        var template_region_slide = $$('#my-name-region-slide').html();
        var compiled_region_slide = Template7.compile(template_region_slide);
        app.request.json(link_region, function (region_slide) {
          //console.log(region_slide.region.imageregions);
          for (var i = 0; i < region_slide.region.imageregions.length; i++) {

            var html = compiled_region_slide({
              image_slide: region_slide.region.imageregions[i]["image"]
            });
            //console.log(html);
            $$('.swiper-wrapper[data-page="page-name-region-slide"]').append(html);
          }

        });



        //du lieu places
        var template_index_place = $$('#my-home-place').html();
        var compiled_index_place = Template7.compile(template_index_place);
        app.request.json("http://toithichdoc.com/places/index.json", function (places) {
          places_sort = places.places.sort(function (a, b) {
            return a.id < b.id;
          });

          var avg_point;
          for (var i = 0; i < places_sort.length; i++) {
            var sum_place = 0;
            if (places_sort[i]["region_id"] == page.route.query.region_id) {
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
                  avg: avg_point
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

          var avg_point;
          hotels_sort = hotels.hotels.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < hotels_sort.length; i++) {
            var sum_hotel = 0;
            if (hotels_sort[i]["region_id"] == page.route.query.region_id) {
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
                  avg: avg_point
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
          restaurants_sort = restaurants.restaurants.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < restaurants_sort.length; i++) {
            var sum_restaurant = 0;
            if (restaurants_sort[i]["region_id"] == page.route.query.region_id) {
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
                  avg: avg_point
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

          for (var i = 0; i < vehicles_sort.length; i++) {
            var sum_vehicle = 0;
            if (vehicles_sort[i]["region_id"] == page.route.query.region_id) {
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
          }
        });

        //du lieu tour
        var template_index_tour = $$('#my-home-tour').html();
        var compiled_index_tour = Template7.compile(template_index_tour);
        app.request.json("http://toithichdoc.com/tours/index.json", function (tours) {
          tours_sort = tours.tours.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < tours_sort.length; i++) {
            var sum_tour = 0;
            if (tours_sort[i]["region_id"] == page.route.query.region_id) {
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
          }
        });
        //remove load page
        app.request.json("http://toithichdoc.com/tours/index.json", function (tours) {

          var lastItemIndex = $$('.swiper-wrapper[data-page="page-home-tour"] div').length;

          if (tours.tours.length == lastItemIndex) {
            $$('.infinite-scroll-preloader').remove();
          }
        });



      },
    }
  },
  {
    path: '/content_hotels/',
    url: './pages/content_hotels.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var link_hotel = 'http://toithichdoc.com/hotels/view/' + page.route.query.hotel_id + '.json';

        var id_hotel = page.route.query.hotel_id;
        //du lieu title name
        // DOM events for About popup
        $$('.popup-rate-hotel').on('popup:open', function (e, popup, page) {
          $$('.link-rate-hotel').on('click', function (e, page) {
            if (localStorage.user_id_save) {
              var formData = app.form.convertToData('#my-form');
              var star = $$("div input[type='radio']:checked").val();
              //alert(star);
              app.request({
                url: 'http://toithichdoc.com/ratehotels/add.json',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                  "user_id": localStorage.user_id_save,
                  "hotel_id": id_hotel,
                  "point": star,
                  "name": formData.name,
                  "description": formData.descripton
                }),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Thêm đánh giá thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });
            } else {
              app.dialog.create({
                title: 'Thông báo',
                text: 'Vui lòng đăng nhập',
                buttons: [{
                  text: 'Yes',
                }],
                verticalButtons: true,
              }).open();
            }
          });
        });

        //du lieu title name
        var template_my_name_content_hotels = $$('#my-name-hotel-header').html();
        var compiled_my_name_content_hotels = Template7.compile(template_my_name_content_hotels);
        app.request.json(link_hotel, function (hotel) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_my_name_content_hotels({
            name_title: hotel.hotel["name"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-name-hotel-header"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_hotel_image = $$('#my-name-hotel-image').html();
        var compiled_hotel_image = Template7.compile(template_hotel_image);
        app.request.json(link_hotel, function (hotel_image) {
          //console.log(hotel_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_hotel_image({
            image: hotel_image.hotel["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-name-hotel-image"]').append(html);
          //}

        });

        //du lieu hotel content
        var template_hotel_content = $$('#my-name-hotel-content').html();
        var compiled_hotel_content = Template7.compile(template_hotel_content);
        app.request.json(link_hotel, function (hotel_content) {
          //console.log(hotel_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_hotel_content({
            name: hotel_content.hotel["name"],
            count_rate: hotel_content.count_rate,
            avg: hotel_content.avg,
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-hotel-content"]').append(html);
          //}

        });

        //du lieu dat phong
        var template_book_room = $$('#my-room-hotel-content').html();
        var compiled_book_room = Template7.compile(template_book_room);
        app.request.json(link_hotel, function (hotel_room) {
          console.log(localStorage.user_id_save);
          console.log(hotel_room.hotel["user_id"]);
          var html = compiled_book_room({
            user_id_save: parseInt(localStorage.user_id_save),
            user_id: parseInt(hotel_room.hotel["user_id"]),
            hotel_id: hotel_room.hotel["id"],
            web: hotel_room.hotel["web"]
          });
          $$('.list[data-page="page-room-hotel-content"] ul').append(html);
          //}

        });

        //Du lieu rate
        var template_hotel_rate = $$('#my-name-hotel-rate').html();
        var compiled_hotel_rate = Template7.compile(template_hotel_rate);
        app.request.json(link_hotel, function (hotel_rate) {
          //console.log(hotel_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_hotel_rate({
            avg: hotel_rate.avg,
            count_rate: hotel_rate.count_rate,
            count_rate_5: hotel_rate.count_rate_5,
            count_rate_4: hotel_rate.count_rate_4,
            count_rate_3: hotel_rate.count_rate_3,
            count_rate_2: hotel_rate.count_rate_2,
            count_rate_1: hotel_rate.count_rate_1,
            percent_rate_5: hotel_rate.percent_rate_5,
            percent_rate_4: hotel_rate.percent_rate_4,
            percent_rate_3: hotel_rate.percent_rate_3,
            percent_rate_2: hotel_rate.percent_rate_2,
            percent_rate_1: hotel_rate.percent_rate_1
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-hotel-rate"]').append(html);
          //}

        });
        //du lieu gioi thieu
        var template_hotel_introduce = $$('#my-name-hotel-introduce').html();
        var compiled_hotel_introduce = Template7.compile(template_hotel_introduce);
        app.request.json(link_hotel, function (hotel_introduce) {
          //console.log(hotel_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_hotel_introduce({
            start: hotel_introduce.hotel["open"],
            end: hotel_introduce.hotel["close"],
            standard: hotel_introduce.hotel["standard"],
            web: hotel_introduce.hotel["web"],
            address: hotel_introduce.hotel["address"],
            price: hotel_introduce.hotel["price"],
            latitude: hotel_introduce.hotel["latitude"],
            longitude: hotel_introduce.hotel["longitude"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-hotel-introduce"]').append(html);
          //}

        });

        //du lieu noi dung
        var template_hotel_description = $$('#my-name-hotel-description').html();
        var compiled_hotel_description = Template7.compile(template_hotel_description);
        app.request.json(link_hotel, function (hotel_description) {
          //console.log(hotel_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_hotel_description({
            content: hotel_description.hotel["descripton"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-hotel-description"]').append(html);
          //}

        });

        //du lieu slide
        var template_hotel_slide = $$('#my-name-hotel-slide').html();
        var compiled_hotel_slide = Template7.compile(template_hotel_slide);
        app.request.json(link_hotel, function (hotel_slide) {
          //console.log(hotel_slide.hotel.imagehotels);
          for (var i = 0; i < hotel_slide.hotel.imagehotels.length; i++) {

            var html = compiled_hotel_slide({
              image_slide: hotel_slide.hotel.imagehotels[i]["image"]
            });
            //console.log(html);
            $$('.swiper-wrapper[data-page="page-name-hotel-slide"]').append(html);
          }

        });

        //du lieu comment
        var template_hotel_form_rate = $$('#my-name-hotel-form-rate').html();
        var compiled_hotel_form_rate = Template7.compile(template_hotel_form_rate);
        app.request.json(link_hotel, function (hotel_form_rate) {
          //console.log(hotel_form_rate.ratehotels.user);
          for (var i = 0; i < hotel_form_rate.ratehotels.length; i++) {

            var html = compiled_hotel_form_rate({
              image: hotel_form_rate.ratehotels[i].user["image"],
              username: hotel_form_rate.ratehotels[i].user["username"],
              created: hotel_form_rate.ratehotels[i]["created"],
              name: hotel_form_rate.ratehotels[i]["name"],
              description: hotel_form_rate.ratehotels[i]["description"]
            });
            //console.log(html);
            $$('.list-form-rate[data-page="page-name-hotel-form-rate"]').append(html);
          }

        });

        //du lieu lat lng truyen trang
        var template_hotel_lat_lng = $$('#my-content-event-lat-lng').html();
        var compiled_hotel_lat_lng = Template7.compile(template_hotel_lat_lng);
        app.request.json(link_hotel, function (hotel_lat_lng) {
          //console.log(hotel_form_rate.ratehotels.user);
          //for (var i = 0; i < hotel_form_rate.ratehotels.length; i++) {

          var html = compiled_hotel_lat_lng({
            lat_content_hotel: hotel_lat_lng.hotel["latitude"],
            lng_content_hotel: hotel_lat_lng.hotel["longitude"]
          });
          //console.log(html);
          $$('.lat-lng-hotel[data-page="page-lat-lng-hotel"]').append(html);
          //}

        });

        //nut luu bai viet
        var template_save = $$('#save-hotel').html();
        var compiled_save = Template7.compile(template_save);
        app.request.json(link_hotel, function (hotel) {
          var status_hotel = false;
          for (var i = 0; i < hotel.hotel.likehotels.length; i++) {
            if (hotel.hotel.likehotels[i]['user_id'] == localStorage.user_id_save) {
              status_hotel = true;
            } else {
              status_hotel = false;
            }

          }
          var html = compiled_save({
            status_hotel: status_hotel,
          });
          //console.log(html);
          $$('.save-hotel').append(html);
        });

        $$('.save-hotel').on('click', function () {
          if (localStorage.user_id_save) {
            $$('.save-hotel').html('');
            app.request.json(link_hotel, function (hotel) {
              var status1 = false;
              for (var i = 0; i < hotel.hotel.likehotels.length; i++) {
                if (hotel.hotel.likehotels[i]['user_id'] == localStorage.user_id_save) {
                  var link = 'http://toithichdoc.com/likehotels/delete/' + hotel.hotel.likehotels[i]['id'] + '.json';
                  status1 = true;
                } else {
                  status1 = false;
                }
              }
              if (status1) {

                alert(link);
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify(),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Hủy lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });

                var html = compiled_save({
                  status_hotel: false
                });
                $$('.save-hotel').append(html);

              } else {
                //console.log(likehotels.likehotels[i]);
                var link = 'http://toithichdoc.com/likehotels/add.json';
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "user_id": localStorage.user_id_save,
                    "hotel_id": page.route.query.hotel_id
                  }),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });
                var html = compiled_save({
                  status_hotel: true
                });
                $$('.save-hotel').append(html);

              }
            });
          } else {
            app.dialog.create({
              title: 'Thông báo',
              text: 'Vui lòng đăng nhập',
              buttons: [{
                text: 'Yes',
              }],
              verticalButtons: true,
            }).open();
          }
        });

        var lat1;
        var lng1;
        var map;
        var markers = [];
        var dt;
        // var centerMap = {
        //     lat: 12.267874,
        //     lng: 109.202376
        // };
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




        app.request.json(link_hotel, function (hotel_map) {
          var lathientai = hotel_map.hotel["latitude"];
          var lnghientai = hotel_map.hotel["longitude"];
          var name = hotel_map.hotel["name"];
          var standard = hotel_map.hotel["standard"];
          var open = hotel_map.hotel["open"];
          var close = hotel_map.hotel["close"];
          var centerMap = {
            lat: parseFloat(lathientai),
            lng: parseFloat(lnghientai)
          };

          function myMap() {
            map = new google.maps.Map(document.getElementById('googleMap'), {
              zoom: 13,
              center: centerMap,
              icon: {
                url: "./icons/hotel.png",
                scaledSize: new google.maps.Size(40, 40)
              },
              mapTypeId: google.maps.MapTypeId.ROADMAP

            });
            var marker = new google.maps.Marker({
              position: centerMap,

              map: map,
              animation: google.maps.Animation.BOUNCE
            });
            // google.maps.event.addListener(map, 'click', function(event) {

            // });
            var infowindow = new google.maps.InfoWindow({
              // content: name,
              content: '<strong>' + name + '</strong> ' + '<p></p>' + '<div> Số sao: ' + standard + '<div>' + '<p></p>' + '<div> Giờ mở cửa: ' + open + '<div>' + '<p></p>' + '<div> Giờ đóng cửa: ' + close + '<div>'
            });

            infowindow.open(map, marker);


          }
          myMap();





        });



      },

    }
  },
  {
    path: '/content_tour/',
    url: './pages/content_tour.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var link_tour = 'http://toithichdoc.com/tours/view/' + page.route.query.tour_id + '.json';

        var id_tour = page.route.query.tour_id;
        //du lieu title name
        // DOM events for About popup
        $$('.popup-rate-tour').on('popup:open', function (e, popup, page) {
          $$('.link-rate-tour').on('click', function (e, page) {
            if (localStorage.user_id_save) {
              var formData = app.form.convertToData('#my-form');
              var star = $$("div input[type='radio']:checked").val();
              //alert(star);
              app.request({
                url: 'http://toithichdoc.com/ratetours/add.json',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                  "user_id": localStorage.user_id_save,
                  "tour_id": id_tour,
                  "point": star,
                  "name": formData.name,
                  "description": formData.descripton
                }),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Thêm đánh giá thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                  app.closeModal("#popup-rate-tour");
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });
            } else {
              app.dialog.create({
                title: 'Thông báo',
                text: 'Vui lòng đăng nhập',
                buttons: [{
                  text: 'Yes',
                }],
                verticalButtons: true,
              }).open();
            }
          });
        });

        //nut luu bai viet
        var template_save = $$('#save-tour').html();
        var compiled_save = Template7.compile(template_save);
        app.request.json(link_tour, function (tour) {
          var status_tour = false;
          for (var i = 0; i < tour.tour.liketours.length; i++) {
            if (tour.tour.liketours[i]['user_id'] == localStorage.user_id_save) {
              status_tour = true;
            } else {
              status_tour = false;
            }

          }
          var html = compiled_save({
            status_tour: status_tour,
          });
          //console.log(html);
          $$('.save-tour').append(html);
        });

        $$('.save-tour').on('click', function () {
          if (localStorage.user_id_save) {
            $$('.save-tour').html('');
            app.request.json(link_tour, function (tour) {
              var status1 = false;
              for (var i = 0; i < tour.tour.liketours.length; i++) {
                if (tour.tour.liketours[i]['user_id'] == localStorage.user_id_save) {
                  var link = 'http://toithichdoc.com/liketours/delete/' + tour.tour.liketours[i]['id'] + '.json';
                  status1 = true;
                } else {
                  status1 = false;
                }
              }
              if (status1) {

                alert(link);
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify(),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Hủy lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });

                var html = compiled_save({
                  status_tour: false
                });
                $$('.save-tour').append(html);

              } else {
                //console.log(liketours.liketours[i]);
                var link = 'http://toithichdoc.com/liketours/add.json';
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "user_id": localStorage.user_id_save,
                    "tour_id": page.route.query.tour_id
                  }),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });
                var html = compiled_save({
                  status_tour: true
                });
                $$('.save-tour').append(html);

              }
            });
          } else {
            app.dialog.create({
              title: 'Thông báo',
              text: 'Vui lòng đăng nhập',
              buttons: [{
                text: 'Yes',
              }],
              verticalButtons: true,
            }).open();
          }
        });

        //du lieu title name
        var template_my_name_content_tours = $$('#my-name-tour-header').html();
        var compiled_my_name_content_tours = Template7.compile(template_my_name_content_tours);
        app.request.json(link_tour, function (tour) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_my_name_content_tours({
            name_title: tour.tour["name"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-name-tour-header"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_tour_image = $$('#my-name-tour-image').html();
        var compiled_tour_image = Template7.compile(template_tour_image);
        app.request.json(link_tour, function (tour_image) {
          //console.log(tour_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_tour_image({
            image: tour_image.tour["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-name-tour-image"]').append(html);
          //}

        });

        //du lieu dat tour
        var template_book_tour = $$('#my-manage-tour').html();
        var compiled_book_tour = Template7.compile(template_book_tour);
        app.request.json(link_tour, function (tour_tour) {
          var html = compiled_book_tour({
            user_id_save: parseInt(localStorage.user_id_save),
            user_id: parseInt(tour_tour.tour["user_id"]),
            tour_id: tour_tour.tour["id"],
            web: tour_tour.tour["web"]
          });
          $$('.list[data-page="page-manage-tour"] ul').append(html);
          //}

        });

        //du lieu tour content
        var template_tour_content = $$('#my-name-tour-content').html();
        var compiled_tour_content = Template7.compile(template_tour_content);
        app.request.json(link_tour, function (tour_content) {
          //console.log(tour_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_tour_content({
            name: tour_content.tour["name"],
            count_rate: tour_content.count_rate,
            avg: tour_content.avg,
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-tour-content"]').append(html);
          //}

        });


        //Du lieu rate
        var template_tour_rate = $$('#my-name-tour-rate').html();
        var compiled_tour_rate = Template7.compile(template_tour_rate);
        app.request.json(link_tour, function (tour_rate) {
          //console.log(tour_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_tour_rate({
            avg: tour_rate.avg,
            count_rate: tour_rate.count_rate,
            count_rate_5: tour_rate.count_rate_5,
            count_rate_4: tour_rate.count_rate_4,
            count_rate_3: tour_rate.count_rate_3,
            count_rate_2: tour_rate.count_rate_2,
            count_rate_1: tour_rate.count_rate_1,
            percent_rate_5: tour_rate.percent_rate_5,
            percent_rate_4: tour_rate.percent_rate_4,
            percent_rate_3: tour_rate.percent_rate_3,
            percent_rate_2: tour_rate.percent_rate_2,
            percent_rate_1: tour_rate.percent_rate_1
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-tour-rate"]').append(html);
          //}

        });

        //du lieu noi dung
        var template_tour_description = $$('#my-name-tour-description').html();
        var compiled_tour_description = Template7.compile(template_tour_description);
        app.request.json(link_tour, function (tour_description) {
          //console.log(tour_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_tour_description({
            content: tour_description.tour["descripton"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-tour-description"]').append(html);
          //}

        });

        //du lieu slide
        var template_tour_slide = $$('#my-name-tour-slide').html();
        var compiled_tour_slide = Template7.compile(template_tour_slide);
        app.request.json(link_tour, function (tour_slide) {
          //console.log(tour_slide.tour.imagetours);
          for (var i = 0; i < tour_slide.tour.imagetours.length; i++) {

            var html = compiled_tour_slide({
              image_slide: tour_slide.tour.imagetours[i]["image"]
            });
            //console.log(html);
            $$('.swiper-wrapper[data-page="page-name-tour-slide"]').append(html);
          }

        });

        //du lieu comment
        var template_tour_form_rate = $$('#my-name-tour-form-rate').html();
        var compiled_tour_form_rate = Template7.compile(template_tour_form_rate);
        app.request.json(link_tour, function (tour_form_rate) {
          //console.log(tour_form_rate.ratetours.user);
          for (var i = 0; i < tour_form_rate.ratetours.length; i++) {

            var html = compiled_tour_form_rate({
              image: tour_form_rate.ratetours[i].user["image"],
              username: tour_form_rate.ratetours[i].user["username"],
              created: tour_form_rate.ratetours[i]["created"],
              name: tour_form_rate.ratetours[i]["name"],
              description: tour_form_rate.ratetours[i]["description"]
            });
            //console.log(html);
            $$('.list-form-rate[data-page="page-name-tour-form-rate"]').append(html);
          }

        });
      },
    }
  },
  {
    path: '/manage_hotel/',
    url: './pages/manage_hotel.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        //var link_hotel = 'http://toithichdoc.com/hotels/view/' + page.route.query.hotel_id + '.json';
        var template_manage_hotel = $$('#my-manage-hotel').html();
        var compiled_manage_hotel = Template7.compile(template_manage_hotel);
        var html = compiled_manage_hotel({
          hotel_id: page.route.query.hotel_id
        });
        //console.log(html);
        $$('.list[data-page="page-manage-hotel"]').append(html);

      }
    }
  },
  {
    path: '/manage_tour/',
    url: './pages/manage_tour.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        //var link_tour = 'http://toithichdoc.com/tours/view/' + page.route.query.tour_id + '.json';
        var template_manage_tour = $$('#my-manage-tour').html();
        var compiled_manage_tour = Template7.compile(template_manage_tour);
        var html = compiled_manage_tour({
          tour_id: page.route.query.tour_id
        });
        //console.log(html);
        $$('.list[data-page="page-manage-tour"]').append(html);

      }
    }
  },
  {
    path: '/manage_vehicle/',
    url: './pages/manage_vehicle.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        //var link_vehicle = 'http://toithichdoc.com/vehicles/view/' + page.route.query.vehicle_id + '.json';
        var template_manage_vehicle = $$('#my-manage-vehicle').html();
        var compiled_manage_vehicle = Template7.compile(template_manage_vehicle);
        var html = compiled_manage_vehicle({
          vehicle_id: page.route.query.vehicle_id
        });
        //console.log(html);
        $$('.list[data-page="page-manage-vehicle"]').append(html);

      }
    }
  },
  {
    path: '/manage_hotel_image/',
    url: './pages/manage_hotel_image.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        //var link_hotel = 'http://toithichdoc.com/hotels/view/' + page.route.query.hotel_id + '.json';
        var template_manage_hotel = $$('#my-manage-image').html();
        var compiled_manage_hotel = Template7.compile(template_manage_hotel);
        var html = compiled_manage_hotel({
          image_id: page.route.query.image_id,
          hotel_id: page.route.query.hotel_id
        });
        //console.log(html);
        $$('.list[data-page="page-manage-image"]').append(html);

        var link_hotel_delete = 'http://toithichdoc.com/imagehotels/delete/' + page.route.query.image_id + '.json';
        $$('.delete-hotel-image').on('click', function (e, page) {
          app.request({
            url: link_hotel_delete,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
            }),
            success: function (data) {
              console.log(data);
              app.dialog.create({
                title: 'Thông báo',
                text: 'Xóa thành công',
                buttons: [{
                  text: 'Ok',
                }, ],
                verticalButtons: true,
              }).open();
              page.view.router.back({
                url: '/',
                force: true,
                ignoreCache: true
              });
            },
            error: function (xhr, status) {
              alert('Error: ' + JSON.stringify(xhr));
              alert('ErrorStatus: ' + JSON.stringify(status));
            }
          });
        });

      }
    }
  },
  {
    path: '/manage_room/',
    url: './pages/manage_room.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        //var link_hotel = 'http://toithichdoc.com/hotels/view/' + page.route.query.hotel_id + '.json';
        var template_manage_hotel = $$('#my-manage-room').html();
        var compiled_manage_hotel = Template7.compile(template_manage_hotel);
        var html = compiled_manage_hotel({
          room_id: page.route.query.room_id,
          hotel_id: page.route.query.hotel_id
        });
        //console.log(html);
        $$('.list[data-page="page-manage-room"]').append(html);

        $$('.list[data-page="page-manage-image"]').append(html);

        var link_room_delete = 'http://toithichdoc.com/rooms/delete/' + page.route.query.room_id + '.json';
        $$('.delete-hotel-image').on('click', function (e, page) {
          app.request({
            url: link_room_delete,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
            }),
            success: function (data) {
              console.log(data);
              app.dialog.create({
                title: 'Thông báo',
                text: 'Xóa thành công',
                buttons: [{
                  text: 'Ok',
                }, ],
                verticalButtons: true,
              }).open();
              page.view.router.back({
                url: '/',
                force: true,
                ignoreCache: true
              });
            },
            error: function (xhr, status) {
              alert('Error: ' + JSON.stringify(xhr));
              alert('ErrorStatus: ' + JSON.stringify(status));
            }
          });
        });
      }
    }
  },
  {
    path: '/content_vehicle/',
    url: './pages/content_vehicle.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var link_vehicle = 'http://toithichdoc.com/vehicles/view/' + page.route.query.vehicle_id + '.json';

        var id_vehicle = page.route.query.vehicle_id;
        //du lieu title name
        // DOM events for About popup
        $$('.popup-rate-vehicle').on('popup:open', function (e, popup, page) {
          $$('.link-rate-vehicle').on('click', function (e, page) {
            if (localStorage.user_id_save) {
              var formData = app.form.convertToData('#my-form');
              var star = $$("div input[type='radio']:checked").val();
              //alert(star);
              app.request({
                url: 'http://toithichdoc.com/ratevehicles/add.json',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                  "user_id": localStorage.user_id_save,
                  "vehicle_id": id_vehicle,
                  "point": star,
                  "name": formData.name,
                  "description": formData.descripton
                }),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Thêm đánh giá thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                  app.closeModal("#popup-rate-vehicle");
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });
            } else {
              app.dialog.create({
                title: 'Thông báo',
                text: 'Vui lòng đăng nhập',
                buttons: [{
                  text: 'Yes',
                }],
                verticalButtons: true,
              }).open();
            }
          });
        });

        //nut luu bai viet
        var template_save = $$('#save-vehicle').html();
        var compiled_save = Template7.compile(template_save);
        app.request.json(link_vehicle, function (vehicle) {
          var status_vehicle = false;
          for (var i = 0; i < vehicle.vehicle.likevehicles.length; i++) {
            if (vehicle.vehicle.likevehicles[i]['user_id'] == localStorage.user_id_save) {
              status_vehicle = true;
            } else {
              status_vehicle = false;
            }

          }
          var html = compiled_save({
            status_vehicle: status_vehicle,
          });
          //console.log(html);
          $$('.save-vehicle').append(html);
        });

        $$('.save-vehicle').on('click', function () {
          if (localStorage.user_id_save) {
            $$('.save-vehicle').html('');
            app.request.json(link_vehicle, function (vehicle) {
              var status1 = false;
              for (var i = 0; i < vehicle.vehicle.likevehicles.length; i++) {
                if (vehicle.vehicle.likevehicles[i]['user_id'] == localStorage.user_id_save) {
                  var link = 'http://toithichdoc.com/likevehicles/delete/' + vehicle.vehicle.likevehicles[i]['id'] + '.json';
                  status1 = true;
                } else {
                  status1 = false;
                }
              }
              if (status1) {

                alert(link);
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify(),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Hủy lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });

                var html = compiled_save({
                  status_vehicle: false
                });
                $$('.save-vehicle').append(html);

              } else {
                //console.log(likevehicles.likevehicles[i]);
                var link = 'http://toithichdoc.com/likevehicles/add.json';
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "user_id": localStorage.user_id_save,
                    "vehicle_id": page.route.query.vehicle_id
                  }),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });
                var html = compiled_save({
                  status_vehicle: true
                });
                $$('.save-vehicle').append(html);

              }
            });
          } else {
            app.dialog.create({
              title: 'Thông báo',
              text: 'Vui lòng đăng nhập',
              buttons: [{
                text: 'Yes',
              }],
              verticalButtons: true,
            }).open();
          }
        });

        //du lieu title name
        var template_my_name_content_vehicles = $$('#my-name-vehicle-header').html();
        var compiled_my_name_content_vehicles = Template7.compile(template_my_name_content_vehicles);
        app.request.json(link_vehicle, function (vehicle) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_my_name_content_vehicles({
            name_title: vehicle.vehicle["name"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-name-vehicle-header"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_vehicle_image = $$('#my-name-vehicle-image').html();
        var compiled_vehicle_image = Template7.compile(template_vehicle_image);
        app.request.json(link_vehicle, function (vehicle_image) {
          //console.log(vehicle_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_vehicle_image({
            image: vehicle_image.vehicle["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-name-vehicle-image"]').append(html);
          //}

        });

        //du lieu dat vehicle
        var template_book_vehicle = $$('#my-manage-vehicle').html();
        var compiled_book_vehicle = Template7.compile(template_book_vehicle);
        app.request.json(link_vehicle, function (vehicle_vehicle) {
          var html = compiled_book_vehicle({
            user_id_save: parseInt(localStorage.user_id_save),
            user_id: parseInt(vehicle_vehicle.vehicle["user_id"]),
            vehicle_id: vehicle_vehicle.vehicle["id"],
            web: vehicle_vehicle.vehicle["web"]
          });
          $$('.list[data-page="page-manage-vehicle"] ul').append(html);
          //}

        });

        //du lieu vehicle content
        var template_vehicle_content = $$('#my-name-vehicle-content').html();
        var compiled_vehicle_content = Template7.compile(template_vehicle_content);
        app.request.json(link_vehicle, function (vehicle_content) {
          //console.log(vehicle_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_vehicle_content({
            name: vehicle_content.vehicle["name"],
            count_rate: vehicle_content.count_rate,
            avg: vehicle_content.avg,
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-vehicle-content"]').append(html);
          //}

        });


        //Du lieu rate
        var template_vehicle_rate = $$('#my-name-vehicle-rate').html();
        var compiled_vehicle_rate = Template7.compile(template_vehicle_rate);
        app.request.json(link_vehicle, function (vehicle_rate) {
          //console.log(vehicle_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_vehicle_rate({
            avg: vehicle_rate.avg,
            count_rate: vehicle_rate.count_rate,
            count_rate_5: vehicle_rate.count_rate_5,
            count_rate_4: vehicle_rate.count_rate_4,
            count_rate_3: vehicle_rate.count_rate_3,
            count_rate_2: vehicle_rate.count_rate_2,
            count_rate_1: vehicle_rate.count_rate_1,
            percent_rate_5: vehicle_rate.percent_rate_5,
            percent_rate_4: vehicle_rate.percent_rate_4,
            percent_rate_3: vehicle_rate.percent_rate_3,
            percent_rate_2: vehicle_rate.percent_rate_2,
            percent_rate_1: vehicle_rate.percent_rate_1
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-vehicle-rate"]').append(html);
          //}

        });

        //du lieu noi dung
        var template_vehicle_description = $$('#my-name-vehicle-description').html();
        var compiled_vehicle_description = Template7.compile(template_vehicle_description);
        app.request.json(link_vehicle, function (vehicle_description) {
          //console.log(vehicle_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_vehicle_description({
            content: vehicle_description.vehicle["descripton"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-vehicle-description"]').append(html);
          //}

        });

        //du lieu slide
        var template_vehicle_slide = $$('#my-name-vehicle-slide').html();
        var compiled_vehicle_slide = Template7.compile(template_vehicle_slide);
        app.request.json(link_vehicle, function (vehicle_slide) {
          //console.log(vehicle_slide.vehicle.imagevehicles);
          for (var i = 0; i < vehicle_slide.vehicle.imagevehicles.length; i++) {

            var html = compiled_vehicle_slide({
              image_slide: vehicle_slide.vehicle.imagevehicles[i]["image"]
            });
            //console.log(html);
            $$('.swiper-wrapper[data-page="page-name-vehicle-slide"]').append(html);
          }

        });

        //du lieu comment
        var template_vehicle_form_rate = $$('#my-name-vehicle-form-rate').html();
        var compiled_vehicle_form_rate = Template7.compile(template_vehicle_form_rate);
        app.request.json(link_vehicle, function (vehicle_form_rate) {
          //console.log(vehicle_form_rate.ratevehicles.user);
          for (var i = 0; i < vehicle_form_rate.ratevehicles.length; i++) {

            var html = compiled_vehicle_form_rate({
              image: vehicle_form_rate.ratevehicles[i].user["image"],
              username: vehicle_form_rate.ratevehicles[i].user["username"],
              created: vehicle_form_rate.ratevehicles[i]["created"],
              name: vehicle_form_rate.ratevehicles[i]["name"],
              description: vehicle_form_rate.ratevehicles[i]["description"]
            });
            //console.log(html);
            $$('.list-form-rate[data-page="page-name-vehicle-form-rate"]').append(html);
          }

        });
      },
    }
  },
  {
    path: '/content_place/',
    url: './pages/content_place.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var link_place = 'http://toithichdoc.com/places/view/' + page.route.query.place_id + '.json';

        var id_place = page.route.query.place_id;
        //du lieu title name
        // DOM events for About popup
        $$('.popup-rate-place').on('popup:open', function (e, popup, page) {
          $$('.link-rate-place').on('click', function (e, page) {
            var formData = app.form.convertToData('#my-form');
            var star = $$("div input[type='radio']:checked").val();
            //alert(star);
            app.request({
              url: 'http://toithichdoc.com/rateplaces/add.json',
              method: 'POST',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "user_id": localStorage.user_id_save,
                "place_id": id_place,
                "point": star,
                "name": formData.name,
                "description": formData.descripton
              }),
              success: function (data) {
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Thêm đánh giá thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();
              },
              error: function (xhr, status) {
                alert('Lỗi: ' + JSON.stringify(xhr));
                alert('Thông báo lỗi: ' + JSON.stringify(status));
              }
            });
          });
        });

        //du lieu title name
        var template_my_name_content_places = $$('#my-name-place-header').html();
        var compiled_my_name_content_places = Template7.compile(template_my_name_content_places);
        app.request.json(link_place, function (place) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_my_name_content_places({
            name_title: place.place["name"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-name-place-header"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_place_image = $$('#my-name-place-image').html();
        var compiled_place_image = Template7.compile(template_place_image);
        app.request.json(link_place, function (place_image) {
          //console.log(place_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_place_image({
            image: place_image.place["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-name-place-image"]').append(html);
          //}

        });

        //du lieu place content
        var template_place_content = $$('#my-name-place-content').html();
        var compiled_place_content = Template7.compile(template_place_content);
        app.request.json(link_place, function (place_content) {
          //console.log(place_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_place_content({
            name: place_content.place["name"],
            count_rate: place_content.count_rate,
            avg: place_content.avg,
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-place-content"]').append(html);
          //}

        });


        //Du lieu rate
        var template_place_rate = $$('#my-name-place-rate').html();
        var compiled_place_rate = Template7.compile(template_place_rate);
        app.request.json(link_place, function (place_rate) {
          //console.log(place_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_place_rate({
            avg: place_rate.avg,
            count_rate: place_rate.count_rate,
            count_rate_5: place_rate.count_rate_5,
            count_rate_4: place_rate.count_rate_4,
            count_rate_3: place_rate.count_rate_3,
            count_rate_2: place_rate.count_rate_2,
            count_rate_1: place_rate.count_rate_1,
            percent_rate_5: place_rate.percent_rate_5,
            percent_rate_4: place_rate.percent_rate_4,
            percent_rate_3: place_rate.percent_rate_3,
            percent_rate_2: place_rate.percent_rate_2,
            percent_rate_1: place_rate.percent_rate_1
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-place-rate"]').append(html);
          //}

        });
        //du lieu gioi thieu
        var template_place_introduce = $$('#my-name-place-introduce').html();
        var compiled_place_introduce = Template7.compile(template_place_introduce);
        app.request.json(link_place, function (place_introduce) {
          //console.log(place_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_place_introduce({
            price: place_introduce.place["price"],
            latitude: place_introduce.place["latitude"],
            longitude: place_introduce.place["longitude"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-place-introduce"]').append(html);
          //}

        });

        //du lieu noi dung
        var template_place_description = $$('#my-name-place-description').html();
        var compiled_place_description = Template7.compile(template_place_description);
        app.request.json(link_place, function (place_description) {
          //console.log(place_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_place_description({
            content: place_description.place["descripton"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-place-description"]').append(html);
          //}

        });

        //du lieu slide
        var template_place_slide = $$('#my-name-place-slide').html();
        var compiled_place_slide = Template7.compile(template_place_slide);
        app.request.json(link_place, function (place_slide) {
          //console.log(place_slide.place.imageplaces);
          for (var i = 0; i < place_slide.place.imageplaces.length; i++) {

            var html = compiled_place_slide({
              image_slide: place_slide.place.imageplaces[i]["image"]
            });
            //console.log(html);
            $$('.swiper-wrapper[data-page="page-name-place-slide"]').append(html);
          }

        });

        //du lieu comment
        var template_place_form_rate = $$('#my-name-place-form-rate').html();
        var compiled_place_form_rate = Template7.compile(template_place_form_rate);
        app.request.json(link_place, function (place_form_rate) {
          //console.log(place_form_rate.rateplaces.user);
          for (var i = 0; i < place_form_rate.rateplaces.length; i++) {

            var html = compiled_place_form_rate({
              image: place_form_rate.rateplaces[i].user["image"],
              username: place_form_rate.rateplaces[i].user["username"],
              created: place_form_rate.rateplaces[i]["created"],
              name: place_form_rate.rateplaces[i]["name"],
              description: place_form_rate.rateplaces[i]["description"]
            });
            //console.log(html);
            $$('.list-form-rate[data-page="page-name-place-form-rate"]').append(html);
          }

        });

        //du lieu lat lng truyen trang
        var template_place_lat_lng = $$('#my-content-event-lat-lng').html();
        var compiled_place_lat_lng = Template7.compile(template_place_lat_lng);
        app.request.json(link_place, function (place_lat_lng) {
          //console.log(place_form_rate.rateplaces.user);
          //for (var i = 0; i < place_form_rate.rateplaces.length; i++) {

          var html = compiled_place_lat_lng({
            lat_content_place: place_lat_lng.place["latitude"],
            lng_content_place: place_lat_lng.place["longitude"]
          });
          //console.log(html);
          $$('.lat-lng-place[data-page="page-lat-lng-place"]').append(html);
          //}

        });

        var lat1;
        var lng1;
        var map;
        var markers = [];
        var dt;
        // var centerMap = {
        //     lat: 12.267874,
        //     lng: 109.202376
        // };
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




        app.request.json(link_place, function (place_map) {
          var lathientai = place_map.place["latitude"];
          var lnghientai = place_map.place["longitude"];
          var name = place_map.place["name"];
          var centerMap = {
            lat: parseFloat(lathientai),
            lng: parseFloat(lnghientai)
          };

          function myMap() {
            map = new google.maps.Map(document.getElementById('googleMap'), {
              zoom: 13,
              center: centerMap,
              icon: {
                url: "./icons/place.png",
                scaledSize: new google.maps.Size(40, 40)
              },
              mapTypeId: google.maps.MapTypeId.ROADMAP

            });
            var marker = new google.maps.Marker({
              position: centerMap,

              map: map,
              animation: google.maps.Animation.BOUNCE
            });
            // google.maps.event.addListener(map, 'click', function(event) {

            // });
            var infowindow = new google.maps.InfoWindow({
              // content: name,
              content: '<strong>' + name + '</strong> '
            });

            infowindow.open(map, marker);


          }
          myMap();
        });

      },
    }
  },
  {
    path: '/content_restaurant/',
    url: './pages/content_restaurant.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var link_restaurant = 'http://toithichdoc.com/restaurants/view/' + page.route.query.restaurant_id + '.json';

        var id_restaurant = page.route.query.restaurant_id;
        //du lieu title name
        // DOM events for About popup
        $$('.popup-rate-restaurant').on('popup:open', function (e, popup, page) {
          $$('.link-rate-restaurant').on('click', function (e, page) {
            if (localStorage.user_id_save) {
              var formData = app.form.convertToData('#my-form');
              var star = $$("div input[type='radio']:checked").val();
              //alert(star);
              app.request({
                url: 'http://toithichdoc.com/raterestaurants/add.json',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                  "user_id": localStorage.user_id_save,
                  "restaurant_id": id_restaurant,
                  "point": star,
                  "name": formData.name,
                  "description": formData.descripton
                }),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Thêm đánh giá thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });
            } else {
              app.dialog.create({
                title: 'Thông báo',
                text: 'Vui lòng đăng nhập',
                buttons: [{
                  text: 'Yes',
                }],
                verticalButtons: true,
              }).open();
            }
          });
        });

        //nut luu bai viet
        var template_save = $$('#save-restaurant').html();
        var compiled_save = Template7.compile(template_save);
        app.request.json(link_restaurant, function (restaurant) {
          var status_restaurant = false;
          for (var i = 0; i < restaurant.restaurant.likerestaurants.length; i++) {
            if (restaurant.restaurant.likerestaurants[i]['user_id'] == localStorage.user_id_save) {
              status_restaurant = true;
            } else {
              status_restaurant = false;
            }

          }
          var html = compiled_save({
            status_restaurant: status_restaurant,
          });
          //console.log(html);
          $$('.save-restaurant').append(html);
        });

        $$('.save-restaurant').on('click', function () {
          if (localStorage.user_id_save) {
            $$('.save-restaurant').html('');
            app.request.json(link_restaurant, function (restaurant) {
              var status1 = false;
              for (var i = 0; i < restaurant.restaurant.likerestaurants.length; i++) {
                if (restaurant.restaurant.likerestaurants[i]['user_id'] == localStorage.user_id_save) {
                  var link = 'http://toithichdoc.com/likerestaurants/delete/' + restaurant.restaurant.likerestaurants[i]['id'] + '.json';
                  status1 = true;
                } else {
                  status1 = false;
                }
              }
              if (status1) {

                alert(link);
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify(),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Hủy lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });

                var html = compiled_save({
                  status_restaurant: false
                });
                $$('.save-restaurant').append(html);

              } else {
                //console.log(likerestaurants.likerestaurants[i]);
                var link = 'http://toithichdoc.com/likerestaurants/add.json';
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "user_id": localStorage.user_id_save,
                    "restaurant_id": page.route.query.restaurant_id
                  }),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });
                var html = compiled_save({
                  status_restaurant: true
                });
                $$('.save-restaurant').append(html);

              }
            });
          } else {
            app.dialog.create({
              title: 'Thông báo',
              text: 'Vui lòng đăng nhập',
              buttons: [{
                text: 'Yes',
              }],
              verticalButtons: true,
            }).open();
          }
        });

        //du lieu title name
        var template_my_name_content_restaurants = $$('#my-name-restaurant-header').html();
        var compiled_my_name_content_restaurants = Template7.compile(template_my_name_content_restaurants);
        app.request.json(link_restaurant, function (restaurant) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_my_name_content_restaurants({
            name_title: restaurant.restaurant["name"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-name-restaurant-header"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_restaurant_image = $$('#my-name-restaurant-image').html();
        var compiled_restaurant_image = Template7.compile(template_restaurant_image);
        app.request.json(link_restaurant, function (restaurant_image) {
          //console.log(restaurant_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_restaurant_image({
            image: restaurant_image.restaurant["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-name-restaurant-image"]').append(html);
          //}

        });

        //du lieu restaurant content
        var template_restaurant_content = $$('#my-name-restaurant-content').html();
        var compiled_restaurant_content = Template7.compile(template_restaurant_content);
        app.request.json(link_restaurant, function (restaurant_content) {
          //console.log(restaurant_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_restaurant_content({
            name: restaurant_content.restaurant["name"],
            count_rate: restaurant_content.count_rate,
            avg: restaurant_content.avg,
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-restaurant-content"]').append(html);
          //}

        });

        //du lieu dat phong
        var template_book_room = $$('#my-room-restaurant-content').html();
        var compiled_book_room = Template7.compile(template_book_room);
        app.request.json(link_restaurant, function (restaurant_room) {
          var html = compiled_book_room({
            user_id_save: parseInt(localStorage.user_id_save),
            user_id: parseInt(restaurant_room.restaurant["user_id"]),
            restaurant_id: restaurant_room.restaurant["id"],
            web: restaurant_room.restaurant["web"]
          });
          $$('.list[data-page="page-room-restaurant-content"] ul').append(html);
          //}

        });

        //Du lieu rate
        var template_restaurant_rate = $$('#my-name-restaurant-rate').html();
        var compiled_restaurant_rate = Template7.compile(template_restaurant_rate);
        app.request.json(link_restaurant, function (restaurant_rate) {
          //console.log(restaurant_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_restaurant_rate({
            avg: restaurant_rate.avg,
            count_rate: restaurant_rate.count_rate,
            count_rate_5: restaurant_rate.count_rate_5,
            count_rate_4: restaurant_rate.count_rate_4,
            count_rate_3: restaurant_rate.count_rate_3,
            count_rate_2: restaurant_rate.count_rate_2,
            count_rate_1: restaurant_rate.count_rate_1,
            percent_rate_5: restaurant_rate.percent_rate_5,
            percent_rate_4: restaurant_rate.percent_rate_4,
            percent_rate_3: restaurant_rate.percent_rate_3,
            percent_rate_2: restaurant_rate.percent_rate_2,
            percent_rate_1: restaurant_rate.percent_rate_1
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-restaurant-rate"]').append(html);
          //}

        });
        //du lieu gioi thieu
        var template_restaurant_introduce = $$('#my-name-restaurant-introduce').html();
        var compiled_restaurant_introduce = Template7.compile(template_restaurant_introduce);
        app.request.json(link_restaurant, function (restaurant_introduce) {
          //console.log(restaurant_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_restaurant_introduce({
            start: restaurant_introduce.restaurant["open"],
            end: restaurant_introduce.restaurant["close"],
            standard: restaurant_introduce.restaurant["standard"],
            web: restaurant_introduce.restaurant["web"],
            address: restaurant_introduce.restaurant["address"],
            latitude: restaurant_introduce.restaurant["latitude"],
            longitude: restaurant_introduce.restaurant["longitude"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-restaurant-introduce"]').append(html);
          //}

        });

        //du lieu noi dung
        var template_restaurant_description = $$('#my-name-restaurant-description').html();
        var compiled_restaurant_description = Template7.compile(template_restaurant_description);
        app.request.json(link_restaurant, function (restaurant_description) {
          //console.log(restaurant_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_restaurant_description({
            content: restaurant_description.restaurant["descripton"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-name-restaurant-description"]').append(html);
          //}

        });

        //du lieu slide
        var template_restaurant_slide = $$('#my-name-restaurant-slide').html();
        var compiled_restaurant_slide = Template7.compile(template_restaurant_slide);
        app.request.json(link_restaurant, function (restaurant_slide) {
          //console.log(restaurant_slide.restaurant.imagerestaurants);
          for (var i = 0; i < restaurant_slide.restaurant.imagerestaurants.length; i++) {

            var html = compiled_restaurant_slide({
              image_slide: restaurant_slide.restaurant.imagerestaurants[i]["image"]
            });
            //console.log(html);
            $$('.swiper-wrapper[data-page="page-name-restaurant-slide"]').append(html);
          }

        });

        //du lieu comment
        var template_restaurant_form_rate = $$('#my-name-restaurant-form-rate').html();
        var compiled_restaurant_form_rate = Template7.compile(template_restaurant_form_rate);
        app.request.json(link_restaurant, function (restaurant_form_rate) {
          //console.log(restaurant_form_rate.raterestaurants.user);
          for (var i = 0; i < restaurant_form_rate.raterestaurants.length; i++) {

            var html = compiled_restaurant_form_rate({
              image: restaurant_form_rate.raterestaurants[i].user["image"],
              username: restaurant_form_rate.raterestaurants[i].user["username"],
              created: restaurant_form_rate.raterestaurants[i]["created"],
              name: restaurant_form_rate.raterestaurants[i]["name"],
              description: restaurant_form_rate.raterestaurants[i]["description"]
            });
            //console.log(html);
            $$('.list-form-rate[data-page="page-name-restaurant-form-rate"]').append(html);
          }

        });

        //du lieu lat lng truyen trang
        var template_restaurant_lat_lng = $$('#my-content-event-lat-lng').html();
        var compiled_restaurant_lat_lng = Template7.compile(template_restaurant_lat_lng);
        app.request.json(link_restaurant, function (restaurant_lat_lng) {
          //console.log(restaurant_form_rate.raterestaurants.user);
          //for (var i = 0; i < restaurant_form_rate.raterestaurants.length; i++) {

          var html = compiled_restaurant_lat_lng({
            lat_content_restaurant: restaurant_lat_lng.restaurant["latitude"],
            lng_content_restaurant: restaurant_lat_lng.restaurant["longitude"]
          });
          //console.log(html);
          $$('.lat-lng-restaurant[data-page="page-lat-lng-restaurant"]').append(html);
          //}

        });

        var lat1;
        var lng1;
        var map;
        var markers = [];
        var dt;
        // var centerMap = {
        //     lat: 12.267874,
        //     lng: 109.202376
        // };
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




        app.request.json(link_restaurant, function (restaurant_map) {
          var lathientai = restaurant_map.restaurant["latitude"];
          var lnghientai = restaurant_map.restaurant["longitude"];
          var name = restaurant_map.restaurant["name"];
          var standard = restaurant_map.restaurant["standard"];
          var open = restaurant_map.restaurant["open"];
          var close = restaurant_map.restaurant["close"];
          var centerMap = {
            lat: parseFloat(lathientai),
            lng: parseFloat(lnghientai)
          };

          function myMap() {
            map = new google.maps.Map(document.getElementById('googleMapContentRestaurant'), {
              zoom: 13,
              center: centerMap,
              icon: {
                url: "./icons/hotel.png",
                scaledSize: new google.maps.Size(40, 40)
              },
              mapTypeId: google.maps.MapTypeId.ROADMAP

            });
            var marker = new google.maps.Marker({
              position: centerMap,

              map: map,
              animation: google.maps.Animation.BOUNCE
            });
            // google.maps.event.addListener(map, 'click', function(event) {

            // });
            var infowindow = new google.maps.InfoWindow({
              // content: name,
              content: '<strong>' + name + '</strong> ' + '<p></p>' + '<div> Số sao: ' + standard + '<div>' + '<p></p>' + '<div> Giờ mở cửa: ' + open + '<div>' + '<p></p>' + '<div> Giờ đóng cửa: ' + close + '<div>'
            });

            infowindow.open(map, marker);


          }
          myMap();





        });



      },
    }
  },
  {
    path: '/list_hotels/',
    url: './pages/list_hotels.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var R = 6371;

        if (typeof (Number.prototype.toRad) === "undefined") {
          Number.prototype.toRad = function () {
            return this * Math.PI / 180;
          }
        }

        //du lieu hotel theo loai
        var template_typehotel = $$('#my-typehotel').html();
        var compiled_typehotel = Template7.compile(template_typehotel);
        app.request.json("http://toithichdoc.com/typehotels/index.json", function (typehotels) {
          //hotels_sort = hotel_feature.hotels.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typehotels.typehotels.length; i++) {
            var html = compiled_typehotel({
              typehotel_id: typehotels.typehotels[i]["id"],
              typehotel_name: typehotels.typehotels[i]["name"]
            });
            $$('.typehotel select').append(html);
          }
        });

        var template_typehotel_content = $$('#my-typehotel-content').html();
        var compiled_typehotel_content = Template7.compile(template_typehotel_content);
        app.request.json("http://toithichdoc.com/hotels/index.json", function (hotel_feature) {
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

            hotels_sort = hotel_feature.hotels.sort(function (a, b) {
              return a.id < b.id;
            });
            for (var i = 0; i < hotels_sort.length; i++) {
              var sum_hotel = 0;
              var avg_point;
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
                var sum_hotel = 0;
                var avg_point;
                if (hotels_sort[i].ratehotels.length > 0) {

                  for (var j = 0; j < hotels_sort[i].ratehotels.length; j++) {
                    sum_hotel += hotels_sort[i].ratehotels[j]["point"];
                  }
                  avg_point = (sum_hotel / hotels_sort[i].ratehotels.length).toFixed(1);
                } else {
                  avg_point = 0;
                }
                //console.log(avg_point);

                var html = compiled_typehotel_content({
                  created_hotel_feature: hotels_sort[i]["created"],
                  name_hotel_feature: hotels_sort[i]["name"],
                  image_hotel_feature: hotels_sort[i]["image"],
                  id_hotel_feature: hotels_sort[i]["id"],
                  price: hotels_sort[i]["price"],
                  description_hotel_feature: hotels_sort[i]["descripton"],
                  kc: d + ' km',
                  avg: avg_point,
                });

                $$('.typehotel-content[data-page="page-typehotel-content"]').append(html);
              }
            }
          }

        });

        $$('#typehotel').on('change', function () {
          $$('.typehotel-content[data-page="page-typehotel-content"]').html('');
          app.request.json("http://toithichdoc.com/hotels/index.json", function (hotel_feature) {
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

              hotels_sort = hotel_feature.hotels.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < hotels_sort.length; i++) {
                if (hotels_sort[i]["typehotel_id"] == $$('#typehotel').val()) {
                  var sum_hotel = 0;
                  var avg_point;
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
                    var html = compiled_typehotel_content({
                      created_hotel_feature: hotels_sort[i]["created"],
                      name_hotel_feature: hotels_sort[i]["name"],
                      image_hotel_feature: hotels_sort[i]["image"],
                      id_hotel_feature: hotels_sort[i]["id"],
                      price: hotels_sort[i]["price"],
                      description_hotel_feature: hotels_sort[i]["descripton"],
                      kc: d + ' km',
                      avg: avg_point,
                    });

                    $$('.typehotel-content[data-page="page-typehotel-content"]').append(html);
                  }
                }
              }
            }

          });

        });

        $$('#typeprice').on('change', function () {
          $$('.typehotel-content[data-page="page-typehotel-content"]').html('');

          if ($$('#typeprice').val() == '500') {
            app.request.json("http://toithichdoc.com/hotels/index.json", function (hotel_feature) {
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

                hotels_sort = hotel_feature.hotels.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < hotels_sort.length; i++) {
                  var sum_hotel = 0;
                  var avg_point;
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
                    if (hotels_sort[i]['price'] < 500000) {
                      if (hotels_sort[i].ratehotels.length > 0) {

                        for (var j = 0; j < hotels_sort[i].ratehotels.length; j++) {
                          sum_hotel += hotels_sort[i].ratehotels[j]["point"];
                        }
                        avg_point = (sum_hotel / hotels_sort[i].ratehotels.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typehotel_content({
                        created_hotel_feature: hotels_sort[i]["created"],
                        name_hotel_feature: hotels_sort[i]["name"],
                        image_hotel_feature: hotels_sort[i]["image"],
                        id_hotel_feature: hotels_sort[i]["id"],
                        price: hotels_sort[i]["price"],
                        description_hotel_feature: hotels_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typehotel-content[data-page="page-typehotel-content"]').append(html);
                    }
                  }
                }
              }

            });
          }
          if ($$('#typeprice').val() == '500-1000') {
            app.request.json("http://toithichdoc.com/hotels/index.json", function (hotel_feature) {
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

                hotels_sort = hotel_feature.hotels.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < hotels_sort.length; i++) {
                  var sum_hotel = 0;
                  var avg_point;
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
                    if (hotels_sort[i]['price'] > 499999 && hotels_sort[i]['price'] < 1000000) {
                      if (hotels_sort[i].ratehotels.length > 0) {

                        for (var j = 0; j < hotels_sort[i].ratehotels.length; j++) {
                          sum_hotel += hotels_sort[i].ratehotels[j]["point"];
                        }
                        avg_point = (sum_hotel / hotels_sort[i].ratehotels.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typehotel_content({
                        created_hotel_feature: hotels_sort[i]["created"],
                        name_hotel_feature: hotels_sort[i]["name"],
                        image_hotel_feature: hotels_sort[i]["image"],
                        id_hotel_feature: hotels_sort[i]["id"],
                        price: hotels_sort[i]["price"],
                        description_hotel_feature: hotels_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typehotel-content[data-page="page-typehotel-content"]').append(html);
                    }
                  }
                }
              }
            });
          }

          if ($$('#typeprice').val() == '1000-1500') {
            app.request.json("http://toithichdoc.com/hotels/index.json", function (hotel_feature) {
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

                hotels_sort = hotel_feature.hotels.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < hotels_sort.length; i++) {
                  var sum_hotel = 0;
                  var avg_point;
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
                    if (hotels_sort[i]['price'] > 999999 && hotels_sort[i]['price'] < 1500000) {
                      if (hotels_sort[i].ratehotels.length > 0) {

                        for (var j = 0; j < hotels_sort[i].ratehotels.length; j++) {
                          sum_hotel += hotels_sort[i].ratehotels[j]["point"];
                        }
                        avg_point = (sum_hotel / hotels_sort[i].ratehotels.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typehotel_content({
                        created_hotel_feature: hotels_sort[i]["created"],
                        name_hotel_feature: hotels_sort[i]["name"],
                        image_hotel_feature: hotels_sort[i]["image"],
                        id_hotel_feature: hotels_sort[i]["id"],
                        price: hotels_sort[i]["price"],
                        description_hotel_feature: hotels_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typehotel-content[data-page="page-typehotel-content"]').append(html);
                    }
                  }
                }
              }
            });
          }
          if ($$('#typeprice').val() == '1500-2000') {
            app.request.json("http://toithichdoc.com/hotels/index.json", function (hotel_feature) {
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

                hotels_sort = hotel_feature.hotels.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < hotels_sort.length; i++) {
                  var sum_hotel = 0;
                  var avg_point;
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
                    if (hotels_sort[i]['price'] > 1499999 && hotels_sort[i]['price'] < 2000000) {
                      if (hotels_sort[i].ratehotels.length > 0) {

                        for (var j = 0; j < hotels_sort[i].ratehotels.length; j++) {
                          sum_hotel += hotels_sort[i].ratehotels[j]["point"];
                        }
                        avg_point = (sum_hotel / hotels_sort[i].ratehotels.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typehotel_content({
                        created_hotel_feature: hotels_sort[i]["created"],
                        name_hotel_feature: hotels_sort[i]["name"],
                        image_hotel_feature: hotels_sort[i]["image"],
                        id_hotel_feature: hotels_sort[i]["id"],
                        price: hotels_sort[i]["price"],
                        description_hotel_feature: hotels_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typehotel-content[data-page="page-typehotel-content"]').append(html);
                    }
                  }
                }
              }
            });
          }
          if ($$('#typeprice').val() == '2000') {
            app.request.json("http://toithichdoc.com/hotels/index.json", function (hotel_feature) {
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

                hotels_sort = hotel_feature.hotels.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < hotels_sort.length; i++) {
                  var sum_hotel = 0;
                  var avg_point;
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
                    if (hotels_sort[i]['price'] > 1999999) {
                      if (hotels_sort[i].ratehotels.length > 0) {

                        for (var j = 0; j < hotels_sort[i].ratehotels.length; j++) {
                          sum_hotel += hotels_sort[i].ratehotels[j]["point"];
                        }
                        avg_point = (sum_hotel / hotels_sort[i].ratehotels.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typehotel_content({
                        created_hotel_feature: hotels_sort[i]["created"],
                        name_hotel_feature: hotels_sort[i]["name"],
                        image_hotel_feature: hotels_sort[i]["image"],
                        id_hotel_feature: hotels_sort[i]["id"],
                        price: hotels_sort[i]["price"],
                        description_hotel_feature: hotels_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typehotel-content[data-page="page-typehotel-content"]').append(html);
                    }
                  }
                }
              }
            });
          }

        });

      }
    }
  },
  {
    path: '/list_places/',
    url: './pages/list_places.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var R = 6371;

        if (typeof (Number.prototype.toRad) === "undefined") {
          Number.prototype.toRad = function () {
            return this * Math.PI / 180;
          }
        }

        //du lieu place theo loai
        var template_typeplace = $$('#my-typeplace').html();
        var compiled_typeplace = Template7.compile(template_typeplace);
        app.request.json("http://toithichdoc.com/typeplaces/index.json", function (typeplaces) {
          //places_sort = place_feature.places.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typeplaces.typeplaces.length; i++) {
            var html = compiled_typeplace({
              typeplace_id: typeplaces.typeplaces[i]["id"],
              typeplace_name: typeplaces.typeplaces[i]["name"]
            });
            $$('.typeplace select').append(html);
          }
        });

        var template_typeplace_content = $$('#my-typeplace-content').html();
        var compiled_typeplace_content = Template7.compile(template_typeplace_content);
        app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
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

            places_sort = place_feature.places.sort(function (a, b) {
              return a.id < b.id;
            });
            for (var i = 0; i < places_sort.length; i++) {
              var sum_place = 0;
              var avg_point;
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
                var sum_place = 0;
                var avg_point;
                if (places_sort[i].rateplaces.length > 0) {

                  for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                    sum_place += places_sort[i].rateplaces[j]["point"];
                  }
                  avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);
                } else {
                  avg_point = 0;
                }
                //console.log(avg_point);

                var html = compiled_typeplace_content({
                  created_place_feature: places_sort[i]["created"],
                  name_place_feature: places_sort[i]["name"],
                  image_place_feature: places_sort[i]["image"],
                  id_place_feature: places_sort[i]["id"],
                  price: places_sort[i]["price"],
                  description_place_feature: places_sort[i]["descripton"],
                  kc: d + ' km',
                  avg: avg_point,
                });

                $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);
              }
            }
          }

        });

        $$('#typeplace').on('change', function () {
          $$('.typeplace-content[data-page="page-typeplace-content"]').html('');
          app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
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

              places_sort = place_feature.places.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < places_sort.length; i++) {
                if (places_sort[i]["typeplace_id"] == $$('#typeplace').val()) {
                  var sum_place = 0;
                  var avg_point;
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
                    var html = compiled_typeplace_content({
                      created_place_feature: places_sort[i]["created"],
                      name_place_feature: places_sort[i]["name"],
                      image_place_feature: places_sort[i]["image"],
                      id_place_feature: places_sort[i]["id"],
                      price: places_sort[i]["price"],
                      description_place_feature: places_sort[i]["descripton"],
                      kc: d + ' km',
                      avg: avg_point,
                    });

                    $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);
                  }
                }
              }
            }

          });

        });

        $$('#typeprice').on('change', function () {
          $$('.typeplace-content[data-page="page-typeplace-content"]').html('');

          if ($$('#typeprice').val() == '250') {
            app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
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

                places_sort = place_feature.places.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < places_sort.length; i++) {
                  var sum_place = 0;
                  var avg_point;
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
                    if (places_sort[i]['price'] < 250000) {
                      if (places_sort[i].rateplaces.length > 0) {

                        for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                          sum_place += places_sort[i].rateplaces[j]["point"];
                        }
                        avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typeplace_content({
                        created_place_feature: places_sort[i]["created"],
                        name_place_feature: places_sort[i]["name"],
                        image_place_feature: places_sort[i]["image"],
                        id_place_feature: places_sort[i]["id"],
                        price: places_sort[i]["price"],
                        description_place_feature: places_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);
                    }
                  }
                }
              }

            });
          }
          if ($$('#typeprice').val() == '250-500') {
            app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
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

                places_sort = place_feature.places.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < places_sort.length; i++) {
                  var sum_place = 0;
                  var avg_point;
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
                    if (places_sort[i]['price'] > 249999 && places_sort[i]['price'] < 500000) {
                      if (places_sort[i].rateplaces.length > 0) {

                        for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                          sum_place += places_sort[i].rateplaces[j]["point"];
                        }
                        avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typeplace_content({
                        created_place_feature: places_sort[i]["created"],
                        name_place_feature: places_sort[i]["name"],
                        image_place_feature: places_sort[i]["image"],
                        id_place_feature: places_sort[i]["id"],
                        price: places_sort[i]["price"],
                        description_place_feature: places_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);
                    }
                  }
                }
              }
            });
          }

          if ($$('#typeprice').val() == '500-750') {
            app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
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

                places_sort = place_feature.places.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < places_sort.length; i++) {
                  var sum_place = 0;
                  var avg_point;
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
                    if (places_sort[i]['price'] > 499999 && places_sort[i]['price'] < 750000) {
                      if (places_sort[i].rateplaces.length > 0) {

                        for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                          sum_place += places_sort[i].rateplaces[j]["point"];
                        }
                        avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typeplace_content({
                        created_place_feature: places_sort[i]["created"],
                        name_place_feature: places_sort[i]["name"],
                        image_place_feature: places_sort[i]["image"],
                        id_place_feature: places_sort[i]["id"],
                        price: places_sort[i]["price"],
                        description_place_feature: places_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);
                    }
                  }
                }
              }
            });
          }
          if ($$('#typeprice').val() == '750-1000') {
            app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
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

                places_sort = place_feature.places.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < places_sort.length; i++) {
                  var sum_place = 0;
                  var avg_point;
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
                    if (places_sort[i]['price'] > 749999 && places_sort[i]['price'] < 1000000) {
                      if (places_sort[i].rateplaces.length > 0) {

                        for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                          sum_place += places_sort[i].rateplaces[j]["point"];
                        }
                        avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typeplace_content({
                        created_place_feature: places_sort[i]["created"],
                        name_place_feature: places_sort[i]["name"],
                        image_place_feature: places_sort[i]["image"],
                        id_place_feature: places_sort[i]["id"],
                        price: places_sort[i]["price"],
                        description_place_feature: places_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);
                    }
                  }
                }
              }
            });
          }
          if ($$('#typeprice').val() == '1000') {
            app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
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

                places_sort = place_feature.places.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < places_sort.length; i++) {
                  var sum_place = 0;
                  var avg_point;
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
                    if (places_sort[i]['price'] > 999999) {
                      if (places_sort[i].rateplaces.length > 0) {

                        for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                          sum_place += places_sort[i].rateplaces[j]["point"];
                        }
                        avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typeplace_content({
                        created_place_feature: places_sort[i]["created"],
                        name_place_feature: places_sort[i]["name"],
                        image_place_feature: places_sort[i]["image"],
                        id_place_feature: places_sort[i]["id"],
                        price: places_sort[i]["price"],
                        description_place_feature: places_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);
                    }
                  }
                }
              }
            });
          }

        });

        app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
          var lastItemIndex = $$('.typeplace-content[data-page="page-typeplace-content"] a').length;

          if (lastItemIndex) {
            $$('.infinite-scroll-preloader').remove();
          }
        });

      }
    }
  },
  {
    path: '/list_restaurants/',
    url: './pages/list_restaurants.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var R = 6371;

        if (typeof (Number.prototype.toRad) === "undefined") {
          Number.prototype.toRad = function () {
            return this * Math.PI / 180;
          }
        }

        //du lieu restaurant theo loai
        var template_typerestaurant = $$('#my-typerestaurant').html();
        var compiled_typerestaurant = Template7.compile(template_typerestaurant);
        app.request.json("http://toithichdoc.com/typerestaurants/index.json", function (typerestaurants) {
          //restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typerestaurants.typerestaurants.length; i++) {
            var html = compiled_typerestaurant({
              typerestaurant_id: typerestaurants.typerestaurants[i]["id"],
              typerestaurant_name: typerestaurants.typerestaurants[i]["name"]
            });
            $$('.typerestaurant select').append(html);
          }
        });

        var template_typerestaurant_content = $$('#my-typerestaurant-content').html();
        var compiled_typerestaurant_content = Template7.compile(template_typerestaurant_content);
        app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurant_feature) {
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

            restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) {
              return a.id < b.id;
            });
            for (var i = 0; i < restaurants_sort.length; i++) {
              var sum_restaurant = 0;
              var avg_point;
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
                var sum_restaurant = 0;
                var avg_point;
                if (restaurants_sort[i].raterestaurants.length > 0) {

                  for (var j = 0; j < restaurants_sort[i].raterestaurants.length; j++) {
                    sum_restaurant += restaurants_sort[i].raterestaurants[j]["point"];
                  }
                  avg_point = (sum_restaurant / restaurants_sort[i].raterestaurants.length).toFixed(1);
                } else {
                  avg_point = 0;
                }
                //console.log(avg_point);

                var html = compiled_typerestaurant_content({
                  created_restaurant_feature: restaurants_sort[i]["created"],
                  name_restaurant_feature: restaurants_sort[i]["name"],
                  image_restaurant_feature: restaurants_sort[i]["image"],
                  id_restaurant_feature: restaurants_sort[i]["id"],
                  price: restaurants_sort[i]["price"],
                  description_restaurant_feature: restaurants_sort[i]["descripton"],
                  kc: d + ' km',
                  avg: avg_point,
                });

                $$('.typerestaurant-content[data-page="page-typerestaurant-content"]').append(html);
              }
            }
          }

        });

        $$('#typerestaurant').on('change', function () {
          $$('.typerestaurant-content[data-page="page-typerestaurant-content"]').html('');
          app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurant_feature) {
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

              restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < restaurants_sort.length; i++) {
                if (restaurants_sort[i]["typerestaurant_id"] == $$('#typerestaurant').val()) {
                  var sum_restaurant = 0;
                  var avg_point;
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
                    var html = compiled_typerestaurant_content({
                      created_restaurant_feature: restaurants_sort[i]["created"],
                      name_restaurant_feature: restaurants_sort[i]["name"],
                      image_restaurant_feature: restaurants_sort[i]["image"],
                      id_restaurant_feature: restaurants_sort[i]["id"],
                      price: restaurants_sort[i]["price"],
                      description_restaurant_feature: restaurants_sort[i]["descripton"],
                      kc: d + ' km',
                      avg: avg_point,
                    });

                    $$('.typerestaurant-content[data-page="page-typerestaurant-content"]').append(html);
                  }
                }
              }
            }

          });

        });

        $$('#typeprice').on('change', function () {
          $$('.typerestaurant-content[data-page="page-typerestaurant-content"]').html('');

          if ($$('#typeprice').val() == '250') {
            app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurant_feature) {
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

                restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < restaurants_sort.length; i++) {
                  var sum_restaurant = 0;
                  var avg_point;
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
                    if (restaurants_sort[i]['price'] < 250000) {
                      if (restaurants_sort[i].raterestaurants.length > 0) {

                        for (var j = 0; j < restaurants_sort[i].raterestaurants.length; j++) {
                          sum_restaurant += restaurants_sort[i].raterestaurants[j]["point"];
                        }
                        avg_point = (sum_restaurant / restaurants_sort[i].raterestaurants.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typerestaurant_content({
                        created_restaurant_feature: restaurants_sort[i]["created"],
                        name_restaurant_feature: restaurants_sort[i]["name"],
                        image_restaurant_feature: restaurants_sort[i]["image"],
                        id_restaurant_feature: restaurants_sort[i]["id"],
                        price: restaurants_sort[i]["price"],
                        description_restaurant_feature: restaurants_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typerestaurant-content[data-page="page-typerestaurant-content"]').append(html);
                    }
                  }
                }
              }

            });
          }
          if ($$('#typeprice').val() == '250-500') {
            app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurant_feature) {
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

                restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < restaurants_sort.length; i++) {
                  var sum_restaurant = 0;
                  var avg_point;
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
                    if (restaurants_sort[i]['price'] > 249999 && restaurants_sort[i]['price'] < 500000) {
                      if (restaurants_sort[i].raterestaurants.length > 0) {

                        for (var j = 0; j < restaurants_sort[i].raterestaurants.length; j++) {
                          sum_restaurant += restaurants_sort[i].raterestaurants[j]["point"];
                        }
                        avg_point = (sum_restaurant / restaurants_sort[i].raterestaurants.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typerestaurant_content({
                        created_restaurant_feature: restaurants_sort[i]["created"],
                        name_restaurant_feature: restaurants_sort[i]["name"],
                        image_restaurant_feature: restaurants_sort[i]["image"],
                        id_restaurant_feature: restaurants_sort[i]["id"],
                        price: restaurants_sort[i]["price"],
                        description_restaurant_feature: restaurants_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typerestaurant-content[data-page="page-typerestaurant-content"]').append(html);
                    }
                  }
                }
              }
            });
          }

          if ($$('#typeprice').val() == '500-750') {
            app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurant_feature) {
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

                restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < restaurants_sort.length; i++) {
                  var sum_restaurant = 0;
                  var avg_point;
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
                    if (restaurants_sort[i]['price'] > 499999 && restaurants_sort[i]['price'] < 750000) {
                      if (restaurants_sort[i].raterestaurants.length > 0) {

                        for (var j = 0; j < restaurants_sort[i].raterestaurants.length; j++) {
                          sum_restaurant += restaurants_sort[i].raterestaurants[j]["point"];
                        }
                        avg_point = (sum_restaurant / restaurants_sort[i].raterestaurants.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typerestaurant_content({
                        created_restaurant_feature: restaurants_sort[i]["created"],
                        name_restaurant_feature: restaurants_sort[i]["name"],
                        image_restaurant_feature: restaurants_sort[i]["image"],
                        id_restaurant_feature: restaurants_sort[i]["id"],
                        price: restaurants_sort[i]["price"],
                        description_restaurant_feature: restaurants_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typerestaurant-content[data-page="page-typerestaurant-content"]').append(html);
                    }
                  }
                }
              }
            });
          }
          if ($$('#typeprice').val() == '750-1000') {
            app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurant_feature) {
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

                restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < restaurants_sort.length; i++) {
                  var sum_restaurant = 0;
                  var avg_point;
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
                    if (restaurants_sort[i]['price'] > 749999 && restaurants_sort[i]['price'] < 1000000) {
                      if (restaurants_sort[i].raterestaurants.length > 0) {

                        for (var j = 0; j < restaurants_sort[i].raterestaurants.length; j++) {
                          sum_restaurant += restaurants_sort[i].raterestaurants[j]["point"];
                        }
                        avg_point = (sum_restaurant / restaurants_sort[i].raterestaurants.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typerestaurant_content({
                        created_restaurant_feature: restaurants_sort[i]["created"],
                        name_restaurant_feature: restaurants_sort[i]["name"],
                        image_restaurant_feature: restaurants_sort[i]["image"],
                        id_restaurant_feature: restaurants_sort[i]["id"],
                        price: restaurants_sort[i]["price"],
                        description_restaurant_feature: restaurants_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typerestaurant-content[data-page="page-typerestaurant-content"]').append(html);
                    }
                  }
                }
              }
            });
          }
          if ($$('#typeprice').val() == '1000') {
            app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurant_feature) {
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

                restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < restaurants_sort.length; i++) {
                  var sum_restaurant = 0;
                  var avg_point;
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
                    if (restaurants_sort[i]['price'] > 999999) {
                      if (restaurants_sort[i].raterestaurants.length > 0) {

                        for (var j = 0; j < restaurants_sort[i].raterestaurants.length; j++) {
                          sum_restaurant += restaurants_sort[i].raterestaurants[j]["point"];
                        }
                        avg_point = (sum_restaurant / restaurants_sort[i].raterestaurants.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      var html = compiled_typerestaurant_content({
                        created_restaurant_feature: restaurants_sort[i]["created"],
                        name_restaurant_feature: restaurants_sort[i]["name"],
                        image_restaurant_feature: restaurants_sort[i]["image"],
                        id_restaurant_feature: restaurants_sort[i]["id"],
                        price: restaurants_sort[i]["price"],
                        description_restaurant_feature: restaurants_sort[i]["descripton"],
                        kc: d + ' km',
                        avg: avg_point,
                      });

                      $$('.typerestaurant-content[data-page="page-typerestaurant-content"]').append(html);
                    }
                  }
                }
              }
            });
          }

        });

      }
    }
  },
  {
    path: '/trip_calendar/',
    url: './pages/trip_calendar.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        //du lieu place theo loai
        var template_typeplace = $$('#my-typeplace').html();
        var compiled_typeplace = Template7.compile(template_typeplace);
        app.request.json("http://toithichdoc.com/typeplaces/index.json", function (typeplaces) {
          //places_sort = place_feature.places.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typeplaces.typeplaces.length; i++) {
            var html = compiled_typeplace({
              typeplace_id: typeplaces.typeplaces[i]["id"],
              typeplace_name: typeplaces.typeplaces[i]["name"]
            });
            $$('.typeplace select').append(html);
          }
        });

        //tao chuyen di tu dong
        var template_typeplace_content = $$('#my-trip-calendar').html();
        var compiled_typeplace_content = Template7.compile(template_typeplace_content);

        var template_calendar_statis_1 = $$('#my-calendar-statis-1').html();
        var compiled_calendar_statis_1 = Template7.compile(template_calendar_statis_1);
        var template_calendar_statis_2 = $$('#my-calendar-statis-2').html();
        var compiled_calendar_statis_2 = Template7.compile(template_calendar_statis_2);
        var template_calendar_statis_3 = $$('#my-calendar-statis-3').html();
        var compiled_calendar_statis_3 = Template7.compile(template_calendar_statis_3);
        var template_calendar_statis_4 = $$('#my-calendar-statis-4').html();
        var compiled_calendar_statis_4 = Template7.compile(template_calendar_statis_4);

        app.request.json("http://toithichdoc.com/places/index.json", function (places) {
          places_sort = places.places.sort(function (a, b) {
            return a.id < b.id;
          });


          $$('.convert-form-to-data').on('click', function () {
            $$('.trip-calendar[data-page="page-trip-calendar"]').html('');
            $$('.numeric-cell[data-page="calendar-statis-1"]').html('');
            $$('.numeric-cell[data-page="calendar-statis-2"]').html('');
            $$('.numeric-cell[data-page="calendar-statis-3"]').html('');
            $$('.numeric-cell[data-page="calendar-statis-4"]').html('');
            //$$('.title-date[data-page="title-date"]').html('');
            var formData = app.form.convertToData('#form-trip-calendar');
            var formData_date = formData.date * formData.countplace;
            var formData_money = formData.money;
            var list_place;
            var arr_place = [];
            //console.log(formData);
            for (var o = 0; o < formData.typeplace.length; o++) {
              for (var n = 0; n < places_sort.length; n++) {
                if (formData.typeplace[o] == places_sort[n]['typeplace_id']) {
                  arr_place.push(places_sort[n]);
                }
              }
            }

            for (var k = 0; k < formData_money; k++) {

              list_place = _.sampleSize(arr_place, formData_date);
              var sum_price = 0;

              for (var m = 0; m < list_place.length; m++) {
                sum_price += list_place[m]['price'];
              }

              if (sum_price < formData_money) {

                for (var i = 0; i < list_place.length; i++) {

                  if (list_place[i]["status"] == 1 && list_place[i]["featured"] == 1) {

                    var sum_place = 0;
                    var avg_point;
                    var list_date = 0;
                    var a = 0;
                    var sum_list_date;
                    if (list_place[i].rateplaces.length > 0) {

                      for (var j = 0; j < list_place[i].rateplaces.length; j++) {
                        sum_place += list_place[i].rateplaces[j]["point"];
                      }
                      avg_point = (sum_place / list_place[i].rateplaces.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    //console.log(avg_point);

                    if (i == 0) {
                      list_date = 1;
                      a = list_date;
                    } else {
                      if (i % formData.countplace == 0) {
                        list_date = i / formData.countplace + 1;
                        a = list_date;

                      } else {

                        list_date = a;
                      }

                    }

                    if (list_date == 0) {
                      sum_list_date = '';
                    } else {
                      sum_list_date = 'Ngày ' + list_date;
                    }


                    var html = compiled_typeplace_content({
                      date: sum_list_date,
                      created_place_feature: list_place[i]["created"],
                      name_place_feature: list_place[i]["name"],
                      image_place_feature: list_place[i]["image"],
                      id_place_feature: list_place[i]["id"],
                      price: list_place[i]["price"],
                      description_place_feature: list_place[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.trip-calendar[data-page="page-trip-calendar"]').append(html);


                  }
                  //}
                }

                break;
              } else {
                list_place = _.sampleSize(places_sort, formData_date);
              }
            }

            var html_calendar_statis_1 = compiled_calendar_statis_1({
              sum_calendar_place: list_place.length
            });

            $$('.numeric-cell[data-page="calendar-statis-1"]').append(html_calendar_statis_1);

            var html_calendar_statis_2 = compiled_calendar_statis_2({
              sum_calendar_money: sum_price
            });

            $$('.numeric-cell[data-page="calendar-statis-2"]').append(html_calendar_statis_2);

            var html_calendar_statis_3 = compiled_calendar_statis_3({
              sum_calendar_cheap: formData_money - sum_price
            });

            $$('.numeric-cell[data-page="calendar-statis-3"]').append(html_calendar_statis_3);

            var html_calendar_statis_4 = compiled_calendar_statis_4({
              avg_calendar_money: sum_price / formData.date
            });

            $$('.numeric-cell[data-page="calendar-statis-4"]').append(html_calendar_statis_4);

          });

        });


      }
    }
  },

  {
    path: '/hotel_calendar/',
    url: './pages/hotel_calendar.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        //du lieu hotel theo loai
        var template_typehotel = $$('#my-typehotel').html();
        var compiled_typehotel = Template7.compile(template_typehotel);
        app.request.json("http://toithichdoc.com/typehotels/index.json", function (typehotels) {
          //hotels_sort = hotel_feature.hotels.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typehotels.typehotels.length; i++) {
            var html = compiled_typehotel({
              typehotel_id: typehotels.typehotels[i]["id"],
              typehotel_name: typehotels.typehotels[i]["name"]
            });
            $$('.typehotel select').append(html);
          }
        });

        //tao chuyen di tu dong
        var template_typehotel_content = $$('#my-hotel-calendar').html();
        var compiled_typehotel_content = Template7.compile(template_typehotel_content);

        var template_calendar_statis_1 = $$('#my-calendar-statis-1').html();
        var compiled_calendar_statis_1 = Template7.compile(template_calendar_statis_1);


        app.request.json("http://toithichdoc.com/hotels/index.json", function (hotels) {
          hotels_sort = hotels.hotels.sort(function (a, b) {
            return a.id < b.id;
          });


          $$('.convert-form-to-data').on('click', function () {
            $$('.hotel-calendar[data-page="page-hotel-calendar"]').html('');
            $$('.numeric-cell[data-page="calendar-statis-1"]').html('');
            //$$('.title-date[data-page="title-date"]').html('');
            var formData = app.form.convertToData('#form-hotel-calendar');
            var formData_date = formData.date * formData.counthotel;
            var formData_money = formData.money;
            var list_hotel;
            var arr_hotel = [];


            //console.log(formData);
            for (var o = 0; o < formData.typehotel.length; o++) {
              for (var n = 0; n < hotels_sort.length; n++) {
                if (formData.typehotel[o] == hotels_sort[n]['typehotel_id']) {
                  arr_hotel.push(hotels_sort[n]);
                }
              }
            }
            //console.log(arr_hotel);

            for (var k = 0; k < formData_money; k++) {

              list_hotel = _.sampleSize(arr_hotel, formData.counthotel);
              var sum_price = 0;
              var arr_hotel_show = [];
              var dem = 0;
              for (var m = 0; m < list_hotel.length; m++) {
                if (list_hotel[m]['price'] * formData.date < formData_money) {
                  arr_hotel_show.push(list_hotel[m]);
                  if (arr_hotel_show.length == formData.counthotel) {
                    var arr_hotel_range = arr_hotel_show;
                  }

                } else {
                  list_hotel = _.sampleSize(arr_hotel, formData.counthotel);
                }

              }
              console.log(arr_hotel_range);
              if (arr_hotel_range.length == formData.counthotel) {
                // console.log(arr_hotel_range);

                for (var i = 0; i < arr_hotel_range.length; i++) {

                  if (arr_hotel_range[i]["status"] == 1 && arr_hotel_range[i]["featured"] == 1) {

                    var sum_hotel = 0;
                    var avg_point;
                    var list_date = 0;
                    var a = 0;
                    var sum_list_date;
                    if (arr_hotel_range[i].ratehotels.length > 0) {

                      for (var j = 0; j < arr_hotel_range[i].ratehotels.length; j++) {
                        sum_hotel += arr_hotel_range[i].ratehotels[j]["point"];
                      }
                      avg_point = (sum_hotel / arr_hotel_range[i].ratehotels.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }

                    var html = compiled_typehotel_content({
                      created_hotel_feature: arr_hotel_range[i]["created"],
                      name_hotel_feature: arr_hotel_range[i]["name"],
                      image_hotel_feature: arr_hotel_range[i]["image"],
                      id_hotel_feature: arr_hotel_range[i]["id"],
                      price: arr_hotel_range[i]["price"],
                      description_hotel_feature: arr_hotel_range[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.hotel-calendar[data-page="page-hotel-calendar"]').append(html);

                  }
                }

                break;
              } else {
                list_hotel = _.sampleSize(arr_hotel, formData.counthotel);
              }
            }

            var html_calendar_statis_1 = compiled_calendar_statis_1({
              sum_calendar_hotel: list_hotel.length
            });

            $$('.numeric-cell[data-page="calendar-statis-1"]').append(html_calendar_statis_1);

          });

        });

      }
    }
  },

  {
    path: '/restaurant_calendar/',
    url: './pages/restaurant_calendar.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        //du lieu restaurant theo loai
        var template_typerestaurant = $$('#my-typerestaurant').html();
        var compiled_typerestaurant = Template7.compile(template_typerestaurant);
        app.request.json("http://toithichdoc.com/typerestaurants/index.json", function (typerestaurants) {
          //restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typerestaurants.typerestaurants.length; i++) {
            var html = compiled_typerestaurant({
              typerestaurant_id: typerestaurants.typerestaurants[i]["id"],
              typerestaurant_name: typerestaurants.typerestaurants[i]["name"]
            });
            $$('.typerestaurant select').append(html);
          }
        });

        //tao chuyen di tu dong
        var template_typerestaurant_content = $$('#my-restaurant-calendar').html();
        var compiled_typerestaurant_content = Template7.compile(template_typerestaurant_content);

        var template_calendar_statis_1 = $$('#my-calendar-statis-1').html();
        var compiled_calendar_statis_1 = Template7.compile(template_calendar_statis_1);
        app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurants) {
          restaurants_sort = restaurants.restaurants.sort(function (a, b) {
            return a.id < b.id;
          });


          $$('.convert-form-to-data').on('click', function () {
            $$('.restaurant-calendar[data-page="page-restaurant-calendar"]').html('');
            $$('.numeric-cell[data-page="calendar-statis-1"]').html('');
            //$$('.title-date[data-page="title-date"]').html('');
            var formData = app.form.convertToData('#form-restaurant-calendar');
            var formData_date = formData.date * formData.countrestaurant;
            var formData_money = formData.money;
            var list_restaurant;
            var arr_restaurant = [];


            //console.log(formData);
            for (var o = 0; o < formData.typerestaurant.length; o++) {
              for (var n = 0; n < restaurants_sort.length; n++) {
                if (formData.typerestaurant[o] == restaurants_sort[n]['typerestaurant_id']) {
                  arr_restaurant.push(restaurants_sort[n]);
                }
              }
            }
            //console.log(arr_restaurant);

            for (var k = 0; k < formData_money; k++) {

              list_restaurant = _.sampleSize(arr_restaurant, formData.countrestaurant);
              var sum_price = 0;
              var arr_restaurant_show = [];
              var dem = 0;
              for (var m = 0; m < list_restaurant.length; m++) {
                if (list_restaurant[m]['price'] * formData.date < formData_money) {
                  arr_restaurant_show.push(list_restaurant[m]);
                  if (arr_restaurant_show.length == 2) {
                    var arr_restaurant_range = arr_restaurant_show;
                  }

                } else {
                  list_restaurant = _.sampleSize(arr_restaurant, formData.countrestaurant);
                }

              }
              console.log(arr_restaurant_range);
              if (arr_restaurant_range.length == formData.countrestaurant) {
                // console.log(arr_restaurant_range);

                for (var i = 0; i < arr_restaurant_range.length; i++) {

                  if (arr_restaurant_range[i]["status"] == 1 && arr_restaurant_range[i]["featured"] == 1) {

                    var sum_restaurant = 0;
                    var avg_point;
                    var list_date = 0;
                    var a = 0;
                    var sum_list_date;
                    if (arr_restaurant_range[i].raterestaurants.length > 0) {

                      for (var j = 0; j < arr_restaurant_range[i].raterestaurants.length; j++) {
                        sum_restaurant += arr_restaurant_range[i].raterestaurants[j]["point"];
                      }
                      avg_point = (sum_restaurant / arr_restaurant_range[i].raterestaurants.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }

                    var html = compiled_typerestaurant_content({
                      created_restaurant_feature: arr_restaurant_range[i]["created"],
                      name_restaurant_feature: arr_restaurant_range[i]["name"],
                      image_restaurant_feature: arr_restaurant_range[i]["image"],
                      id_restaurant_feature: arr_restaurant_range[i]["id"],
                      price: arr_restaurant_range[i]["price"],
                      description_restaurant_feature: arr_restaurant_range[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.restaurant-calendar[data-page="page-restaurant-calendar"]').append(html);

                  }
                }

                break;
              } else {
                list_restaurant = _.sampleSize(arr_restaurant, formData.countrestaurant);
              }
            }

            var html_calendar_statis_1 = compiled_calendar_statis_1({
              sum_calendar_restaurant: list_restaurant.length
            });

            $$('.numeric-cell[data-page="calendar-statis-1"]').append(html_calendar_statis_1);

          });

        });

      }
    }
  },

  {
    path: '/vehicle_calendar/',
    url: './pages/vehicle_calendar.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var map;
        var markers = [];
        var dt;
        var centerMap = {
          lat: 12.267874,
          lng: 109.202376
        };
        var lat_dau = '';
        var lng_dau = '';
        var lat_cuoi = '';
        var lng_cuoi = '';
        var lat_hientai;
        var lng_hientai;
        var pos;
        var srcData;
        var R = 6371;

        if (typeof (Number.prototype.toRad) === "undefined") {
          Number.prototype.toRad = function () {
            return this * Math.PI / 180;
          }
        }
        //du lieu vehicle theo loai
        var template_typevehicle = $$('#my-typevehicle').html();
        var compiled_typevehicle = Template7.compile(template_typevehicle);
        app.request.json("http://toithichdoc.com/typevehicles/index.json", function (typevehicles) {
          //vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typevehicles.typevehicles.length; i++) {
            var html = compiled_typevehicle({
              typevehicle_id: typevehicles.typevehicles[i]["id"],
              typevehicle_name: typevehicles.typevehicles[i]["name"]
            });
            $$('.typevehicle select').append(html);
          }
        });

        //map
        function myMap() {
          map = new google.maps.Map(document.getElementById('googleMap'), {
            zoom: 13,
            center: centerMap,

            mapTypeId: google.maps.MapTypeId.ROADMAP

          });

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

              var d;
              var dlat;
              var dlon;
              var dlat1;
              var dLat2;

              dLat = (latitude - e.latLng.lat() - 0).toRad();
              dLon = (longitude - e.latLng.lng() - 0).toRad();
              dLat1 = (e.latLng.lat() - 0).toRad();
              dLat2 = (latitude - 0).toRad();
              var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(dLat1) * Math.cos(dLat1) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              d = R * c;
              var n = parseFloat(d);
              d = Math.round(n * 1000) / 1000;
              document.getElementById("kc").value = d;
            }
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
              position: pos,
              map: map,
              animation: google.maps.Animation.BOUNCE
            });
            var infowindow = new google.maps.InfoWindow({
              content: "You are here!"
            });

            infowindow.open(map, marker);
            infoWindow.setPosition(pos);
            map.setCenter(pos);
          }, function () {
            handleLocationError(infoWindow, map.getCenter());
          });

        }
        myMap();

        //tao chuyen di tu dong
        var template_typevehicle_content = $$('#my-vehicle-calendar').html();
        var compiled_typevehicle_content = Template7.compile(template_typevehicle_content);

        var template_calendar_statis_1 = $$('#my-calendar-statis-1').html();
        var compiled_calendar_statis_1 = Template7.compile(template_calendar_statis_1);


        app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicles) {
          vehicles_sort = vehicles.vehicles.sort(function (a, b) {
            return a.id < b.id;
          });


          $$('.convert-form-to-data').on('click', function () {
            $$('.vehicle-calendar[data-page="page-vehicle-calendar"]').html('');
            $$('.numeric-cell[data-page="calendar-statis-1"]').html('');
            //$$('.title-date[data-page="title-date"]').html('');
            var formData = app.form.convertToData('#form-vehicle-calendar');
            var formData_date = formData.date * formData.countvehicle;
            var formData_money = formData.money;
            var list_vehicle;
            var arr_vehicle = [];


            //console.log(formData);
            for (var o = 0; o < formData.typevehicle.length; o++) {
              for (var n = 0; n < vehicles_sort.length; n++) {
                if (formData.typevehicle[o] == vehicles_sort[n]['typevehicle_id']) {
                  arr_vehicle.push(vehicles_sort[n]);
                }
              }
            }
            //console.log(arr_vehicle);

            for (var k = 0; k < formData_money; k++) {

              list_vehicle = _.sampleSize(arr_vehicle, formData.countvehicle);
              var sum_price = 0;
              var arr_vehicle_show = [];
              var dem = 0;
              for (var m = 0; m < list_vehicle.length; m++) {
                if (list_vehicle[m]['price'] * formData.date < formData_money) {
                  arr_vehicle_show.push(list_vehicle[m]);
                  if (arr_vehicle_show.length == formData.countvehicle) {
                    var arr_vehicle_range = arr_vehicle_show;
                  }

                } else {
                  list_vehicle = _.sampleSize(arr_vehicle, formData.countvehicle);
                }

              }
              console.log(arr_vehicle_range);
              if (arr_vehicle_range.length == formData.countvehicle) {
                // console.log(arr_vehicle_range);

                for (var i = 0; i < arr_vehicle_range.length; i++) {

                  if (arr_vehicle_range[i]["status"] == 1 && arr_vehicle_range[i]["featured"] == 1) {

                    var sum_vehicle = 0;
                    var avg_point;
                    var list_date = 0;
                    var a = 0;
                    var sum_list_date;
                    if (arr_vehicle_range[i].ratevehicles.length > 0) {

                      for (var j = 0; j < arr_vehicle_range[i].ratevehicles.length; j++) {
                        sum_vehicle += arr_vehicle_range[i].ratevehicles[j]["point"];
                      }
                      avg_point = (sum_vehicle / arr_vehicle_range[i].ratevehicles.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }

                    var html = compiled_typevehicle_content({
                      created_vehicle_feature: arr_vehicle_range[i]["created"],
                      name_vehicle_feature: arr_vehicle_range[i]["name"],
                      image_vehicle_feature: arr_vehicle_range[i]["image"],
                      id_vehicle_feature: arr_vehicle_range[i]["id"],
                      price: arr_vehicle_range[i]["price"],
                      description_vehicle_feature: arr_vehicle_range[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.vehicle-calendar[data-page="page-vehicle-calendar"]').append(html);

                  }
                }

                break;
              } else {
                list_vehicle = _.sampleSize(arr_vehicle, formData.countvehicle);
              }
            }

            var html_calendar_statis_1 = compiled_calendar_statis_1({
              sum_calendar_vehicle: list_vehicle.length
            });

            $$('.numeric-cell[data-page="calendar-statis-1"]').append(html_calendar_statis_1);

          });

        });

      }
    }
  },

  {
    path: '/list_tours/',
    url: './pages/list_tours.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        //du lieu place theo loai
        var template_typetour = $$('#my-typetour').html();
        var compiled_typetour = Template7.compile(template_typetour);
        app.request.json("http://toithichdoc.com/typetours/index.json", function (typetours) {
          //tours_sort = tour_feature.tours.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typetours.typetours.length; i++) {
            var html = compiled_typetour({
              typetour_id: typetours.typetours[i]["id"],
              typetour_name: typetours.typetours[i]["name"]
            });
            $$('.typetour select').append(html);
          }
        });

        var template_typetour_content = $$('#my-typetour-content').html();
        var compiled_typetour_content = Template7.compile(template_typetour_content);
        app.request.json("http://toithichdoc.com/tours/index.json", function (tour_feature) {
          tours_sort = tour_feature.tours.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < tours_sort.length; i++) {
            //if (tours_sort[i]["typetour_id"] == 1) {

            if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {
              var sum_tour = 0;
              var avg_point;
              if (tours_sort[i].ratetours.length > 0) {

                for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
                  sum_tour += tours_sort[i].ratetours[j]["point"];
                }
                avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);
              } else {
                avg_point = 0;
              }
              //console.log(avg_point);

              var html = compiled_typetour_content({
                created_tour_feature: tours_sort[i]["created"],
                name_tour_feature: tours_sort[i]["name"],
                image_tour_feature: tours_sort[i]["image"],
                id_tour_feature: tours_sort[i]["id"],
                price: tours_sort[i]["price"],
                description_tour_feature: tours_sort[i]["descripton"],
                avg: avg_point,
              });

              $$('.typetour-content[data-page="page-typetour-content"]').append(html);
            }
            //}
          }
        });

        $$('#typetour').on('change', function () {
          $$('.typetour-content[data-page="page-typetour-content"]').html('');
          app.request.json("http://toithichdoc.com/tours/index.json", function (tour_feature) {
            tours_sort = tour_feature.tours.sort(function (a, b) {
              return a.id < b.id;
            });
            for (var i = 0; i < tours_sort.length; i++) {

              if (tours_sort[i]["typetour_id"] == $$('#typetour').val()) {
                var sum_tour = 0;
                var avg_point;
                if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {

                  if (tours_sort[i].ratetours.length > 0) {

                    for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
                      sum_tour += tours_sort[i].ratetours[j]["point"];
                    }
                    avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);
                  } else {
                    avg_point = 0;
                  }
                  var html = compiled_typetour_content({
                    created_tour_feature: tours_sort[i]["created"],
                    name_tour_feature: tours_sort[i]["name"],
                    image_tour_feature: tours_sort[i]["image"],
                    id_tour_feature: tours_sort[i]["id"],
                    price: tours_sort[i]["price"],
                    description_tour_feature: tours_sort[i]["descripton"],
                    avg: avg_point,
                  });

                  $$('.typetour-content[data-page="page-typetour-content"]').append(html);
                }
              }
            }
          });

        });

        $$('#typeprice').on('change', function () {
          $$('.typetour-content[data-page="page-typetour-content"]').html('');

          if ($$('#typeprice').val() == '500') {
            app.request.json("http://toithichdoc.com/tours/index.json", function (tour_feature) {
              tours_sort = tour_feature.tours.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < tours_sort.length; i++) {

                //if (tours_sort[i]["typetour_id"] == $$('#typetour').val()) {
                var sum_tour = 0;
                var avg_point;
                if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {
                  if (tours_sort[i]['price'] < 500000) {
                    if (tours_sort[i].ratetours.length > 0) {

                      for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
                        sum_tour += tours_sort[i].ratetours[j]["point"];
                      }
                      avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typetour_content({
                      created_tour_feature: tours_sort[i]["created"],
                      name_tour_feature: tours_sort[i]["name"],
                      image_tour_feature: tours_sort[i]["image"],
                      id_tour_feature: tours_sort[i]["id"],
                      price: tours_sort[i]["price"],
                      description_tour_feature: tours_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typetour-content[data-page="page-typetour-content"]').append(html);
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '500-1000') {
            app.request.json("http://toithichdoc.com/tours/index.json", function (tour_feature) {
              tours_sort = tour_feature.tours.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < tours_sort.length; i++) {

                //if (tours_sort[i]["typetour_id"] == $$('#typetour').val()) {
                var sum_tour = 0;
                var avg_point;
                if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {
                  if (tours_sort[i]['price'] > 499999 && tours_sort[i]['price'] < 1000000) {
                    if (tours_sort[i].ratetours.length > 0) {

                      for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
                        sum_tour += tours_sort[i].ratetours[j]["point"];
                      }
                      avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typetour_content({
                      created_tour_feature: tours_sort[i]["created"],
                      name_tour_feature: tours_sort[i]["name"],
                      image_tour_feature: tours_sort[i]["image"],
                      id_tour_feature: tours_sort[i]["id"],
                      price: tours_sort[i]["price"],
                      description_tour_feature: tours_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typetour-content[data-page="page-typetour-content"]').append(html);
                  }
                }
                //}
              }
            });
          }

          if ($$('#typeprice').val() == '1000-1500') {
            app.request.json("http://toithichdoc.com/tours/index.json", function (tour_feature) {
              tours_sort = tour_feature.tours.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < tours_sort.length; i++) {

                //if (tours_sort[i]["typetour_id"] == $$('#typetour').val()) {
                var sum_tour = 0;
                var avg_point;
                if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {
                  if (tours_sort[i]['price'] > 999999 && tours_sort[i]['price'] < 1500000) {
                    if (tours_sort[i].ratetours.length > 0) {

                      for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
                        sum_tour += tours_sort[i].ratetours[j]["point"];
                      }
                      avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typetour_content({
                      created_tour_feature: tours_sort[i]["created"],
                      name_tour_feature: tours_sort[i]["name"],
                      image_tour_feature: tours_sort[i]["image"],
                      id_tour_feature: tours_sort[i]["id"],
                      price: tours_sort[i]["price"],
                      description_tour_feature: tours_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typetour-content[data-page="page-typetour-content"]').append(html);
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '1500-2000') {
            app.request.json("http://toithichdoc.com/tours/index.json", function (tour_feature) {
              tours_sort = tour_feature.tours.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < tours_sort.length; i++) {

                //if (tours_sort[i]["typetour_id"] == $$('#typetour').val()) {
                var sum_tour = 0;
                var avg_point;
                if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {
                  if (tours_sort[i]['price'] > 1499999 && tours_sort[i]['price'] < 2000000) {
                    if (tours_sort[i].ratetours.length > 0) {

                      for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
                        sum_tour += tours_sort[i].ratetours[j]["point"];
                      }
                      avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typetour_content({
                      created_tour_feature: tours_sort[i]["created"],
                      name_tour_feature: tours_sort[i]["name"],
                      image_tour_feature: tours_sort[i]["image"],
                      id_tour_feature: tours_sort[i]["id"],
                      price: tours_sort[i]["price"],
                      description_tour_feature: tours_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typetour-content[data-page="page-typetour-content"]').append(html);
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '2000') {
            app.request.json("http://toithichdoc.com/tours/index.json", function (tour_feature) {
              tours_sort = tour_feature.tours.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < tours_sort.length; i++) {

                //if (tours_sort[i]["typetour_id"] == $$('#typetour').val()) {
                var sum_tour = 0;
                var avg_point;
                if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {
                  if (tours_sort[i]['price'] > 1999999) {
                    if (tours_sort[i].ratetours.length > 0) {

                      for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
                        sum_tour += tours_sort[i].ratetours[j]["point"];
                      }
                      avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typetour_content({
                      created_tour_feature: tours_sort[i]["created"],
                      name_tour_feature: tours_sort[i]["name"],
                      image_tour_feature: tours_sort[i]["image"],
                      id_tour_feature: tours_sort[i]["id"],
                      price: tours_sort[i]["price"],
                      description_tour_feature: tours_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typetour-content[data-page="page-typetour-content"]').append(html);
                  }
                }
                //}
              }
            });
          }

        });
      }
    }
  },
  {
    path: '/list_vehicles/',
    url: './pages/list_vehicles.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        //du lieu vehicle theo loai
        var template_typevehicle = $$('#my-typevehicle').html();
        var compiled_typevehicle = Template7.compile(template_typevehicle);
        app.request.json("http://toithichdoc.com/typevehicles/index.json", function (typevehicles) {
          //vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typevehicles.typevehicles.length; i++) {
            var html = compiled_typevehicle({
              typevehicle_id: typevehicles.typevehicles[i]["id"],
              typevehicle_name: typevehicles.typevehicles[i]["name"]
            });
            $$('.typevehicle select').append(html);
          }
        });

        var template_typevehicle_content = $$('#my-typevehicle-content').html();
        var compiled_typevehicle_content = Template7.compile(template_typevehicle_content);
        app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicle_feature) {
          vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < vehicles_sort.length; i++) {
            //if (vehicles_sort[i]["typevehicle_id"] == 1) {

            if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {
              var sum_vehicle = 0;
              var avg_point;
              if (vehicles_sort[i].ratevehicles.length > 0) {

                for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
                  sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];
                }
                avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);
              } else {
                avg_point = 0;
              }
              //console.log(avg_point);

              var html = compiled_typevehicle_content({
                created_vehicle_feature: vehicles_sort[i]["created"],
                name_vehicle_feature: vehicles_sort[i]["name"],
                image_vehicle_feature: vehicles_sort[i]["image"],
                id_vehicle_feature: vehicles_sort[i]["id"],
                price: vehicles_sort[i]["price"],
                description_vehicle_feature: vehicles_sort[i]["descripton"],
                avg: avg_point,
              });

              $$('.typevehicle-content[data-page="page-typevehicle-content"]').append(html);
            }
            //}
          }
        });

        $$('#typevehicle').on('change', function () {
          $$('.typevehicle-content[data-page="page-typevehicle-content"]').html('');
          app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicle_feature) {
            vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) {
              return a.id < b.id;
            });
            for (var i = 0; i < vehicles_sort.length; i++) {

              if (vehicles_sort[i]["typevehicle_id"] == $$('#typevehicle').val()) {
                var sum_vehicle = 0;
                var avg_point;
                if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {

                  if (vehicles_sort[i].ratevehicles.length > 0) {

                    for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
                      sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];
                    }
                    avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);
                  } else {
                    avg_point = 0;
                  }
                  var html = compiled_typevehicle_content({
                    created_vehicle_feature: vehicles_sort[i]["created"],
                    name_vehicle_feature: vehicles_sort[i]["name"],
                    image_vehicle_feature: vehicles_sort[i]["image"],
                    id_vehicle_feature: vehicles_sort[i]["id"],
                    price: vehicles_sort[i]["price"],
                    description_vehicle_feature: vehicles_sort[i]["descripton"],
                    avg: avg_point,
                  });

                  $$('.typevehicle-content[data-page="page-typevehicle-content"]').append(html);
                }
              }
            }
          });

        });

        $$('#typeprice').on('change', function () {
          $$('.typevehicle-content[data-page="page-typevehicle-content"]').html('');

          if ($$('#typeprice').val() == '50') {
            app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicle_feature) {
              vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < vehicles_sort.length; i++) {

                //if (vehicles_sort[i]["typevehicle_id"] == $$('#typevehicle').val()) {
                var sum_vehicle = 0;
                var avg_point;
                if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {
                  if (vehicles_sort[i]['price'] < 50000) {
                    if (vehicles_sort[i].ratevehicles.length > 0) {

                      for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
                        sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];
                      }
                      avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typevehicle_content({
                      created_vehicle_feature: vehicles_sort[i]["created"],
                      name_vehicle_feature: vehicles_sort[i]["name"],
                      image_vehicle_feature: vehicles_sort[i]["image"],
                      id_vehicle_feature: vehicles_sort[i]["id"],
                      price: vehicles_sort[i]["price"],
                      description_vehicle_feature: vehicles_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typevehicle-content[data-page="page-typevehicle-content"]').append(html);
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '50-100') {
            app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicle_feature) {
              vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < vehicles_sort.length; i++) {

                //if (vehicles_sort[i]["typevehicle_id"] == $$('#typevehicle').val()) {
                var sum_vehicle = 0;
                var avg_point;
                if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {
                  if (vehicles_sort[i]['price'] > 49999 && vehicles_sort[i]['price'] < 100000) {
                    if (vehicles_sort[i].ratevehicles.length > 0) {

                      for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
                        sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];
                      }
                      avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typevehicle_content({
                      created_vehicle_feature: vehicles_sort[i]["created"],
                      name_vehicle_feature: vehicles_sort[i]["name"],
                      image_vehicle_feature: vehicles_sort[i]["image"],
                      id_vehicle_feature: vehicles_sort[i]["id"],
                      price: vehicles_sort[i]["price"],
                      description_vehicle_feature: vehicles_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typevehicle-content[data-page="page-typevehicle-content"]').append(html);
                  }
                }
                //}
              }
            });
          }

          if ($$('#typeprice').val() == '100-150') {
            app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicle_feature) {
              vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < vehicles_sort.length; i++) {

                //if (vehicles_sort[i]["typevehicle_id"] == $$('#typevehicle').val()) {
                var sum_vehicle = 0;
                var avg_point;
                if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {
                  if (vehicles_sort[i]['price'] > 99999 && vehicles_sort[i]['price'] < 150000) {
                    if (vehicles_sort[i].ratevehicles.length > 0) {

                      for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
                        sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];
                      }
                      avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typevehicle_content({
                      created_vehicle_feature: vehicles_sort[i]["created"],
                      name_vehicle_feature: vehicles_sort[i]["name"],
                      image_vehicle_feature: vehicles_sort[i]["image"],
                      id_vehicle_feature: vehicles_sort[i]["id"],
                      price: vehicles_sort[i]["price"],
                      description_vehicle_feature: vehicles_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typevehicle-content[data-page="page-typevehicle-content"]').append(html);
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '150-200') {
            app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicle_feature) {
              vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < vehicles_sort.length; i++) {

                //if (vehicles_sort[i]["typevehicle_id"] == $$('#typevehicle').val()) {
                var sum_vehicle = 0;
                var avg_point;
                if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {
                  if (vehicles_sort[i]['price'] > 149999 && vehicles_sort[i]['price'] < 200000) {
                    if (vehicles_sort[i].ratevehicles.length > 0) {

                      for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
                        sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];
                      }
                      avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typevehicle_content({
                      created_vehicle_feature: vehicles_sort[i]["created"],
                      name_vehicle_feature: vehicles_sort[i]["name"],
                      image_vehicle_feature: vehicles_sort[i]["image"],
                      id_vehicle_feature: vehicles_sort[i]["id"],
                      price: vehicles_sort[i]["price"],
                      description_vehicle_feature: vehicles_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typevehicle-content[data-page="page-typevehicle-content"]').append(html);
                  }
                }
                //}
              }
            });
          }
          if ($$('#typeprice').val() == '200') {
            app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicle_feature) {
              vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < vehicles_sort.length; i++) {

                //if (vehicles_sort[i]["typevehicle_id"] == $$('#typevehicle').val()) {
                var sum_vehicle = 0;
                var avg_point;
                if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {
                  if (vehicles_sort[i]['price'] > 199999) {
                    if (vehicles_sort[i].ratevehicles.length > 0) {

                      for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
                        sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];
                      }
                      avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_typevehicle_content({
                      created_vehicle_feature: vehicles_sort[i]["created"],
                      name_vehicle_feature: vehicles_sort[i]["name"],
                      image_vehicle_feature: vehicles_sort[i]["image"],
                      id_vehicle_feature: vehicles_sort[i]["id"],
                      price: vehicles_sort[i]["price"],
                      description_vehicle_feature: vehicles_sort[i]["descripton"],
                      avg: avg_point,
                    });

                    $$('.typevehicle-content[data-page="page-typevehicle-content"]').append(html);
                  }
                }
                //}
              }
            });
          }

        });

      }
    }
  },
  {
    path: '/list_events/',
    url: './pages/list_events.html',
    on: {


      pageAfterIn: function (e, page) {
        //alert(page.route.query.slug);
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {

        var $$ = Dom7;
        var app = new Framework7();
        var searchbar = app.searchbar.create({
          el: '.searchbar-event',
          searchContainer: '.list',
          searchIn: '.item-title',
          on: {
            search(sb, query, previousQuery) {
              //console.log(query, previousQuery);
            }
          }
        });
        if (page.route.query.region_id) {
          var link_region = 'http://toithichdoc.com/regions/view/' + page.route.query.region_id + '.json';

          var template_search_events = $$('#my-search-event').html();
          var compiled_search_events = Template7.compile(template_search_events);
          app.request.json(link_region, function (region) {
            for (var i = 0; i < region.region.events.length; i++) {
              if (region.region.events[i]["status"] == 1 && region.region.events[i]["featured"] == 1) {
                var html = compiled_search_events({
                  image_event: region.region.events[i]["image"],
                  name_event: region.region.events[i]["title"],
                  description_event: region.region.events[i]["content"],
                  event_id: region.region.events[i]["id"],
                });
                $$('.search-event[data-page="list-search-event"] ul').append(html);
              }
            }
          });
        } else {
          var link_region = 'http://toithichdoc.com/events/index.json';

          var template_search_events = $$('#my-search-event').html();
          var compiled_search_events = Template7.compile(template_search_events);
          app.request.json(link_region, function (events) {
            for (var i = 0; i < events.events.length; i++) {
              if (events.events[i]["status"] == 1 && events.events[i]["featured"] == 1) {
                var html = compiled_search_events({
                  image_event: events.events[i]["image"],
                  name_event: events.events[i]["title"],
                  description_event: events.events[i]["content"],
                  event_id: events.events[i]["id"],
                });
                $$('.search-event[data-page="list-search-event"] ul').append(html);
              }
            }
          });
        }

      },
    }
  },
  {
    path: '/list_regions/',
    url: './pages/list_regions.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();


        var template_typeregion_content = $$('#my-typeregion-content').html();
        var compiled_typeregion_content = Template7.compile(template_typeregion_content);
        app.request.json("http://toithichdoc.com/regions/index.json", function (region_feature) {
          regions_sort = region_feature.regions;
          for (var i = 0; i < regions_sort.length; i++) {
            var html = compiled_typeregion_content({
              created_region_feature: regions_sort[i]["created"],
              name_region_feature: regions_sort[i]["name"],
              image_region_feature: regions_sort[i]["image"],
              id_region_feature: regions_sort[i]["id"],
              description_region_feature: regions_sort[i]["descripton"],
            });

            $$('.typeregion-content[data-page="page-typeregion-content"]').append(html);
          }
        });

      }
    }
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/sign-in/',
    url: './pages/sign-in.html',
  },
  {
    path: '/login/',
    url: './pages/login.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        $$('.login-button').on('click', function () {

          var username = $$('[name="username"]').val();
          var password = $$('[name="password"]').val();
          app.request({
            url: 'http://toithichdoc.com/users/login.json',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              "email": username,
              "password": password
            }),
            success: function (data) {
              localStorage.setItem("user_id_save", data.res.user_id_save); // set localStorage
              localStorage.setItem("typeuser_slug_save", data.res.typeuser_slug_save);
              localStorage.setItem("user_name_save", data.res.user_name_save);
              localStorage.setItem("user_image_save", data.res.user_image_save);
              app.dialog.create({
                title: 'Thông báo',
                text: 'Đăng nhập thành công',
                buttons: [{
                  text: 'Ok',
                }, ],
                verticalButtons: true,
              }).open();
              page.view.router.back({
                url: '/',
                force: true,
                ignoreCache: true
              });
            },
            error: function (xhr, status) {
              alert('Lỗi: ' + JSON.stringify(xhr));
              alert('Thông báo lỗi: ' + JSON.stringify(status));
            }
          });

        });
      },
    }
  },
  {
    path: '/register/',
    url: './pages/register.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        $$('.register-button').on('click', function () {

          var username = $$('[name="username"]').val();
          var password = $$('[name="password1"]').val();
          console.log(username);
          console.log(password);
          app.request({
            url: 'http://toithichdoc.com/users/register.json',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              "email": username,
              "password": password,
              "typeuser_id": 3,
            }),
            success: function (data) {
              app.dialog.create({
                title: 'Thông báo',
                text: 'Đăng ký thành công',
                buttons: [{
                  text: 'Ok',
                }, ],
                verticalButtons: true,
              }).open();
              page.view.router.back({
                url: '/',
                force: true,
                ignoreCache: true
              });
            },
            error: function (xhr, status) {
              alert('Lỗi: ' + JSON.stringify(xhr));
              alert('Thông báo lỗi: ' + JSON.stringify(status));
            }
          });

        });
      },
    }
  },
  {
    path: '/sign_in/',
    url: './pages/sign_in.html',
  },

  {
    path: '/add_place/',
    url: './pages/add_place.html',
  },
  {
    path: '/add_review/',
    url: './pages/add_review.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
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
              url: 'http://toithichdoc.com/hotels/index.json',
              method: 'GET',
              dataType: 'json',
              //send "query" to server. Useful in case you generate response dynamically
              data: {
                query: query,
              },
              success: function (hotels) {
                f = hotels.hotels;
                // Find matched items
                for (var i = 0; i < f.length; i++) {
                  if (f[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(f[i]);
                }
                // Hide Preoloader
                autocomplete.preloaderHide();
                // Render items by passing array with result items
                render(results);
              }
            });
            app.request({
              url: 'http://toithichdoc.com/restaurants/index.json',
              method: 'GET',
              dataType: 'json',
              //send "query" to server. Useful in case you generate response dynamically
              data: {
                query: query,
              },
              success: function (restaurants) {
                f = restaurants.restaurants;
                // Find matched items
                for (var i = 0; i < f.length; i++) {
                  if (f[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(f[i]);
                }
                // Hide Preoloader
                autocomplete.preloaderHide();
                // Render items by passing array with result items
                render(results);
              }
            });
            app.request({
              url: 'http://toithichdoc.com/places/index.json',
              method: 'GET',
              dataType: 'json',
              //send "query" to server. Useful in case you generate response dynamically
              data: {
                query: query,
              },
              success: function (places) {
                f = places.places;
                // Find matched items
                for (var i = 0; i < f.length; i++) {
                  if (f[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(f[i]);
                }
                // Hide Preoloader
                autocomplete.preloaderHide();
                // Render items by passing array with result items
                render(results);
              }
            });
          }
        });




        var formData = app.form.convertToData('#my-form');

        $$('.encodeImageFileAsURL').on('click', function () {

          var formData = app.form.convertToData('#my-form');

          var filesSelected = document.getElementById("inputFileToLoad").files;
          if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];

            var fileReader = new FileReader();

            fileReader.onload = function (fileLoadedEvent) {
              srcData = fileLoadedEvent.target.result; // <--- data: base64

              var newImage = document.getElementById('image1');
              newImage.src = srcData;

              document.getElementById("imgTest").innerHTML = newImage.outerHTML;
              t = document.getElementById("imgTest").innerHTML;
            }
            fileReader.readAsDataURL(fileToLoad);
          }


        });






        $$('.add-review').on('click', function () {

          var formData = app.form.convertToData('#my-form');


          app.request({
            // url: 'http://toithichdoc.com/hotels/delete/6.json',
            url: 'http://toithichdoc.com/reviews/add.json',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              "title": formData.title,
              "name": formData.name,
              "typereview_id": formData.type,
              "address": formData.address,
              "descripton": formData.descripton,
              "image": srcData,
              "status": "1",
              "featured": "1"
            }),
            success: function (data) {
              alert(JSON.stringify(data));
            },
            error: function (xhr, status) {
              alert('Error: ' + JSON.stringify(xhr));
              alert('ErrorStatus: ' + JSON.stringify(status));
            }
          });

        });

      },
    }

  },
  {
    path: '/add_restaurant/',
    url: './pages/add_restaurant.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var map;
        var markers = [];
        var dt;
        var centerMap = {
          lat: 12.267874,
          lng: 109.202376
        };
        var $$ = Dom7;
        var lat_dau = '';
        var lng_dau = '';
        var lat_cuoi = '';
        var lng_cuoi = '';
        var lat_hientai;
        var lng_hientai;
        var pos;
        var srcData;



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
            var infowindow = new google.maps.InfoWindow({
              content: "You are here!"
            });

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

        $$('.add-restaurant').on('click', function () {
          var formData = app.form.convertToData('#my-form');
          var region;
          app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
            a = regions.regions;

            for (var i = 0; i < a.length; i++) {
              if (formData.tp == a[i]["name"]) {
                region = a[i]["id"];

                app.request({
                  // url: 'http://toithichdoc.com/restaurants/delete/267.json',
                  url: 'http://toithichdoc.com/restaurants/add.json',
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "region_id": region,
                    "name": formData.name,
                    "branch": formData.branch,
                    "typerestaurant_id": formData.type,
                    "address": formData.address,
                    "open": formData.open,
                    "close": formData.close,
                    "latitude": formData.lat,
                    "longitude": formData.lng,
                    "descripton": formData.descripton,
                    "web": formData.web,
                    "image": srcData,
                    "status": "0",
                    "featured": "0"
                  }),
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

      },
    }
  },
  {
    path: '/color_themes/',
    url: './pages/color_themes.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var myApp = new Framework7({
          material: true
        });

        var $$ = Dom7;
        $$('input[name = "color-radio"]').on('change', function () {
          if (this.checked) {
            var colors = 'theme-' + 'red pink  blue lightblue cyan green lime amber orange  brown gray bluegray  black'.split(' ').join(' theme-');
            $$('.view').removeClass(colors);
            $$('.view').addClass('theme-' + $$(this).val());
          }
        });

        $$('input[name = "layout-radio"]').on('change', function () {
          if (this.checked) {
            $$('.view').removeClass('layout-dark layout-white');
            $$('.view').addClass(this.value);
          }
        });
      },
    }
  },
  {
    path: '/explore/',
    url: './pages/explore.html',
    on: {
      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var app = new Framework7();

        var $$ = Dom7;
        app.toolbar.show('.toolbar-index');

        //du lieu review noi bac
        var template_review_feature = $$('#my-review-feature').html();
        var compiled_review_feature = Template7.compile(template_review_feature);
        app.request.json("http://toithichdoc.com/reviews/index.json", function (review_feature) {
          reviews_sort = review_feature.reviews.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < reviews_sort.length; i++) {
            //console.log(events.events[i]);
            if (reviews_sort[i]["status"] == 1 && reviews_sort[i]["featured"] == 1) {
              var html = compiled_review_feature({
                user_id: reviews_sort[i].user["id"],
                user_id_save: localStorage.user_id_save,
                avatar_user_review_feature: reviews_sort[i].user["image"],
                user_name_review_feature: reviews_sort[i].user["username"],
                created_review_feature: reviews_sort[i]["created"],
                name_review_feature: reviews_sort[i]["name"],
                image_review_feature: reviews_sort[i]["image"],
                id_review_feature: reviews_sort[i]["id"],
                count_like_review: reviews_sort[i].likereviews.length,
                count_comment_review: reviews_sort[i].comments.length,
              });
              $$('.page-content[data-page="page-review-feature"]').append(html);
            }
          }
        });

        //du lieu review theo loai
        var template_typereview = $$('#my-typereview').html();
        var compiled_typereview = Template7.compile(template_typereview);
        app.request.json("http://toithichdoc.com/typereviews/index.json", function (typereviews) {
          //reviews_sort = review_feature.reviews.sort(function (a, b) { return a.id < b.id; });
          for (var i = 0; i < typereviews.typereviews.length; i++) {

            var html = compiled_typereview({
              typereview_id: typereviews.typereviews[i]["id"],
              typereview_name: typereviews.typereviews[i]["name"]
            });
            $$('.typereview select').append(html);
            //}
          }
        });

        var template_typereview_content = $$('#my-typereview-content').html();
        var compiled_typereview_content = Template7.compile(template_typereview_content);
        app.request.json("http://toithichdoc.com/reviews/index.json", function (review_feature) {
          reviews_sort = review_feature.reviews.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < reviews_sort.length; i++) {
            if (reviews_sort[i]["typereview_id"] == 1) {

              if (reviews_sort[i]["status"] == 1 && reviews_sort[i]["featured"] == 1) {

                var html = compiled_typereview_content({
                  user_id: reviews_sort[i].user["id"],
                  user_id_save: localStorage.user_id_save,
                  avatar_user_review_feature: reviews_sort[i].user["image"],
                  user_name_review_feature: reviews_sort[i].user["username"],
                  created_review_feature: reviews_sort[i]["created"],
                  name_review_feature: reviews_sort[i]["name"],
                  image_review_feature: reviews_sort[i]["image"],
                  id_review_feature: reviews_sort[i]["id"],
                  count_like_review: reviews_sort[i].likereviews.length,
                  count_comment_review: reviews_sort[i].comments.length,
                });

                $$('.typereview-content[data-page="page-typereview-content"]').append(html);
              }
            }
          }
        });

        $$('#typereview').on('change', function () {
          $$('.typereview-content[data-page="page-typereview-content"]').html('');
          app.request.json("http://toithichdoc.com/reviews/index.json", function (review_feature) {
            reviews_sort = review_feature.reviews.sort(function (a, b) {
              return a.id < b.id;
            });
            for (var i = 0; i < reviews_sort.length; i++) {
              if (reviews_sort[i]["typereview_id"] == $$('#typereview').val()) {

                if (reviews_sort[i]["status"] == 1 && reviews_sort[i]["featured"] == 1) {

                  var html = compiled_typereview_content({
                    user_id: reviews_sort[i].user["id"],
                    user_id_save: localStorage.user_id_save,
                    avatar_user_review_feature: reviews_sort[i].user["image"],
                    user_name_review_feature: reviews_sort[i].user["username"],
                    created_review_feature: reviews_sort[i]["created"],
                    name_review_feature: reviews_sort[i]["name"],
                    image_review_feature: reviews_sort[i]["image"],
                    id_review_feature: reviews_sort[i]["id"],
                    count_like_review: reviews_sort[i].likereviews.length,
                    count_comment_review: reviews_sort[i].comments.length,
                  });

                  $$('.typereview-content[data-page="page-typereview-content"]').append(html);
                }
              }
            }
          });

        });


        //du lieu review cua toi
        var template_review_user = $$('#my-review-user').html();
        var compiled_review_user = Template7.compile(template_review_user);
        var template_plan_user = $$('#my-plan-user').html();
        var compiled_plan_user = Template7.compile(template_plan_user);
        app.request.json("http://toithichdoc.com/reviews/index.json", function (review_user) {
          reviews_sort = review_user.reviews.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < reviews_sort.length; i++) {
            //if (reviews_sort[i]["status"] == 1 && reviews_sort[i]["featured"] == 1) {
            //console.log(review_user.users_reviews[i]['id']);
            //console.log(localStorage.user_id_save);
            if (reviews_sort[i]['user_id'] == localStorage.user_id_save) {
              //alert('1111');
              var html = compiled_review_user({
                avatar_user_review_user: reviews_sort[i].user["image"],
                user_name_review_user: reviews_sort[i].user["username"],
                created_review_user: reviews_sort[i]["created"],
                name_review_user: reviews_sort[i]["name"],
                image_review_user: reviews_sort[i]["image"],
                id_review_user: reviews_sort[i]["id"],
                count_like_review: reviews_sort[i].likereviews.length,
                count_comment_review: reviews_sort[i].comments.length,
              });
              $$('.review-user[data-page="page-review-user"]').append(html);
            }
            //}
          }
        });

        $$('#typereview-tab3').on('change', function () {
          $$('.review-user[data-page="page-review-user"]').html('');
          if ($$('#typereview-tab3').val() == 'review') {
            app.request.json("http://toithichdoc.com/reviews/index.json", function (review_user) {
              reviews_sort = review_user.reviews.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < reviews_sort.length; i++) {
                //if (reviews_sort[i]["status"] == 1 && reviews_sort[i]["featured"] == 1) {
                //console.log(review_user.users_reviews[i]['id']);
                //console.log(localStorage.user_id_save);
                if (reviews_sort[i]['user_id'] == localStorage.user_id_save) {
                  //alert('1111');
                  var html = compiled_review_user({
                    avatar_user_review_user: reviews_sort[i].user["image"],
                    user_name_review_user: reviews_sort[i].user["username"],
                    created_review_user: reviews_sort[i]["created"],
                    name_review_user: reviews_sort[i]["name"],
                    image_review_user: reviews_sort[i]["image"],
                    id_review_user: reviews_sort[i]["id"],
                    count_like_review: reviews_sort[i].likereviews.length,
                    count_comment_review: reviews_sort[i].comments.length,
                  });
                  $$('.review-user[data-page="page-review-user"]').append(html);
                }
                //}
              }
            });
          }
          if ($$('#typereview-tab3').val() == 'plan') {
            app.request.json("http://toithichdoc.com/plans/index.json", function (plan_user) {
              plans_sort = plan_user.plans.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < plans_sort.length; i++) {
                //if (plans_sort[i]["status"] == 1 && plans_sort[i]["featured"] == 1) {
                //console.log(plan_user.users_plans[i]['id']);
                //console.log(localStorage.user_id_save);
                if (plans_sort[i]['user_id'] == localStorage.user_id_save) {
                  //alert('1111');
                  var html = compiled_plan_user({
                    avatar_user_plan_user: plans_sort[i].user["image"],
                    user_name_plan_user: plans_sort[i].user["username"],
                    created_plan_user: plans_sort[i]["created"],
                    name_plan_user: plans_sort[i]["name"],
                    image_plan_user: plans_sort[i]["image"],
                    id_plan_user: plans_sort[i]["id"],
                    count_like_plan: plans_sort[i].likeplans.length,
                    count_comment_plan: plans_sort[i].commentplans.length,
                  });
                  $$('.review-user[data-page="page-review-user"]').append(html);
                }
                //}
              }
            });
          }


        });

        //du lieu chuyến đi
        var template_trip_plan = $$('#my-trip-plan').html();
        var compiled_trip_plan = Template7.compile(template_trip_plan);
        app.request.json("http://toithichdoc.com/plans/index.json", function (trip_plan) {
          plans_sort = trip_plan.plans.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < plans_sort.length; i++) {
            if (plans_sort[i]["status"] == 1 && plans_sort[i]["featured"] == 1) {
              //console.log(events.events[i]);
              var html = compiled_trip_plan({
                avatar_user_trip_plan: plans_sort[i].user["image"],
                user_name_trip_plan: plans_sort[i].user["username"],
                created_trip_plan: plans_sort[i]["created"],
                name_trip_plan: plans_sort[i]["name"],
                image_trip_plan: plans_sort[i]["image"],
                id_trip_plan: plans_sort[i]["id"],
                count_like_plan: plans_sort[i].likeplans.length,
                count_comment_plan: plans_sort[i].commentplans.length,
              });
              $$('.page-content[data-page="page-trip-plan"]').append(html);
            }

          }
        });

        //gán sự kiện click 
        $$('#button-like-review').on("click", function () {
          //Lấy tất cả các class của button và chuyển thành chuỗi
          var allClass = this.classList.toString();
          // kiểm tra nếu chưa tồn tại class active thì thêm class active
          if (allClass.indexOf('active') == -1) {
            this.classList += ' active';
          }
          //Thêm hoặc xóa class fa-thumbs-down
          this.classList.toggle("fa-thumbs-down");
        });

        $$('.like-review-1').on('click', function () {
          alert('1111');
        });

      }
    }
  },
  {
    path: '/notification/',
    url: './pages/notification.html',
    on: {
      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var app = new Framework7();

        var $$ = Dom7;

        var template_typeevent_content = $$('#my-typeevent-content').html();
        var compiled_typeevent_content = Template7.compile(template_typeevent_content);
        app.request.json("http://toithichdoc.com/events/index.json", function (event_feature) {
          events_sort = event_feature.events.sort(function (a, b) {
            return a.id < b.id;
          });
          for (var i = 0; i < events_sort.length; i++) {
            //if (events_sort[i]["typeevent_id"] == 1) {

            if (events_sort[i]["status"] == 1 && events_sort[i]["featured"] == 1) {
              var sum_event = 0;
              var avg_point;
              if (events_sort[i].rateevents.length > 0) {

                for (var j = 0; j < events_sort[i].rateevents.length; j++) {
                  sum_event += events_sort[i].rateevents[j]["point"];
                }
                avg_point = (sum_event / events_sort[i].rateevents.length).toFixed(1);
              } else {
                avg_point = 0;
              }
              //console.log(avg_point);

              var html = compiled_typeevent_content({
                created_event_feature: events_sort[i]["created"],
                name_event_feature: events_sort[i]["title"],
                image_event_feature: events_sort[i]["image"],
                id_event_feature: events_sort[i]["id"],
                description_event_feature: events_sort[i]["content"],
                avg: avg_point,
              });

              $$('.typeevent-content[data-page="page-typeevent-content"]').append(html);
            }
            //}
          }
        });
      }
    }
  },
  {
    path: '/favorite/',
    url: './pages/favorite.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        var template_typeplace_content = $$('#my-typeplace-content').html();
        var compiled_typeplace_content = Template7.compile(template_typeplace_content);
        var template_typehotel_content = $$('#my-typehotel-content').html();
        var compiled_typehotel_content = Template7.compile(template_typehotel_content);
        var template_typerestaurant_content = $$('#my-typerestaurant-content').html();
        var compiled_typerestaurant_content = Template7.compile(template_typerestaurant_content);
        var template_typevehicle_content = $$('#my-typevehicle-content').html();
        var compiled_typevehicle_content = Template7.compile(template_typevehicle_content);
        var template_typetour_content = $$('#my-typetour-content').html();
        var compiled_typetour_content = Template7.compile(template_typetour_content);
        var template_typeevent_content = $$('#my-typeevent-content').html();
        var compiled_typeevent_content = Template7.compile(template_typeevent_content);
        app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
          places_sort = place_feature.places.sort(function (a, b) {
            return a.id < b.id;
          });
          var arr = [];
          var arr1 = [];
          for (var i = 0; i < places_sort.length; i++) {
            //if (places_sort[i]["typeplace_id"] == 1) {

            if (places_sort[i]["status"] == 1 && places_sort[i]["featured"] == 1) {
              var sum_place = 0;
              var avg_point;

              if (places_sort[i].rateplaces.length > 0) {

                for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                  //avg_point = _.meanBy(places_sort[i].rateplaces[j], function(o) { return o.point; });
                  sum_place += places_sort[i].rateplaces[j]["point"];
                }
                avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);

                arr.push({
                  'avg_place': avg_point
                });
                arr1.push(places_sort[i]);
              }

            }
          }

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

            var merge_place = _.merge(arr, arr1);
            var merge_place_sort = merge_place.sort(function (a, b) {
              return a.avg_place < b.avg_place;
            });
            for (var o = 0; o < merge_place_sort.length; o++) {
              var sum_place = 0;
              dLat = (latitude - merge_place_sort[o]["latitude"]).toRad();
              dLon = (longitude - merge_place_sort[o]["longitude"]).toRad();
              dLat1 = (merge_place_sort[o]["latitude"] - 0).toRad();
              dLat2 = (latitude - 0).toRad();
              var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(dLat1) * Math.cos(dLat1) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              var d = R * c;
              var n = parseFloat(d);
              d = Math.round(n * 1000) / 1000;

              var html = compiled_typeplace_content({
                created_place_feature: merge_place_sort[o]["created"],
                name_place_feature: merge_place_sort[o]["name"],
                image_place_feature: merge_place_sort[o]["image"],
                id_place_feature: merge_place_sort[o]["id"],
                price: merge_place_sort[o]["price"],
                description_place_feature: merge_place_sort[o]["descripton"],
                avg: merge_place_sort[o]["avg_place"],
                kc: d + " km"
              });

              $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);

            }
          }

        });

        $$('#typeplace').on('change', function () {
          $$('.typeplace-content[data-page="page-typeplace-content"]').html('');

          if ($$('#typeplace').val() == 'place') {
            app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
              places_sort = place_feature.places.sort(function (a, b) {
                return a.id < b.id;
              });
              var arr = [];
              var arr1 = [];
              for (var i = 0; i < places_sort.length; i++) {
                //if (places_sort[i]["typeplace_id"] == 1) {

                if (places_sort[i]["status"] == 1 && places_sort[i]["featured"] == 1) {
                  var sum_place = 0;
                  var avg_point;

                  if (places_sort[i].rateplaces.length > 0) {

                    for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                      //avg_point = _.meanBy(places_sort[i].rateplaces[j], function(o) { return o.point; });
                      sum_place += places_sort[i].rateplaces[j]["point"];
                    }
                    avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);

                    arr.push({
                      'avg_place': avg_point
                    });
                    arr1.push(places_sort[i]);
                  }

                }
              }

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

                var merge_place = _.merge(arr, arr1);
                var merge_place_sort = merge_place.sort(function (a, b) {
                  return a.avg_place < b.avg_place;
                });
                for (var o = 0; o < merge_place_sort.length; o++) {
                  var sum_place = 0;
                  dLat = (latitude - merge_place_sort[o]["latitude"]).toRad();
                  dLon = (longitude - merge_place_sort[o]["longitude"]).toRad();
                  dLat1 = (merge_place_sort[o]["latitude"] - 0).toRad();
                  dLat2 = (latitude - 0).toRad();
                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  var d = R * c;
                  var n = parseFloat(d);
                  d = Math.round(n * 1000) / 1000;

                  var html = compiled_typeplace_content({
                    created_place_feature: merge_place_sort[o]["created"],
                    name_place_feature: merge_place_sort[o]["name"],
                    image_place_feature: merge_place_sort[o]["image"],
                    id_place_feature: merge_place_sort[o]["id"],
                    price: merge_place_sort[o]["price"],
                    description_place_feature: merge_place_sort[o]["descripton"],
                    avg: merge_place_sort[o]["avg_place"],
                    kc: d + " km"
                  });

                  $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);

                }
              }
            });
          }

          if ($$('#typeplace').val() == 'hotel') {
            app.request.json("http://toithichdoc.com/hotels/index.json", function (hotel_feature) {
              hotels_sort = hotel_feature.hotels.sort(function (a, b) {
                return a.id < b.id;
              });
              var arr = [];
              var arr1 = [];
              for (var i = 0; i < hotels_sort.length; i++) {
                //if (hotels_sort[i]["typehotel_id"] == 1) {

                if (hotels_sort[i]["status"] == 1 && hotels_sort[i]["featured"] == 1) {
                  var sum_hotel = 0;
                  var avg_point;

                  if (hotels_sort[i].ratehotels.length > 0) {

                    for (var j = 0; j < hotels_sort[i].ratehotels.length; j++) {
                      //avg_point = _.meanBy(hotels_sort[i].ratehotels[j], function(o) { return o.point; });
                      sum_hotel += hotels_sort[i].ratehotels[j]["point"];
                    }
                    avg_point = (sum_hotel / hotels_sort[i].ratehotels.length).toFixed(1);

                    arr.push({
                      'avg_hotel': avg_point
                    });
                    arr1.push(hotels_sort[i]);
                  } else {
                    avg_point = 0;
                  }

                }
              }

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

                var merge_hotel = _.merge(arr, arr1);
                var merge_hotel_sort = merge_hotel.sort(function (a, b) {
                  return a.avg_hotel < b.avg_hotel;
                });
                for (var o = 0; o < merge_hotel_sort.length; o++) {
                  var sum_hotel = 0;
                  dLat = (latitude - merge_hotel_sort[o]["latitude"]).toRad();
                  dLon = (longitude - merge_hotel_sort[o]["longitude"]).toRad();
                  dLat1 = (merge_hotel_sort[o]["latitude"] - 0).toRad();
                  dLat2 = (latitude - 0).toRad();
                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  var d = R * c;
                  var n = parseFloat(d);
                  d = Math.round(n * 1000) / 1000;

                  var html = compiled_typehotel_content({
                    created_hotel_feature: merge_hotel_sort[o]["created"],
                    name_hotel_feature: merge_hotel_sort[o]["name"],
                    image_hotel_feature: merge_hotel_sort[o]["image"],
                    id_hotel_feature: merge_hotel_sort[o]["id"],
                    price: merge_hotel_sort[o]["price"],
                    description_hotel_feature: merge_hotel_sort[o]["descripton"],
                    avg: merge_hotel_sort[o]["avg_hotel"],
                    kc: d + " km"
                  });

                  $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);

                }
              }
            });
          }

          if ($$('#typeplace').val() == 'restaurant') {
            app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurant_feature) {
              restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) {
                return a.id < b.id;
              });
              var arr = [];
              var arr1 = [];
              for (var i = 0; i < restaurants_sort.length; i++) {
                //if (restaurants_sort[i]["typerestaurant_id"] == 1) {
                if (restaurants_sort[i]["status"] == 1 && restaurants_sort[i]["featured"] == 1) {
                  var sum_restaurant = 0;
                  var avg_point;
                  if (restaurants_sort[i].raterestaurants.length > 0) {

                    for (var j = 0; j < restaurants_sort[i].raterestaurants.length; j++) {
                      //avg_point = _.meanBy(restaurants_sort[i].raterestaurants[j], function(o) { return o.point; });
                      sum_restaurant += restaurants_sort[i].raterestaurants[j]["point"];
                    }
                    avg_point = (sum_restaurant / restaurants_sort[i].raterestaurants.length).toFixed(1);

                    arr.push({
                      'avg_restaurant': avg_point
                    });
                    arr1.push(restaurants_sort[i]);
                  } else {
                    avg_point = 0;
                  }

                }
              }

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

                var merge_restaurant = _.merge(arr, arr1);

                var merge_restaurant_sort = merge_restaurant.sort(function (a, b) {
                  return a.avg_restaurant < b.avg_restaurant;
                });
                for (var o = 0; o < merge_restaurant_sort.length; o++) {
                  var sum_restaurant = 0;
                  dLat = (latitude - merge_restaurant_sort[o]["latitude"]).toRad();
                  dLon = (longitude - merge_restaurant_sort[o]["longitude"]).toRad();
                  dLat1 = (merge_restaurant_sort[o]["latitude"] - 0).toRad();
                  dLat2 = (latitude - 0).toRad();
                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  var d = R * c;
                  var n = parseFloat(d);
                  d = Math.round(n * 1000) / 1000;

                  var html = compiled_typerestaurant_content({
                    created_restaurant_feature: merge_restaurant_sort[o]["created"],
                    name_restaurant_feature: merge_restaurant_sort[o]["name"],
                    image_restaurant_feature: merge_restaurant_sort[o]["image"],
                    id_restaurant_feature: merge_restaurant_sort[o]["id"],
                    price: merge_restaurant_sort[o]["price"],
                    description_restaurant_feature: merge_restaurant_sort[o]["descripton"],
                    avg: merge_restaurant_sort[o]["avg_restaurant"],
                    kc: d + ' km',
                  });

                  $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);

                }
              }
            });
          }

          if ($$('#typeplace').val() == 'vehicle') {
            app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicle_feature) {
              vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) {
                return a.id < b.id;
              });
              var arr = [];
              var arr1 = [];
              for (var i = 0; i < vehicles_sort.length; i++) {
                //if (vehicles_sort[i]["typevehicle_id"] == 1) {
                if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {
                  var sum_vehicle = 0;
                  var avg_point;
                  if (vehicles_sort[i].ratevehicles.length > 0) {

                    for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
                      //avg_point = _.meanBy(vehicles_sort[i].ratevehicles[j], function(o) { return o.point; });
                      sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];

                    }
                    avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);

                    arr.push({
                      'avg_vehicle': avg_point
                    });
                    arr1.push(vehicles_sort[i]);

                  } else {
                    avg_point = 0;
                  }

                }
              }

              var merge_vehicle = _.merge(arr, arr1);

              var merge_vehicle_sort = merge_vehicle.sort(function (a, b) {
                return a.avg_vehicle < b.avg_vehicle;
              });
              for (var o = 0; o < merge_vehicle_sort.length; o++) {

                var html = compiled_typevehicle_content({
                  created_vehicle_feature: merge_vehicle_sort[o]["created"],
                  name_vehicle_feature: merge_vehicle_sort[o]["name"],
                  image_vehicle_feature: merge_vehicle_sort[o]["image"],
                  id_vehicle_feature: merge_vehicle_sort[o]["id"],
                  price: merge_vehicle_sort[o]["price"],
                  description_vehicle_feature: merge_vehicle_sort[o]["descripton"],
                  avg: merge_vehicle_sort[o]["avg_vehicle"],
                });

                $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);

              }

            });
          }

          if ($$('#typeplace').val() == 'tour') {
            app.request.json("http://toithichdoc.com/tours/index.json", function (tour_feature) {
              tours_sort = tour_feature.tours.sort(function (a, b) {
                return a.id < b.id;
              });
              var arr = [];
              var arr1 = [];
              for (var i = 0; i < tours_sort.length; i++) {
                //if (tours_sort[i]["typetour_id"] == 1) {
                if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {
                  var sum_tour = 0;
                  var avg_point;
                  if (tours_sort[i].ratetours.length > 0) {

                    for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
                      //avg_point = _.meanBy(tours_sort[i].ratetours[j], function(o) { return o.point; });
                      sum_tour += tours_sort[i].ratetours[j]["point"];

                    }
                    avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);

                    arr.push({
                      'avg_tour': avg_point
                    });
                    arr1.push(tours_sort[i]);

                  } else {
                    avg_point = 0;
                  }

                }
              }

              var merge_tour = _.merge(arr, arr1);

              var merge_tour_sort = merge_tour.sort(function (a, b) {
                return a.avg_tour < b.avg_tour;
              });
              for (var o = 0; o < merge_tour_sort.length; o++) {

                var html = compiled_typetour_content({
                  created_tour_feature: merge_tour_sort[o]["created"],
                  name_tour_feature: merge_tour_sort[o]["name"],
                  image_tour_feature: merge_tour_sort[o]["image"],
                  id_tour_feature: merge_tour_sort[o]["id"],
                  price: merge_tour_sort[o]["price"],
                  description_tour_feature: merge_tour_sort[o]["descripton"],
                  avg: merge_tour_sort[o]["avg_tour"],
                });

                $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);

              }

            });
          }

          if ($$('#typeplace').val() == 'event') {
            app.request.json("http://toithichdoc.com/events/index.json", function (event_feature) {
              events_sort = event_feature.events.sort(function (a, b) {
                return a.id < b.id;
              });
              var arr = [];
              var arr1 = [];
              for (var i = 0; i < events_sort.length; i++) {
                //if (events_sort[i]["typeevent_id"] == 1) {
                if (events_sort[i]["status"] == 1 && events_sort[i]["featured"] == 1) {
                  var sum_event = 0;
                  var avg_point;
                  if (events_sort[i].rateevents.length > 0) {

                    for (var j = 0; j < events_sort[i].rateevents.length; j++) {
                      //avg_point = _.meanBy(events_sort[i].rateevents[j], function(o) { return o.point; });
                      sum_event += events_sort[i].rateevents[j]["point"];

                    }
                    avg_point = (sum_event / events_sort[i].rateevents.length).toFixed(1);

                    arr.push({
                      'avg_event': avg_point
                    });
                    arr1.push(events_sort[i]);

                  } else {
                    avg_point = 0;
                  }

                }
              }

              var merge_event = _.merge(arr, arr1);

              var merge_event_sort = merge_event.sort(function (a, b) {
                return a.avg_event < b.avg_event;
              });
              for (var o = 0; o < merge_event_sort.length; o++) {

                var html = compiled_typeevent_content({
                  created_event_feature: merge_event_sort[o]["created"],
                  name_event_feature: merge_event_sort[o]["name"],
                  image_event_feature: merge_event_sort[o]["image"],
                  id_event_feature: merge_event_sort[o]["id"],
                  price: merge_event_sort[o]["price"],
                  description_event_feature: merge_event_sort[o]["descripton"],
                  avg: merge_event_sort[o]["avg_event"],
                });

                $$('.typeplace-content[data-page="page-typeplace-content"]').append(html);

              }

            });
          }

        });

        var template_typeplace_content_tab2 = $$('#my-typeplace-content-tab2').html();
        var compiled_typeplace_content_tab2 = Template7.compile(template_typeplace_content_tab2);
        var template_typehotel_content_tab2 = $$('#my-typehotel-content-tab2').html();
        var compiled_typehotel_content_tab2 = Template7.compile(template_typehotel_content_tab2);
        var template_typerestaurant_content_tab2 = $$('#my-typerestaurant-content-tab2').html();
        var compiled_typerestaurant_content_tab2 = Template7.compile(template_typerestaurant_content_tab2);
        var template_typevehicle_content_tab2 = $$('#my-typevehicle-content-tab2').html();
        var compiled_typevehicle_content_tab2 = Template7.compile(template_typevehicle_content_tab2);
        var template_typetour_content_tab2 = $$('#my-typetour-content-tab2').html();
        var compiled_typetour_content_tab2 = Template7.compile(template_typetour_content_tab2);
        var template_typeevent_content_tab2 = $$('#my-typeevent-content-tab2').html();
        var compiled_typeevent_content_tab2 = Template7.compile(template_typeevent_content_tab2);
        app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
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

            places_sort = place_feature.places.sort(function (a, b) {
              return a.id < b.id;
            });
            for (var i = 0; i < places_sort.length; i++) {
              //var sum_place = 0;
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
                for (var k = 0; k < places_sort[i].likeplaces.length; k++) {
                  if (places_sort[i].likeplaces[k]['user_id'] == localStorage.user_id_save) {
                    var sum_place = 0;
                    var avg_point;
                    if (places_sort[i].rateplaces.length > 0) {
                      for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                        sum_place += places_sort[i].rateplaces[j]["point"];
                      }
                      avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }

                    var html = compiled_typeplace_content_tab2({
                      created_place_feature: places_sort[i]["created"],
                      name_place_feature: places_sort[i]["name"],
                      image_place_feature: places_sort[i]["image"],
                      id_place_feature: places_sort[i]["id"],
                      price: places_sort[i]["price"],
                      description_place_feature: places_sort[i]["descripton"],
                      kc: d + ' km',
                      avg: avg_point,

                    });

                    $$('.typeplace-content-tab2[data-page="page-typeplace-content-tab2"]').append(html);

                  }
                }

              }
            }
          }
        });

        $$('#typeplace-tab2').on('change', function () {
          //console.log(String($$('#typeplace-tab2').val()));
          $$('.typeplace-content-tab2[data-page="page-typeplace-content-tab2"]').html('');
          if ($$('#typeplace-tab2').val() == 'place') {
            app.request.json("http://toithichdoc.com/places/index.json", function (place_feature) {
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

                places_sort = place_feature.places.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < places_sort.length; i++) {
                  //var sum_place = 0;
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
                    for (var k = 0; k < places_sort[i].likeplaces.length; k++) {
                      if (places_sort[i].likeplaces[k]['user_id'] == localStorage.user_id_save) {
                        var sum_place = 0;
                        var avg_point;
                        if (places_sort[i].rateplaces.length > 0) {
                          for (var j = 0; j < places_sort[i].rateplaces.length; j++) {
                            sum_place += places_sort[i].rateplaces[j]["point"];
                          }
                          avg_point = (sum_place / places_sort[i].rateplaces.length).toFixed(1);
                        } else {
                          avg_point = 0;
                        }

                        var html = compiled_typeplace_content_tab2({
                          created_place_feature: places_sort[i]["created"],
                          name_place_feature: places_sort[i]["name"],
                          image_place_feature: places_sort[i]["image"],
                          id_place_feature: places_sort[i]["id"],
                          price: places_sort[i]["price"],
                          description_place_feature: places_sort[i]["descripton"],
                          kc: d + ' km',
                          avg: avg_point,

                        });

                        $$('.typeplace-content-tab2[data-page="page-typeplace-content-tab2"]').append(html);

                      }
                    }

                  }
                }
              }
            });
          }

          if ($$('#typeplace-tab2').val() == 'hotel') {
            app.request.json("http://toithichdoc.com/hotels/index.json", function (hotel_feature) {
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

                hotels_sort = hotel_feature.hotels.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < hotels_sort.length; i++) {
                  //var sum_hotel = 0;
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
                    for (var k = 0; k < hotels_sort[i].likehotels.length; k++) {
                      if (hotels_sort[i].likehotels[k]['user_id'] == localStorage.user_id_save) {
                        var sum_hotel = 0;
                        var avg_point;
                        if (hotels_sort[i].ratehotels.length > 0) {
                          for (var j = 0; j < hotels_sort[i].ratehotels.length; j++) {
                            sum_hotel += hotels_sort[i].ratehotels[j]["point"];
                          }
                          avg_point = (sum_hotel / hotels_sort[i].ratehotels.length).toFixed(1);
                        } else {
                          avg_point = 0;
                        }

                        var html = compiled_typehotel_content_tab2({
                          created_hotel_feature: hotels_sort[i]["created"],
                          name_hotel_feature: hotels_sort[i]["name"],
                          image_hotel_feature: hotels_sort[i]["image"],
                          id_hotel_feature: hotels_sort[i]["id"],
                          price: hotels_sort[i]["price"],
                          description_hotel_feature: hotels_sort[i]["descripton"],
                          kc: d + ' km',
                          avg: avg_point,

                        });

                        $$('.typeplace-content-tab2[data-page="page-typeplace-content-tab2"]').append(html);

                      }
                    }

                  }
                }
              }
            });
          }

          if ($$('#typeplace-tab2').val() == 'restaurant') {
            app.request.json("http://toithichdoc.com/restaurants/index.json", function (restaurant_feature) {
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

                restaurants_sort = restaurant_feature.restaurants.sort(function (a, b) {
                  return a.id < b.id;
                });
                for (var i = 0; i < restaurants_sort.length; i++) {
                  //var sum_restaurant = 0;
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
                    for (var k = 0; k < restaurants_sort[i].likerestaurants.length; k++) {
                      if (restaurants_sort[i].likerestaurants[k]['user_id'] == localStorage.user_id_save) {
                        var sum_restaurant = 0;
                        var avg_point;
                        if (restaurants_sort[i].raterestaurants.length > 0) {
                          for (var j = 0; j < restaurants_sort[i].raterestaurants.length; j++) {
                            sum_restaurant += restaurants_sort[i].raterestaurants[j]["point"];
                          }
                          avg_point = (sum_restaurant / restaurants_sort[i].raterestaurants.length).toFixed(1);
                        } else {
                          avg_point = 0;
                        }

                        var html = compiled_typerestaurant_content_tab2({
                          created_restaurant_feature: restaurants_sort[i]["created"],
                          name_restaurant_feature: restaurants_sort[i]["name"],
                          image_restaurant_feature: restaurants_sort[i]["image"],
                          id_restaurant_feature: restaurants_sort[i]["id"],
                          price: restaurants_sort[i]["price"],
                          description_restaurant_feature: restaurants_sort[i]["descripton"],
                          kc: d + ' km',
                          avg: avg_point,

                        });

                        $$('.typeplace-content-tab2[data-page="page-typeplace-content-tab2"]').append(html);

                      }
                    }

                  }
                }
              }
            });
          }
          if ($$('#typeplace-tab2').val() == 'vehicle') {
            app.request.json("http://toithichdoc.com/vehicles/index.json", function (vehicle_feature) {
              vehicles_sort = vehicle_feature.vehicles.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < vehicles_sort.length; i++) {

                if (vehicles_sort[i]["status"] == 1 && vehicles_sort[i]["featured"] == 1) {
                  for (var k = 0; k < vehicles_sort[i].likevehicles.length; k++) {
                    if (vehicles_sort[i].likevehicles[k]['user_id'] == localStorage.user_id_save) {
                      var sum_vehicle = 0;
                      var avg_point;
                      if (vehicles_sort[i].ratevehicles.length > 0) {
                        for (var j = 0; j < vehicles_sort[i].ratevehicles.length; j++) {
                          sum_vehicle += vehicles_sort[i].ratevehicles[j]["point"];
                        }
                        avg_point = (sum_vehicle / vehicles_sort[i].ratevehicles.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }

                      var html = compiled_typevehicle_content_tab2({
                        created_vehicle_feature: vehicles_sort[i]["created"],
                        name_vehicle_feature: vehicles_sort[i]["name"],
                        image_vehicle_feature: vehicles_sort[i]["image"],
                        id_vehicle_feature: vehicles_sort[i]["id"],
                        price: vehicles_sort[i]["price"],
                        description_vehicle_feature: vehicles_sort[i]["descripton"],

                        avg: avg_point,

                      });

                      $$('.typeplace-content-tab2[data-page="page-typeplace-content-tab2"]').append(html);

                    }
                  }

                }
              }
            });
          }
          if ($$('#typeplace-tab2').val() == 'tour') {
            app.request.json("http://toithichdoc.com/tours/index.json", function (tour_feature) {
              tours_sort = tour_feature.tours.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < tours_sort.length; i++) {

                if (tours_sort[i]["status"] == 1 && tours_sort[i]["featured"] == 1) {
                  for (var k = 0; k < tours_sort[i].liketours.length; k++) {
                    if (tours_sort[i].liketours[k]['user_id'] == localStorage.user_id_save) {
                      var sum_tour = 0;
                      var avg_point;
                      if (tours_sort[i].ratetours.length > 0) {
                        for (var j = 0; j < tours_sort[i].ratetours.length; j++) {
                          sum_tour += tours_sort[i].ratetours[j]["point"];
                        }
                        avg_point = (sum_tour / tours_sort[i].ratetours.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }

                      var html = compiled_typetour_content_tab2({
                        created_tour_feature: tours_sort[i]["created"],
                        name_tour_feature: tours_sort[i]["name"],
                        image_tour_feature: tours_sort[i]["image"],
                        id_tour_feature: tours_sort[i]["id"],
                        price: tours_sort[i]["price"],
                        description_tour_feature: tours_sort[i]["descripton"],

                        avg: avg_point,

                      });

                      $$('.typeplace-content-tab2[data-page="page-typeplace-content-tab2"]').append(html);

                    }
                  }

                }
              }
            });
          }
          if ($$('#typeplace-tab2').val() == 'event') {
            app.request.json("http://toithichdoc.com/events/index.json", function (event_feature) {
              events_sort = event_feature.events.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var i = 0; i < events_sort.length; i++) {

                if (events_sort[i]["status"] == 1 && events_sort[i]["featured"] == 1) {
                  for (var k = 0; k < events_sort[i].likeevents.length; k++) {
                    if (events_sort[i].likeevents[k]['user_id'] == localStorage.user_id_save) {
                      var sum_event = 0;
                      var avg_point;
                      if (events_sort[i].rateevents.length > 0) {
                        for (var j = 0; j < events_sort[i].rateevents.length; j++) {
                          sum_event += events_sort[i].rateevents[j]["point"];
                        }
                        avg_point = (sum_event / events_sort[i].rateevents.length).toFixed(1);
                      } else {
                        avg_point = 0;
                      }
                      //console.log(avg_point);

                      var html = compiled_typeevent_content_tab2({
                        created_event_feature: events_sort[i]["created"],
                        name_event_feature: events_sort[i]["title"],
                        image_event_feature: events_sort[i]["image"],
                        id_event_feature: events_sort[i]["id"],
                        description_event_feature: events_sort[i]["content"],

                        avg: avg_point,

                      });

                      $$('.typeplace-content-tab2[data-page="page-typeplace-content-tab2"]').append(html);

                    }
                  }

                }
              }
            });
          }

        });

      }
    }
  },
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
    on: {
      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var app = new Framework7();
        var $$ = Dom7;
        $$('.logout-button').on('click', function () {
          app.request({
            url: 'http://toithichdoc.com/users/logout.json',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              localStorage.clear(); // set localStorage
              app.dialog.create({
                title: 'Thông báo',
                text: 'Đăng xuất thành công',
                buttons: [{
                  text: 'Ok',
                }, ],
                verticalButtons: true,
              }).open();
              page.view.router.back({
                url: '/',
                force: true,
                ignoreCache: true
              });
            },
            error: function (xhr, status) {
              alert('Lỗi: ' + JSON.stringify(xhr));
              alert('Thông báo lỗi: ' + JSON.stringify(status));
            }
          });

        });
      }
    }
  },
  {
    path: '/menus/',
    url: './pages/menus.html',
    on: {
      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var app = new Framework7();
        var $$ = Dom7;

        var id_event = page.route.query.event_id;
        //du lieu title name
        // DOM events for About popup
        $$('.popup-feedback').on('popup:open', function (e, popup, page) {
          $$('.link-feedback').on('click', function (e, page) {
            var formData = app.form.convertToData('#my-form');
            //alert(star);
            app.request({
              url: 'http://toithichdoc.com/feedbacks/add.json',
              method: 'POST',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "user_id": localStorage.user_id_save,
                "descripton": formData.descripton
              }),
              success: function (data) {
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Thêm góp ý thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();

              },
              error: function (xhr, status) {
                alert('Lỗi: ' + JSON.stringify(xhr));
                alert('Thông báo lỗi: ' + JSON.stringify(status));
              }
            });


          });
        });

        if (localStorage.user_id_save !== undefined && localStorage.user_id_save !== null) {
          //alert(localStorage.user_id_save);
          var link_menu_user = 'http://toithichdoc.com/users/view/' + localStorage.user_id_save + '.json';
          var template_menu_user = $$('#my-menu-user').html();
          var compiled_menu_user = Template7.compile(template_menu_user);
          app.request.json(link_menu_user, function (menu_user) {
            //for (var i = 0; i < regions.regions.length; i++) {
            var html = compiled_menu_user({
              user_id_save: localStorage.user_id_save,
              user_menu_id: menu_user.user["id"],
              image_user: menu_user.user["image"],
              name_user: menu_user.user["username"]
            });
            $$('.list[data-page="page-menu-user"] ul li').append(html);
            //}
          });
        } else {
          //var link_menu_user = 'http://toithichdoc.com/users/view/' + localStorage.user_id_save + '.json';
          var template_menu_user = $$('#my-menu-user').html();
          var compiled_menu_user = Template7.compile(template_menu_user);
          //app.request.json(link_menu_user, function (menu_user) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_menu_user({
            user_id_save: localStorage.user_id_save
          });
          $$('.list[data-page="page-menu-user"] ul li').append(html);
          //}
          //});
        }

        var template_add_place = $$('#my-add-place').html();
        var compiled_add_place = Template7.compile(template_add_place);
        var html = compiled_add_place({
          user_id_save: localStorage.user_id_save,
        });
        $$('.add-place[data-page="add-place"]').append(html);



      },
    }
  },
  {
    path: '/events/',
    url: './pages/events.html',
  },
  {
    path: '/list_categories/',
    url: './pages/list_categories.html',
  },
  {
    path: '/form/',
    url: './pages/form.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var app = new Framework7();

        var $$ = Dom7;

        $$('.convert-form-to-data').on('click', function () {
          var formData = app.form.convertToData('#my-form');
          alert(JSON.stringify(formData));
        });

        $$('.fill-form-from-data').on('click', function () {
          var formData = {
            'name': 'John',
            'email': 'john@doe.com',
            'gender': 'female',
            'toggle': ['yes'],
          }
          app.form.fillFromData('#my-form', formData);
        });
      },
    }
  },
  {
    path: '/search_regions/',
    url: './pages/search_regions.html',
    on: {


      pageAfterIn: function (e, page) {
        //alert(page.route.query.slug);
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {

        var $$ = Dom7;
        var app = new Framework7();
        var searchbar = app.searchbar.create({
          el: '.searchbar-region',
          searchContainer: '.list',
          searchIn: '.item-title',
          on: {
            search(sb, query, previousQuery) {
              //console.log(query, previousQuery);
            }
          }
        });
        var template_list_regions = $$('#my-list-regions').html();
        var compiled_list_regions = Template7.compile(template_list_regions);
        app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
          for (var i = 0; i < regions.regions.length; i++) {
            var html = compiled_list_regions({
              image: regions.regions[i]["image"],
              name: regions.regions[i]["name"],
              description: regions.regions[i]["descripton"],
              slug: page.route.query.slug,
              id: regions.regions[i]["id"],
            });
            $$('.regions[data-page="list-view-regions"] ul').append(html);
          }
        });

      },
    }
  },

  {
    path: '/search_hotels/',
    url: './pages/search_hotels.html',
    on: {


      pageAfterIn: function (e, page) {
        //alert(page.route.query.slug);
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {

        var $$ = Dom7;
        var app = new Framework7();
        var searchbar = app.searchbar.create({
          el: '.searchbar-hotel',
          searchContainer: '.list',
          searchIn: '.item-title',
          on: {
            search(sb, query, previousQuery) {
              //console.log(query, previousQuery);
            }
          }
        });

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

          if (page.route.query.region_id) {
            var link_region = 'http://toithichdoc.com/hotels/index.json';

            var template_search_hotels = $$('#my-search-hotel').html();
            var compiled_search_hotels = Template7.compile(template_search_hotels);
            app.request.json(link_region, function (hotels) {
              for (var i = 0; i < hotels.hotels.length; i++) {
                var sum_hotel = 0;
                dLat = (latitude - hotels.hotels[i]["latitude"]).toRad();
                dLon = (longitude - hotels.hotels[i]["longitude"]).toRad();
                dLat1 = (hotels.hotels[i]["latitude"] - 0).toRad();
                dLat2 = (latitude - 0).toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(dLat1) * Math.cos(dLat1) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                var n = parseFloat(d);
                d = Math.round(n * 1000) / 1000;
                var avg_point;
                if (hotels.hotels[i]["status"] == 1 && hotels.hotels[i]["featured"] == 1) {
                  if (hotels.hotels[i]["region_id"] == page.route.query.region_id) {
                    if (hotels.hotels[i].ratehotels.length > 0) {
                      for (var j = 0; j < hotels.hotels[i].ratehotels.length; j++) {
                        sum_hotel += hotels.hotels[i].ratehotels[j]["point"];
                      }
                      avg_point = (sum_hotel / hotels.hotels[i].ratehotels.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_search_hotels({
                      image_hotel: hotels.hotels[i]["image"],
                      name_hotel: hotels.hotels[i]["name"],
                      description_hotel: hotels.hotels[i]["descripton"],
                      hotel_id: hotels.hotels[i]["id"],
                      kc: d + ' km',
                      avg: avg_point
                    });
                    $$('.search-hotel[data-page="list-search-hotel"] ul').append(html);
                  }
                }
              }
            });
          } else {
            var link_region = 'http://toithichdoc.com/hotels/index.json';

            var template_search_hotels = $$('#my-search-hotel').html();
            var compiled_search_hotels = Template7.compile(template_search_hotels);
            app.request.json(link_region, function (hotels) {
              for (var i = 0; i < hotels.hotels.length; i++) {
                var sum_hotel = 0;
                dLat = (latitude - hotels.hotels[i]["latitude"]).toRad();
                dLon = (longitude - hotels.hotels[i]["longitude"]).toRad();
                dLat1 = (hotels.hotels[i]["latitude"] - 0).toRad();
                dLat2 = (latitude - 0).toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(dLat1) * Math.cos(dLat1) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                var n = parseFloat(d);
                d = Math.round(n * 1000) / 1000;
                var avg_point;
                if (hotels.hotels[i]["status"] == 1 && hotels.hotels[i]["featured"] == 1) {
                  if (hotels.hotels[i].ratehotels.length > 0) {
                    for (var j = 0; j < hotels.hotels[i].ratehotels.length; j++) {
                      sum_hotel += hotels.hotels[i].ratehotels[j]["point"];
                    }
                    avg_point = (sum_hotel / hotels.hotels[i].ratehotels.length).toFixed(1);
                  } else {
                    avg_point = 0;
                  }
                  var html = compiled_search_hotels({
                    image_hotel: hotels.hotels[i]["image"],
                    name_hotel: hotels.hotels[i]["name"],
                    description_hotel: hotels.hotels[i]["descripton"],
                    hotel_id: hotels.hotels[i]["id"],
                    kc: d + ' km',
                    avg: avg_point
                  });
                  $$('.search-hotel[data-page="list-search-hotel"] ul').append(html);
                }
              }
            });
          }

        }

      },
    }
  },

  {
    path: '/search_map_hotels/',
    url: './pages/search_map_hotels.html',
  },

  {
    path: '/search_places/',
    url: './pages/search_places.html',
    on: {


      pageAfterIn: function (e, page) {
        //alert(page.route.query.slug);
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {

        var $$ = Dom7;
        var app = new Framework7();
        var searchbar = app.searchbar.create({
          el: '.searchbar-place',
          searchContainer: '.list',
          searchIn: '.item-title',
          on: {
            search(sb, query, previousQuery) {
              //console.log(query, previousQuery);
            }
          }
        });
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

          if (page.route.query.region_id) {
            var link_region = 'http://toithichdoc.com/places/index.json';

            var template_search_places = $$('#my-search-place').html();
            var compiled_search_places = Template7.compile(template_search_places);
            app.request.json(link_region, function (places) {
              for (var i = 0; i < places.places.length; i++) {
                var sum_place = 0;
                dLat = (latitude - places.places[i]["latitude"]).toRad();
                dLon = (longitude - places.places[i]["longitude"]).toRad();
                dLat1 = (places.places[i]["latitude"] - 0).toRad();
                dLat2 = (latitude - 0).toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(dLat1) * Math.cos(dLat1) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                var n = parseFloat(d);
                d = Math.round(n * 1000) / 1000;
                var avg_point;
                if (places.places[i]["status"] == 1 && places.places[i]["featured"] == 1) {
                  if (places.places[i]["region_id"] == page.route.query.region_id) {
                    if (places.places[i].rateplaces.length > 0) {
                      for (var j = 0; j < places.places[i].rateplaces.length; j++) {
                        sum_place += places.places[i].rateplaces[j]["point"];
                      }
                      avg_point = (sum_place / places.places[i].rateplaces.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_search_places({
                      image_place: places.places[i]["image"],
                      name_place: places.places[i]["name"],
                      description_place: places.places[i]["descripton"],
                      place_id: places.places[i]["id"],
                      kc: d + ' km',
                      avg: avg_point
                    });
                    $$('.search-place[data-page="list-search-place"] ul').append(html);
                  }
                }
              }
            });
          } else {
            var link_region = 'http://toithichdoc.com/places/index.json';

            var template_search_places = $$('#my-search-place').html();
            var compiled_search_places = Template7.compile(template_search_places);
            app.request.json(link_region, function (places) {
              for (var i = 0; i < places.places.length; i++) {
                var sum_place = 0;
                dLat = (latitude - places.places[i]["latitude"]).toRad();
                dLon = (longitude - places.places[i]["longitude"]).toRad();
                dLat1 = (places.places[i]["latitude"] - 0).toRad();
                dLat2 = (latitude - 0).toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(dLat1) * Math.cos(dLat1) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                var n = parseFloat(d);
                d = Math.round(n * 1000) / 1000;
                var avg_point;
                if (places.places[i]["status"] == 1 && places.places[i]["featured"] == 1) {
                  if (places.places[i].rateplaces.length > 0) {
                    for (var j = 0; j < places.places[i].rateplaces.length; j++) {
                      sum_place += places.places[i].rateplaces[j]["point"];
                    }
                    avg_point = (sum_place / places.places[i].rateplaces.length).toFixed(1);
                  } else {
                    avg_point = 0;
                  }
                  var html = compiled_search_places({
                    image_place: places.places[i]["image"],
                    name_place: places.places[i]["name"],
                    description_place: places.places[i]["descripton"],
                    place_id: places.places[i]["id"],
                    kc: d + ' km',
                    avg: avg_point
                  });
                  $$('.search-place[data-page="list-search-place"] ul').append(html);
                }
              }
            });
          }

        }

      },
    }
  },

  {
    path: '/search_restaurants/',
    url: './pages/search_restaurants.html',
    on: {


      pageAfterIn: function (e, page) {
        //alert(page.route.query.slug);
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {

        var $$ = Dom7;
        var app = new Framework7();
        var searchbar = app.searchbar.create({
          el: '.searchbar-restaurant',
          searchContainer: '.list',
          searchIn: '.item-title',
          on: {
            search(sb, query, previousQuery) {
              //console.log(query, previousQuery);
            }
          }
        });
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

          if (page.route.query.region_id) {
            var link_region = 'http://toithichdoc.com/restaurants/index.json';

            var template_search_restaurants = $$('#my-search-restaurant').html();
            var compiled_search_restaurants = Template7.compile(template_search_restaurants);
            app.request.json(link_region, function (restaurants) {
              for (var i = 0; i < restaurants.restaurants.length; i++) {
                var sum_restaurant = 0;
                dLat = (latitude - restaurants.restaurants[i]["latitude"]).toRad();
                dLon = (longitude - restaurants.restaurants[i]["longitude"]).toRad();
                dLat1 = (restaurants.restaurants[i]["latitude"] - 0).toRad();
                dLat2 = (latitude - 0).toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(dLat1) * Math.cos(dLat1) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                var n = parseFloat(d);
                d = Math.round(n * 1000) / 1000;
                var avg_point;
                if (restaurants.restaurants[i]["status"] == 1 && restaurants.restaurants[i]["featured"] == 1) {
                  if (restaurants.restaurants[i]["region_id"] == page.route.query.region_id) {
                    if (restaurants.restaurants[i].raterestaurants.length > 0) {
                      for (var j = 0; j < restaurants.restaurants[i].raterestaurants.length; j++) {
                        sum_restaurant += restaurants.restaurants[i].raterestaurants[j]["point"];
                      }
                      avg_point = (sum_restaurant / restaurants.restaurants[i].raterestaurants.length).toFixed(1);
                    } else {
                      avg_point = 0;
                    }
                    var html = compiled_search_restaurants({
                      image_restaurant: restaurants.restaurants[i]["image"],
                      name_restaurant: restaurants.restaurants[i]["name"],
                      description_restaurant: restaurants.restaurants[i]["descripton"],
                      restaurant_id: restaurants.restaurants[i]["id"],
                      kc: d + ' km',
                      avg: avg_point
                    });
                    $$('.search-restaurant[data-page="list-search-restaurant"] ul').append(html);
                  }
                }
              }
            });
          } else {
            var link_region = 'http://toithichdoc.com/restaurants/index.json';

            var template_search_restaurants = $$('#my-search-restaurant').html();
            var compiled_search_restaurants = Template7.compile(template_search_restaurants);
            app.request.json(link_region, function (restaurants) {
              for (var i = 0; i < restaurants.restaurants.length; i++) {
                var sum_restaurant = 0;
                dLat = (latitude - restaurants.restaurants[i]["latitude"]).toRad();
                dLon = (longitude - restaurants.restaurants[i]["longitude"]).toRad();
                dLat1 = (restaurants.restaurants[i]["latitude"] - 0).toRad();
                dLat2 = (latitude - 0).toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(dLat1) * Math.cos(dLat1) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                var n = parseFloat(d);
                d = Math.round(n * 1000) / 1000;
                var avg_point;
                if (restaurants.restaurants[i]["status"] == 1 && restaurants.restaurants[i]["featured"] == 1) {
                  if (restaurants.restaurants[i].raterestaurants.length > 0) {
                    for (var j = 0; j < restaurants.restaurants[i].raterestaurants.length; j++) {
                      sum_restaurant += restaurants.restaurants[i].raterestaurants[j]["point"];
                    }
                    avg_point = (sum_restaurant / restaurants.restaurants[i].raterestaurants.length).toFixed(1);
                  } else {
                    avg_point = 0;
                  }
                  var html = compiled_search_restaurants({
                    image_restaurant: restaurants.restaurants[i]["image"],
                    name_restaurant: restaurants.restaurants[i]["name"],
                    description_restaurant: restaurants.restaurants[i]["descripton"],
                    restaurant_id: restaurants.restaurants[i]["id"],
                    kc: d + ' km',
                    avg: avg_point
                  });
                  $$('.search-restaurant[data-page="list-search-restaurant"] ul').append(html);
                }
              }
            });
          }

        }

      },
    }
  },

  {
    path: '/search_map_places/',
    url: './pages/search_map_places.html',
    on: {

      pageAfterIn: function (e, page) {

        var map;
        var markers = [];
        var dt;
        var centerMap = {
          lat: 12.267874,
          lng: 109.202376
        };
        var a;
        var b = [];
        var c;
        var d;
        var directionsService;
        var directionsDisplay;
        var stepDisplay;
        var markersDirection = [];
        var spLuongMarkerTrongCSDL;
        var $$ = Dom7;
        var app = new Framework7();
        var lat_dau = '';
        var lng_dau = '';
        var lat_cuoi = '';
        var lng_cuoi = '';
        var geocoder = new google.maps.Geocoder();
        var lat_hientai;
        var lng_hientai;
        var pos;

        function myMap() {
          map = new google.maps.Map(document.getElementById('googleMap'), {
            zoom: 13,
            center: centerMap,
            mapTypeId: google.maps.MapTypeId.ROADMAP

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

          try {

            if (navigator.geolocation) {

              // timeout at 60000 milliseconds (60 seconds)
              var options = {
                timeout: 60000
              };
              navigator.geolocation.getCurrentPosition(function (position) {

                pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                // alert("Latitude : " + latitude + " Longitude: " + longitude);
                handleLocationError(pos);
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

            function handleLocationError(pos) {

              var marker = new google.maps.Marker({
                position: pos,
                map: map,
                animation: google.maps.Animation.BOUNCE
              });
              var infowindow = new google.maps.InfoWindow({
                content: "Bạn đang ở đây!"
              });

              infowindow.open(map, marker);
              infoWindow.setPosition(pos);

              map.setCenter(pos);

            }


          } catch (error) {

          }

        }
        myMap();


        app.request.json("http://toithichdoc.com/places/index.json", function (hotels) {
          b = hotels.hotels;

          for (var i = 0; i < b.length; i++) {
            createMaker1(b[i]);
          }

        });

        var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
          inputEl: '#autocomplete-dropdown-ajax-typeahead',
          openIn: 'dropdown',
          preloader: true, //enable preloader
          /* If we set valueProperty to "id" then input value on select will be set according to this property */
          valueProperty: 'name', //object's "value" property name
          textProperty: 'name', //object's "text" property name
          limit: 20, //limit to 20 results
          typeahead: true,
          // dropdownPlaceholderText: 'Try "New Sun hotels"',
          source: function (query, render) {
            var autocomplete = this;
            var results = [];
            if (query.length === 0) {
              render(results);
              return;
            }
            // Show Preloader
            autocomplete.preloaderShow();

            app.request({
              url: 'http://toithichdoc.com/places/index.json',
              method: 'GET',
              dataType: 'json',
              //send "query" to server. Useful in case you generate response dynamically
              data: {
                query: query,
              },
              success: function (places) {
                // Find matched items
                f = places.places;
                for (var i = 0; i < f.length; i++) {
                  if (f[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(f[i]);
                }
                // Hide Preoloader
                autocomplete.preloaderHide();
                // Render items by passing array with result items
                render(results);
              }
            });

          }
        });

        function createMaker1(object) {
          var infowindow = new google.maps.InfoWindow({
            // content: object["name"],
            content: '<strong>' + object["name"] + '</strong> ' + '<p></p>' + '<a href="/content_hotels/?hotel_id=' + object["id"] + '">Xem địa điểm</a>'
          });
          var marker = new google.maps.Marker({
            position: {
              lat: parseFloat(object["latitude"]),
              lng: parseFloat(object["longitude"])
            },
            map: map,
            icon: {
              url: "./icons/place.png",
              scaledSize: new google.maps.Size(40, 40)
            }
          });
          // marker.addListener('mouseover', function () {
          //     infowindow.open(map, this);
          // });

          marker.addListener('click', function () {
            infowindow.open(map, this);
            map.setZoom(16);
            map.setCenter(marker.getPosition());
          });

          markers.push(marker);
        }
        $$('.Find-place').on('click', function () {

          var R = 6371;

          if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
              return this * Math.PI / 180;
            }
          }

          // for (var i = 0; i < markers.length; i++) {
          //   markers[i].setMap(map);
          // }
          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }
          directionsDisplay.setMap(null);

          var viTri = -1;
          var KC = app.form.convertToData('#khungnhaplieu1');
          var diemCanTim = app.form.convertToData('#my-form');

          if (diemCanTim.name == "") {
            alert("Hãy nhập địa điểm")
            for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(map);
            }
          } else {

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
              var vitri = 1;



              directionsDisplay.setMap(null)


              for (var i = 0; i <= markers.length; i++) {


                try {
                  // markers[i].setMap(null);
                  // alert(markers.length);
                  // alert( b[i]["latitude"]);
                  dLat = (latitude - b[i]["latitude"]).toRad();
                  dLon = (longitude - b[i]["longitude"]).toRad();
                  dLat1 = (b[i]["latitude"] - 0).toRad();
                  dLat2 = (latitude - 0).toRad();
                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  var d = R * c;

                  if (diemCanTim.name == b[i]["name"] && (KC.KC >= d || KC.KC == "")) { // so sánh điểm nhập với tên trong json

                    markers[i].setMap(map);
                    map.setCenter(markers[i].getPosition());
                    markers[i].setAnimation(google.maps.Animation.BOUNCE);
                    map.setZoom(14);
                    vitri = 0;
                  } else {
                    markers[i].setMap(null);
                    // }


                  }
                } catch (error) {

                }

              }

              if (vitri == 1) {

                alert("Không tìm được địa điểm này");
                for (var i = 0; i <= markers.length; i++) {
                  markers[i].setMap(map);
                }
              }
            }
          }
        });


        $$('.convert-form-to-data').on('click', function () {

          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }

          var R = 6371;

          if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
              return this * Math.PI / 180;
            }
          }


          markersDirection = [];
          // var oDiemDau = app.form.convertToData('#khungnhaplieu');
          var oDiemCuoi = app.form.convertToData('#my-form');
          var KC = app.form.convertToData('#khungnhaplieu1');

          for (var i = 0; i <= markers.length; i++) {

            try {
              if (oDiemCuoi.name == b[i]["name"]) {

                lat_cuoi = b[i]["latitude"];
                lng_cuoi = b[i]["longitude"];

                // alert(lat_cuoi +" "+  lng_cuoi );
              }
            } catch (error) {

            }

          }


          if (oDiemCuoi.name == "") {
            alert("Lỗi đầu vào");

          } else {


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

              var d;
              var dlat;
              var dlon;
              var dlat1;
              var dLat2;
              // infoWindow.setPosition(pos);
              directionsService.route({
                // origin: pos,
                origin: {
                  lat: latitude,
                  lng: longitude
                },
                destination: {
                  lat: parseFloat(lat_cuoi),
                  lng: parseFloat(lng_cuoi)
                },
                travelMode: 'WALKING'
              }, function (response, status) {

                // for (var i = 0; i <= markers.length; i++) {
                try {

                  dLat = (latitude - lat_cuoi - 0).toRad();
                  dLon = (longitude - lng_cuoi - 0).toRad();
                  dLat1 = (lat_cuoi - 0).toRad();
                  dLat2 = (latitude - 0).toRad();
                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  d = R * c;

                  if (status === 'OK' && (KC.KC >= d || KC.KC == "")) {
                    // alert(KC.KC);
                    // alert(d);
                    directionsDisplay.setMap(map);
                    directionsDisplay.setDirections(response);
                    if (markers.length > 0)
                      for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                      }
                    showSteps(response);
                  } else {
                    directionsDisplay.setMap(null);
                    window.alert("Không tìm được đường đi!");
                    for (var i = 0; i < markers.length; i++) {
                      markers[i].setMap(map);
                    }
                  }
                } catch (error) {

                }
              });

            }
          }
        });

        $$('.find-distance').on('click', function () {
          var R = 6371;

          if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
              return this * Math.PI / 180;
            }
          }

          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }

          markersDirection = [];
          var KC = app.form.convertToData('#khungnhaplieu1');


          for (var i = 0; i <= markers.length; i++) {

            try {} catch (error) {

            }

          }


          if (KC.KC == "") {
            for (i = 0; i < markersDirection.length; i++) {
              markersDirection[i].setMap(null);
            }
            for (i = 0; i < markers.length; i++) {
              markers[i].setMap(map);
            }
            directionsDisplay.setMap(null);
          } else {


            if (navigator.geolocation) {

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



              directionsDisplay.setMap(null);
              for (var i = 0; i < markers.length; i++) {

                try {

                  dLat = (latitude - b[i]["latitude"]).toRad();
                  dLon = (longitude - b[i]["longitude"]).toRad();
                  dLat1 = (b[i]["latitude"] - 0).toRad();
                  dLat2 = (latitude - 0).toRad();
                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  var d = R * c;
                  // alert(d);
                  if (KC.KC >= d) {
                    // alert(markers.length);
                    markers[i].setMap(map);
                    // alert(d);
                  } else {
                    markers[i].setMap(null);
                  }
                  //  alert(dLat + " " + dLon + " " +  dLat1 + " " + dLat2 + " " + latitude + " " + longitude );
                } catch (error) {}
              }
            }
          }
        });

        function showSteps(directionResult) {
          var myRoute = directionResult.routes[0].legs[0];

          for (var i = 0; i < myRoute.steps.length; i++) {
            var icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + i + "|FF0000|000000";
            if (i == 0) {
              icon = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|car-dealer|00FFFF|FF0000";
            }
            var marker = new google.maps.Marker({
              position: myRoute.steps[i].start_point,
              map: map,
              icon: icon
            });
            attachInstructionText(marker, myRoute.steps[i].instructions);
            markersDirection.push(marker);
          }
          var marker = new google.maps.Marker({
            position: myRoute.steps[i - 1].end_point,
            map: map,
            icon: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|ADDE63"
          });
          markersDirection.push(marker);

          google.maps.event.trigger(markersDirection[0], "click");
        }

        function attachInstructionText(marker, text) {
          google.maps.event.addListener(marker, 'click', function () {
            // Open an info window when the marker is clicked on,
            // containing the text of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
          });
        }
      },
      pageInit: function (e, page) {
        // do something when page initialized
      },
    }
  },

  {
    path: '/search_map_restaurants/',
    url: './pages/search_map_restaurants.html',
    on: {

      pageAfterIn: function (e, page) {

        var map;
        var markers = [];
        var dt;
        var centerMap = {
          lat: 12.267874,
          lng: 109.202376
        };
        var a;
        var b = [];
        var c;
        var d;
        var directionsService;
        var directionsDisplay;
        var stepDisplay;
        var markersDirection = [];
        var spLuongMarkerTrongCSDL;
        var $$ = Dom7;
        var app = new Framework7();
        var lat_dau = '';
        var lng_dau = '';
        var lat_cuoi = '';
        var lng_cuoi = '';
        var geocoder = new google.maps.Geocoder();
        var lat_hientai;
        var lng_hientai;
        var pos;

        function myMap() {
          map = new google.maps.Map(document.getElementById('googleMap'), {
            zoom: 13,
            center: centerMap,
            mapTypeId: google.maps.MapTypeId.ROADMAP

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

          try {

            if (navigator.geolocation) {

              // timeout at 60000 milliseconds (60 seconds)
              var options = {
                timeout: 60000
              };
              navigator.geolocation.getCurrentPosition(function (position) {

                pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                // alert("Latitude : " + latitude + " Longitude: " + longitude);
                handleLocationError(pos);
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

            function handleLocationError(pos) {

              var marker = new google.maps.Marker({
                position: pos,
                map: map,
                animation: google.maps.Animation.BOUNCE
              });
              var infowindow = new google.maps.InfoWindow({
                content: "Bạn đang ở đây!"
              });

              infowindow.open(map, marker);
              infoWindow.setPosition(pos);

              map.setCenter(pos);

            }


          } catch (error) {

          }

        }
        myMap();


        app.request.json("http://toithichdoc.com/restaurants/index.json", function (hotels) {
          b = hotels.hotels;

          for (var i = 0; i < b.length; i++) {
            createMaker1(b[i]);
          }

        });

        var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
          inputEl: '#autocomplete-dropdown-ajax-typeahead',
          openIn: 'dropdown',
          preloader: true, //enable preloader
          /* If we set valueProperty to "id" then input value on select will be set according to this property */
          valueProperty: 'name', //object's "value" property name
          textProperty: 'name', //object's "text" property name
          limit: 20, //limit to 20 results
          typeahead: true,
          // dropdownPlaceholderText: 'Try "New Sun hotels"',
          source: function (query, render) {
            var autocomplete = this;
            var results = [];
            if (query.length === 0) {
              render(results);
              return;
            }
            // Show Preloader
            autocomplete.preloaderShow();

            app.request({
              url: 'http://toithichdoc.com/restaurants/index.json',
              method: 'GET',
              dataType: 'json',
              //send "query" to server. Useful in case you generate response dynamically
              data: {
                query: query,
              },
              success: function (restaurants) {
                // Find matched items
                f = restaurants.restaurants;
                for (var i = 0; i < f.length; i++) {
                  if (f[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(f[i]);
                }
                // Hide Preoloader
                autocomplete.preloaderHide();
                // Render items by passing array with result items
                render(results);
              }
            });

          }
        });

        function createMaker1(object) {
          var infowindow = new google.maps.InfoWindow({
            // content: object["name"],
            content: '<strong>' + object["name"] + '</strong> ' + '<p></p>' + '<a href="/content_hotels/?hotel_id=' + object["id"] + '">Xem địa điểm</a>'
          });
          var marker = new google.maps.Marker({
            position: {
              lat: parseFloat(object["latitude"]),
              lng: parseFloat(object["longitude"])
            },
            map: map,
            icon: {
              url: "./icons/restaurant.png",
              scaledSize: new google.maps.Size(40, 40)
            }
          });
          // marker.addListener('mouseover', function () {
          //     infowindow.open(map, this);
          // });

          marker.addListener('click', function () {
            infowindow.open(map, this);
            map.setZoom(16);
            map.setCenter(marker.getPosition());
          });

          markers.push(marker);
        }
        $$('.Find-place').on('click', function () {

          var R = 6371;

          if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
              return this * Math.PI / 180;
            }
          }

          // for (var i = 0; i < markers.length; i++) {
          //   markers[i].setMap(map);
          // }
          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }
          directionsDisplay.setMap(null);

          var viTri = -1;
          var KC = app.form.convertToData('#khungnhaplieu1');
          var diemCanTim = app.form.convertToData('#my-form');

          if (diemCanTim.name == "") {
            alert("Hãy nhập địa điểm")
            for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(map);
            }
          } else {

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
              var vitri = 1;



              directionsDisplay.setMap(null)


              for (var i = 0; i <= markers.length; i++) {


                try {
                  // markers[i].setMap(null);
                  // alert(markers.length);
                  // alert( b[i]["latitude"]);
                  dLat = (latitude - b[i]["latitude"]).toRad();
                  dLon = (longitude - b[i]["longitude"]).toRad();
                  dLat1 = (b[i]["latitude"] - 0).toRad();
                  dLat2 = (latitude - 0).toRad();
                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  var d = R * c;

                  if (diemCanTim.name == b[i]["name"] && (KC.KC >= d || KC.KC == "")) { // so sánh điểm nhập với tên trong json

                    markers[i].setMap(map);
                    map.setCenter(markers[i].getPosition());
                    markers[i].setAnimation(google.maps.Animation.BOUNCE);
                    map.setZoom(14);
                    vitri = 0;
                  } else {
                    markers[i].setMap(null);
                    // }


                  }
                } catch (error) {

                }

              }

              if (vitri == 1) {

                alert("Không tìm được địa điểm này");
                for (var i = 0; i <= markers.length; i++) {
                  markers[i].setMap(map);
                }
              }
            }
          }
        });


        $$('.convert-form-to-data').on('click', function () {

          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }

          var R = 6371;

          if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
              return this * Math.PI / 180;
            }
          }


          markersDirection = [];
          // var oDiemDau = app.form.convertToData('#khungnhaplieu');
          var oDiemCuoi = app.form.convertToData('#my-form');
          var KC = app.form.convertToData('#khungnhaplieu1');

          for (var i = 0; i <= markers.length; i++) {

            try {
              if (oDiemCuoi.name == b[i]["name"]) {

                lat_cuoi = b[i]["latitude"];
                lng_cuoi = b[i]["longitude"];

                // alert(lat_cuoi +" "+  lng_cuoi );
              }
            } catch (error) {

            }

          }


          if (oDiemCuoi.name == "") {
            alert("Lỗi đầu vào");

          } else {


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

              var d;
              var dlat;
              var dlon;
              var dlat1;
              var dLat2;
              // infoWindow.setPosition(pos);
              directionsService.route({
                // origin: pos,
                origin: {
                  lat: latitude,
                  lng: longitude
                },
                destination: {
                  lat: parseFloat(lat_cuoi),
                  lng: parseFloat(lng_cuoi)
                },
                travelMode: 'WALKING'
              }, function (response, status) {

                // for (var i = 0; i <= markers.length; i++) {
                try {

                  dLat = (latitude - lat_cuoi - 0).toRad();
                  dLon = (longitude - lng_cuoi - 0).toRad();
                  dLat1 = (lat_cuoi - 0).toRad();
                  dLat2 = (latitude - 0).toRad();
                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  d = R * c;

                  if (status === 'OK' && (KC.KC >= d || KC.KC == "")) {
                    // alert(KC.KC);
                    // alert(d);
                    directionsDisplay.setMap(map);
                    directionsDisplay.setDirections(response);
                    if (markers.length > 0)
                      for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                      }
                    showSteps(response);
                  } else {
                    directionsDisplay.setMap(null);
                    window.alert("Không tìm được đường đi!");
                    for (var i = 0; i < markers.length; i++) {
                      markers[i].setMap(map);
                    }
                  }
                } catch (error) {

                }
              });

            }
          }
        });

        $$('.find-distance').on('click', function () {
          var R = 6371;

          if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
              return this * Math.PI / 180;
            }
          }

          for (i = 0; i < markersDirection.length; i++) {
            markersDirection[i].setMap(null);
          }

          markersDirection = [];
          var KC = app.form.convertToData('#khungnhaplieu1');


          for (var i = 0; i <= markers.length; i++) {

            try {} catch (error) {

            }

          }


          if (KC.KC == "") {
            for (i = 0; i < markersDirection.length; i++) {
              markersDirection[i].setMap(null);
            }
            for (i = 0; i < markers.length; i++) {
              markers[i].setMap(map);
            }
            directionsDisplay.setMap(null);
          } else {


            if (navigator.geolocation) {

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



              directionsDisplay.setMap(null);
              for (var i = 0; i < markers.length; i++) {

                try {

                  dLat = (latitude - b[i]["latitude"]).toRad();
                  dLon = (longitude - b[i]["longitude"]).toRad();
                  dLat1 = (b[i]["latitude"] - 0).toRad();
                  dLat2 = (latitude - 0).toRad();
                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  var d = R * c;
                  // alert(d);
                  if (KC.KC >= d) {
                    // alert(markers.length);
                    markers[i].setMap(map);
                    // alert(d);
                  } else {
                    markers[i].setMap(null);
                  }
                  //  alert(dLat + " " + dLon + " " +  dLat1 + " " + dLat2 + " " + latitude + " " + longitude );
                } catch (error) {}
              }
            }
          }
        });

        function showSteps(directionResult) {
          var myRoute = directionResult.routes[0].legs[0];

          for (var i = 0; i < myRoute.steps.length; i++) {
            var icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + i + "|FF0000|000000";
            if (i == 0) {
              icon = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|car-dealer|00FFFF|FF0000";
            }
            var marker = new google.maps.Marker({
              position: myRoute.steps[i].start_point,
              map: map,
              icon: icon
            });
            attachInstructionText(marker, myRoute.steps[i].instructions);
            markersDirection.push(marker);
          }
          var marker = new google.maps.Marker({
            position: myRoute.steps[i - 1].end_point,
            map: map,
            icon: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|ADDE63"
          });
          markersDirection.push(marker);

          google.maps.event.trigger(markersDirection[0], "click");
        }

        function attachInstructionText(marker, text) {
          google.maps.event.addListener(marker, 'click', function () {
            // Open an info window when the marker is clicked on,
            // containing the text of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
          });
        }
      },
      pageInit: function (e, page) {
        // do something when page initialized
      },
    }
  },

  {
    path: '/search_vehicles/',
    url: './pages/search_vehicles.html',
    on: {


      pageAfterIn: function (e, page) {
        //alert(page.route.query.slug);
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {

        var $$ = Dom7;
        var app = new Framework7();
        var searchbar = app.searchbar.create({
          el: '.searchbar-vehicle',
          searchContainer: '.list',
          searchIn: '.item-title',
          on: {
            search(sb, query, previousQuery) {
              //console.log(query, previousQuery);
            }
          }
        });
        if (page.route.query.region_id) {
          var link_region = 'http://toithichdoc.com/regions/view/' + page.route.query.region_id + '.json';

          var template_search_vehicles = $$('#my-search-vehicle').html();
          var compiled_search_vehicles = Template7.compile(template_search_vehicles);
          app.request.json(link_region, function (region) {
            for (var i = 0; i < region.region.vehicles.length; i++) {
              if (region.region.vehicles[i]["status"] == 1 && region.region.vehicles[i]["featured"] == 1) {
                var html = compiled_search_vehicles({
                  image_vehicle: region.region.vehicles[i]["image"],
                  name_vehicle: region.region.vehicles[i]["name"],
                  description_vehicle: region.region.vehicles[i]["descripton"],
                  vehicle_id: region.region.vehicles[i]["id"],
                });
                $$('.search-vehicle[data-page="list-search-vehicle"] ul').append(html);
              }
            }
          });
        } else {
          var link_region = 'http://toithichdoc.com/vehicles/index.json';

          var template_search_vehicles = $$('#my-search-vehicle').html();
          var compiled_search_vehicles = Template7.compile(template_search_vehicles);
          app.request.json(link_region, function (vehicles) {
            for (var i = 0; i < vehicles.vehicles.length; i++) {
              if (vehicles.vehicles[i]["status"] == 1 && vehicles.vehicles[i]["featured"] == 1) {
                var html = compiled_search_vehicles({
                  image_vehicle: vehicles.vehicles[i]["image"],
                  name_vehicle: vehicles.vehicles[i]["name"],
                  description_vehicle: vehicles.vehicles[i]["descripton"],
                  vehicle_id: vehicles.vehicles[i]["id"],
                });
                $$('.search-vehicle[data-page="list-search-vehicle"] ul').append(html);
              }
            }
          });
        }

      },
    }
  },

  {
    path: '/search_tours/',
    url: './pages/search_tours.html',
    on: {


      pageAfterIn: function (e, page) {
        //alert(page.route.query.slug);
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {

        var $$ = Dom7;
        var app = new Framework7();
        var searchbar = app.searchbar.create({
          el: '.searchbar-tour',
          searchContainer: '.list',
          searchIn: '.item-title',
          on: {
            search(sb, query, previousQuery) {
              //console.log(query, previousQuery);
            }
          }
        });
        if (page.route.query.region_id) {
          var link_region = 'http://toithichdoc.com/regions/view/' + page.route.query.region_id + '.json';

          var template_search_tours = $$('#my-search-tour').html();
          var compiled_search_tours = Template7.compile(template_search_tours);
          app.request.json(link_region, function (region) {
            for (var i = 0; i < region.region.tours.length; i++) {
              if (region.region.tours[i]["status"] == 1 && region.region.tours[i]["featured"] == 1) {
                var html = compiled_search_tours({
                  image_tour: region.region.tours[i]["image"],
                  name_tour: region.region.tours[i]["name"],
                  description_tour: region.region.tours[i]["descripton"],
                  tour_id: region.region.tours[i]["id"],
                });
                $$('.search-tour[data-page="list-search-tour"] ul').append(html);
              }
            }
          });
        } else {
          var link_region = 'http://toithichdoc.com/tours/index.json';

          var template_search_tours = $$('#my-search-tour').html();
          var compiled_search_tours = Template7.compile(template_search_tours);
          app.request.json(link_region, function (tours) {
            for (var i = 0; i < tours.tours.length; i++) {
              if (tours.tours[i]["status"] == 1 && tours.tours[i]["featured"] == 1) {
                var html = compiled_search_tours({
                  image_tour: tours.tours[i]["image"],
                  name_tour: tours.tours[i]["name"],
                  description_tour: tours.tours[i]["descripton"],
                  tour_id: tours.tours[i]["id"],
                });
                $$('.search-tour[data-page="list-search-tour"] ul').append(html);
              }
            }
          });
        }
      },
    }
  },

  {
    path: '/map/',
    url: './pages/map.html',
  },
  {
    path: '/list_events/',
    url: './pages/list_events.html',
    on: {

      pageAfterIn: function (e, page) {


      },
      pageInit: function (e, page) {
        // do something when page initialized
      },
    }
  },

  {
    path: '/content_user/',
    url: './pages/content_user.html',
    on: {

      pageAfterIn: function (e, page) {


      },
      pageInit: function (e, page) {
        // do something when page initialized
        var $$ = Dom7;
        var app = new Framework7();

        var link_profile = 'http://toithichdoc.com/users/view/' + page.route.query.user_id + '.json';
        //alert(link_profile);
        //var link_user = 'http://toithichdoc.com/users/view/' + localStorage.user_id_save + '.json';

        //du lieu theo doi
        var template_follow = $$('#my-follow').html();
        var compiled_follow = Template7.compile(template_follow);
        app.request.json(link_profile, function (user) {
          status_user = false;
          for (var i = 0; i < user.user.followings_user.length; i++) {
            if (user.user.followings_user[i]['followings_id'] == localStorage.user_id_save) {
              status_user = true;
            } else {
              status_user = false;
            }
          }
          var html = compiled_follow({
            status_user: status_user
          });
          $$('.link-follow').append(html);

        });



        $$('.link-follow').on('click', function () {
          $$('.link-follow').html('');
          app.request.json(link_profile, function (user) {
            status_user1 = false;
            for (var i = 0; i < user.user.followings_user.length; i++) {
              if (user.user.followings_user[i]['followings_id'] == localStorage.user_id_save) {
                var link = 'http://toithichdoc.com/followings/delete/' + user.user.followings_user[i]['id'] + '.json';
                status_user1 = true;
              } else {
                status_user1 = false;
              }
            }
            if (status_user1) {

              alert(link);
              app.request({
                url: link,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Hủy theo dõi thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });

              var html = compiled_follow({
                status_user: false
              });
              $$('.link-follow').append(html);

            } else {
              //console.log(likehotels.likehotels[i]);
              var link = 'http://toithichdoc.com/followings/add.json';
              app.request({
                url: link,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                  "followings_id": localStorage.user_id_save,
                  "user_id": page.route.query.user_id
                }),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Theo dõi thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });
              var html = compiled_follow({
                status_user: true
              });
              $$('.link-follow').append(html);

            }

          });
        });
        if (page.route.query.user_id == localStorage.user_id_save) {
          //console.log('1111');
          $$('.card-status').hide();
        }

        //du lieu title name
        var template_content_user_title = $$('#my-content-user-title').html();
        var compiled_content_user_title = Template7.compile(template_content_user_title);
        app.request.json(link_profile, function (user) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_user_title({
            name_user_title: user.user["username"],
            user_id_save: localStorage.user_id_save,
            user_id: page.route.query.user_id
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-content-user-title"]').append(html);
          //}

        });

        //du lieu header 
        var template_content_user_header = $$('#my-user-header').html();
        var compiled_content_user_header = Template7.compile(template_content_user_header);
        app.request.json(link_profile, function (user) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_user_header({
            image_cover_user: user.user["cover"],
            image_avatar_user: user.user["image"],
            name_user: user.user["username"]
          });
          //console.log(html);
          $$('.user-header[data-page="page-user-header"]').append(html);
          //}

        });

        //dem so luong theo doi
        var template_followings = $$('#count-followings').html();
        var compiled_followings = Template7.compile(template_followings);
        app.request.json(link_profile, function (followings) {
          var html = compiled_followings({
            user_id: followings.user['id'],
            count_following: followings.user.followings.length,
          });
          $$('.count-followings').append(html);
        });
        //dem so luong nguoi theo doi
        var template_follower = $$('#count-followers').html();
        var compiled_follower = Template7.compile(template_follower);
        app.request.json(link_profile, function (followers) {
          var html = compiled_follower({
            user_id: followers.user['id'],
            count_follower: followers.user.followings_user.length,
          });
          $$('.count-followers').append(html);
        });
        //dem so luong bai review
        var template_review = $$('#count-reviews').html();
        var compiled_review = Template7.compile(template_review);
        app.request.json(link_profile, function (reviews) {
          var html = compiled_review({
            count_review: reviews.user.reviews.length,
          });
          $$('.count-reviews').append(html);
        });
        //dem so luong bai da luu
        var template_save = $$('#count-save').html();
        var compiled_save = Template7.compile(template_save);
        app.request.json(link_profile, function (save) {
          var sum = save.user.liketours.length + save.user.likevehicles.length + save.user.likeplaces.length + save.user.likeevents.length + save.user.likerestaurants.length + save.user.likehotels.length;
          var html = compiled_save({
            count_save: sum,
          });
          $$('.count-save').append(html);
        });
        //dem so luong bai da them
        var template_add = $$('#count-adds').html();
        var compiled_add = Template7.compile(template_add);
        app.request.json(link_profile, function (adds) {
          var sum_add = adds.user.hotels.length + adds.user.restaurants.length + adds.user.places.length;
          var html = compiled_add({
            user_id: adds.user['id'],
            count_add: sum_add,
          });
          $$('.count-adds').append(html);
        });
        //dem so luong bai chuyen di
        var template_plan = $$('#count-plans').html();
        var compiled_plan = Template7.compile(template_plan);
        app.request.json(link_profile, function (plans) {
          var html = compiled_plan({
            user_id: plans.user['id'],
            count_plan: plans.user.plans.length,
          });
          $$('.count-plans').append(html);
        });

        //du lieu review cua toi
        var template_profile_user = $$('#my-profile-user').html();
        var compiled_profile_user = Template7.compile(template_profile_user);
        app.request.json("http://toithichdoc.com/reviews/index.json", function (review_profile) {
          for (var i = 0; i < review_profile.reviews.length; i++) {
            //console.log(review_user.users_reviews[i]['id']);
            //console.log(localStorage.user_id_save);
            if (review_profile.reviews[i].user['id'] == page.route.query.user_id) {
              //alert('1111');
              var html = compiled_profile_user({
                avatar_user_review_user: review_profile.reviews[i].user["image"],
                user_name_review_user: review_profile.reviews[i].user["username"],
                created_review_user: review_profile.reviews[i]["created"],
                name_review_user: review_profile.reviews[i]["name"],
                image_review_user: review_profile.reviews[i]["image"],
                id_review_user: review_profile.reviews[i]["id"]
              });
              $$('.profile-user[data-page="page-profile-user"]').append(html);
            }
          }
        });

      },
    }
  },

  {
    path: '/content_plans/',
    url: './pages/content_plans.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {

        // do something when page initialized
        var $$ = Dom7;
        var app = new Framework7();
        var place;
        var names;
        var images;
        var detail1;
        var ids;
        var startpoints;
        var endpoints;
        var timestamp = new Date();
        //alert(page.route.query.id_trip_plan);
        app.toolbar.show('.toolbar-comment');
        var link_detail = 'http://toithichdoc.com/details/index.json';
        // var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.id_trip_plan + '.json';
        var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.id_trip_plan + '.json';


        //du lieu comment
        var template_from_detail_content = $$('#my-name-from-detail-content').html();
        var compiled_from_detail_content = Template7.compile(template_from_detail_content);
        app.request.json(link_detail, function (from_detail) {
          //console.log(hotel_form_rate.ratehotels.user);
          app.request.json("http://toithichdoc.com/places/index.json", function (places) {
            place = places.places;

            for (var i = 0; i < from_detail.details.length; i++) {

              if (from_detail.details[i]["plan_id"] == page.route.query.id_trip_plan) {
                for (var j = 0; j < place.length; j++) {
                  if (from_detail.details[i]["place_id"] == place[j]["id"]) {
                    names = place[j]["name"];
                    images = place[j]["image"];
                    ids = place[j]["id"];
                  }
                }
                // alert(from_detail.details[i]["date"] + from_detail.details[i]["timemove"] + from_detail.details[i]["timevisit"]);
                var html = compiled_from_detail_content({
                  place_id: ids,
                  edit_detail_id: from_detail.details[i]["id"],
                  image: images,
                  name: names,
                  date: from_detail.details[i]["date"],
                  timemove: from_detail.details[i]["timemove"],
                  timevisit: from_detail.details[i]["timevisit"]
                });
                //console.log(html);
                $$('.list-from-detail-content[data-page="page-name-from-detail-content"]').append(html);
              }
            }
          });
        });

        if (localStorage.user_id_save) {

          var template_plan_login_like = $$('#plan-login-like').html();
          var compiled_plan_login_like = Template7.compile(template_plan_login_like);

          var html = compiled_plan_login_like({
            like: "save-plan",

          });
          //console.log(html);
          $$('.fab-right-bottom[data-page="page-name-plan-login-like"]').append(html);


        } else {
          app.dialog.create({
            title: 'Thông báo',
            text: 'Đăng nhập để lưu địa điểm',
            buttons: [{
                text: 'Yes',
                onClick: function () {
                  app.router.navigate('/login/');
                }
              },
              {
                text: 'No',
              },
            ],
            verticalButtons: true,
          }).open();
        }


        $$('.send-link-comment').on('click', function () {
          var content_comment = $$('[name="comment-plan"]').val();
          if (localStorage.user_id_save) {
            app.request({
              url: 'http://toithichdoc.com/commentplans/edit/2.json',
              method: 'POST',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "user_id": localStorage.user_id_save,
                "plan_id": page.route.query.id_trip_plan,
                "content": content_comment
              }),
              success: function (data) {
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Bình luận thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();

                $$('[name="comment-plan"]').val('');
                var date_time = timestamp.getFullYear() + '-' + timestamp.getMonth() + '-' + timestamp.getDate() + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes();
                //  console.log("amen");
                var html = '<li>' +
                  '<a class="item-content">' +
                  '<div class="item-media">' +
                  '<img src="' + localStorage.user_image_save + '" width="50" class="message-avatar" />' +
                  '</div>' +
                  '<div class="item-inner">' +
                  '<div class="item-title-row">' +
                  '<div class="item-title" style="font-size: 14px;">' + localStorage.user_name_save + '</div>' +
                  '<div class="item-after" style="font-size: 12px;">' + date_time + '</div>' +
                  '</div>' +
                  '<div class="item-text" style="font-size: 11px;">' + content_comment + '</div>' +
                  '</div>' +
                  '</a>' +
                  '</li>';
                // console.log("lay hon");
                document.getElementById("list-content-plan-comment").innerHTML += html;
                //page.view.router.navigate(url_refesh);
                // console.log("hu cau");
                $$('.page-content').scrollTop(5000);
              },
              error: function (xhr, status) {
                alert('Error: ' + JSON.stringify(xhr));
                alert('ErrorStatus: ' + JSON.stringify(status));
              }
            });

          } else {
            app.dialog.create({
              title: 'Thông báo',
              text: 'Vui lòng đăng nhập',
              buttons: [{
                  text: 'Yes',
                  onClick: function () {
                    app.router.navigate('/login/');
                  }
                },
                {
                  text: 'No',
                },
              ],
              verticalButtons: true,
            }).open();
          }



        });


        //nut luu bai viet
        var template_save = $$('#save-plan').html();
        var compiled_save = Template7.compile(template_save);
        app.request.json('http://toithichdoc.com/likeplans/index.json', function (likeplans) {
          for (var i = 0; i < likeplans.likeplans.length; i++) {
            if (likeplans.likeplans[i]['plan_id'] == page.route.query.id_trip_plan && likeplans.likeplans[i]['user_id'] == localStorage.user_id_save) {
              var html = compiled_save({
                status: true,
              });
              //console.log(html);
              $$('.save-plan').append(html);
            } else {
              var html = compiled_save({
                status: false,
              });
              //console.log(html);
              $$('.save-plan').append(html);
            }
          }
        });

        $$('.save-plan').on('click', function () {
          app.request.json('http://toithichdoc.com/likeplans/index.json', function (likeplans) {
            for (var i = 0; i < likeplans.likeplans.length; i++) {
              if (likeplans.likeplans[i]['plan_id'] == page.route.query.id_trip_plan && likeplans.likeplans[i]['user_id'] == localStorage.user_id_save) {
                console.log(likeplans.likeplans[i]);
                var link = 'http://toithichdoc.com/likeplans/delete/' + likeplans.likeplans[i]['id'] + '.json'
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify(),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Hủy lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });
              } else {
                //console.log(likeplans.likeplans[i]);
                var link = 'http://toithichdoc.com/likeplans/add.json'
                app.request({
                  url: link,
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "user_id": localStorage.user_id_save,
                    "plan_id": page.route.query.id_trip_plan
                  }),
                  success: function (data) {
                    app.dialog.create({
                      title: 'Thông báo',
                      text: 'Lưu thành công',
                      buttons: [{
                        text: 'Ok',
                      }, ],
                      verticalButtons: true,
                    }).open();
                  },
                  error: function (xhr, status) {
                    alert('Lỗi: ' + JSON.stringify(xhr));
                    alert('Thông báo lỗi: ' + JSON.stringify(status));
                  }
                });
              }
            }
          });
        });




        //du lieu title name
        var template_content_plan_title = $$('#my-content-plan-title').html();
        var compiled_content_plan_title = Template7.compile(template_content_plan_title);
        app.request.json(link_plan, function (plan) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_plan_title({
            name_title: plan.plan["name"],
          });
          //console.log(html);
          $$('.title[data-page="page-content-plan-title"]').append(html);
          //}
        });
        app.request.json("http://toithichdoc.com/plans/index.json", function (plans) {
          a = plans.plans;

          for (var i = 0; i < a.length; i++) {
            // && page.route.query.id_trip_plan == a[i]["id"]
            if (localStorage.user_id_save == a[i]["user_id"] && page.route.query.id_trip_plan == a[i]["id"]) {
              var template_content_plan_id = $$('#my-plan-content').html();
              var compiled_content_plan_id = Template7.compile(template_content_plan_id);
              app.request.json(link_plan, function (plan) {
                //for (var i = 0; i < regions.regions.length; i++) {
                var html = compiled_content_plan_id({

                  id_plan: plan.plan["id"],
                  plan_id: plan.plan["id"],


                });
                //console.log(html);
                $$('.list[data-page="page-plan-content"]').append(html);
                //}

              });
            }
          }
        });




        //du lieu hinh anh
        var template_content_plan_image = $$('#my-content-plan-image').html();
        var compiled_content_plan_image = Template7.compile(template_content_plan_image);
        app.request.json(link_plan, function (plan_image) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_plan_image({
            image: plan_image.plan["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-content-plan-image"]').append(html);
          //}

        });

        //du lieu name 
        var template_content_plan_name = $$('#my-content-plan-name').html();
        var compiled_content_plan_name = Template7.compile(template_content_plan_name);
        app.request.json(link_plan, function (plan_name) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_plan_name({
            name: plan_name.plan["name"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-content-plan-name"]').append(html);
          //}

        });

        //du lieu introduce
        var template_content_plan_introduce = $$('#my-content-plan-introduce').html();
        var compiled_content_plan_introduce = Template7.compile(template_content_plan_introduce);
        app.request.json(link_plan, function (plan_introduce) {
          app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
            app.request.json("http://toithichdoc.com/details/index.json", function (details) {
              var sum = 0;
              region = regions.regions;
              //console.log(region);
              if (plan_introduce.plan["id"] == page.route.query.id_trip_plan) {
                for (var j = 0; j < region.length; j++) {
                  if (plan_introduce.plan["start_point"] == region[j]["id"]) {
                    startpoints = region[j]["name"];
                    for (var k = 0; k < region.length; k++) {
                      if (plan_introduce.plan["arrival_point"] == region[k]["id"]) {
                        endpoints = region[k]["name"];
                      }
                    }
                  }
                }

                for (var i = 0; i < details.details.length; i++) {
                  if (details.details[i]['plan_id'] == page.route.query.id_trip_plan) {
                    sum += details.details[i].place['price'];
                  }
                }

                var html = compiled_content_plan_introduce({
                  start: plan_introduce.plan["start"],
                  end: plan_introduce.plan["end"],
                  startpoint: startpoints,
                  arrivalpoint: endpoints,
                  price_plan: sum
                });

                //console.log(html);
                $$('.item-inner[data-page="page-content-plan-introduce"]').append(html);
              }
            });
          });
        });

        //du lieu comment
        var template_content_plan_comment = $$('#my-content-plan-comment').html();
        var compiled_content_plan_comment = Template7.compile(template_content_plan_comment);
        app.request.json(link_plan, function (plan_comment) {
          // console.log(plan_comment.plan.commentplans);
          // console.log("aaaa");
          for (var i = 0; i < plan_comment.plan.commentplans.length; i++) {
            //console.log(plan_comment.commentplans[i]);
            var html = compiled_content_plan_comment({
              image_user: plan_comment.commentplans[i].user["image"],
              username: plan_comment.commentplans[i].user["username"],
              created: plan_comment.commentplans[i]["created"],
              content: plan_comment.commentplans[i]["content"],
            });
            $$('.list-form-rate[data-page="page-content-plan-comment"]').append(html);
          }
        });

        // //remove load page
        // app.request.json(link_plan, function (count_plan_comment) {
        //   //console.log(event_content);
        //   var lastItemIndex = $$('.list .list-form-rate li').length;
        //   if (count_plan_comment.commentplans.length == lastItemIndex) {
        //     $$('.infinite-scroll-preloader').remove();
        //   }
        // });


      },
    }
  },

  {
    path: '/edit_review/',
    url: './pages/edit_review.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
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

        page.route.query.id_review


        var k;
        // var content_comment = $$('[name="comment-review"]').val();
        // var content_comment = $$('[name="comment-review"]').val();
        // var content_comment = $$('[name="comment-review"]').val();
        // var content_comment = $$('[name="comment-review"]').val();
        // var content_comment = $$('[name="comment-review"]').val();

        console.log(page.route.query.id_review);
        var template_content_review_image = $$('#my-content-review-image').html();
        var compiled_content_review_image = Template7.compile(template_content_review_image);
        var link_review = 'http://toithichdoc.com/reviews/view/' + page.route.query.id_review + '.json';
        app.request.json(link_review, function (review) {

          a = review.review;
          console.log(a["image"]);
          console.log(a["name"]);
          // console.log(a["title"]);
          console.log(a["address"]);
          console.log(a["description"]);
          var html = compiled_content_review_image({
            image_avatar_review_change: a["image"],
          });

          $$('.review-image[data-page="page-content-review-image"]').append(html);
          // document.getElementById("image1").value = a["image"];
          document.getElementById("title").value = a["name"];
          // document.getElementById("title").value = a["title"];
          document.getElementById("address").value = a["address"];
          document.getElementById("description").value = a["description"];


        });


        // var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
        //   inputEl: '#autocomplete-dropdown-ajax-typeahead',
        //   openIn: 'dropdown',
        //   preloader: true, //enable preloader
        //   /* If we set valueProperty to "id" then input value on select will be set according to this property */
        //   valueProperty: 'name', //object's "value" property name
        //   textProperty: 'name', //object's "text" property name
        //   limit: 20, //limit to 20 results
        //   typeahead: true,
        //   dropdownPlaceholderText: 'Try "JavaScript"',
        //   source: function (query, render) {
        //     var autocomplete = this;
        //     var results = [];
        //     if (query.length === 0) {
        //       render(results);
        //       return;
        //     }
        //     // Show Preloader
        //     autocomplete.preloaderShow();

        //     // Do Ajax request to Autocomplete data
        //     app.request({
        //       url: 'http://toithichdoc.com/hotels/index.json',
        //       method: 'GET',
        //       dataType: 'json',
        //       //send "query" to server. Useful in case you generate response dynamically
        //       data: {
        //         query: query,
        //       },
        //       success: function (hotels) {
        //         f = hotels.hotels;
        //         // Find matched items
        //         for (var i = 0; i < f.length; i++) {
        //           if (f[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(f[i]);
        //         }
        //         // Hide Preoloader
        //         autocomplete.preloaderHide();
        //         // Render items by passing array with result items
        //         render(results);
        //       }
        //     });
        //     app.request({
        //       url: 'http://toithichdoc.com/restaurants/index.json',
        //       method: 'GET',
        //       dataType: 'json',
        //       //send "query" to server. Useful in case you generate response dynamically
        //       data: {
        //         query: query,
        //       },
        //       success: function (restaurants) {
        //         f = restaurants.restaurants;
        //         // Find matched items
        //         for (var i = 0; i < f.length; i++) {
        //           if (f[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(f[i]);
        //         }
        //         // Hide Preoloader
        //         autocomplete.preloaderHide();
        //         // Render items by passing array with result items
        //         render(results);
        //       }
        //     });
        //     app.request({
        //       url: 'http://toithichdoc.com/places/index.json',
        //       method: 'GET',
        //       dataType: 'json',
        //       //send "query" to server. Useful in case you generate response dynamically
        //       data: {
        //         query: query,
        //       },
        //       success: function (places) {
        //         f = places.places;
        //         // Find matched items
        //         for (var i = 0; i < f.length; i++) {
        //           if (f[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(f[i]);
        //         }
        //         // Hide Preoloader
        //         autocomplete.preloaderHide();
        //         // Render items by passing array with result items
        //         render(results);
        //       }
        //     });
        //   }
        // });

        var formData = app.form.convertToData('#my-form');

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


        $$('.edit-review').on('click', function () {

          var formData = app.form.convertToData('#my-form');

          app.request({
            // url: 'http://toithichdoc.com/hotels/delete/6.json',
            url: 'http://toithichdoc.com/reviews/edit/' + page.route.query.id_review + '.json',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              "title": formData.title,
              "name": formData.name,
              "typereview_id": formData.type,
              "address": formData.address,
              "description": formData.description,
              "image": srcData,
              "status": "1",
              "featured": "1"
            }),
            success: function (data) {
              alert(JSON.stringify(data));
            },
            error: function (xhr, status) {
              alert('Error: ' + JSON.stringify(xhr));
              alert('ErrorStatus: ' + JSON.stringify(status));
            }
          });

        });

      },
    }

  },
  {
    path: '/list_comment/',
    url: './pages/list_comment.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        var place;
        var names;
        var images;
        var detail1;
        var ids;
        console.log(page.route.query.review_comment_id);
        var link_comment = 'http://toithichdoc.com/comments/index.json';
        // var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.comment_id + '.json';
        var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.review_comment_id + '.json';





        //du lieu comment
        var template_from_list_comment = $$('#my-name-from-list-comment').html();
        var compiled_from_list_comment = Template7.compile(template_from_list_comment);
        app.request.json(link_comment, function (from_comment) {
          //console.log(hotel_form_rate.ratehotels.user);
          app.request.json("http://toithichdoc.com/users/index.json", function (users) {
            user = users.users;
          console.log("aaa");
            for (var i = 0; i < from_comment.comments.length; i++) {
              var k;
              console.log("bbbb");
              if (from_comment.comments[i]["review_id"] == page.route.query.review_comment_id) {
                console.log("ccc");
                var k = from_comment.comments[i]["id"];
                for (var j = 0; j < user.length; j++) {
                  console.log("ddd");
                  if (from_comment.comments[i]["user_id"] == user[j]["id"]) {
                    console.log("eeee");
                    names = user[j]["name"];
                    images = user[j]["image"];
                    ids = user[j]["id"];
                  }
                }
                // alert(from_detail.details[i]["date"] + from_detail.details[i]["timemove"] + from_detail.details[i]["timevisit"]);
                var html = compiled_from_list_comment({
                  user_id: ids,
                  image: images,
                  name: names,
                  date: from_comment.comments[i]["created"],
                  comment: from_comment.comments[i]["content"],
                });
                //console.log(html);
                $$('.list-from-list-comment[data-page="page-name-from-list-comment"]').append(html);
                $$('.swipeout-delete').on('click', function () {
                  app.request({
                    url: 'http://toithichdoc.com/comments/delete/' + k + '.json',
                    // url: 'http://toithichdoc.com/details/add.json',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({}),
                    success: function (data) {
                      alert(JSON.stringify(data));
                    },
                    error: function (xhr, status) {
                      alert('Error: ' + JSON.stringify(xhr));
                      alert('ErrorStatus: ' + JSON.stringify(status));
                    }
                  });
                  // }
                  //}
                  //});
                });
              }
            }
          });
        });
      },
    }
  },
  {
    path: '/list_commentplan/',
    url: './pages/list_commentplan.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        var place;
        var names;
        var images;
        var detail1;
        var ids;
        console.log(page.route.query.commentplan_id);
        var link_commentplan = 'http://toithichdoc.com/commentplans/index.json';
        // var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.comment_id + '.json';
        var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.commentplan_id + '.json';





        //du lieu comment
        var template_from_list_commentplan = $$('#my-name-from-list-commentplan').html();
        var compiled_from_list_commentplan = Template7.compile(template_from_list_commentplan);
        app.request.json(link_commentplan, function (from_commentplan) {
          //console.log(hotel_form_rate.ratehotels.user);
          app.request.json("http://toithichdoc.com/users/index.json", function (users) {
            user = users.users;

            for (var i = 0; i < from_commentplan.commentplans.length; i++) {
              var k;
         
              if (from_commentplan.commentplans[i]["plan_id"] == page.route.query.commentplan_id) {
              
                var k = from_commentplan.commentplans[i]["id"];
                for (var j = 0; j < user.length; j++) {
                  
                  if (from_commentplan.commentplans[i]["user_id"] == user[j]["id"]) {
                   
                    names = user[j]["name"];
                
                    images = user[j]["image"];
                 
                    ids = user[j]["id"];
                    
                  }
                }
                // alert(from_detail.details[i]["date"] + from_detail.details[i]["timemove"] + from_detail.details[i]["timevisit"]);
                var html = compiled_from_list_commentplan({
                  user_id: ids,
                  image: images,
                  name: names,
                  date: from_commentplan.commentplans[i]["created"],
                  comment: from_commentplan.commentplans[i]["content"],
                });
                //console.log(html);
                $$('.list-from-list-commentplan[data-page="page-name-from-list-commentplan"]').append(html);
                $$('.swipeout-delete').on('click', function () {
                  app.request({
                    url: 'http://toithichdoc.com/commentplans/delete/' + k + '.json',
                    // url: 'http://toithichdoc.com/details/add.json',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({}),
                    success: function (data) {
                      alert(JSON.stringify(data));
                    },
                    error: function (xhr, status) {
                      alert('Error: ' + JSON.stringify(xhr));
                      alert('ErrorStatus: ' + JSON.stringify(status));
                    }
                  });
                  // }
                  //}
                  //});
                });
              }
            }
          });
        });
      },
    }
  },

  {
    path: '/content_review/',
    url: './pages/content_review.html',
    on: {

      pageAfterIn: function (e, page) {


      },
      pageInit: function (e, page) {
        // do something when page initialized
        var $$ = Dom7;
        var app = new Framework7();
        var timestamp = new Date();

        //app.toolbar.hide('.toolbar-index');
        app.toolbar.show('.toolbar-comment');
        var link_review = 'http://toithichdoc.com/reviews/view/' + page.route.query.review_id + '.json';

        app.request.json("http://toithichdoc.com/reviews/index.json", function (reviews) {
        a = reviews.reviews;

        for (var i = 0; i < a.length; i++) {
          // && page.route.query.id_trip_review == a[i]["id"]
          if (localStorage.user_id_save == a[i]["user_id"] && page.route.query.review_id == a[i]["id"]) {
            var template_content_review_id = $$('#my-content-review-id').html();
            var compiled_content_review_id = Template7.compile(template_content_review_id);
            app.request.json(link_review, function (review) {
              //for (var i = 0; i < regions.regions.length; i++) {
              var html = compiled_content_review_id({
                id_review: review.review["id"]
              });
              //console.log(html);
              $$('.right[data-page="page-content-review-id"]').append(html);
              //}
    
            });
          }
        }
    });


    //du lieu title name
    var template_content_review_title = $$('#my-content-review-title').html();
    var compiled_content_review_title = Template7.compile(template_content_review_title);
    app.request.json(link_review, function (review) {
      //for (var i = 0; i < regions.regions.length; i++) {
      var html = compiled_content_review_title({
        name_title: review.review["name"]
      });
      //console.log(html);
      $$('.title[data-page="page-content-review-title"]').append(html);
      //}

    });
    // if (localStorage.user_id_save) {

    //   var template_review_login_like = $$('#review-login-like').html();
    // var compiled_review_login_like = Template7.compile(template_review_login_like);

    //   var html = compiled_review_login_like({
    //     like : "save-review",

    //   });
    //   //console.log(html);
    //   $$('.fab-right-bottom[data-page="page-name-review-login-like"]').append(html);


    // }
    // else {
    //   app.dialog.create({
    //     title: 'Thông báo',
    //     text: 'Đăng nhập để lưu địa điểm',
    //     buttons: [
    //       {
    //         text: 'Yes',
    //         onClick: function () {
    //           app.router.navigate('/login/');
    //         }
    //       },
    //       {
    //         text: 'No',
    //       },
    //     ],
    //     verticalButtons: true,
    //   }).open();
    // }

        $$('.send-link-comment').on('click', function () {
          var content_comment = $$('[name="comment-review"]').val();
          if (localStorage.user_id_save) {
            app.request({
              url: 'http://toithichdoc.com/comments/add.json',
              method: 'POST',
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({
                "user_id": localStorage.user_id_save,
                "review_id": page.route.query.review_id,
                "content": content_comment
              }),
              success: function (data) {
                app.dialog.create({
                  title: 'Thông báo',
                  text: 'Bình luận thành công',
                  buttons: [{
                    text: 'Ok',
                  }, ],
                  verticalButtons: true,
                }).open();

                $$('[name="comment-review"]').val('');
                var date_time = timestamp.getFullYear() + '-' + timestamp.getMonth() + '-' + timestamp.getDate() + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes();
                var html = '<li>' +
                  '<a class="item-content">' +
                  '<div class="item-media">' +
                  '<img src="' + localStorage.user_image_save + '" width="50" class="message-avatar" />' +
                  '</div>' +
                  '<div class="item-inner">' +
                  '<div class="item-title-row">' +
                  '<div class="item-title" style="font-size: 14px;">' + localStorage.user_name_save + '</div>' +
                  '<div class="item-after" style="font-size: 12px;">' + date_time + '</div>' +
                  '</div>' +
                  '<div class="item-text" style="font-size: 11px;">' + content_comment + '</div>' +
                  '</div>' +
                  '</a>' +
                  '</li>';
                document.getElementById("list-content-review-comment").innerHTML += html;
                //page.view.router.navigate(url_refesh);
                $$('.page-content').scrollTop(5000);
              },
              error: function (xhr, status) {
                alert('Error: ' + JSON.stringify(xhr));
                alert('ErrorStatus: ' + JSON.stringify(status));
              }
            });
          } else {
            app.dialog.create({
              title: 'Thông báo',
              text: 'Vui lòng đăng nhập',
              buttons: [{
                text: 'Yes',
              }],
              verticalButtons: true,
            }).open();
          }


        });

        //du lieu title name
        var template_content_review_title = $$('#my-content-review-title').html();
        var compiled_content_review_title = Template7.compile(template_content_review_title);
        app.request.json(link_review, function (review) {
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_review_title({
            user_id_save: parseInt(localStorage.user_id_save),
            user_id: parseInt(review.review["user_id"]),
            name_title: review.review["name"]
          });
          //console.log(html);
          $$('.navbar-inner[data-page="page-content-review-title"]').append(html);
          //}

        });

        //du lieu hinh anh
        var template_content_review_image = $$('#my-content-review-image').html();
        var compiled_content_review_image = Template7.compile(template_content_review_image);
        app.request.json(link_review, function (review_image) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_review_image({
            image: review_image.review["image"]
          });
          //console.log(html);
          $$('.item-image[data-page="page-content-review-image"]').append(html);
          //}

        });

        //du lieu name 
        var template_content_review_name = $$('#my-content-review-name').html();
        var compiled_content_review_name = Template7.compile(template_content_review_name);
        app.request.json(link_review, function (review_name) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_review_name({
            name: review_name.review["name"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-content-review-name"]').append(html);
          //}

        });

        //du lieu introduce
        var template_content_review_introduce = $$('#my-content-review-introduce').html();
        var compiled_content_review_introduce = Template7.compile(template_content_review_introduce);
        app.request.json(link_review, function (review_introduce) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_review_introduce({
            open: review_introduce.review["open"],
            close: review_introduce.review["close"],
            address: review_introduce.review["address"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-content-review-introduce"]').append(html);
          //}
        });

        //du lieu noi dung
        var template_content_review_description = $$('#my-content-review-description').html();
        var compiled_content_review_description = Template7.compile(template_content_review_description);
        app.request.json(link_review, function (review_description) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_review_description({
            description: review_description.review["description"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-content-review-description"]').append(html);
          //}
        });

        //du lieu list hình ảnh
        var template_content_review_list_image = $$('#my-content-review-list-image').html();
        var compiled_content_review_list_image = Template7.compile(template_content_review_list_image);
        app.request.json(link_review, function (review_list_image) {
          for (var i = 0; i < review_list_image.review.imagereviews.length; i++) {
            //console.log(review_list_image.review.imagereviews[i]);
            var html = compiled_content_review_list_image({
              name_image: review_list_image.review.imagereviews[i]["name"],
              list_image: review_list_image.review.imagereviews[i]["image"],
            });
            //console.log(html);
            $$('.list-image[data-page="page-content-review-list-image"]').append(html);
          }
        });

        //du lieu nhan xet
        var template_content_review_rate = $$('#my-content-review-rate').html();
        var compiled_content_review_rate = Template7.compile(template_content_review_rate);
        app.request.json(link_review, function (review_rate) {
          //console.log(event_content);
          //for (var i = 0; i < regions.regions.length; i++) {
          var html = compiled_content_review_rate({
            rate: review_rate.review["rate"]
          });
          //console.log(html);
          $$('.item-inner[data-page="page-content-review-rate"]').append(html);
          //}
        });

        //du lieu comment
        var template_content_review_comment = $$('#my-content-review-comment').html();
        var compiled_content_review_comment = Template7.compile(template_content_review_comment);
        app.request.json(link_review, function (review_comment) {
          //console.log(event_content);
          for (var i = 0; i < review_comment.comments.length; i++) {
            var html = compiled_content_review_comment({
              image_user: review_comment.comments[i].user["image"],
              username: review_comment.comments[i].user["username"],
              created: review_comment.comments[i]["created"],
              content: review_comment.comments[i]["content"],
            });
            $$('.list-form-rate[data-page="page-content-review-comment"]').append(html);
          }
        });

        //nut luu bai viet
        var template_save = $$('#save-review').html();
        var compiled_save = Template7.compile(template_save);
        app.request.json(link_review, function (review) {
          var status_review = false;
          for (var i = 0; i < review.review.likereviews.length; i++) {
            if (review.review.likereviews[i]['user_id'] == localStorage.user_id_save) {
              status_review = true;
            } else {
              status_review = false;
            }

          }
          var html = compiled_save({
            status_review: status_review,
          });
          //console.log(html);
          $$('.save-review').append(html);
        });

        $$('.save-review').on('click', function () {
          $$('.save-review').html('');
          app.request.json(link_review, function (review) {
            var status1 = false;
            for (var i = 0; i < review.review.likereviews.length; i++) {
              if (review.review.likereviews[i]['user_id'] == localStorage.user_id_save) {
                var link = 'http://toithichdoc.com/likereviews/delete/' + review.review.likereviews[i]['id'] + '.json';
                status1 = true;
              } else {
                status1 = false;
              }
            }
            if (status1) {

              alert(link);
              app.request({
                url: link,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Hủy thích thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });

              var html = compiled_save({
                status_review: false
              });
              $$('.save-review').append(html);

            } else {
              //console.log(likereviews.likereviews[i]);
              var link = 'http://toithichdoc.com/likereviews/add.json';
              app.request({
                url: link,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                  "user_id": localStorage.user_id_save,
                  "review_id": page.route.query.review_id
                }),
                success: function (data) {
                  app.dialog.create({
                    title: 'Thông báo',
                    text: 'Thích thành công',
                    buttons: [{
                      text: 'Ok',
                    }, ],
                    verticalButtons: true,
                  }).open();
                },
                error: function (xhr, status) {
                  alert('Lỗi: ' + JSON.stringify(xhr));
                  alert('Thông báo lỗi: ' + JSON.stringify(status));
                }
              });
              var html = compiled_save({
                status_review: true
              });
              $$('.save-review').append(html);

            }
          });
        });


        //remove load page
        app.request.json(link_review, function (count_review_comment) {
          //console.log(event_content);
          var lastItemIndex = $$('.list .list-form-rate li').length;
          if (count_review_comment.comments.length == lastItemIndex) {
            $$('.infinite-scroll-preloader').remove();
          }
        });

      },
    }
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [{
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve({
          componentUrl: './pages/request-and-load.html',
        }, {
          context: {
            user: user,
          }
        });
      }, 1000);
    },
  },
  {
    path: '/search_users/',
    url: './pages/search_users.html',
    on: {


      pageAfterIn: function (e, page) {
        //alert(page.route.query.slug);
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {

        var $$ = Dom7;
        var app = new Framework7();
        var searchbar = app.searchbar.create({
          el: '.searchbar-user',
          searchContainer: '.list',
          searchIn: '.item-title',
          on: {
            search(sb, query, previousQuery) {
              //console.log(query, previousQuery);
            }
          }
        });
        if (localStorage.user_id_save) {
          var link_user = 'http://toithichdoc.com/users/index.json';

          var template_search_users = $$('#my-search-user').html();
          var compiled_search_users = Template7.compile(template_search_users);
          app.request.json(link_user, function (users) {
            for (var i = 0; i < users.users.length; i++) {

              var html = compiled_search_users({
                avatar_user: users.users[i]["image"],
                name_user: users.users[i]["name"],
                user_id: users.users[i]["id"],
              });

              $$('.search-user[data-page="list-search-user"] ul').append(html);

            }
          });

          var allowInfinite = true;

          // Last loaded index
          var lastItemIndex = $$('.list li').length;

          // Max items to load
          var maxItems = 200;

          // Append items per load
          var itemsPerLoad = 20;

          // Attach 'infinite' event handler
          $$('.infinite-scroll-content').on('infinite', function () {
            // Exit, if loading in progress
            if (!allowInfinite) return;

            // Set loading flag
            allowInfinite = false;

            // Emulate 1s loading
            setTimeout(function () {
              // Reset loading flag
              allowInfinite = true;

              if (lastItemIndex >= maxItems) {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                app.infiniteScroll.destroy('.infinite-scroll-content');
                // Remove preloader
                $$('.infinite-scroll-preloader').remove();
                return;
              }

              // Generate new items HTML
              var html = '';
              for (var i = lastItemIndex + 1; i <= lastItemIndex + itemsPerLoad; i++) {
                html += '<li>'
                '<a href="/content_user/?user_id=' + user_id + '" class="item-link item-content">'
                '<div class="card-header">'
                '<img src="' + avatar_user + '" width="34" height="34" />'
                '</div>'
                '<div class="item-inner">'
                '<div class="item-title-row">'
                '<div class="item-title">' + name_user + '</div>'
                '<div class="item-after"></div>'
                '</div>'
                '</div>'
                '</a>'
                '</li>'



                '<li>Item ' + i + '</li>';
              }

              // Append new items
              $$('.list ul').append(html);

              // Update last loaded index
              lastItemIndex = $$('.list li').length;
            }, 1000);
          });

        } else {
          app.dialog.create({
            title: 'Thông báo',
            text: 'Vui lòng đăng nhập',
            buttons: [{
                text: 'Yes',
                onClick: function () {
                  app.router.navigate('/login/');
                }
              },
              {
                text: 'No',
              },
            ],
            verticalButtons: true,
          }).open();
        }

      },
    }
  },

  //addddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddđ
  {
    path: '/add_hotel/',
    url: './pages/add_hotel.html',
  },

  {
    path: '/modify_information/',
    url: './pages/modify_information.html',
    on: {

      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var k;
        var template_content_user_image = $$('#my-content-user-image').html();
        var compiled_content_user_image = Template7.compile(template_content_user_image);
        var link_user = 'http://toithichdoc.com/users/view/' + localStorage.user_id_save + '.json';
        app.request.json(link_user, function (user) {

          a = user.user;

          var html = compiled_content_user_image({
            image_avatar_user_change: a["image"],
          });

          if (a["sex"] == 1) {
            k = 'Female';
          } else {
            k = 'Male';
          }
          var formData = {
            'gender': k
          }
          app.form.fillFromData('#my-form', formData);

          $$('.user-image[data-page="page-content-user-image"]').append(html);
          // document.getElementById("image1").value = a["image"];
          document.getElementById("name").value = a["name"];
          document.getElementById("username").value = a["username"];
          document.getElementById("address").value = a["address"];
          document.getElementById("email").value = a["email"];
          document.getElementById("facebook").value = a["facebook"];
          document.getElementById("phone").value = a["phone"];
          document.getElementById("gender").value = a["sex"];
          document.getElementById("birthday").value = a["birthday"];
          document.getElementById("descripton").value = a["descripton"];

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

          $('#inputFileToLoad1').change(function (evt) {

            var files = evt.target.files;
            var file = files[0];

            if (file) {
              var reader = new FileReader();
              reader.onload = function (e) {
                document.getElementById('image2').src = e.target.result;
              };
              reader.readAsDataURL(file);

              var formData = app.form.convertToData('#my-form');

              var filesSelected = document.getElementById("inputFileToLoad1").files;

              if (filesSelected.length > 0) {
                var fileToLoad = filesSelected[0];

                var fileReader = new FileReader();

                fileReader.onload = function (fileLoadedEvent) {
                  srcData1 = fileLoadedEvent.target.result; // <--- data: base64

                }
                fileReader.readAsDataURL(fileToLoad);
              }

            }
          });


        });

        $$('.save-acount').on('click', function () {
          var formData = app.form.convertToData('#my-form');
          // alert(JSON.stringify(formData));
          // alert(formData.birthday);
          var day = formData.birthday;
          app.request({
            url: 'http://toithichdoc.com/users/edit/' + localStorage.user_id_save + '.json',
            // url: 'http://toithichdoc.com/users/delete/4.json',
            // http://toithichdoc.com/regions/index.json
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              "email": formData.email,
              "username": formData.username,
              "name": formData.name,
              "address": formData.address,
              "facebook": formData.facebook,
              "phone": formData.phone,
              "gender": formData.gender,
              "birthday": day,
              "descripton": formData.descripton,
              "image": srcData,
              "typeuser_id": "2",
              "cover": srcData1
            }),
            success: function (data) {
              alert(JSON.stringify(data));
            },
            error: function (xhr, status) {
              alert('Error: ' + JSON.stringify(xhr));
              alert('ErrorStatus: ' + JSON.stringify(status));
            }
          });


        });
      },
    }
  },

  {
    path: '/create_plan/',
    url: './pages/create_plan.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var app = new Framework7();
        var $$ = Dom7;


        var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
          inputEl: '#start-point',
          openIn: 'dropdown',
          preloader: true, //enable preloader
          /* If we set valueProperty to "id" then input value on select will be set according to this property */
          valueProperty: 'name', //object's "value" property name
          textProperty: 'name', //object's "text" property name
          limit: 20, //limit to 20 results
          typeahead: true,
          dropdownPlaceholderText: 'Try "Thành phố Nha Trang"',
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

        var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
          inputEl: '#arrival-point',
          openIn: 'dropdown',
          preloader: true, //enable preloader
          /* If we set valueProperty to "id" then input value on select will be set according to this property */
          valueProperty: 'name', //object's "value" property name
          textProperty: 'name', //object's "text" property name
          limit: 20, //limit to 20 results
          typeahead: true,
          dropdownPlaceholderText: 'Try "Thị xã Ninh Hòa"',
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
                var h = regions.regions;
                // Find matched items
                for (var i = 0; i < h.length; i++) {
                  if (h[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(h[i]);
                }
                // Hide Preoloader
                autocomplete.preloaderHide();
                // Render items by passing array with result items
                render(results);
              }
            });
          }
        });

        var private = 0;

        $$('.add-trip').on('click', function () {
          app.request.json("http://toithichdoc.com/plans/index.json", function (plan_id) {
            var max = 1;
            var plan = plan_id.plans;
            // alert(max);

            for (var i = 0; i < plan.length; i++) {

              // alert(trip[i]["id"]);
              if (max < plan[i]["id"]) {

                max = plan[i]["id"];
                console.log(max);
              }
            }



            if ($('#private').is(":checked")) {
              private = 1;
              console.log(private);
            } else {
              private = 0;
              console.log(private);
            }


            var formData = app.form.convertToData('#my-form');
            // //alert(formData.username);
            // $$.request.post('http://local.nhatrangtravel:82/restaurants/add.json', { name: 'formData.username', address: 'formData.password' }, function (restaurants) {
            //   var t = restaurants.restaurants;  
            //   alert(t.username);
            // // console.log(restaurants);
            // });

            var daystart = formData.startdate;
            var dayend = formData.returndate;

            if (Date.parse(dayend) - Date.parse(daystart) >= 0) {

              app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
                a = regions.regions;
                b = regions.regions;


                for (var i = 0; i < a.length; i++) {

                  if (formData.startpoint == a[i]["name"]) {
                    var start = a[i]["id"];

                    for (var j = 0; j < b.length; j++) {
                      if (formData.arrivalpoint == b[j]["name"]) {
                        var arrival = b[j]["id"];
                        var images = b[j]["image"];

                        app.request({
                          // url: 'http://toithichdoc.com/details/delete/9.json',
                          url: 'http://toithichdoc.com/plans/add.json',
                          method: 'POST',
                          dataType: 'json',
                          contentType: 'application/json',
                          data: JSON.stringify({
                            "user_id": localStorage.user_id_save,
                            "id": max + 1,
                            "name": formData.name,
                            "start_point": start,
                            "arrival_point": arrival,
                            "start": daystart,
                            "end": dayend,
                            "image": images,
                            "status": private
                          }),
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

                  }
                }
              });

              //du lieu tours
              var template_create_plan_id = $$('#my-create-plan-id').html();
              var compiled_create_plan_id = Template7.compile(template_create_plan_id);
              app.request.json("http://toithichdoc.com/plans/index.json", function (plan_id) {
                var max = 1;
                var plan = plan_id.plans;
                // alert(max);
                for (var i = 0; i < plan.length; i++) {

                  // alert(trip[i]["id"]);
                  if (max < plan[i]["id"]) {
                    max = plan[i]["id"];
                  }
                }
                var html = compiled_create_plan_id({

                  plan_id: max + 1
                });
                // alert(max);
                $$('.create-plan-id[data-page="page-create-plan-id"]').append(html);

              });
            } else {
              alert("Ngày kết thúc phải lớn hơn ngày ngày khởi hành")
            }
          });
        });
      },
    }
  },

  {
    path: '/create_day/',
    url: './pages/create_day.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var app = new Framework7();
        var $$ = Dom7;

        var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.plan_id + '.json';

        var template_create_day_plan_id = $$('#my-create-day-plan-id').html();
        var compiled_create_day_plan_id = Template7.compile(template_create_day_plan_id);
        app.request.json(link_plan, function (day_plan_id) {
          //console.log(hotel_slide.hotel.imagehotels);
          //for (var i = 0; i < hotel_slide.hotel.imagehotels.length; i++) {
          // alert(day_plan_id.plan["id"]);
          var html = compiled_create_day_plan_id({
            day_plan_id_create: day_plan_id.plan["id"]
          });
          //console.log(html);
          $$('.create-day-plan-id[data-page="page-create-day-plan-id"]').append(html);
          //}

        });

        // alert(page.route.query.plan_id);
        function am_pm_to_hours(time) {
          console.log(time);
          var hours = Number(time.match(/^(\d+)/)[1]);
          var minutes = Number(time.match(/:(\d+)/)[1]);
          var AMPM = time.match(/\s(.*)$/)[1];
          if (AMPM == "pm" && hours < 12) hours = hours + 12;
          if (AMPM == "am" && hours == 12) hours = hours - 12;
          var sHours = hours.toString();
          var sMinutes = minutes.toString();
          if (hours < 10) sHours = "0" + sHours;
          if (minutes < 10) sMinutes = "0" + sMinutes;
          return (sHours + ':' + sMinutes);
        }

        //   $('#add-day').click(function(){
        //     var n = $('#textbox1').val();
        //      var n1 =n.split('_');
        //     var time = am_pm_to_hours(n1[0]+':'+n1[1]+' '+n1[2]);
        //     alert(time);
        //     // $('#result').text(time);
        //     var m = $('#textbox2').val();
        //      var m1 =m.split('_');
        //     var time1 = am_pm_to_hours(m1[0]+':'+m1[1]+' '+m1[2]);
        //     alert(time1);
        // });

        var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
          inputEl: '#autocomplete-dropdown-ajax-typeahead',
          openIn: 'dropdown',
          preloader: true, //enable preloader
          /* If we set valueProperty to "id" then input value on select will be set according to this property */
          valueProperty: 'name', //object's "value" property name
          textProperty: 'name', //object's "text" property name
          limit: 20, //limit to 20 results
          typeahead: true,
          dropdownPlaceholderText: 'Try "Chợ đầm"',
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
              url: 'http://toithichdoc.com/places/index.json',
              method: 'GET',
              dataType: 'json',
              //send "query" to server. Useful in case you generate response dynamically
              data: {
                query: query,
              },
              success: function (places) {
                var g = places.places;
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


        // <div class="col"><a class="button fill-form-from-data " href="#">Fill Form</a></div>\

        $$('.add-day').on('click', function () {
          var formData = app.form.convertToData('#my-form3');
          // //alert(formData.username);
          // $$.request.post('http://local.nhatrangtravel:82/restaurants/add.json', { name: 'formData.username', address: 'formData.password' }, function (restaurants) {
          //   var t = restaurants.restaurants;  
          //   alert(t.username);
          // // console.log(restaurants);
          // });
          var day = formData.date;
          var place;
          app.request.json("http://toithichdoc.com/places/index.json", function (places) {
            a = places.places;
            console.log(page.route.query.plan_id);
            // alert(formData.name);
            // alert("aaa");
            for (var i = 0; i < a.length; i++) {
              // alert(a[i]["name"]);

              if (formData.name == a[i]["name"]) {
                place = a[i]["id"];
                // console.log("bbbbb");
                app.request({
                  // url: 'http://toithichdoc.com/details/delete/9.json',
                  url: 'http://toithichdoc.com/details/add.json',
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "plan_id": page.route.query.plan_id,
                    "place_id": place,
                    "timevisit": formData.timevisit,
                    "timemove": formData.timemove,
                    "date": day,
                    "note": formData.note
                  }),
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


      },
    }
  },


  {
    path: '/list_plan/',
    url: './pages/list_plan.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();

        var place;
        var names;
        var images;
        var detail1;
        var ids;
        console.log(page.route.query.day_plan_id_create);
        var link_detail = 'http://toithichdoc.com/details/index.json';
        // var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.day_plan_id_create + '.json';
        var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.day_plan_id_create + '.json';





        //du lieu comment
        var template_from_detail = $$('#my-name-from-detail').html();
        var compiled_from_detail = Template7.compile(template_from_detail);
        app.request.json(link_detail, function (from_detail) {
          //console.log(hotel_form_rate.ratehotels.user);
          app.request.json("http://toithichdoc.com/places/index.json", function (places) {
            place = places.places;

            for (var i = 0; i < from_detail.details.length; i++) {
              var k;
              if (from_detail.details[i]["plan_id"] == page.route.query.day_plan_id_create) {
                var k = from_detail.details[i]["id"];
                for (var j = 0; j < place.length; j++) {
                  if (from_detail.details[i]["place_id"] == place[j]["id"]) {
                    names = place[j]["name"];
                    images = place[j]["image"];
                    ids = place[j]["id"];
                  }
                }
                // alert(from_detail.details[i]["date"] + from_detail.details[i]["timemove"] + from_detail.details[i]["timevisit"]);
                var html = compiled_from_detail({
                  place_id: ids,
                  edit_detail_id: from_detail.details[i]["id"],
                  image: images,
                  name: names,
                  date: from_detail.details[i]["date"],
                  timemove: from_detail.details[i]["timemove"],
                  timevisit: from_detail.details[i]["timevisit"]
                });
                //console.log(html);
                $$('.list-from-detail[data-page="page-name-from-detail"]').append(html);
                $$('.swipeout-delete').on('click', function () {
                  // var formData = app.form.convertToData('#my-form');
                  // var day = formData.date;
                  // var place;
                  // app.request.json(link_detail, function (details) {
                  //   a  = details.details;
                  //  console.log(page.route.query.plan_id);
                  // alert(formData.name);
                  // alert("aaa");
                  //  for(var i = 0; i < a.length; i++)
                  // {
                  // alert(a[i]["name"]);

                  //    if( formData.name == a[i]["name"]){
                  //     place = a[i]["id"];
                  // console.log("bbbbb");
                  app.request({
                    url: 'http://toithichdoc.com/details/delete/' + k + '.json',
                    // url: 'http://toithichdoc.com/details/add.json',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({}),
                    success: function (data) {
                      alert(JSON.stringify(data));
                    },
                    error: function (xhr, status) {
                      alert('Error: ' + JSON.stringify(xhr));
                      alert('ErrorStatus: ' + JSON.stringify(status));
                    }
                  });
                  // }
                  //}
                  //});
                });
              }
            }
          });
        });
      },
    }
  },

  {
    path: '/edit_day/',
    url: './pages/edit_day.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var app = new Framework7();
        var $$ = Dom7;
        alert(page.route.query.edit_detail_id);
        var link_detail = 'http://toithichdoc.com/details/view/' + page.route.query.edit_detail_id + '.json';

        var template_edit_day_plan_id = $$('#my-edit-day-plan-id').html();
        var compiled_edit_day_plan_id = Template7.compile(template_edit_day_plan_id);
        app.request.json(link_detail, function (edit_day_plan_id) {
          //console.log(hotel_slide.hotel.imagehotels);
          //for (var i = 0; i < hotel_slide.hotel.imagehotels.length; i++) {
          // alert(day_plan_id.plan["id"]);
          alert(edit_day_plan_id.detail["plan_id"]);
          var html = compiled_edit_day_plan_id({
            day_plan_id_edit: edit_day_plan_id.detail["plan_id"]
          });
          //console.log(html);
          $$('.edit-day-plan-id[data-page="page-edit-day-plan-id"]').append(html);
          //}

        });

        // alert(page.route.query.detail_plan_id);
        function am_pm_to_hours(time) {
          console.log(time);
          var hours = Number(time.match(/^(\d+)/)[1]);
          var minutes = Number(time.match(/:(\d+)/)[1]);
          var AMPM = time.match(/\s(.*)$/)[1];
          if (AMPM == "pm" && hours < 12) hours = hours + 12;
          if (AMPM == "am" && hours == 12) hours = hours - 12;
          var sHours = hours.toString();
          var sMinutes = minutes.toString();
          if (hours < 10) sHours = "0" + sHours;
          if (minutes < 10) sMinutes = "0" + sMinutes;
          return (sHours + ':' + sMinutes);
        }

        var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
          inputEl: '#autocomplete-dropdown-ajax-typeahead',
          openIn: 'dropdown',
          preloader: true, //enable preloader
          /* If we set valueProperty to "id" then input value on select will be set according to this property */
          valueProperty: 'name', //object's "value" property name
          textProperty: 'name', //object's "text" property name
          limit: 20, //limit to 20 results
          typeahead: true,
          dropdownPlaceholderText: 'Try "Chợ đầm"',
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
              url: 'http://toithichdoc.com/places/index.json',
              method: 'GET',
              dataType: 'json',
              //send "query" to server. Useful in case you generate response dynamically
              data: {
                query: query,
              },
              success: function (places) {
                var g = places.places;
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


        // <div class="col"><a class="button fill-form-from-data " href="#">Fill Form</a></div>\

        $$('.edit-day').on('click', function () {
          var formData = app.form.convertToData('#my-form');
          // //alert(formData.username);
          // $$.request.post('http://local.nhatrangtravel:82/restaurants/add.json', { name: 'formData.username', address: 'formData.password' }, function (restaurants) {
          //   var t = restaurants.restaurants;  
          //   alert(t.username);
          // // console.log(restaurants);
          // });
          var day = formData.date;
          var place;
          app.request.json("http://toithichdoc.com/places/index.json", function (places) {
            a = places.places;

            for (var i = 0; i < a.length; i++) {
              if (formData.name == a[i]["name"]) {
                place = a[i]["id"];

                app.request({
                  // url: 'http://toithichdoc.com/details/delete/9.json',
                  url: 'http://toithichdoc.com/details/edit/' + page.route.query.edit_detail_id + '.json',
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "place_id": place,
                    "timevisit": formData.timevisit,
                    "timemove": formData.timemove,
                    "date": day,
                    "note": formData.note
                  }),
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
        $$('.delete-day').on('click', function () {
          var formData = app.form.convertToData('#my-form');
          var day = formData.date;
          var place;
          app.request.json("http://toithichdoc.com/places/index.json", function (places) {
            a = places.places;

            for (var i = 0; i < a.length; i++) {
              if (formData.name == a[i]["name"]) {
                place = a[i]["id"];

                app.request({
                  // url: 'http://toithichdoc.com/details/delete/9.json',
                  url: 'http://toithichdoc.com/details/delete/' + page.route.query.edit_detail_id + '.json',
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "place_id": place,
                    "timevisit": formData.timevisit,
                    "timemove": formData.timemove,
                    "date": day,
                    "note": formData.note
                  }),
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


      },
    }
  },

  {
    path: '/edit_plan/',
    url: './pages/edit_plan.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {


        var $$ = Dom7;
        var app = new Framework7();

        page.route.query.id_plan

        var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
          inputEl: '#start-point',
          openIn: 'dropdown',
          preloader: true, //enable preloader
          /* If we set valueProperty to "id" then input value on select will be set according to this property */
          valueProperty: 'name', //object's "value" property name
          textProperty: 'name', //object's "text" property name
          limit: 20, //limit to 20 results
          typeahead: true,
          dropdownPlaceholderText: 'Try "Thành phố Nha Trang"',
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

        var autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
          inputEl: '#arrival-point',
          openIn: 'dropdown',
          preloader: true, //enable preloader
          /* If we set valueProperty to "id" then input value on select will be set according to this property */
          valueProperty: 'name', //object's "value" property name
          textProperty: 'name', //object's "text" property name
          limit: 20, //limit to 20 results
          typeahead: true,
          dropdownPlaceholderText: 'Try "Thị xã Ninh Hòa"',
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
                var h = regions.regions;
                // Find matched items
                for (var i = 0; i < h.length; i++) {
                  if (h[i].name.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(h[i]);
                }
                // Hide Preoloader
                autocomplete.preloaderHide();
                // Render items by passing array with result items
                render(results);
              }
            });
          }
        });

        var private = 0;


        var link_plan = 'http://toithichdoc.com/plans/view/' + page.route.query.id_plan + '.json';
        app.request.json(link_plan, function (plan) {

          a = plan.plan;
          // console.log(a["image"]);
          // console.log(a["name"]);

          // console.log(a["address"]);
          // console.log(a["description"]);
          // var s = a["start"];
          // var e = a["end"]


          document.getElementById("name-plan").value = a["name"];
          document.getElementById("start-point").value = a["start_point"];
          document.getElementById("arrival-point").value = a["arrival_point"];
          // document.getElementById("start-date").value = a["start"];
          // document.getElementById("return-date").value = a["end"];

        });




        //du lieu tours
        var template_create_plan_id = $$('#my-create-plan-id').html();
        var compiled_create_plan_id = Template7.compile(template_create_plan_id);
        app.request.json("http://toithichdoc.com/plans/index.json", function (plan_id) {
          var max = 1;
          var plan = plan_id.plans;
          // alert(max);
          for (var i = 0; i < plan.length; i++) {

            // alert(trip[i]["id"]);
            if (max < plan[i]["id"]) {
              max = plan[i]["id"];
            }
          }
          var html = compiled_create_plan_id({

            plan_id: page.route.query.id_plan
          });
          // alert(max);
          $$('.create-plan-id[data-page="page-create-plan-id"]').append(html);

        });


        // <div class="col"><a class="button fill-form-from-data " href="#">Fill Form</a></div>\

        $$('.edit-plan').on('click', function () {
          app.request.json("http://toithichdoc.com/plans/index.json", function (plan_id) {
            var max = 1;
            var plan = plan_id.plans;
            // alert(max);
            for (var i = 0; i < plan.length; i++) {

              // alert(trip[i]["id"]);
              if (max < plan[i]["id"]) {
                max = plan[i]["id"];
              }
            }


            if ($('#private').is(":checked")) {
              private = 1;
              console.log(private);
            } else {
              private = 0;
              console.log(private);
            }


            var formData = app.form.convertToData('#my-form');
            // //alert(formData.username);
            // $$.request.post('http://local.nhatrangtravel:82/restaurants/add.json', { name: 'formData.username', address: 'formData.password' }, function (restaurants) {
            //   var t = restaurants.restaurants;  
            //   alert(t.username);
            // // console.log(restaurants);
            // });

            var daystart = formData.startdate;
            var dayend = formData.returndate;


            app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
              a = regions.regions;
              b = regions.regions;


              for (var i = 0; i < a.length; i++) {

                if (formData.startpoint == a[i]["name"]) {
                  var start = a[i]["id"];

                  for (var j = 0; j < b.length; j++) {
                    if (formData.arrivalpoint == b[j]["name"]) {
                      var arrival = b[j]["id"];
                      var images = b[j]["image"];
                      app.request({
                        // url: 'http://toithichdoc.com/details/delete/9.json',
                        url: 'http://toithichdoc.com/plans/edit/' + page.route.query.id_plan + '.json',
                        method: 'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({
                          "name": formData.name,
                          "start_point": start,
                          "arrival_point": arrival,
                          "start": daystart,
                          "end": dayend,
                          "image": images,
                          "status": private
                        }),
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

                }
              }
            });
          });
        });
        $$('.delete-plan').on('click', function () {
          app.request.json("http://toithichdoc.com/plans/index.json", function (plan_id) {
            var max = 1;
            var plan = plan_id.plans;
            // alert(max);
            for (var i = 0; i < plan.length; i++) {

              // alert(trip[i]["id"]);
              if (max < plan[i]["id"]) {
                max = plan[i]["id"];
              }
            }


            if ($('#private').is(":checked")) {
              private = 1;
              console.log(private);
            } else {
              private = 0;
              console.log(private);
            }


            var formData = app.form.convertToData('#my-form');
            // //alert(formData.username);
            // $$.request.post('http://local.nhatrangtravel:82/restaurants/add.json', { name: 'formData.username', address: 'formData.password' }, function (restaurants) {
            //   var t = restaurants.restaurants;  
            //   alert(t.username);
            // // console.log(restaurants);
            // });

            var daystart = formData.startdate;
            var dayend = formData.returndate;


            app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
              a = regions.regions;
              b = regions.regions;


              for (var i = 0; i < a.length; i++) {

                if (formData.startpoint == a[i]["name"]) {
                  var start = a[i]["id"];

                  for (var j = 0; j < b.length; j++) {
                    if (formData.arrivalpoint == b[j]["name"]) {
                      var arrival = b[j]["id"];
                      var images = b[j]["image"];
                      app.request({
                        // url: 'http://toithichdoc.com/details/delete/9.json',
                        url: 'http://toithichdoc.com/plans/delete/' + page.route.query.id_plan + '.json',
                        method: 'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({
                          "name": formData.name,
                          "start_point": start,
                          "arrival_point": arrival,
                          "start": daystart,
                          "end": dayend,
                          "image": images,
                          "featured": private
                        }),
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

                }
              }
            });
          });
        });



      },
    }
  },

  {
    path: '/add_place_entertainment/',
    url: './pages/add_place_entertainment.html',
    on: {


      pageAfterIn: function (e, page) {
        // do something after page gets into the view
        //alert('Here comes About page');
      },
      pageInit: function (e, page) {
        var $$ = Dom7;
        var app = new Framework7();
        var map;
        var markers = [];
        var dt;
        var centerMap = {
          lat: 12.267874,
          lng: 109.202376
        };
        var $$ = Dom7;
        var lat_dau = '';
        var lng_dau = '';
        var lat_cuoi = '';
        var lng_cuoi = '';
        var lat_hientai;
        var lng_hientai;
        var pos;
        var srcData;



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
            var infowindow = new google.maps.InfoWindow({
              content: "You are here!"
            });

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

        $$('.add-thing-to-do').on('click', function () {
          var formData = app.form.convertToData('#my-form');
          var region;
          app.request.json("http://toithichdoc.com/regions/index.json", function (regions) {
            a = regions.regions;

            for (var i = 0; i < a.length; i++) {
              if (formData.tp == a[i]["name"]) {
                region = a[i]["id"];

                app.request({
                  // url: 'http://toithichdoc.com/places/delete/7.json',
                  url: 'http://toithichdoc.com/places/add.json',
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    "region_id": region,
                    "name": formData.name,
                    "typeplace_id": formData.type,
                    "latitude": formData.lat,
                    "longitude": formData.lng,
                    "descripton": formData.descripton,
                    "image": srcData,
                    "status": "0",
                    "featured": "0"
                  }),
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

      },
    }
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },

];
