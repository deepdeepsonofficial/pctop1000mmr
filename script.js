const form = document.querySelector('#booking-form');
const zone = form.elements.zone;
const pack = form.elements.package;
const date = form.elements.date;
const time = form.elements.time;
const seats = document.querySelector('#seats');
const message = document.querySelector('#form-message');
let selected = '';
// Данные игровых зон. Цены указаны за выбранное число часов.
const zones = {
  standard: { name: 'ПК Standard', count: 12, prefix: 'S', price: { 1: 150, 3: 400, 5: 600, 9: 800 } },
  vip: { name: 'ПК VIP', count: 6, prefix: 'V', price: { 1: 250, 3: 650, 5: 1000, 9: 1300 } },
  ps5: { name: 'PS5 Standard', count: 2, prefix: 'P', price: { 1: 350, 3: 900, 5: 1400, 9: 1800 } },
  ps5vip: { name: 'PS5 VIP', count: 2, prefix: 'PV', price: { 1: 500, 3: 1300, 5: 2000, 9: 2600 } }
};
// Обновляем название, стоимость и выделение кнопок.
function update() {
  document.querySelector('#summary-zone').textContent = zones[zone.value].name;
  document.querySelector('#total').textContent = zones[zone.value].price[pack.value] + ' ₽';
  if (selected) document.querySelector('#summary-details').textContent = 'Место ' + selected;
  else document.querySelector('#summary-details').textContent = 'Выбери место';
  time.readOnly = pack.value === '9';
  if (time.readOnly) time.value = '23:00';
  for (const button of document.querySelectorAll('[data-field]')) {
    const active = form.elements[button.dataset.field].value === button.dataset.value;
    button.setAttribute('aria-pressed', active);
  }
  message.textContent = '';
}

// Создаём кнопки игровых мест.
function drawSeats() {
  seats.replaceChildren();
  selected = '';
  for (let n = 1; n <= zones[zone.value].count; n++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'seat';
    button.textContent = zones[zone.value].prefix + n;
    button.setAttribute('aria-pressed', 'false');
    button.onclick = () => {
      selected = button.textContent;
      for (const item of seats.querySelectorAll('button')) {
        item.setAttribute('aria-pressed', item === button);
      }
      update();
    };
    seats.append(button);
  }
  update();
}

// Обрабатываем выбор зоны и пакета.
form.onclick = event => {
  const button = event.target.closest('[data-field]');
  if (!button) return;
  form.elements[button.dataset.field].value = button.dataset.value;
  if (button.dataset.field === 'zone') drawSeats(); else update();
};

// Проверяем форму и показываем пример заявки.
form.onsubmit = event => {
  event.preventDefault();
  if (!selected) message.textContent = 'Выбери место.';
  else if (new Date(date.value + 'T' + time.value) <= new Date()) message.textContent = 'Выбери время в будущем.';
  else message.textContent = 'Пример заявки: ' + zones[zone.value].name + ', ' + selected + ', ' + date.value + ' в ' + time.value + '. Без отправки и сохранения.';
};
const today = new Date();
date.min = date.value = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
const requested = new URLSearchParams(location.search).get('zone');
if (zones[requested]) zone.value = requested;
drawSeats();
