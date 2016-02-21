$(function() {

  var config = {
    backgroundServiceURL: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    countryServiceURL: 'https://ext.eurocontrol.int/arcgis/rest/services/ELCIP/BACKGROUND/MapServer/3',
    defaultExtent: {
      xmin: -5140481.991058672,
      ymin: 3855761.191337039,
      xmax: 5719690.987696283,
      ymax: 7769337.039537024,
      wkid: 3857
    }
  };

  var listModule = new app.moduleClasses.ListModule();
  var mapModule = new app.moduleClasses.MapModule();
  var repositoryModule = new app.moduleClasses.RepositoryModule();

  listModule.init({
    createNewProposal: function(city, country, callback) {
      repositoryModule.createNewProposal(city, country, callback);
      mapModule.addCountry(country);
    },
    decrementRanking: function(city, callback) {
      repositoryModule.decrementRanking(city, callback);
    },
    incrementRanking: function(city, callback) {
      repositoryModule.incrementRanking(city, callback);
    }
  });

  mapModule.init(config);

  repositoryModule.getAllProposals(function(data) {
    listModule.displayProposals(data);
    mapModule.displayProposals(data);
  });

  mapModule.createMap();
});
