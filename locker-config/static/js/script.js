function alertSuccess(message) {
  $("#alerts").append(
    '<div id="sucess-alert" class="alert alert-success alert-dismissible fade show" role="alert">' +
      message +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
      '</div>'
  );
  
  removeEl('#sucess-alert', 2000);
}

function alertError(message) {
    $("#alerts").append(
        '<div id="error-alert" class="alert alert-danger alert-dismissible fade show" role="alert">' +
          message +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
          '</div>'
      );
      
  removeEl('#error-alert', 2000);
}


function removeEl(selector, ms=2000) {
  setTimeout(function(){
    if ($(selector).length > 0) {
      $(selector).remove();
    }
  }, ms)
}



// Show hide password
$(document).ready(function() {
  $("#toggle_password a").on('click', function(event) {
      event.preventDefault();
      if($('#toggle_password input').attr("type") == "text"){
          $('#toggle_password input').attr('type', 'password');
          $('#toggle_password i').addClass( "fa-eye-slash" );
          $('#toggle_password i').removeClass( "fa-eye" );
      }else if($('#toggle_password input').attr("type") == "password"){
          $('#toggle_password input').attr('type', 'text');
          $('#toggle_password i').removeClass( "fa-eye-slash" );
          $('#toggle_password i').addClass( "fa-eye" );
      }
  });
});
