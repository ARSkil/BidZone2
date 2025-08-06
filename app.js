document.addEventListener("DOMContentLoaded", () => {
  const productsEl = document.getElementById("products");
  const modal = document.getElementById("cardModal");
  const closeBtn = document.querySelector(".close");
  const linkCardBtn = document.getElementById("linkCardBtn");
  const successMsg = document.getElementById("successMsg");

  const loggedIn = localStorage.getItem("bidzoneLoggedIn") === "true";
  const userEmail = localStorage.getItem("bidzoneUserEmail");
  const cardLinked = localStorage.getItem("bidzoneCardLinked") === "true";

document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("bidzoneLoggedIn") === "true";
  const userName = localStorage.getItem("bidzoneUserName");

  if (loggedIn) {
    document.getElementById("loginLink").style.display = "none";
    document.getElementById("userEmail").style.display = "inline";
    document.getElementById("userEmail").textContent = `Привет, ${userName}`;
    document.getElementById("logoutBtn").style.display = "inline";
  }

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
  });
});
const firebaseConfig = { 
  apiKey : "AIzaSyBRWdm9N6-mje12iPUS2gU5eAvFrToz9mI" , 
  authDomain : "bidzone2-22307.firebaseapp.com" , 
  projectId : "bidzone2-22307" , 
  storageBucket : "bidzone2-22307.firebasestorage.app" , 
  messagingSenderId : "994395619375" , 
  appId : "1:994395619375:web:682b4ffee9d4ff604906da" , 
  MeasurementId : "G-97Q254PN7X" 
};

  // Загружаем товары
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("product");
        card.innerHTML = `
          <img src="${prod.image}" alt="${prod.name}">
          <h3>${prod.name}</h3>
          <p>${prod.price} $</p>
          <button class="bidBtn">Сделать ставку</button>
        `;
        productsEl.appendChild(card);
      });

      document.querySelectorAll(".bidBtn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (!loggedIn) {
            alert("❌ Сначала войдите в аккаунт!");
            window.location.href = "login.html";
            return;
          }

          if (!cardLinked) {
            modal.style.display = "block";
            return;
          }

          alert("✅ Ваша ставка принята!");
        });
      });
    });

  // Закрыть модалку
  closeBtn.addEventListener("click", () => modal.style.display = "none");

  // Привязка карты
 linkCardBtn.addEventListener("click", () => {
  const holder = document.getElementById("cardHolder").value.trim();
  const number = document.getElementById("cardNumber").value.trim();
  const expiry = document.getElementById("cardExpiry").value.trim();
  const cvc = document.getElementById("cardCVC").value.trim();

  if (!holder || number.length < 16 || expiry.length < 4 || cvc.length < 3) {
    alert("❌ Пожалуйста, заполните все поля корректно.");
    return;
  }

  localStorage.setItem("bidzoneCardLinked", "true");
  modal.style.display = "none";
  successMsg.style.display = "block";
  setTimeout(() => successMsg.style.display = "none", 3000);
});


  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

function openRegisterModal() {
    document.getElementById("registerModal").style.display = "block";
}
function closeRegisterModal() {
    document.getElementById("registerModal").style.display = "none";
}


// Функция входа
function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const cardName = document.getElementById("cardName").value;

    if (!email || !password || !cardName) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    alert(`Добро пожаловать, ${email}!\nКарта: ${cardName} привязана.`);
    closeLoginModal();
}
// Открыть модалку регистрации
function openRegisterModal() {
    document.getElementById("registerModal").style.display = "block";
}

// Закрыть модалку регистрации
function closeRegisterModal() {
    document.getElementById("registerModal").style.display = "none";
}


// Функция регистрации
function registerUser() {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const passwordConfirm = document.getElementById("regPasswordConfirm").value;
    const cardName = document.getElementById("regCardName").value;

    if (!name || !email || !password || !passwordConfirm || !cardName) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    if (password !== passwordConfirm) {
        alert("Пароли не совпадают.");
        return;
    }

    alert(`Регистрация успешна!\nДобро пожаловать, ${name}!\nКарта: ${cardName} привязана.`);
    closeRegisterModal();
}
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRWdm9N6-mje12iPUS2gU5eAvFrToz9mI",
  authDomain: "bidzone2-22307.firebaseapp.com",
  projectId: "bidzone2-22307",
  storageBucket: "bidzone2-22307.firebasestorage.app",
  messagingSenderId: "994395619375",
  appId: "1:994395619375:web:682b4ffee9d4ff604906da",
  measurementId: "G-97Q254PN7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
