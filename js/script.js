"use strict";

(function () {
  const ignoreList = [
    'https://www.highload.ru/moscow/2021',
    'https://golangconf.ru/2022',
    'https://knowledgeconf.ru/2022',
    'http://devtechconf.ru/2022'
  ];
  const calendarList = document.querySelector('.calendar__in');
  const arrEvent = [];
  let dateId = 0,
    arrDate = {},
    year;

  fetch('https://conf.ontico.ru/api/conferences/forCalendar.json').then(function (res) {
    return res.json();
  }).then(function (data) {
    data.result.forEach(item => {
      item = item.date_range.split(' ');
      item.forEach(item => {
        if (item.length === 4 && item.match(/\d+/g)) {
          year = item;
        }
        if ((item.length >= 3) && item.match(/[а-яёА-ЯЁ]/g)) {
          item = item.replace(/\я$/, 'ь');
          arrDate = {
            id: `${dateId}`,
            month: `${item}`,
            year: `${year}`
          };
          arrEvent.push(arrDate);
          ++dateId;
        }
      })
    })

    // console.log(arrEvent);

    monthRange();

    function monthRange() {

      let monthsArr = [];
      arrEvent.forEach(x => {
        // console.log(x.month);
        if (!monthsArr.some(y => JSON.stringify(y.month) === JSON.stringify(x.month))) {
          monthsArr.push(x);
        }
      })

      const $footerrange = document.createElement('div');
      $footerrange.classList.add('footer__range');

      $footerrange.innerHTML = '<input type="range" min="1" max="' + monthsArr.length + '" value="1" class="footer__slider" id="myRange">'
      document.querySelector('.footer__bottom').append($footerrange);

      const $monthsList = document.createElement('ul');
      $monthsList.classList.add('footer__months');

      monthsArr.forEach(item => {
        const $monthItem = document.createElement('li');
        $monthItem.classList.add('footer__month');
        $monthItem.textContent = item.month + ' ' + item.year;
        $monthsList.append($monthItem);
      })

      $footerrange.append($monthsList);

      function changeRange() {
        const $changerange = document.querySelector('#myRange');
        $changerange.addEventListener('change', (event) => {
          const arrRange = [];
          const monthNumber = event.target.value;

          let dateEvents = monthsArr[monthNumber - 1].month;


          data.result.forEach(item => {
            let monthRange = item.date_range.split(' ');
            monthRange.forEach(monthRange => {
              console.log(dateEvents.slice(-1));
              if (dateEvents.slice(-1) !== 'я') {
                dateEvents = dateEvents.replace(/\ь$/, 'я');
              }
              if ((monthRange.length >= 3 && monthRange.match(/[а-яёА-ЯЁ]/g)) && monthRange === dateEvents) {
                // console.log(item);
                arrRange.push(item);
              }
              calendarList.innerHTML = '';
              initEvents(arrRange);
            })
          })
        });
      }
      changeRange();
    }

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
    // let item = document.createElement('div');
    let itemDate = document.createElement('div');
    let itemIn = document.createElement('a');
    let itemLogo = document.createElement('img');
    let itemTtl = document.createElement('div');
    let itemPlace = document.createElement('div');
    let itemText = document.createElement('div');
    let itemLink = document.createElement('div');
    let itemWrap = document.createElement('div');
    let itemTicket = document.createElement('div');
    let itemMore = document.createElement('div');

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

