const namaList = [
  "Rehan", "Daman", "Leony", "Ninis", "Ehsan",
  "Angga", "Jidun", "Cesta", "Sanjaya", "Claudya",
  "Arya", "Vivi", "Cesa", "Vina", "Natasya"
];

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const isPhotobooth = document.querySelector(".page-photobooth");

  if (isPhotobooth) {
    // photobooth: load gallery tapi TANPA upload box
    initGallery("photobooth", false);
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const folder = params.get("id") || "default";

  const titleEl = document.getElementById("galleryTitle");
  if (titleEl && !isNaN(folder)) {
    titleEl.textContent = namaList[parseInt(folder) - 1] || "gallery";
  }

  // gallery biasa: dengan upload box
  initGallery(folder, true);
});

window.initGallery = async function (folder, showUpload = true) {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  gallery.addEventListener("dragover", (e) => {
    e.preventDefault();
    gallery.style.background = "rgba(232,160,191,0.08)";
  });
  gallery.addEventListener("dragleave", () => {
    gallery.style.background = "";
  });
  gallery.addEventListener("drop", async (e) => {
    e.preventDefault();
    gallery.style.background = "";
    if (!showUpload) return;
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) await uploadFile(file, folder);
    loadImages(folder, showUpload);
  });

  await loadImages(folder, showUpload);

  async function loadImages(folder, showUpload) {
    gallery.innerHTML = "";

    try {
      const { data } = await supabaseClient
        .storage.from("images").list(folder);

      if (data) {
        data.forEach(file => {
          if (!file.name) return;
          const { data: urlData } = supabaseClient
            .storage.from("images")
            .getPublicUrl(folder + "/" + file.name);
          if (!urlData?.publicUrl) return;

          const img = document.createElement("img");
          img.src = urlData.publicUrl;
          img.onerror = () => img.remove();
          img.onclick = () => showPopup(urlData.publicUrl);
          gallery.appendChild(img);
        });
      }
    } catch (err) {
      console.warn(err);
    }

    // Upload box hanya untuk gallery biasa, bukan photobooth
    if (showUpload) {
      createUploadBox(folder, showUpload);
    }
  }

  async function uploadFile(file, folder) {
    const fileName = Date.now() + "-" + file.name;
    const { error } = await supabaseClient.storage
      .from("images")
      .upload(folder + "/" + fileName, file);
    if (error) alert("Upload gagal: " + error.message);
  }

  function createUploadBox(folder, showUpload) {
    const existing = gallery.querySelector(".img-placeholder");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.className = "img-placeholder";
    box.innerText = "add photo";

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.style.display = "none";

    box.onclick = () => input.click();
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      for (const file of files) await uploadFile(file, folder);
      loadImages(folder, showUpload);
    };

    gallery.appendChild(box);
    gallery.appendChild(input);
  }
};

window.showPopup = function (src) {
  document.getElementById("popup").style.display = "flex";
  document.getElementById("popupImg").src = src;
};

window.closePopup = function () {
  document.getElementById("popup").style.display = "none";
};