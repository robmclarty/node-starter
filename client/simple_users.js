var users = [];

$(function() {
  populateTable();

  $('#userlist table tbody').on('click', 'a.showuser-link', showUserInfo);
  $('#create-user-button').on('click', createUser);
  $('#userlist table tbody').on('click', 'a.deleteuser-link', deleteUser);
});

function populateTable() {
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON('/users', function(data) {
    users = data;

    // For each item in the JSON, add a table row and cells to the content string.
    $.each(users, function() {
      var name = this.profile.displayName || 'No Name';
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="showuser-link" data-id="' + this._id + '">' + name + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="deleteuser-link" data-id="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into existing HTML table.
    $('#userlist table tbody').html(tableContent);
  });
}

function showUserInfo(e) {
  e.preventDefault();

  var userID = $(this).data('id');
  var arrayPosition = users.map(function(arrayItem) {
    return arrayItem._id;
  }).indexOf(userID);
  var user = users[arrayPosition];

  $('#userinfo-name').text(user.profile.displayName || 'No Name');
  $('#userinfo-email').text(user.email);
  $('#userinfo-id').text(user._id);
  $('#userinfo-description').text(user.profile.description);
}

function createUser(e) {
  e.preventDefault();

  var newUser = {
    "userEmail": $('#adduser fieldset input#userEmail').val(),
    "userName": $('#adduser fieldset input#userName').val(),
    "userDescription": $('#adduser fieldset textarea#userDescription').val()
  };

  $.ajax({
    type: 'POST',
    data: newUser,
    url: '/users',
    dataType: 'JSON'
  }).done(function(res) {
    if (res.msg === '') {
      $('#adduser fieldset input').val('');
      $('#adduser fieldset textarea').val('');
      populateTable();
    } else {
      console.log("Error: ", res.msg);
    }
  });
}

function deleteUser(e) {
  e.preventDefault();

  var confirmation = confirm('Are you sure?');

  if (confirmation === true) {
    $.ajax({
      type: 'DELETE',
      url: "/users/" + $(this).data('id')
    }).done(function(res) {
      if (res.msg === '') {
        // everything worked!
      } else {
        console.log("Error: ", res.msg);
      }
      populateTable();
    });
  } else {
    return false;
  }
}
