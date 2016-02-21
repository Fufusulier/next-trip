var mapModule = (function() {

  /**
   * Creating the map
   */
  var map;

  function createMap() {
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
  }

  function displayProposals(data) {
    $.each(_.sortBy(data, 'rank').reverse(), function(i, proposal) {
      mapModule.addCountry(proposal.country);
    });
  }

  function addCountry(country) {
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
  }

  return {
    displayProposals: displayProposals,
    createMap: createMap,
    addCountry: addCountry
  };
})();
