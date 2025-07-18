let isZoomed = false;
let isMobile = window.matchMedia("(max-width: 768px)").matches;
let imageList = [];
let currentIndex = 0;

function initImageList() {
  const anchors = document.querySelectorAll('.content a');
  anchors.forEach(anchor => {
    const onclickStr = anchor.getAttribute('onclick');
    const match = /openPreview\('([^']+)'\)/.exec(onclickStr);
    if (match) {
      imageList.push(match[1]);
    }
  });
}

function toggleZoom(event) {
    if (isMobile) return; // no zoom on mobile
    
    event.stopPropagation();
    const previewImg = document.getElementById('preview-img');
    previewImg.style.transition = 'transform 0.3s ease';
  
    if (isZoomed) {
      previewImg.style.transform = 'scale(1)';
      previewImg.style.cursor = 'zoom-in';
    } else {
      const rect = previewImg.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const originX = (offsetX / rect.width) * 100;
      const originY = (offsetY / rect.height) * 100;
      previewImg.style.transformOrigin = `${originX}% ${originY}%`;
      previewImg.style.transform = 'scale(2)';
      previewImg.style.cursor = 'zoom-out';
    }
    isZoomed = !isZoomed;
  }
  

function nextImage() {
  currentIndex = (currentIndex + 1) % imageList.length;
  updatePreviewImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
  updatePreviewImage();
}

function updatePreviewImage() {
  const previewImg = document.getElementById('preview-img');
  const spinner = document.getElementById('loading-spinner');
  
  spinner.style.display = 'block';
  previewImg.style.display = 'none';
  
  previewImg.src = imageList[currentIndex];
  previewImg.onload = function() {
    spinner.style.display = 'none';
    previewImg.style.display = 'block';
  };
  isZoomed = false;
  previewImg.style.transform = 'scale(1)';
  previewImg.style.transformOrigin = 'center center';
  previewImg.style.cursor = isMobile ? 'default' : 'zoom-in';
}

function handleKeyDown(event) {
  const overlay = document.getElementById('overlay');
  if (overlay.style.display === 'flex') {
    if (event.key === 'ArrowRight') {
      nextImage();
    } else if (event.key === 'ArrowLeft') {
      prevImage();
    } else if (event.key === 'Escape') {
      closePreview();
    }
  }
}
document.addEventListener('keydown', handleKeyDown);

function openPreview(src) {
  const previewImg = document.getElementById('preview-img');
  const spinner = document.getElementById('loading-spinner');
  const overlay = document.getElementById('overlay');

  spinner.style.display = 'block';
  previewImg.style.display = 'none';
  overlay.style.display = 'flex';

  previewImg.src = src;
  previewImg.onload = function() {
    spinner.style.display = 'none';
    previewImg.style.display = 'block';
  };

  currentIndex = imageList.indexOf(src);
  if (currentIndex === -1) {
    currentIndex = 0;
  }
  isZoomed = false;
  previewImg.style.transform = 'scale(1)';
  previewImg.style.transformOrigin = 'center center';
  previewImg.style.cursor = isMobile ? 'default' : 'zoom-in';
}

function closePreview() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
  const targetSrc = imageList[currentIndex];
  const anchor = document.querySelector(`.content a[onclick*="${targetSrc}"]`);
  if (anchor) {
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

window.onload = function() {
  initImageList();
};