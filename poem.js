// poems.js

// where poems are shown
let poemListDiv = document.getElementById("poemList");

// load poems when page opens
window.onload = function() {
  let savedPoems = localStorage.getItem("poems");
  if (savedPoems) {
    savedPoems = JSON.parse(savedPoems);
    for (let i = 0; i < savedPoems.length; i++) {
      let p = savedPoems[i];
      showPoem(p.id, p.name, p.poem);
    }
  }
};

// handle submit
document.getElementById("poemForm").addEventListener("submit", function(event) {
  event.preventDefault();

  let name = document.getElementById("poetName").value.trim();
  let poem = document.getElementById("poem").value.trim();

  if (name === "" || poem === "") return;

  // give each poem a simple unique id (time in ms)
  let poemId = Date.now();

  let newPoem = {
    id: poemId,
    name: name,
    poem: poem
  };

  // save to localStorage
  let poems = localStorage.getItem("poems");
  if (poems) {
    poems = JSON.parse(poems);
  } else {
    poems = [];
  }

  poems.push(newPoem);
  localStorage.setItem("poems", JSON.stringify(poems));

  // show it on the page
  showPoem(poemId, name, poem);

  // clear inputs
  document.getElementById("poetName").value = "";
  document.getElementById("poem").value = "";
});

// show a poem and add a Delete button
function showPoem(id, name, poemText) {
  // create container
  let div = document.createElement("div");
  div.className = "poemEntry";
  div.setAttribute("data-id", id);

  // build inner HTML (keep it simple)
  div.innerHTML = "<h3>" + escapeHtml(name) + "</h3>" +
                  "<p>" + escapeHtml(poemText).replace(/\n/g, "<br>") + "</p>";

  // create delete button
  let delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.style.marginTop = "6px";
  delBtn.onclick = function() {
    deletePoem(id);
  };

  // append button to the poem div
  div.appendChild(delBtn);

  // add to page
  poemListDiv.appendChild(div);
}

// delete a single poem (by id)
function deletePoem(id) {
  // remove from localStorage
  let poems = JSON.parse(localStorage.getItem("poems")) || [];
  let newList = [];

  for (let i = 0; i < poems.length; i++) {
    if (poems[i].id !== id) {
      newList.push(poems[i]);
    }
  }

  localStorage.setItem("poems", JSON.stringify(newList));

  // remove from DOM
  let node = document.querySelector('[data-id="' + id + '"]');
  if (node) {
    node.parentNode.removeChild(node);
  }
}

// Delete All button (optional)
let deleteAllBtn = document.getElementById("deleteAllBtn");
if (deleteAllBtn) {
  deleteAllBtn.addEventListener("click", function() {
    if (!confirm("Delete ALL poems? This cannot be undone.")) return;
    localStorage.removeItem("poems");
    // remove all poemEntry nodes
    let entries = document.getElementsByClassName("poemEntry");
    // convert HTMLCollection to array to remove easily
    let arr = Array.prototype.slice.call(entries);
    for (let i = 0; i < arr.length; i++) {
      arr[i].parentNode.removeChild(arr[i]);
    }
  });
}

// small helper to avoid HTML injection
function escapeHtml(text) {
  let map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
