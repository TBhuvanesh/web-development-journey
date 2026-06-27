function signup() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var users = JSON.parse(localStorage.getItem("users"));

  if (users == null) {
    users = [];
  }

  var userExists = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      userExists = true;
      break;
    }
  }

  if (userExists) {
    alert("User already exists");
    return;
  }

  var newUser = {
    email: email,
    password: password
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful");
  window.location.href = "login.html";
}