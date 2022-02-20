"use strict";

(function () {
  const ignoreList = [
    'https://www.highload.ru/moscow/2021',
    'https://golangconf.ru/2022',
    'https://knowledgeconf.ru/2022',
    'http://devtechconf.ru/2022'
  ];
  const calendarList = document.querySelector('.calendar__in');

  fetch('https://conf.ontico.ru/api/conferences/forCalendar.json').then(function (res) {
    return res.json();
  }).then(function (data) {
    initEvents(data.result.filter(el => !ignoreList.includes(el.uri.trim())));
  }).catch(function (err) {
    return console.log(err);
  });

  function initEvents(data) {
    data.forEach(function (el) {
      return addItem(el);
    });
  }

  function addItem(element) {
    // var item = document.createElement('div');
    var itemDate = document.createElement('div');
    var itemIn = document.createElement('a');
    var itemLogo = document.createElement('img');
    var itemTtl = document.createElement('div');
    var itemPlace = document.createElement('div');
    var itemText = document.createElement('div');
    var itemLink = document.createElement('div');
    var itemWrap = document.createElement('div');
    var itemTicket = document.createElement('div');
    var itemMore = document.createElement('div');

    itemWrap.className = 'calendar__item-wrap';
    itemDate.className = 'calendar__item-date';
    itemDate.innerHTML = element.date_range;

    itemIn.className = 'calendar__item-in';
    itemIn.target = '_blank';
    itemIn.href = element.uri;

    itemLink.className = 'calendar__item-link';
    itemLink.target = '_blank';
    itemLink.innerHTML = element.uri;

    itemTicket.className = 'calendar__item-ticket';
    itemTicket.textContent = 'Купить билет';

    itemMore.className = 'calendar__item-more';
    itemMore.textContent = 'Подробнее';

    itemLogo.className = 'calendar__item-logo';
    itemLogo.src = element.logo;
    itemLogo.alt = `Лого ${element.name}`;

    itemTtl.className = 'calendar__item-ttl';
    itemTtl.textContent = element.name;

    itemText.className = 'calendar__item-text';
    itemText.textContent = element.brief;

    itemPlace.className = 'calendar__item-place';
    if (element.location.includes('отменена') || element.location.includes('объединена')) {
      itemPlace.classList.add('calendar__item-place_cancelled');
    }
    itemPlace.textContent = element.location;

    appendChildren(itemIn, [itemDate, itemLogo, itemTtl, itemText, itemPlace, itemLink, itemWrap]);
    appendChildren(itemWrap, [itemTicket, itemMore]);

    calendarList.appendChild(itemIn);
  }

  function appendChildren(element, items) {
    items.forEach(function (children) {
      element.appendChild(children);
    });
  }
})();
