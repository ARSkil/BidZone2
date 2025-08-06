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

// Открыть модальное окно
function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
}

// Закрыть модальное окно
function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
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
