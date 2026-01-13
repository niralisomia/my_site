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
}

function toggleTheme() {
  var themeSelector = document.getElementById('themeSelector');
  var themeName = themeSelector.value;
  localStorage.setItem('theme', themeName);
  var htmlElement = document.getElementsByTagName('html')[0];
  var bodyElement = document.getElementsByTagName('body')[0];
  changeTheme(htmlElement, bodyElement, themeMap[themeName]);
}

function changeTheme(htmlElement, bodyElement, theme) {
  // Set CSS custom properties on html element
  htmlElement.style.setProperty("--primary-background-color", theme['background-color']);
  htmlElement.style.setProperty("--primary-text-color", theme['text-color']);
  htmlElement.style.setProperty("--primary-highlight-color", theme['highlight-color']);
  
  // Apply background-image and other background properties directly to body element
  if (theme['background-image']) {
    // Try to construct the correct path
    // First, try absolute path from root
    var imagePath = '/images/' + theme['background-image'];
    
    // If we're on GitHub Pages with a repo name, we might need to adjust
    // Check if there's a base tag or if we can detect the base path
    var baseTag = document.querySelector('base');
    var baseHref = baseTag ? baseTag.getAttribute('href') : '';
    
    // If there's a base href that's not just '/', use it
    if (baseHref && baseHref !== '/' && baseHref !== '') {
      // Remove trailing slash if present
      var base = baseHref.replace(/\/$/, '');
      imagePath = base + '/images/' + theme['background-image'];
    }
    
    var backgroundImageUrl = 'url("' + imagePath + '")';
    
    // Debug: log the path being used
    console.log('Setting background image to:', backgroundImageUrl);
    console.log('Image path:', imagePath);
    console.log('Base href:', baseHref);
    console.log('Current pathname:', window.location.pathname);
    
    // Set all background properties using direct style assignment (more reliable than setProperty)
    // Use CSS background shorthand to ensure everything is set together
    var bgSize = theme['background-size'] || 'cover';
    var bgPosition = theme['background-position'] || 'center';
    var bgRepeat = theme['background-repeat'] || 'no-repeat';
    var bgAttachment = theme['background-attachment'] || 'fixed';
    
    // Set individual properties
    bodyElement.style.backgroundImage = backgroundImageUrl;
    bodyElement.style.backgroundSize = bgSize;
    bodyElement.style.backgroundPosition = bgPosition;
    bodyElement.style.backgroundRepeat = bgRepeat;
    bodyElement.style.backgroundAttachment = bgAttachment;
    
    // Ensure background-color doesn't interfere - set it to the theme color but image should show on top
    // The background-image will render on top of background-color in CSS
    bodyElement.style.backgroundColor = theme['background-color'] || 'transparent';
  } else {
    // No background image, so use the background color from CSS variable
    bodyElement.style.backgroundImage = 'none';
    bodyElement.style.backgroundSize = '';
    bodyElement.style.backgroundPosition = '';
    bodyElement.style.backgroundRepeat = '';
    bodyElement.style.backgroundAttachment = '';
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}