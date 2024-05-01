const iconBars = document.getElementById("icon-bars");
const deleteLinks = document.getElementById("clear-links");
const shortenClicked = document.getElementById("shorten-clicked");
const urlInput = document.getElementById("url-input");
const linksContainer = document.querySelector("section.links .container");

iconBars.addEventListener("click", () => {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show-menu");
});

async function shortenUrlReq(url) {
  try {
    let body = {
      url: `${url}`,
      domain: `tiny.one`,
    };

    let response = await fetch(`https://api.tinyurl.com/create`, {
      method: `POST`,
      headers: {
        accept: `application/json`,
        authorization: `Bearer 2nLQGpsuegHP8l8J0Uq1TsVkCzP3un3T23uQ5YovVf5lvvGOucGmFOYRVj6L`,
        "content-type": `application/json`,
      },
      body: JSON.stringify(body),
    });

    let data = await response.json();

    if (response.ok) {
      let shortUrl = data.data.tiny_url;
      saveInLocalStorage(shortUrl, url);
    } else {
      throw data.errors;
    }
  } catch (error) {
    urlInput.classList.add("warning");
    urlInput.nextElementSibling.innerHTML = error;
  }
}

shortenClicked.addEventListener("click", () => {
  if (urlInput.value == "") {
    urlInput.classList.add("warning");
    urlInput.nextElementSibling.innerHTML = "Can't Be Empty";
  } else if (urlInput.value.trim().includes(" ")) {
    urlInput.classList.add("warning");
    urlInput.nextElementSibling.innerHTML = "Should not contain whitespace";
  } else {
    urlInput.classList.remove("warning");
    urlInput.nextElementSibling.innerHTML = "";
    shortenUrlReq(urlInput.value);
    urlInput.value = "";
  }
});

function saveInLocalStorage(shortUrl, url) {
  let links;
  if (!localStorage.getItem("links")) {
    links = [];
  } else {
    links = JSON.parse(localStorage.getItem("links"));
  }

  let link = JSON.stringify({
    id: Date.now(),
    short: shortUrl,
    original: url,
  });

  links.push(link);

  localStorage.setItem("links", JSON.stringify(links));

  appendToDom(links);
}

function clear() {
  localStorage.removeItem("links");
  deleteLinks.style.display = "none";
  linksContainer.innerHTML = "";
}

deleteLinks.onclick = clear;

if (localStorage.getItem("links")) {
  let arr = JSON.parse(localStorage.getItem("links"));
  deleteLinks.style.display = "block";
  appendToDom(arr);
} else {
  deleteLinks.style.display = "none";
}


function appendToDom(arr) {
  deleteLinks.style.display = "block";

  arr.forEach((link) => {
    link = JSON.parse(link);
    linksContainer.innerHTML += `
        <div class="link-parent">
            <div class="regural-link">
            <p>${link.original}</p>
            </div>
            <div class="shorten-link">
            <a href="${link.short}" class="link-to-copy">${link.short}</a>
            <button onclick="copyToClipboard('${link.short}' , this)" class="my-btn">Copy</button>
            </div>
        </div>
    `;
  });

}

function copyToClipboard(text ,btn) {
    window.navigator.clipboard.writeText(text);
    btn.classList.add("copied");
    btn.innerText = "Copied!";

    setTimeout(()=>{
        btn.classList.remove("copied");
        btn.innerText = "Copy";
    },8_000)

}