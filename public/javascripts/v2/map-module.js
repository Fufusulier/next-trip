var app = app || { moduleClasses: {} };
app.moduleClasses.MapModule = (function() {

  var Cache = function(countryServiceURL) {
    var self = this;
    var cache = {};
    self.get = function(country, callback) {
      if (cache[country] && cache[country].value !== null) {
        callback(cache[country].value);
      } else if (cache[country] && cache[country].loading) {
        cache[country].callbacks.push(callback);
      } else if (!cache[country]) {
        cache[country] = {
          loading: true,
          callbacks: [callback],
          value: null
        };

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

            var queryTask = new QueryTask(countryServiceURL);
            queryTask.execute(query, function(featureSet) {
                var feature = featureSet.features[0];
                feature.setSymbol(new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                  undefined,
                  new Color('green')));
                cache[country].loading = false;
                cache[country].value = feature;
                $.each(cache[country].callbacks, function(i, callback) {
                  callback(feature);
                });
              },
              function() {
                console.log('error getting the spatial data', arguments);
              });
          }
        );
      }
    };
  };


  var MapModuleClass = function() {};

  MapModuleClass.prototype.init = function(config) {
    var self = this;
    self.map = null;
    self.backgroundServiceURL = config.backgroundServiceURL;
    self.countryServiceURL = config.countryServiceURL;
    self.defaultExtent = config.defaultExtent;
    this.cache = new Cache(self.countryServiceURL);
  };

  MapModuleClass.prototype.createMap = function() {
    var self = this;
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

        self.map = new Map("map", {
          extent: new Extent(self.defaultExtent.xmin,
            self.defaultExtent.ymin,
            self.defaultExtent.xmax,
            self.defaultExtent.ymax,
            new SpatialReference({ wkid: self.defaultExtent.wkid }))
        });

        // adding the background layer
        var tiled = new Tiled(self.backgroundServiceURL);
        self.map.addLayer(tiled);
        setTimeout(function() {
          // disabling interaction with the mouse
          self.map.disableScrollWheelZoom();
          self.map.disableRubberBandZoom();
          self.map.disablePan();
        }, 500);
      }
    );
  };

  MapModuleClass.prototype.displayProposals = function(data) {
    var self = this;
    $.each(_.sortBy(data, 'rank').reverse(), function(i, proposal) {
      self.addCountry(proposal.country);
    });
  };

  MapModuleClass.prototype.addCountry = function(country) {
    var self = this;
    self.cache.get(country, function(feature) {
      self.map.graphics.add(feature);
    });
  };

  return MapModuleClass;

})();
