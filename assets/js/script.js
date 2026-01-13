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
    // Set all background properties - use inline styles which have high specificity
    bodyElement.style.backgroundImage = theme['background-image'];
    // Make background-color transparent so image shows through
    bodyElement.style.backgroundColor = 'transparent';
    
    if (theme['background-size']) {
      bodyElement.style.backgroundSize = theme['background-size'];
    } else {
      bodyElement.style.backgroundSize = '';
    }
    
    if (theme['background-position']) {
      bodyElement.style.backgroundPosition = theme['background-position'];
    } else {
      bodyElement.style.backgroundPosition = '';
    }
    
    if (theme['background-repeat']) {
      bodyElement.style.backgroundRepeat = theme['background-repeat'];
    } else {
      bodyElement.style.backgroundRepeat = '';
    }
    
    if (theme['background-attachment']) {
      bodyElement.style.backgroundAttachment = theme['background-attachment'];
    } else {
      bodyElement.style.backgroundAttachment = '';
    }
  } else {
    // No background image, so use the background color from CSS variable
    bodyElement.style.backgroundImage = 'none';
    bodyElement.style.backgroundColor = '';
    bodyElement.style.backgroundSize = '';
    bodyElement.style.backgroundPosition = '';
    bodyElement.style.backgroundRepeat = '';
    bodyElement.style.backgroundAttachment = '';
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}