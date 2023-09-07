$.ajax({
  type: "GET",
  url: "/check-internet",
  success: function(response) {
    if (!response['connected']) {
      $('.content').html('<div class="no-internet"><img class="img-responsive" src="/static/icons/warning.svg"/><p>NO INTERNET CONNECTION</p></div>')
    }
  },
  error: function(response) {
    alert('ERROR')
  }
})
