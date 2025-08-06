const nameField = document.getElementById("nameField");
const fullNameInput = document.getElementById("fullName");

document.getElementById("registerBtn").addEventListener("click", () => {
  // Показать поле имени при регистрации
  if (nameField.style.display === "none") {
    nameField.style.display = "block";
    return; // ждём, пока пользователь введёт имя
  }

  const name = fullNameInput.value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Введите имя, email и пароль");
    return;
  }

  const userData = { name, email, password };
  localStorage.setItem("bidzoneUser", JSON.stringify(userData));
  alert("Регистрация успешна! Теперь войдите.");
  nameField.style.display = "none"; // скрываем поле имени
});

document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Введите email и пароль");
    return;
  }

  const savedUser = JSON.parse(localStorage.getItem("bidzoneUser"));
  if (savedUser && savedUser.email === email && savedUser.password === password) {
    localStorage.setItem("bidzoneLoggedIn", "true");
    localStorage.setItem("bidzoneUserName", savedUser.name);
    window.location.href = "index.html";
  } else {
    alert("Неверный email или пароль");
  }
});
