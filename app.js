fetch("products.json")
  .then(res => res.json())
  .then(products => {
    const productList = document.getElementById("product-list");
    products.forEach(product => {
      const productHTML = `
        <div class="product-card" onclick="openProduct(${product.id})">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>Цена: $${product.price}</p>
          <p id="timer-${product.id}"></p>
        </div>
      `;
      productList.innerHTML += productHTML;

      // Запуск таймера для каждой карточки
      startTimer(`timer-${product.id}`, product.endTime);
    });
  });

function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function startTimer(elementId, endTime) {
  const timerElement = document.getElementById(elementId);
  const end = new Date(endTime).getTime();

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = end - now;

    if (distance <= 0) {
      clearInterval(interval);
      timerElement.textContent = "Аукцион завершен";
      return;
    }

    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    timerElement.textContent = `${hours}ч ${minutes}м ${seconds}с`;
  }, 1000);
}


// Обработка ставки
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

fetch("products.json")
  .then(res => res.json())
  .then(products => {
    const productList = document.getElementById("product-list");
    products.forEach(product => {
      const productHTML = `
        <div class="product-card" onclick="openProduct(${product.id})">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>Цена: $${product.price}</p>
        </div>
      `;
      productList.innerHTML += productHTML;
    });
  });

function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}
