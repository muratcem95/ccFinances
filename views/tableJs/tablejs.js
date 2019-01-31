$(document).ready(function(){
  var table = $('#example').DataTable();
  
  $('#btn-export').on('click', function(){
      $('<table>').append(table.$('tr').clone()).table2excel({
          exclude: ".excludeThisClass",
          name: "Worksheet Name",
          filename: "C&C Financials" //do not include extension
      });
  });      
});

// data-* attributes to scan when populating modal values
var ATTRIBUTES = ['studentname', 'ccpayment', 'received', 'left', 'partnername', 'partnertype', 'partnerpayment', 'partnercommissionrate', 'partnercommissionamount', 'partnercommissionstructure', 'partnerreceived', 'partnerleft', 'details', 'partnerpartnername'];

$('[data-toggle="modal"]').on('click', function (e) {
  // convert target (e.g. the button) to jquery object
  var $target = $(e.target);
  // modal targeted by the button
  var modalSelector = $target.data('target');
  
  // iterate over each possible data-* attribute
  ATTRIBUTES.forEach(function (attributeName) {
    // retrieve the dom element corresponding to current attribute
    var $modalAttribute = $(modalSelector + ' #modal-' + attributeName);
    var dataValue = $target.data(attributeName);
    
    // if the attribute value is empty, $target.data() will return undefined.
    // In JS boolean expressions return operands and are not coerced into
    // booleans. That way is dataValue is undefined, the left part of the following
    // Boolean expression evaluate to false and the empty string will be returned
    $modalAttribute.text(dataValue || '');
  });
});