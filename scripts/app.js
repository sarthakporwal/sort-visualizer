"use strict";

// Update UI elements with current selections
const updateUI = () => {
  const sizeSelect = document.querySelector(".size-menu");
  const algoSelect = document.querySelector(".algo-menu");
  const currentSize = document.getElementById("current-size");
  const currentAlgo = document.getElementById("current-algo");
  
  if (sizeSelect.value !== "0") {
    currentSize.textContent = sizeSelect.value;
  }
  
  if (algoSelect.value !== "0") {
    const algoText = algoSelect.options[algoSelect.value].text;
    currentAlgo.textContent = algoText;
  } else {
    currentAlgo.textContent = "None";
  }
};

// Add loading state to buttons
const setLoadingState = (isLoading) => {
  const startBtn = document.querySelector(".start");
  const randomBtn = document.querySelector("#random");
  
  if (isLoading) {
    startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sorting...';
    startBtn.style.pointerEvents = 'none';
    startBtn.style.opacity = '0.7';
  } else {
    startBtn.innerHTML = '<i class="fas fa-play"></i> Sort';
    startBtn.style.pointerEvents = 'auto';
    startBtn.style.opacity = '1';
  }
};

const start = async () => {
  let algoValue = Number(document.querySelector(".algo-menu").value);
  let speedValue = Number(document.querySelector(".speed-menu").value);

  if (speedValue === 0) {
    speedValue = 1;
  }
  if (algoValue === 0) {
    // Create a beautiful notification instead of alert
    showNotification("Please select an algorithm first!", "warning");
    return;
  }

  setLoadingState(true);
  
  try {
    let algorithm = new sortAlgorithms(speedValue);
    if (algoValue === 1) await algorithm.BubbleSort();
    if (algoValue === 2) await algorithm.SelectionSort();
    if (algoValue === 3) await algorithm.InsertionSort();
    if (algoValue === 4) await algorithm.MergeSort();
    if (algoValue === 5) await algorithm.QuickSort();
    
    // Show completion notification
    showNotification("Sorting completed successfully!", "success");
  } catch (error) {
    showNotification("An error occurred during sorting.", "error");
  } finally {
    setLoadingState(false);
  }
};

const RenderScreen = async () => {
  let algoValue = Number(document.querySelector(".algo-menu").value);
  await RenderList();
  updateUI();
};

const RenderList = async () => {
  let sizeValue = Number(document.querySelector(".size-menu").value);
  await clearScreen();

  let list = await randomList(sizeValue);
  const arrayNode = document.querySelector(".array");
  
  // Add fade-in animation for cells
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    const node = document.createElement("div");
    node.className = "cell";
    node.setAttribute("value", String(element));
    node.style.height = `${3.8 * element}px`;
    node.style.opacity = "0";
    node.style.transform = "translateY(20px)";
    arrayNode.appendChild(node);
    
    // Staggered animation
    setTimeout(() => {
      node.style.transition = "all 0.5s ease";
      node.style.opacity = "1";
      node.style.transform = "translateY(0)";
    }, i * 50);
  }
  
  updateUI();
};

const RenderArray = async (sorted) => {
  let sizeValue = Number(document.querySelector(".size-menu").value);
  await clearScreen();

  let list = await randomList(sizeValue);
  if (sorted) list.sort((a, b) => a - b);

  const arrayNode = document.querySelector(".array");
  const divnode = document.createElement("div");
  divnode.className = "s-array";

  for (const element of list) {
    const dnode = document.createElement("div");
    dnode.className = "s-cell";
    dnode.innerText = element;
    divnode.appendChild(dnode);
  }
  arrayNode.appendChild(divnode);
};

const randomList = async (Length) => {
  let list = new Array();
  let lowerBound = 1;
  let upperBound = 100;

  for (let counter = 0; counter < Length; ++counter) {
    let randomNumber = Math.floor(
      Math.random() * (upperBound - lowerBound + 1) + lowerBound
    );
    list.push(parseInt(randomNumber));
  }
  return list;
};

const clearScreen = async () => {
  const arrayNode = document.querySelector(".array");
  arrayNode.innerHTML = "";
};

// Beautiful notification system
const showNotification = (message, type = "info") => {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  
  const icon = document.createElement("i");
  icon.className = getNotificationIcon(type);
  
  const text = document.createElement("span");
  text.textContent = message;
  
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.className = "notification-close";
  closeBtn.onclick = () => notification.remove();
  
  notification.appendChild(icon);
  notification.appendChild(text);
  notification.appendChild(closeBtn);
  
  document.body.appendChild(notification);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 4000);
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "success": return "fas fa-check-circle";
    case "warning": return "fas fa-exclamation-triangle";
    case "error": return "fas fa-times-circle";
    default: return "fas fa-info-circle";
  }
};

const response = () => {
  let Navbar = document.querySelector(".navbar");
  if (Navbar.className === "navbar") {
    Navbar.className += " responsive";
  } else {
    Navbar.className = "navbar";
  }
};

// Event listeners
document.querySelector(".icon").addEventListener("click", response);
document.querySelector(".start").addEventListener("click", start);
document.querySelector("#random").addEventListener("click", RenderScreen);
document.querySelector(".size-menu").addEventListener("change", RenderScreen);
document.querySelector(".algo-menu").addEventListener("change", RenderScreen);

// Initialize on page load
window.onload = () => {
  RenderScreen();
  
  // Add some initial animation
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(20px)";
  
  setTimeout(() => {
    document.body.style.transition = "all 0.8s ease";
    document.body.style.opacity = "1";
    document.body.style.transform = "translateY(0)";
  }, 100);
};
