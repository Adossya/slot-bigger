const images = [
  'ace.png', 'beer.png', 'boat.png', 'fish-big.png', 'fisher.png',
  'fish-golden.png', 'fish-little.png', 'fish-middle.png', 'fish-small.png',
  'float.png', 'jack.png', 'king.png', 'queen.png', 'rod.png', 'scatter.png', 'ten.png'
];


const colum1 = ['boat.png','scatter.png','float.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','fish-big.png','fish-golden.png','rod.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','ace.png','beer.png','fish-little.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','fish-little.png','fisher.png','king.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png'];

const colum2 = ['rod.png','scatter.png','king.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','fish-middle.png','fish-golden.png','queen.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','fish-small.png','beer.png','fisher.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','ten.png','float.png','fish-middle.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png'];

const colum3 = ['jack.png','scatter.png','fish-golden.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','ten.png','boat.png','beer.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','rod.png','float.png','jack.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','fish-middle.png','queen.png','beer.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png','random.png'];

const allSpins = [
  [ ['ace.png','fish-small.png','rod.png'], ['beer.png','beer.png','float.png'], ['fish-little.png','fisher.png','jack.png'] ],
  [ ['fish-big.png','fish-middle.png','ten.png'], ['fish-golden.png','fish-golden.png','boat.png'], ['rod.png','beer.png','queen.png'] ],
  [ ['boat.png','rod.png','jack.png'], ['scatter.png','scatter.png','scatter.png'], ['float.png','fish-golden.png','king.png'] ]
];

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

function generateStaticColumns(columnsData) {
  gridWrapper.innerHTML = '';

  columnsData.forEach(colArray => {
    const column = document.createElement('div');
    column.classList.add('promo__column');

    const columnInner = document.createElement('div');
    columnInner.classList.add('promo__column-inner');

    colArray.forEach(imageName => {
      const actualImage = imageName === 'random.png'
        ? images[Math.floor(Math.random() * images.length)]
        : imageName;

      const cell = createCell(actualImage);
      columnInner.appendChild(cell);
    });

    column.appendChild(columnInner);
    gridWrapper.appendChild(column);
  });
}


function getCellHeightRem() {
  const width = window.innerWidth;

  if (width < 375) {
    return 16;
  } else if (width < 480) {
    return 20;
  } else if (width < 1080) {
    return 25;
  } else {
    return 28;  
  }
}

const gapRem = 0.3; 

let cellHeightRem = getCellHeightRem();
let totalCellHeightRem = cellHeightRem + gapRem;


let currentOffsetRem = -totalCellHeightRem * 36;
const stepRem = totalCellHeightRem * 12;

function spinColumns(callback) {
  const columns = document.querySelectorAll('.promo__column-inner');

  currentOffsetRem += stepRem; 

  columns.forEach((columnInner, index) => {

    columnInner.style.transition = 'none';
    columnInner.style.transform = `translateY(${currentOffsetRem - stepRem}rem)`;

    setTimeout(() => {
      columnInner.style.transition = 'transform 2s ease-out';
      columnInner.style.transform = `translateY(${currentOffsetRem}rem)`;
    }, index * 400); 
  });

  if (typeof callback === 'function') {
    setTimeout(callback, 2500 + (columns.length - 1) * 700);
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

  spinButton.disabled = true; 

  currentSpin++;
  spinsLeft--;
  resultSpan.textContent = spinsLeft;

  spinColumns(() => {
  
    if (currentSpin === allSpins.length) {
      setTimeout(() => {
        const finalScatterImages = document.querySelectorAll('.promo__cell img');
        finalScatterImages.forEach(img => {
          if (img.src.includes('scatter.png')) {
            img.classList.add('pulse-anim');
          }
        });
      }, 100);
    }


    if (spinsLeft === 0) {

      setTimeout(() => {
        document.getElementById('end').classList.add('active');
        document.body.classList.add('active');
        startTimer(15);
      }, 4000);


      return; 
    }

    spinButton.disabled = false;
  });

  if (spinsLeft > 0) {
    setTimeout(() => {
      spinButton.disabled = false;
    }, 3500);
  }
});


window.addEventListener('resize', () => {
  cellHeightRem = getCellHeightRem();
  totalCellHeightRem = cellHeightRem + gapRem;
});



window.addEventListener('DOMContentLoaded', () => {

  generateStaticColumns([colum1, colum2, colum3]);

  const imagesToLoad = Array.from(document.querySelectorAll('img'));
  let loadedCount = 0;

  const checkLoaded = () => {
    loadedCount++;
    if (loadedCount === imagesToLoad.length) {
      showStart();
    }
  };

  imagesToLoad.forEach(img => {
    if (img.complete) {
      checkLoaded();
    } else {
      img.onload = img.onerror = checkLoaded;
    }
  });

  function showStart() {
    const loader = document.querySelector('.loader');
    const cocos = document.querySelector('.loader__loading--cocos');
    const shadow = document.querySelector('.loader__loading--shadow');
    const resultSpan = document.querySelector('.result-span');

    cocos?.classList.add('animate');
    shadow?.classList.add('shrink');

    setTimeout(() => {
      loader?.classList.add('hidden');
      resultSpan.textContent = spinsLeft;
      document.getElementById('start')?.classList.add('active');
      document.body.classList.add('active');
    }, 1500);


    setTimeout(() => {
      const columns = document.querySelectorAll('.promo__column-inner');
      columns.forEach(columnInner => {
        columnInner.style.transition = 'transform 2s ease-out';
        columnInner.style.transform = `translateY(${currentOffsetRem}rem)`; 
      });
    }, 100);
    setTimeout(() => {
      document.getElementById('start').classList.add('active');
      document.body.classList.add('active');
    }, 0); 
  }
});