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
    bodyElement.style.setProperty("background-image", theme['background-image']);
  } else {
    bodyElement.style.setProperty("background-image", "none");
  }
  
  if (theme['background-size']) {
    bodyElement.style.setProperty("background-size", theme['background-size']);
  } else {
    bodyElement.style.removeProperty("background-size");
  }
  
  if (theme['background-position']) {
    bodyElement.style.setProperty("background-position", theme['background-position']);
  } else {
    bodyElement.style.removeProperty("background-position");
  }
  
  if (theme['background-repeat']) {
    bodyElement.style.setProperty("background-repeat", theme['background-repeat']);
  } else {
    bodyElement.style.removeProperty("background-repeat");
  }
  
  if (theme['background-attachment']) {
    bodyElement.style.setProperty("background-attachment", theme['background-attachment']);
  } else {
    bodyElement.style.removeProperty("background-attachment");
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}