function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var users = JSON.parse(localStorage.getItem("users"));

  if (users == null) {
    alert("No users found. Please signup first.");
    return;
  }

  var isValid = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email && users[i].password == password) {
      isValid = true;
      break;
    }
  }

  if (isValid) {
    localStorage.setItem("currentUser", email);
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password");
  }
}