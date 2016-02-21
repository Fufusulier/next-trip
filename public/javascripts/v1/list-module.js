var listModule = (function() {

  function displayProposals(data) {
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
        repositoryModule.decrementRanking($(this).closest('li').data('proposal').city, function(data) {
          $el.find('.proposal-rank').html(data.rank);
        });
      });
      // registering the handler for incrementing the rank
      $el.find('.proposal-increment').click(function() {
        repositoryModule.incrementRanking($(this).closest('li').data('proposal').city, function(data) {
          $el.find('.proposal-rank').html(data.rank);
        });
      });
      // registering the proposal data to the html element
      $el.data('proposal', proposal);
    });
  }

  function init() {
    /**
     * Add a new proposal
     */
    $('#proposal-add').click(function() {

      // get the form values
      var city = $('#proposal-city').val();
      var country = $('#proposal-country').val();

      // posting the data to the server
      repositoryModule.createNewProposal(city, country,
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
            repositoryModule.decrementRanking($(this).closest('li').data('proposal').city, function(data) {
              $el.find('.proposal-rank').html(data.rank);
            });
          });
          // registering the handler for incrementing the rank
          $el.find('.proposal-increment').click(function() {
            repositoryModule.incrementRanking($(this).closest('li').data('proposal').city, function(data) {
              $el.find('.proposal-rank').html(data.rank);
            });
          });
          // registering the proposal data to the html element
          $el.data('proposal', proposal);

          // reseting the form values
          $('#proposal-city').val(null);
          $('#proposal-country').val(null);

          mapModule.addCountry(country);

        }, 'json');
    });
  }

  return {
    init: init,
    displayProposals: displayProposals
  };
})();
