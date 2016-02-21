var app = app || { moduleClasses: {} };
app.moduleClasses.ListModule = (function() {

  var formUI = new function() {
    var self = this;

    self.onClickAdd = function(callback) {
      $('#proposal-add').click(function() {
        callback(self.getCity(), self.getCountry());
      });
    };

    self.reset = function() {
      // reseting the form values
      $('#proposal-city').val(null);
      $('#proposal-country').val(null);
    };

    self.getCity = function() {
      return $('#proposal-city').val();
    };
    self.getCountry = function() {
      return $('#proposal-country').val();
    };
  };

  var listUI = new function() {
    var self = this;
    self.createNewElement = function(proposal) {
      var $el = $('<li class="list-group-item">' +
        '<span class="proposal-city">' + proposal.city + '</span>' +
        '<span class="proposal-country">' + proposal.country + '</span>' +
        '<div class="proposal-rank-group">' +
        '<button class="btn btn-xs btn-default proposal-decrement">-</button>' +
        '<span class="proposal-rank">' + proposal.rank + '</span>' +
        '<button class="btn btn-xs btn-default proposal-increment">+</button>' +
        '</div>' +
        '</li>').appendTo($('#existing-proposals'));

      // registering the proposal data to the html element
      $el.data('proposal', proposal);

      return $el;
    };

    self.registerDecrementRank = function($el, callback) {
      // registering the handler for decrementing the rank
      $el.find('.proposal-decrement').click(function() {
        callback($(this).closest('li').data('proposal').city);
      });
    };

    self.registerIncrementRank = function($el, callback) {
      // registering the handler for decrementing the rank
      $el.find('.proposal-increment').click(function() {
        callback($(this).closest('li').data('proposal').city);
      });
    };

    self.setRank = function($el, rank) {
      $el.find('.proposal-rank').html(rank);
    };
  };


  function ListModuleClass() {

  }

  ListModuleClass.prototype.init = function(externalSystem) {
    var self = this;
    self.externalSystem = externalSystem;
    self.initFormUI();
  };

  ListModuleClass.prototype.displayProposal = function(proposal) {
    var self = this;
    // creating the html for the proposal
    var $el = listUI.createNewElement(proposal);

    // handler for decrementing the rank
    listUI.registerDecrementRank($el, function(city) {
      self.externalSystem.decrementRanking(city, function(data) {
        listUI.setRank($el, data.rank);
      });
    });

    // handle for incrementing the rank
    listUI.registerIncrementRank($el, function(city) {
      self.externalSystem.incrementRanking(city, function(data) {
        listUI.setRank($el, data.rank);
      });
    });
  };

  ListModuleClass.prototype.initFormUI = function(data) {
    var self = this;
    formUI.onClickAdd(function(city, country) {
      self.externalSystem.createNewProposal(city, country, self._onNewProposalCreated.bind(self));
    });
  };

  ListModuleClass.prototype._onNewProposalCreated = function(proposal) {
    var self = this;
    self.displayProposal(proposal);
    formUI.reset();
  };

  ListModuleClass.prototype.displayProposals = function(data) {
    var self = this;
    $.each(_.sortBy(data, 'rank').reverse(), function(i, proposal) {
      self.displayProposal(proposal);
    });
  };

  return ListModuleClass;
})();
