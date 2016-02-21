var app = app || { moduleClasses: {} };
app.moduleClasses.RepositoryModule = (function() {

  var RepositoryModuleClass = function() {

  };

  RepositoryModuleClass.prototype.getAllProposals = function(callback) {
    $.getJSON('/proposals', null, function(data) {
      callback(data);
    });
  };

  RepositoryModuleClass.prototype.createNewProposal = function(city, country, callback) {
    $.post('/proposals', {
      city: city,
      country: country
    }, function(proposal) {
      callback(proposal);
    });
  };

  RepositoryModuleClass.prototype.incrementRanking = function(city, callback) {
    $.getJSON('/proposals/' + city + '/increment', null, function(data) {
      callback(data);
    });
  };

  RepositoryModuleClass.prototype.decrementRanking = function(city, callback) {
    $.getJSON('/proposals/' + city + '/decrement', null, function(data) {
      callback(data);
    });
  };

  return RepositoryModuleClass;
})();
