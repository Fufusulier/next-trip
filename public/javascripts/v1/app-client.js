$(function() {

  listModule.init();

  repositoryModule.getAllProposals(function(data) {
    listModule.displayProposals(data);
    mapModule.displayProposals(data);
  });

  mapModule.createMap();
});
