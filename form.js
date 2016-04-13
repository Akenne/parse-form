$(document).ready(function() {
  $("#datepicker").datepicker({
    dateFormat: 'dd M yy',
    showAnim: 'slideDown',
    showOtherMonths: true,
    selectOtherMonths: true
  });

  $('#quoteForm').validate({
    rules: {
      quote: {
        number: true
      },
      firstName: {
        lettersonly: true
      },
      surname: {
        lettersonly: true
      },
      email: {
        email: true
      },
      phone: {
        number: true
      }
    }
  });
});
Parse.initialize("dyPoSQasleiTmBIPDDWemFtdzzLDNYWjOBJ9tuKF", "aAa4TUo0UFQuESsmGzUwcv1B7PHd1F3kS04MeePn");

var Categories = Parse.Object.extend("Categories");
var query = new Parse.Query(Categories);
query.find({
  success: function(results) {
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      $("select#category").append($("<option>")
        .html(object.attributes.CategoryName)
      );
      if (i == 0) {
        updateSubCategories()
      }
    }
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});



function updateSubCategories() {
  var subCategories = Parse.Object.extend("SubCategories");
  var query = new Parse.Query(subCategories);
  var e = document.getElementById("category");
  var strUser = e.options[e.selectedIndex].text;
  query.equalTo("Parent", strUser);
  query.find({
    success: function(results) {
      $('#subCategory option').remove();
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        $("select#subCategory").append($("<option>")
          .html(object.attributes.SubCategoryName)
        );
      }
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
}

$('select#category').change(function() {
  updateSubCategories()
});


function clicked() {
  console.log("hey")
  if ($('#quoteForm').valid()) {
    var Quote = Parse.Object.extend("QuoteDetails");
    var quote = new Quote();
    quote.set("Category", $("#category").val());
    quote.set("SubCategory", $("#subCategory").val());
    quote.set("QuoteDetail", $("#description").val());
    quote.set("Budget", parseInt($("#budget").val().replace("$", "")));
    quote.set("QuoteStartDate", $("#datepicker").val());
    quote.set("FirstName", $("#firstName").val());
    quote.set("SurName", $("#surname").val());
    quote.set("PhoneNumber", $("#phone").val());
    quote.set("Email", $("#email").val());
    quote.save(null, {
      success: function(quote) {
        window.location.href = 'submitted.html';
        console.log(quote)
      },
      error: function(quote, error) {
        console.log('Failed to create new object, with error code: ' + error.message);
      }
    });
  }
}
