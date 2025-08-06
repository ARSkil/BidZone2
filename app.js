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


