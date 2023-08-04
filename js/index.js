if (loadUserFromLocalStorage() == null) {
  location.href = "login.html";
}
let userName = loadUserFromLocalStorage().name;
document.querySelector("#userName").innerHTML = userName;

const logoutButton = document.querySelector("#logoutButton");
logoutButton.addEventListener("click", function () {
  localStorage.removeItem("logedUser");
  location.href = "login.html";
});

/* helper */
function loadUserFromLocalStorage() {
  return JSON.parse(localStorage.getItem("logedUser"));
}
