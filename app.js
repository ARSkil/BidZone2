// Загружаем товары из products.json
fetch("products.json")
    .then(res => res.json())
    .then(products => {
        const productList = document.getElementById("product-list");
        products.forEach(product => {
            const productHTML = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Цена: $${product.price}</p>

                    <div class="bid-section">
                        <div class="auction-timer" id="timer-${product.id}">Осталось: 24:00:00</div>

                        <label>Ваша ставка ($)</label>
                        <input type="number" id="bidAmount-${product.id}" placeholder="Например: 100000">

                        <label>Максимальная ставка ($)</label>
                        <input type="number" id="maxBidAmount-${product.id}" placeholder="Например: 200000">

                        <button onclick="placeBid(${product.id})">Сделать ставку</button>
                    </div>
                </div>
            `;
            productList.innerHTML += productHTML;

            startAuctionTimer(product.id, 600); // 24 часа
        });
    });

// Таймер для аукциона
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
