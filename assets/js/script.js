function onLoad() {
  var themeSelector = document.getElementById('themeSelector');
  for (var themeName in themeMap) {
    var opt = document.createElement('option');
    opt.value = themeName;
    opt.innerHTML = capitalizeFirstLetter(themeName);
    themeSelector.appendChild(opt);
  }
  if (localStorage.getItem('theme') != null) {
    themeSelector.value = localStorage.getItem('theme');
    toggleTheme();
  }
  
  // Listen for orientation changes to update background image
  window.addEventListener('orientationchange', function() {
    // Wait a bit for orientation to settle
    setTimeout(function() {
      if (localStorage.getItem('theme') != null) {
        toggleTheme();
      }
    }, 100);
  });
  
  // Also listen for window resize (handles cases where orientationchange doesn't fire)
  window.addEventListener('resize', function() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(function() {
      if (localStorage.getItem('theme') != null) {
        toggleTheme();
      }
    }, 250);
  });
}

function toggleTheme() {
  var themeSelector = document.getElementById('themeSelector');
  var themeName = themeSelector.value;
  localStorage.setItem('theme', themeName);
  var htmlElement = document.getElementsByTagName('html')[0];
  var bodyElement = document.getElementsByTagName('body')[0];
  changeTheme(htmlElement, bodyElement, themeMap[themeName], themeName);
}

// Helper function to check if device is mobile in portrait orientation
function isMobilePortrait() {
  var width = window.innerWidth || document.documentElement.clientWidth;
  var height = window.innerHeight || document.documentElement.clientHeight;
  // Check if mobile (width < 768px) AND portrait (height > width)
  return width < 768 && height > width;
}

// Helper function to check if we're on About or Blog page
function isAboutOrBlogPage() {
  var pathname = window.location.pathname;
  return pathname.includes('/about/') || pathname.includes('/blog/');
}

function changeTheme(htmlElement, bodyElement, theme, themeName) {
  // Set CSS custom properties on html element
  htmlElement.style.setProperty("--primary-background-color", theme['background-color']);
  htmlElement.style.setProperty("--primary-text-color", theme['text-color']);
  htmlElement.style.setProperty("--primary-highlight-color", theme['highlight-color']);
  
  // Apply background-image and other background properties directly to body element
  // Hide background image on mobile portrait orientation
  if (theme['background-image'] && !isMobilePortrait()) {
    // Check if we need to override the background image for specific pages
    var backgroundImage = theme['background-image'];
    
    // Override background image for sepia-light theme on About/Blog pages
    if (themeName === 'sepia-light' && isAboutOrBlogPage()) {
      backgroundImage = 'Sides_SepiaLight.jpg';
    }
    
    // Try to construct the correct path
    // First, try absolute path from root
    var imagePath = '/my_site/images/' + backgroundImage;
    
    // If we're on GitHub Pages with a repo name, we might need to adjust
    // Check if there's a base tag or if we can detect the base path
    var baseTag = document.querySelector('base');
    var baseHref = baseTag ? baseTag.getAttribute('href') : '';
    
    // If there's a base href that's not just '/', use it
    if (baseHref && baseHref !== '/' && baseHref !== '') {
      // Remove trailing slash if present
      var base = baseHref.replace(/\/$/, '');
      imagePath = base + '/my_site/images/' + theme['background-image'];
    }
    
    var backgroundImageUrl = 'url("' + imagePath + '")';
    
    // Debug: log the path being used
    console.log('Setting background image to:', backgroundImageUrl);
    console.log('Image path:', imagePath);
    console.log('Base href:', baseHref);
    console.log('Current pathname:', window.location.pathname);
    console.log('Full URL would be:', window.location.origin + imagePath);
    
    // Test if image exists by trying to load it
    var testImg = new Image();
    testImg.onload = function() {
      console.log('✓ Image loaded successfully:', imagePath);
    };
    testImg.onerror = function() {
      console.error('✗ Image failed to load:', imagePath);
      console.error('Tried to load from:', window.location.origin + imagePath);
    };
    testImg.src = imagePath;
    
    // Set all background properties using direct style assignment (more reliable than setProperty)
    // Use CSS background shorthand to ensure everything is set together
    var bgSize = theme['background-size'] || 'cover';
    var bgPosition = theme['background-position'] || 'center';
    var bgRepeat = theme['background-repeat'] || 'no-repeat';
    var bgAttachment = theme['background-attachment'] || 'fixed';
    
    // Set individual properties with !important to override CSS
    bodyElement.style.setProperty('background-image', backgroundImageUrl, 'important');
    bodyElement.style.setProperty('background-size', bgSize, 'important');
    bodyElement.style.setProperty('background-position', bgPosition, 'important');
    bodyElement.style.setProperty('background-repeat', bgRepeat, 'important');
    bodyElement.style.setProperty('background-attachment', bgAttachment, 'important');
    
    // Set background-color to transparent so image shows through
    // The CSS has background-color: var(--primary-background-color) which might be covering the image
    bodyElement.style.setProperty('background-color', 'transparent', 'important');
    
    // Verify it was set
    console.log('Applied styles - backgroundImage:', bodyElement.style.backgroundImage);
    console.log('Computed background-image:', window.getComputedStyle(bodyElement).backgroundImage);
  } else if (theme['background-image'] && isMobilePortrait()) {
    // Theme has background image but we're on mobile portrait - use background color only
    bodyElement.style.backgroundImage = 'none';
    bodyElement.style.backgroundSize = '';
    bodyElement.style.backgroundPosition = '';
    bodyElement.style.backgroundRepeat = '';
    bodyElement.style.backgroundAttachment = '';
    bodyElement.style.removeProperty('background-color');
    console.log('Mobile portrait detected - background image hidden');
  } else {
    // No background image, so use the background color from CSS variable
    bodyElement.style.backgroundImage = 'none';
    bodyElement.style.backgroundSize = '';
    bodyElement.style.backgroundPosition = '';
    bodyElement.style.backgroundRepeat = '';
    bodyElement.style.backgroundAttachment = '';
    // Remove the transparent background-color so the CSS variable can work
    bodyElement.style.removeProperty('background-color');
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}