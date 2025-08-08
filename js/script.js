const images = [
  'ace.png', 'beer.png', 'boat.png', 'fish-big.png', 'fisher.png',
  'fish-golden.png', 'fish-little.png', 'fish-middle.png', 'fish-small.png',
  'float.png', 'jack.png', 'king.png', 'queen.png', 'rod.png', 'scatter.png', 'ten.png'
];

const startGrid = [
  ['fish-little.png', 'ten.png', 'fish-middle.png'],
  ['fisher.png', 'float.png', 'queen.png'],
  ['king.png', 'fish-middle.png', 'beer.png']
];

const spinGrid1 = [
  ['ace.png', 'fish-small.png', 'rod.png'],
  ['beer.png', 'beer.png', 'float.png'],
  ['fish-little.png', 'fisher.png', 'jack.png']
];

const spinGrid2 = [
  ['fish-big.png', 'fish-middle.png', 'ten.png'],
  ['fish-golden.png', 'fish-golden.png', 'boat.png'],
  ['rod.png', 'beer.png', 'queen.png']
];

const spinGrid3 = [
  ['boat.png', 'rod.png', 'jack.png'],
  ['scatter.png', 'scatter.png', 'scatter.png'],
  ['float.png', 'fish-golden.png', 'king.png']
];

const allSpins = [spinGrid1, spinGrid2, spinGrid3];

const gridWrapper = document.querySelector('.promo__cells');
const resultSpan = document.querySelector('.promo__result-count span');
const spinButton = document.getElementById('spin');

let spinsLeft = 3;
let currentSpin = 0;

function getImageClass(filename) {
  return `promo__img--${filename.replace('.png', '').toLowerCase()}`;
}

function createCell(imageName) {
  const cell = document.createElement('div');
  cell.classList.add('promo__cell');

  const img = document.createElement('img');
  img.src = `./img/slots/${imageName}`;
  img.alt = imageName;
  img.className = getImageClass(imageName);

  cell.appendChild(img);
  return cell;
}

function generateGrid(grid, withRandom = true) {
  gridWrapper.innerHTML = '';

  for (let col = 0; col < 3; col++) {
    const column = document.createElement('div');
    column.classList.add('promo__column');

    const columnInner = document.createElement('div');
    columnInner.classList.add('promo__column-inner');

    // Сначала финальные — они сверху
    for (let row = 0; row < 3; row++) {
      const finalImage = grid[row][col];
      const cell = createCell(finalImage);
      cell.classList.add('final-cell');
      columnInner.appendChild(cell);
    }

    // Потом 6 рандомных — снизу
    if (withRandom) {
      for (let i = 0; i < 6; i++) {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const cell = createCell(randomImage);
        columnInner.appendChild(cell);
      }
    }

    column.appendChild(columnInner);
    gridWrapper.appendChild(column);
  }
}


function updateFinalCells(grid) {
  const columns = document.querySelectorAll('.promo__column-inner');

  columns.forEach((columnInner, colIndex) => {
    const cells = columnInner.querySelectorAll('.promo__cell');

    // Первые 3 ячейки — финальные
    for (let row = 0; row < 3; row++) {
      const img = cells[row].querySelector('img');
      const imageName = grid[row][colIndex];
      img.src = `./img/slots/${imageName}`;
      img.alt = imageName;
      img.className = getImageClass(imageName);
    }
  });
}

function spinColumns(callback) {
  const columns = document.querySelectorAll('.promo__column-inner');
  const cellHeightRem = 22.2; // высота одной ячейки
  const scrollCells = 6; // рандомных ячеек
  const initialOffset = -cellHeightRem * scrollCells;

  columns.forEach((columnInner, index) => {
    // Сразу сдвигаем наверх, чтобы в кадре были рандомные
    columnInner.style.transition = 'none';
    columnInner.style.transform = `translateY(${initialOffset}rem)`;
    void columnInner.offsetWidth; // форс-рефлоу

    setTimeout(() => {
      // Потом плавно опускаем колонку вниз, финальные ячейки появляются сверху
      columnInner.style.transition = 'transform 2s ease-out';
      columnInner.style.transform = `translateY(0rem)`;
    }, index * 250);
  });

  if (typeof callback === 'function') {
    // чуть позже вызовем коллбэк
    setTimeout(callback, 200);
  }
}

function startTimer(durationMinutes) {
  let totalSeconds = durationMinutes * 60;

  const minutesSpan = document.getElementById('minutes');
  const secondsSpan = document.getElementById('seconds');

  const timerInterval = setInterval(() => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    minutesSpan.textContent = minutes.toString().padStart(2, '0');
    secondsSpan.textContent = seconds.toString().padStart(2, '0');

    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
    }

    totalSeconds--;
  }, 1000);
}

const popStartBtn = document.querySelector('.pop__btn');
popStartBtn.addEventListener('click', () => {
  document.querySelector('.pop').classList.remove('active');
  document.body.classList.remove('active');
});



spinButton.addEventListener('click', () => {
  if (spinsLeft <= 0 || currentSpin >= allSpins.length) return;

  const finalGrid = allSpins[currentSpin];
  currentSpin++;
  spinsLeft--;
  resultSpan.textContent = spinsLeft;

  // 🔁 Запускаем прокрутку СТАРЫХ колонок
  spinColumns(() => {
    // ⏱ Через задержку (после начала анимации) → заменяем нижние ячейки на финальные
    updateFinalCells(finalGrid);

    // 🎉 Если последний спин — добавим анимацию на scatter
    if (currentSpin === allSpins.length) {
      setTimeout(() => {
        const finalScatterImages = document.querySelectorAll('.final-cell img');
        finalScatterImages.forEach(img => {
          if (img.src.includes('scatter.png')) {
            img.classList.add('pulse-anim');
          }
        });
      }, 2500);
    }

    // 💀 Финальная сцена
    if (spinsLeft === 0) {
      const element = document.querySelector('.promo__btn');
      element.style.backgroundImage = 'url("./img/button-dis.png")';

      setTimeout(() => {
        document.getElementById('end').classList.add('active');
        document.body.classList.add('active');
        startTimer(15);
      }, 5000);
    }
  });
});


window.addEventListener('DOMContentLoaded', () => {
  // Показываем стартовую сетку С РАНДОМНЫМИ сверху
  generateGrid(startGrid, true);

  // Ждём загрузки всех картинок
  const imagesToLoad = Array.from(document.querySelectorAll('.promo__cell img'));
  let loadedCount = 0;

  imagesToLoad.forEach(img => {
    if (img.complete) {
      loadedCount++;
    } else {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesToLoad.length) showStart();
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imagesToLoad.length) showStart();
      };
    }
  });

  if (loadedCount === imagesToLoad.length) {
    showStart();
  }

  function showStart() {
    // Прячем лоадер
    document.querySelector('.loader').classList.add('hidden');

    // Начинаем плавное появление сетки, как при обычном спине
    setTimeout(() => {
      spinColumns();
    }, 100);

    resultSpan.textContent = spinsLeft;

    setTimeout(() => {
      document.getElementById('start').classList.add('active');
      document.body.classList.add('active');
    }, 0); 
  }
});
