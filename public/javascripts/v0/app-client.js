$(function() {

  /**
   * Add a new proposal
   */
  $('#proposal-add').click(function() {

    // get the form values
    var city = $('#proposal-city').val();
    var country = $('#proposal-country').val();

    // posting the data to the server
    $.post('/proposals', {
        city: city,
        country: country
      },
      function(proposal) {

        // creating the html for the proposal
        var $el = $('<li class="list-group-item">' +
          '<span class="proposal-city">' + proposal.city + '</span>' +
          '<span class="proposal-country">' + proposal.country + '</span>' +
          '<div class="proposal-rank-group">' +
          '<button class="btn btn-xs btn-default proposal-decrement">-</button>' +
          '<span class="proposal-rank">' + proposal.rank + '</span>' +
          '<button class="btn btn-xs btn-default proposal-increment">+</button>' +
          '</div>' +
          '</li>').appendTo($('#existing-proposals'));

        // registering the handler for decrementing the rank
        $el.find('.proposal-decrement').click(function() {
          $.getJSON('/proposals/' + $(this).closest('li').data('proposal').city + '/decrement', null, function(data) {
            $el.find('.proposal-rank').html(data.rank);
          });
        });
        // registering the handler for incrementing the rank
        $el.find('.proposal-increment').click(function() {
          $.getJSON('/proposals/' + $(this).closest('li').data('proposal').city + '/increment', null, function(data) {
            $el.find('.proposal-rank').html(data.rank);
          });
        });
        // registering the proposal data to the html element
        $el.data('proposal', proposal);

        // reseting the form values
        $('#proposal-city').val(null);
        $('#proposal-country').val(null);

        // displaying the country on the map
        require(['esri/SpatialReference',
            'esri/tasks/QueryTask',
            'esri/tasks/query',
            'esri/symbols/SimpleFillSymbol',
            'esri/Color'
          ],
          function(SpatialReference,
            QueryTask,
            Query,
            SimpleFillSymbol,
            Color) {
            var query = new Query();
            query.outFields = ['*'];
            query.outSpatialReference = new SpatialReference({ wkid: 3857 });
            query.where = 'ISO2_CODE = \'' + country + '\'';
            query.returnGeometry = true;

            var queryTask = new QueryTask('https://ext.eurocontrol.int/arcgis/rest/services/ELCIP/BACKGROUND/MapServer/3');
            queryTask.execute(query, function(featureSet) {
                var feature = featureSet.features[0];
                feature.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                  undefined,
                  new Color('green')));
                map.graphics.add(feature);
              },
              function() {
                console.log('error getting the spatial data', arguments);
              });
          }
        );


      }, 'json');
  });

  /**
   * Loading all the proposals for the initialization
   */
  $.getJSON('/proposals', null, function(data) {
    $.each(_.sortBy(data, 'rank').reverse(), function(i, proposal) {
      // creating the html element
      var $el = $('<li class="list-group-item">' +
        '<span class="proposal-city">' + proposal.city + '</span>' +
        '<span class="proposal-country">' + proposal.country + '</span>' +
        '<div class="proposal-rank-group">' +
        '<button class="btn btn-xs btn-default proposal-decrement">-</button>' +
        '<span class="proposal-rank">' + proposal.rank + '</span>' +
        '<button class="btn btn-xs btn-default proposal-increment">+</button>' +
        '</div>' +
        '</li>').appendTo($('#existing-proposals'));
      // registering the handler for decrementing the rank
      $el.find('.proposal-decrement').click(function() {
        $.getJSON('/proposals/' + $(this).closest('li').data('proposal').city + '/decrement', null, function(data) {
          $el.find('.proposal-rank').html(data.rank);
        });
      });
      // registering the handler for incrementing the rank
      $el.find('.proposal-increment').click(function() {
        $.getJSON('/proposals/' + $(this).closest('li').data('proposal').city + '/increment', null, function(data) {
          $el.find('.proposal-rank').html(data.rank);
        });
      });
      // registering the proposal data to the html element
      $el.data('proposal', proposal);


      // displaying the country on the map
      require(['esri/SpatialReference',
          'esri/tasks/QueryTask',
          'esri/tasks/query',
          'esri/symbols/SimpleFillSymbol',
          'esri/Color'
        ],
        function(SpatialReference,
          QueryTask,
          Query,
          SimpleFillSymbol,
          Color) {
          var query = new Query();
          query.outFields = ['*'];
          query.outSpatialReference = new SpatialReference({ wkid: 3857 });
          query.where = 'ISO2_CODE = \'' + proposal.country + '\'';
          query.returnGeometry = true;

          var queryTask = new QueryTask('https://ext.eurocontrol.int/arcgis/rest/services/ELCIP/BACKGROUND/MapServer/3');
          queryTask.execute(query, function(featureSet) {
              var feature = featureSet.features[0];
              feature.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                undefined,
                new Color('green')));
              map.graphics.add(feature);
            },
            function() {
              console.log('error getting the spatial data', arguments);
            });
        }
      );
    });
  });


  /**
   * Creating the map
   */
  var map;

  require(["esri/map",
      "esri/layers/ArcGISTiledMapServiceLayer",
      'esri/SpatialReference',
      'esri/geometry/Extent',
      'esri/tasks/QueryTask',
      'esri/tasks/query',
      "dojo/domReady!"
    ],
    function(Map,
      Tiled,
      SpatialReference,
      Extent,
      QueryTask,
      Query) {
      map = new Map("map", {
        extent: new Extent(-5140481.991058672,
          3855761.191337039,
          5719690.987696283,
          7769337.039537024,
          new SpatialReference({ wkid: 3857 }))
      });

      // adding the background layer
      var tiled = new Tiled("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
      map.addLayer(tiled);
      setTimeout(function() {
        // disabling interaction with the mouse
        map.disableScrollWheelZoom();
        map.disableRubberBandZoom();
        map.disablePan();
      }, 500);
    }
  );

});
