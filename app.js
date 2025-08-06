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
// Создание карточек товаров с таймером
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');

    // Фото
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    card.appendChild(img);

    // Название
    const name = document.createElement('h3');
    name.textContent = product.name;
    card.appendChild(name);

    // Цена
    const price = document.createElement('p');
    price.textContent = `Текущая ставка: $${product.currentBid}`;
    card.appendChild(price);

    // Таймер
    const timer = document.createElement('p');
    timer.classList.add('timer');
    card.appendChild(timer);

    // Запуск таймера
    updateTimer(timer, product.endTime);
    setInterval(() => updateTimer(timer, product.endTime), 1000);

    // Кнопка ставки
    const bidButton = document.createElement('button');
    bidButton.textContent = 'Сделать ставку';
    card.appendChild(bidButton);

    return card;
}

// Функция обновления таймера
function updateTimer(timerElement, endTime) {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const distance = end - now;

    if (distance <= 0) {
        timerElement.textContent = "Аукцион завершён";
        return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerElement.textContent = `${hours}ч ${minutes}м ${seconds}с`;
}


