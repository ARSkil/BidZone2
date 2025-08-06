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
// Конфиг Firebase (замени на свой)
const firebaseConfig = {
  apiKey: "pk_test_51RsHMWFS3bBlu3xt3Ebn7ZmXRaBj9VsI8419jGJ9Fwg63bSruqZvkDMKzJs4QKslLPOUtoWdxdnyeYLmnU7gf9Xv00YyYfeWzj",
  authDomain: "BidZone2.firebaseapp.com",
  projectId: "BidZone2",
  storageBucket: "BidZone2.appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID"
};

// Инициализация
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Вход через Google
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            alert(`Добро пожаловать, ${result.user.displayName}!`);
        })
        .catch((error) => {
            console.error(error);
            alert("Ошибка входа через Google");
        });
}
