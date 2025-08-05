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
    localStorage.setItem("bidzoneUserEmail", email);
    window.location.href = "index.html";
  } else {
    alert("Неверный email или пароль");
  }
});

document.getElementById("registerBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Введите email и пароль");
    return;
  }

  const userData = { email, password };
  localStorage.setItem("bidzoneUser", JSON.stringify(userData));
  alert("Регистрация успешна! Теперь войдите.");
});
