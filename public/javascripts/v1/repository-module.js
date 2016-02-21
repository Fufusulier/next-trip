var repositoryModule = (function() {

  function getAllProposals(callback) {
    $.getJSON('/proposals', null, function(data) {
      callback(data);
    });
  }

  function createNewProposal(city, country, callback) {
    $.post('/proposals', {
      city: city,
      country: country
    }, function(proposal) {
      callback(proposal);
    });
  }

  function incrementRanking(city, callback) {
    $.getJSON('/proposals/' + city + '/increment', null, function(data) {
      callback(data);
    });
  }

  function decrementRanking(city, callback) {
    $.getJSON('/proposals/' + city + '/decrement', null, function(data) {
      callback(data);
    });
  }

  return {
    getAllProposals: getAllProposals,
    createNewProposal: createNewProposal,
    incrementRanking: incrementRanking,
    decrementRanking: decrementRanking
  };
})();
