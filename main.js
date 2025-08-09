/* main.js — единый модуль для всех страниц */
const app = (function(){
  // --- helpers for localStorage ---
  const LS_USERS = 'bidzone_users_v1';
  const LS_SESSION = 'bidzone_session_v1'; // stores current user id
  const LS_PRODUCT_STATE = 'bidzone_prod_state_v1'; // {id: {currentBid, endTimeISO, lastBidUserId}}

  function readJSON(key){ try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch(e){return null} }
  function writeJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  // users CRUD
  function getUsers(){ return readJSON(LS_USERS) || []; }
  function saveUsers(u){ writeJSON(LS_USERS, u); }
  function genId(){ return 'u'+Date.now().toString(36)+'-'+Math.floor(Math.random()*9000+1000); }

  async function register({name,email,phone,password}){
    if(!name||!email||!password) throw new Error('Нужно указать имя, email и пароль');
    const users = getUsers();
    if(users.find(x=>x.email===email)) throw new Error('Пользователь с таким email уже есть');
    const newUser = { id: genId(), name, email, phone, password, photo:null, cardLinked:false };
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(LS_SESSION, newUser.id);
    return newUser;
  }
  async function login(email,password){
    const users = getUsers();
    const u = users.find(x=>x.email===email && x.password===password);
    if(!u) throw new Error('Неверный email или пароль');
    localStorage.setItem(LS_SESSION, u.id);
    return u;
  }
  async function logout(){
    localStorage.removeItem(LS_SESSION);
  }
  function getCurrentUser(){
    const id = localStorage.getItem(LS_SESSION);
    if(!id) return null;
    const users = getUsers();
    return users.find(u=>u.id===id) || null;
  }
  async function getCurrentUserOrRedirect(){
    const u = getCurrentUser();
    if(!u){ location.href='auth.html'; throw new Error('redirected'); }
    return u;
  }
  async function updateProfile(fields){
    const id = localStorage.getItem(LS_SESSION);
    if(!id) throw new Error('Not logged');
    const users = getUsers();
    const idx = users.findIndex(u=>u.id===id);
    if(idx<0) throw new Error('User not found');
    users[idx] = {...users[idx], ...fields};
    saveUsers(users);
    return users[idx];
  }
  async function deleteCurrentUser(){
    const id = localStorage.getItem(LS_SESSION);
    if(!id) return;
    let users = getUsers();
    users = users.filter(u=>u.id!==id);
    saveUsers(users);
    localStorage.removeItem(LS_SESSION);
  }

  // Header render
  async function renderHeader(){
    const headerRoot = document.getElementById('site-header');
    const user = getCurrentUser();
    const html = `
      <div class="header">
        <div class="left">
          <div class="logo">BidZone</div>
        </div>
        <div class="right">
          <button class="btn secondary" onclick="history.back()">← Назад</button>
          ${user ? `<span style="margin-right:12px">Привет, ${escapeHtml(user.name)}</span>` : ''}
          ${user ? `<button class="btn" id="btnProfile">Профиль</button>` : `<button class="btn" id="btnLogin">Войти</button>`}
          ${user ? `<button class="btn secondary" id="btnLogout">Выйти</button>` : `<button class="btn" id="btnRegister">Регистрация</button>`}
        </div>
      </div>
    `;
    headerRoot.innerHTML = html;

    // attach
    if(document.getElementById('btnLogin')) document.getElementById('btnLogin').onclick = ()=> location.href='auth.html';
    if(document.getElementById('btnRegister')) document.getElementById('btnRegister').onclick = ()=> location.href='auth.html';
    if(document.getElementById('btnProfile')) document.getElementById('btnProfile').onclick = ()=> location.href='profile.html';
    if(document.getElementById('btnLogout')) document.getElementById('btnLogout').onclick = async ()=>{
      await logout(); location.href='index.html';
    };
  }

  // escape
  function escapeHtml(s){ return String(s||'').replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }

  // products
  async function fetchProducts(){
    const res = await fetch('products.json');
    const data = await res.json();
    return data;
  }

  // product state: keep current bid and endTime in localStorage so timers persist
  function loadProductState(){
    return readJSON(LS_PRODUCT_STATE) || {};
  }
  function saveProductState(obj){ writeJSON(LS_PRODUCT_STATE, obj); }

  // ensure state exists for product (on first load set currentBid = price, endTime = endTime from JSON)
  function ensureProductState(product){
    const st = loadProductState();
    if(!st[product.id]){
      st[product.id] = { currentBid: product.price, endTimeISO: product.endTime, lastBidUserId: null };
      saveProductState(st);
    }
  }

  // render product list (index)
  async function renderProductList(){
    const products = await fetchProducts();
    const root = document.getElementById('product-list');
    root.innerHTML = '';
    products.forEach(p => {
      ensureProductState(p);
      const state = loadProductState()[p.id];
      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.id = p.id;
      card.innerHTML = `
        <img src="${p.image}" alt="${escapeHtml(p.name)}">
        <div class="meta">
          <div>
            <h3>${escapeHtml(p.name)}</h3>
            <div class="price">$<span id="price-${p.id}">${state.currentBid}</span></div>
          </div>
        </div>
        <div class="card-bid">
          <div class="timer" id="timer-${p.id}">—</div>
          <div class="row">
            <input type="number" id="bidInput-${p.id}" placeholder="Ваша ставка" min="1">
            <button class="quick-btn" onclick="app.quickBid(event, ${p.id})">+5$</button>
          </div>
          <div style="margin-top:8px" class="row">
            <input type="number" id="maxInput-${p.id}" placeholder="Макс. ставка">
            <button class="btn" onclick="app.placeBidFromCard(${p.id})">Сделать ставку</button>
          </div>
        </div>
      `;
      // click whole card -> product page
      card.onclick = (e) => {
        // if click on internal button/input — don't navigate
        if(e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        location.href = `product.html?id=${p.id}`;
      };
      root.appendChild(card);

      // start timer
      startTimerForElement(p.id);
      // show current price immediately
      document.getElementById(`price-${p.id}`).textContent = state.currentBid;
    });
  }

  // render product page
  async function renderProductPage(){
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get('id'));
    const products = await fetchProducts();
    const prod = products.find(x=>x.id===id);
    if(!prod){
      document.getElementById('product-detail').innerHTML = '<div class="card">Товар не найден</div>';
      return;
    }
    ensureProductState(prod);
    const state = loadProductState()[prod.id];

    const root = document.getElementById('product-detail');
    root.innerHTML = `
      <div class="product-detail">
        <img src="${prod.image}" alt="${escapeHtml(prod.name)}">
        <h2>${escapeHtml(prod.name)}</h2>
        <p>${escapeHtml(prod.description || '')}</p>
        <div class="row" style="justify-content:space-between;align-items:center;margin-top:8px">
          <div class="price">Текущая ставка: $<span id="detail-price">${state.currentBid}</span></div>
          <div class="timer" id="detail-timer">—</div>
        </div>

        <div class="controls">
          <div style="margin-top:12px;">
            <button class="quick-btn" onclick="app.quickBid(event, ${prod.id})">+5$</button>
            <input type="number" id="detail-bid" placeholder="Ваша ставка" style="width:140px;margin-left:8px">
            <input type="number" id="detail-max" placeholder="Макс ставка" style="width:140px;margin-left:8px">
            <button class="btn" onclick="app.placeBidFromDetail(${prod.id})" style="margin-left:8px">Сделать ставку</button>
          </div>
        </div>
      </div>
    `;
    startTimerForDetail(prod.id);
  }

  // timer helpers --------------------------------------------------------------
  const timers = {}; // intervals

  function startTimerForElement(productId){
    // timer for index card (id timer-{id})
    const state = loadProductState()[productId];
    const elId = `timer-${productId}`;
    // clear old
    if(timers['idx-'+productId]) clearInterval(timers['idx-'+productId]);
    timers['idx-'+productId] = setInterval(()=>{
      updateTimerDisplay(productId, elId);
    }, 1000);
    updateTimerDisplay(productId, elId);
  }

  function startTimerForDetail(productId){
    if(timers['det-'+productId]) clearInterval(timers['det-'+productId]);
    timers['det-'+productId] = setInterval(()=>{
      updateTimerDisplay(productId, 'detail-timer', 'detail-price');
    }, 1000);
    updateTimerDisplay(productId, 'detail-timer', 'detail-price');
  }

  function updateTimerDisplay(productId, timerElId, priceElId){
    const st = loadProductState()[productId];
    if(!st) return;
    const el = document.getElementById(timerElId);
    if(!el) return;
    const end = new Date(st.endTimeISO).getTime();
    const now = Date.now();
    let diff = Math.floor((end - now)/1000);
    if(diff <= 0){
      el.textContent = 'Аукцион завершён';
      if(priceElId){
        const pe = document.getElementById(priceElId);
        if(pe) pe.textContent = st.currentBid;
      }
      return;
    }
    const h = Math.floor(diff/3600); diff%=3600;
    const m = Math.floor(diff/60); const s = diff%60;
    el.textContent = `${h}ч ${m}м ${s}с`;
    if(priceElId){
      const pe = document.getElementById(priceElId);
      if(pe) pe.textContent = st.currentBid;
    }
  }

  // bidding logic --------------------------------------------------------------
  // place bid generic
  function placeBid(productId, amount){
    const user = getCurrentUser();
    if(!user) { alert('Сначала войдите'); location.href='auth.html'; return; }
    // require card linked
    const users = getUsers();
    const curUser = users.find(u=>u.id===user.id);
    if(!curUser || !curUser.cardLinked){
      if(confirm('Для ставок нужна привязанная карта. Перейти в профиль?')) location.href='profile.html';
      return;
    }

    const st = loadProductState();
    const s = st[productId];
    if(!s) { alert('Состояние товара отсутствует'); return; }

    if(amount <= s.currentBid){
      alert('Ставка должна быть больше текущей');
      return;
    }

    // обновить
    s.currentBid = amount;
    s.lastBidUserId = user.id;

    // если осталось <=60 сек — добавить 30 сек
    const end = new Date(s.endTimeISO).getTime();
    const now = Date.now();
    const remaining = Math.floor((end - now)/1000);
    if(remaining <= 60){
      const newEnd = new Date(end + 30*1000);
      s.endTimeISO = newEnd.toISOString();
    }
    st[productId] = s;
    saveProductState(st);

    // обновить UI
    // index price
    const priceEl = document.getElementById(`price-${productId}`);
    if(priceEl) priceEl.textContent = s.currentBid;
    // detail price
    const detailPrice = document.getElementById('detail-price');
    if(detailPrice) detailPrice.textContent = s.currentBid;

    showToast('Ставка принята');
  }

  // quick +5 handler
  function quickBid(e, productId){
    e.stopPropagation();
    const st = loadProductState()[productId];
    const amount = Number(st.currentBid) + 5;
    placeBid(productId, amount);
  }

  // place from card (index)
  function placeBidFromCard(productId){
    const input = document.getElementById(`bidInput-${productId}`);
    const maxInput = document.getElementById(`maxInput-${productId}`);
    const entered = Number(input.value || 0);
    const max = Number(maxInput.value || 0);
    const st = loadProductState()[productId];
    const minAllowed = st.currentBid + 1;
    let amount = entered || minAllowed;
    if(max && amount > max){ alert('Ваша ставка больше указанного максимума'); return; }
    if(amount <= st.currentBid){ amount = st.currentBid + 1; }
    placeBid(productId, amount);
  }

  // place from detail page
  function placeBidFromDetail(productId){
    const entered = Number(document.getElementById('detail-bid').value || 0);
    const max = Number(document.getElementById('detail-max').value || 0);
    const st = loadProductState()[productId];
    const minAllowed = st.currentBid + 1;
    let amount = entered || minAllowed;
    if(max && amount > max){ alert('Ставка больше указанного максимума'); return; }
    if(amount <= st.currentBid){ amount = st.currentBid + 1; }
    placeBid(productId, amount);
  }

  // toast
  function showToast(txt){
    let t = document.querySelector('.toast');
    if(!t){
      t = document.createElement('div'); t.className='toast'; t.id='appToast';
      document.body.appendChild(t);
    }
    t.textContent = txt; t.style.display='block';
    setTimeout(()=>{ t.style.display='none'; },3000);
  }

  // expose API functions needed by inline onclick
  return {
    renderHeader, renderProductList, renderProductPage, register, login, getCurrentUserOrRedirect,
    getCurrentUser, updateProfile, deleteCurrentUser, quickBid, placeBidFromCard, placeBidFromDetail,
    placeBidFromDetail_alias: placeBidFromDetail, // alias
    placeBid // direct
  };
})();
