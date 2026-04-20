document.addEventListener("DOMContentLoaded", () => {
  // tidak perlu classList, opacity langsung 1 dari CSS
});

window.nextPage = function () {
  window.location.href = "menu2.html";
};

window.goToIndex = function () {
  window.location.href = "index.html";
};

window.goToMenu2 = function () {
  window.location.href = "menu2.html";
};

window.goToPeople = function () {
  window.location.href = "menu.html";
};

window.goToPhotobooth = function () {
  window.location.href = "photobooth.html";
};

window.goGallery = function (id) {
  window.location.href = "gallery.html?id=" + id;
};

window.goBack = function () {
  window.location.href = "menu.html";
};

/* MENU BUTTONS */
const menuContainer = document.getElementById("menuContainer");

if (menuContainer) {
  const namaButton = [
    "Rehan", "Daman", "Leony", "Ninis", "Ehsan",
    "Angga", "Jidun", "Cesta", "Sanjaya", "Claudya",
    "Arya", "Vivi", "Cesa", "Vina", "Natasya"
  ];

  namaButton.forEach((nama, i) => {
    const btn = document.createElement("button");
    btn.innerText = nama;
    btn.className = "menu-btn";
    btn.style.animationDelay = (i * 0.06) + "s";
    btn.onclick = () => goGallery(i + 1);
    menuContainer.appendChild(btn);
  });
}