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
    if (data) { //  убираем loader
      document.querySelector('.calendar__loader').remove();
    }
    data.result.forEach(item => {
      item = item.date_range.split(' '); /*разбиваем полученную строку даты на массив элементов по пробелу */
      item.forEach(item => {
        if (item.length === 4 && item.match(/\d+/g)) { /* ищем 4 цифры - это год */
          year = item;
        }
        /* ищем месяц и если год уже есть, кладём всё в массив месяцев планируемых мероприятий, определяем метки шкалы фильтра по месяцам*/
        if ((item.length >= 3) && item.match(/[а-яёА-ЯЁ]/g) && year) {
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


    function monthRange() {
      /* проверяем полученный массив на уникальность записей для шкалы */

      let monthsArr = [];
      arrEvent.forEach(x => {
        if (!monthsArr.some(y => JSON.stringify(y.month) === JSON.stringify(x.month))) {
          monthsArr.push(x);
        }
      })

      /* рисуем ползунок с месяцами */

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

      /* отслеживаем ползунок */

      (function changeRange() {
        const $changerange = document.querySelector('#myRange');
        $changerange.addEventListener('change', (event) => {
          const arrRange = [];

          /* сравниваем полученный номер позиции ползунка с базой уникальных месяцев и получаем месяц */

          const monthNumber = event.target.value;
          let dateEvents = monthsArr[monthNumber - 1].month;

          /* для данных из API отдельно выделяем месяц приводим его к нужному падежу и сраниваем с месяц из базы ползунка
          если совпадение есть кладём ВСЕ объекты из API в массив
          очищаем область вывода и вызываем на основе этого массива прорисовку карточек */

          data.result.forEach(item => {
            let monthRange = item.date_range.split(' ');
            monthRange.forEach(monthRange => {
              monthRange = monthRange.replace(/\я$/, 'ь');
              if ((monthRange.length >= 3 && monthRange.match(/[а-яёА-ЯЁ]/g)) && monthRange === dateEvents) {
                console.log(dateEvents)
                arrRange.push(item);
              }
              calendarList.innerHTML = '';
              initEvents(arrRange);
            })
          })
        });
      })()
    }

    monthRange();

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

