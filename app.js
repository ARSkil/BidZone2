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
const firebaseConfig = { 
  apiKey : "AIzaSyBRWdm9N6-mje12iPUS2gU5eAvFrToz9mI" , 
  authDomain : "bidzone2-22307.firebaseapp.com" , 
  projectId : "bidzone2-22307" , 
  storageBucket : "bidzone2-22307.firebasestorage.app" , 
  messagingSenderId : "994395619375" , 
  appId : "1:994395619375:web:682b4ffee9d4ff604906da" , 
  MeasurementId : "G-97Q254PN7X" 
};

function startAuctionTimer(productId, seconds) {
    let timeLeft = seconds;
    const timerElement = document.getElementById(`timer-${productId}`);

    const interval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        timerElement.innerText = `Осталось: ${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(interval);
            timerElement.innerText = "Аукцион завершён";
        }
    }, 1000);
}

function placeBid(productId) {
    const bid = parseFloat(document.getElementById(`bidAmount-${productId}`).value);
    const maxBid = parseFloat(document.getElementById(`maxBidAmount-${productId}`).value);

    if (isNaN(bid) || isNaN(maxBid)) {
        alert("Введите обе суммы ставки");
        return;
    }
    if (bid <= 0 || maxBid <= 0) {
        alert("Ставка должна быть больше 0");
        return;
    }
    if (bid > maxBid) {
        alert("Ваша ставка не может быть выше максимальной");
        return;
    }

    alert(`Ваша ставка: $${bid}\nМаксимальная ставка: $${maxBid}`);
}

// Запускаем таймеры для всех товаров (10 минут)
products.forEach(product => {
    startAuctionTimer(product.id, 600);
});
// Таймер аукциона (пример — 10 минут)
let timeLeft = 600; // в секундах (10 минут)

function startAuctionTimer() {
    const timerElement = document.getElementById("timer1");
    const timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.innerText = `Осталось: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            timerElement.innerText = "Аукцион завершён";
        }
    }, 1000);
}

// Запуск таймера при загрузке страницы
startAuctionTimer();

// Отправка ставки
function placeBid() {
    const bid = parseFloat(document.getElementById("bidAmount").value);
    const maxBid = parseFloat(document.getElementById("maxBidAmount").value);

    if (isNaN(bid) || isNaN(maxBid)) {
        alert("Введите обе суммы ставки");
        return;
    }
    if (bid <= 0 || maxBid <= 0) {
        alert("Ставка должна быть больше 0");
        return;
    }
    if (bid > maxBid) {
        alert("Ваша ставка не может быть выше максимальной");
        return;
    }

    alert(`Ваша ставка: $${bid}\nМаксимальная ставка: $${maxBid}`);
}

