  const MEDIA_QUERY_TO_MATCH = '(max-width: 992px)';
  const carousels = document.querySelectorAll('.Carousel');

  const getTranslateValues = (element) => {
    const style = window.getComputedStyle(element)
    const matrix = style['transform'] || style.webkitTransform || style.mozTransform

    // No transform property. Simply return 0 values.
    if (matrix === 'none') {
      return 0;
    }

    const matrixType = matrix.includes('3d') ? '3d' : '2d'
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')

    if (matrixType === '2d') {
      return matrixValues[4];
    }

    if (matrixType === '3d') {
      return matrixValues[12];
    }
  };

  const toggleCarouselClass = (screenSize) => {
    const carouselWrappers = document.querySelectorAll('.Carousel-wrapper');
    carouselWrappers.forEach((carouselWrapper) => {
    carouselWrapper.style.transform = 'translateX(0px)';
    if (screenSize.matches) {
      if (!carouselWrapper.querySelector('.Carousel-track')) {
        carouselWrapper.classList.add('Carousel-track');
      }
    } else {
      carouselWrapper.classList.remove('Carousel-track');
    }
    });
  }

  const initCarousel = (carousel) => {
    let initialPosition = null;
    let moving = false;
    let transform = 0;
    let track;

    const gestureStart = (evt) => {
      track = carousel.querySelector('.Carousel-track');
      if (carousel.querySelector('.Carousel-track')) {
        initialPosition = evt.pageX;
        moving = true;
        const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform');
        if (transformMatrix !== 'none') {
          transform = parseInt(transformMatrix.split(',')[4].trim());
        }
      }
    };

    const gestureMove = (evt) => {
      track = carousel.querySelector('.Carousel-track');
      if (carousel.querySelector('.Carousel-track')) {
        if (moving) {
          const currentPosition = evt.pageX;
          const diff = currentPosition - initialPosition;
          track.style.transform = `translateX(${transform + diff}px)`;
          checkBoundary();
        }
      }
    };

    const gestureEnd = () => {
      track = carousel.querySelector('.Carousel-track');
      if (track) {
        moving = false;
      }
    };

    const checkBoundary = () => {
      track = carousel.querySelector('.Carousel-track');
      if (carousel.querySelector('.Carousel-track')) {
        let outer = carousel.getBoundingClientRect();
        let inner = track.getBoundingClientRect();
        if (getTranslateValues(track) > 0) {
          track.style.transform = `translateX(0px)`;
        } else if (inner.right < outer.right) {
          track.style.transform = `translateX(-${inner.width - outer.width}px)`
        }
      }
    };

    if (window.PointerEvent) {
      carousel.addEventListener('pointerdown', gestureStart);
      carousel.addEventListener('pointermove', gestureMove);
      carousel.addEventListener('pointerup', gestureEnd);
    } else {
      carousel.addEventListener('touchdown', gestureStart);
      carousel.addEventListener('touchmove', gestureMove);
      carousel.addEventListener('touchup', gestureEnd);
      carousel.addEventListener('mousedown', gestureStart);
      carousel.addEventListener('mousemove', gestureMove);
      carousel.addEventListener('mouseup', gestureEnd);
    }
  }

  if (carousels.length > 0) {
    const screenSize = window.matchMedia(MEDIA_QUERY_TO_MATCH);
    toggleCarouselClass(screenSize);
    screenSize.addListener(toggleCarouselClass);
    carousels.forEach((carousel) => initCarousel(carousel))
  }
