document.addEventListener("DOMContentLoaded", () => {
  const productsEl = document.getElementById("products");
  const modal = document.getElementById("cardModal");
  const closeBtn = document.querySelector(".close");
  const linkCardBtn = document.getElementById("linkCardBtn");
  const successMsg = document.getElementById("successMsg");

  // Загружаем тестовые товары
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
          modal.style.display = "block";
        });
      });
    });

  closeBtn.addEventListener("click", () => modal.style.display = "none");

 linkCardBtn.addEventListener("click", () => {
  const number = document.getElementById("cardNumber").value.trim();
  const expiry = document.getElementById("cardExpiry").value.trim();
  const cvc = document.getElementById("cardCVC").value.trim();

  if (number.length < 16 || expiry.length < 4 || cvc.length < 3) {
    alert("❌ Пожалуйста, заполните все поля корректно.");
    return;
  }

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
