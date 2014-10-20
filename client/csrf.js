// Use jQuery's ajaxPrefilter API to add csrf token to each request.
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  var token;
  if (!options.crossDomain) {
    token = $('meta[name="csrf-token"]').attr('content');
    if (token) {
      return jqXHR.setRequestHeader('X-CSRF-Token', token);
    }
  }
});
