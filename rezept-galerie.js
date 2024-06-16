document.addEventListener('DOMContentLoaded', () => {
  loadRezepteFromLocalStorage();
  document.getElementById('editForm').addEventListener('submit', event => {
    event.preventDefault();
    saveEditedRezept();
  });
});

function loadRezepteFromLocalStorage() {
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  rezepte.forEach(addRezeptToGalerie);
}

function addRezeptToGalerie(rezept) {
  const galerie = document.getElementById('galerie');
  if (!galerie) {
    console.error('Galerie-Element nicht gefunden');
    return;
  }

  const rezeptElement = document.createElement('div');
  rezeptElement.classList.add('rezept');
  rezeptElement.innerHTML = `
    <div class="rezept-info">
      <h3><a href="#" onclick="openRezeptModal(${rezept.id}); return false;">${rezept.name}</a></h3>
      <img class="rezept-bild" src="${rezept.bild}" alt="${rezept.name}">
      <p>Kochzeit: ${rezept.kochzeit}</p>
      <button onclick="openEditModal(${rezept.id})">Bearbeiten</button>
      <button onclick="deleteRezept(${rezept.id})">Löschen</button>
    </div>
  `;
  galerie.appendChild(rezeptElement);
}

function openRezeptModal(id) {
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  const rezept = rezepte.find(r => r.id === id);
  if (rezept) {
    document.getElementById('rezeptModalName').textContent = rezept.name;
    document.getElementById('rezeptModalBeschreibung').textContent = rezept.beschreibung;
    document.getElementById('rezeptModalKochzeit').textContent = `Kochzeit: ${rezept.kochzeit}`;

    // Zubereitungsschritte direkt anzeigen
    const zubereitungHTML = rezept.zubereitung.join('<br>');
    document.getElementById('rezeptModalZubereitung').innerHTML = `Zubereitung:<br>${zubereitungHTML}`;

    // Zutatenliste direkt anzeigen
    const zutatenListeHTML = rezept.zutatenListe.map(zutat => `${zutat.menge} ${zutat.zutat}`).join('<br>');
    document.getElementById('rezeptModalZutaten').innerHTML = `Zutaten:<br>${zutatenListeHTML}`;
    document.getElementById('rezeptModal').style.display = 'block';
  }
}


function closeRezeptModal() {
  document.getElementById('rezeptModal').style.display = 'none';
}

function openEditModal(id) {
  const rezept = getRezeptById(id);
  if (rezept) {
    const modal = document.getElementById('editModal');
    modal.querySelector('#editId').value = rezept.id;
    modal.querySelector('#editName').value = rezept.name;
    modal.querySelector('#editBeschreibung').value = rezept.beschreibung;
    modal.querySelector('#editKochzeit').value = rezept.kochzeit;

    fillEditZubereitung(rezept.zubereitung);
    fillEditZutaten(rezept.zutatenListe);

    modal.style.display = 'block';
  }
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

function saveEditedRezept() {
  const id = parseInt(document.getElementById('editId').value, 10);
  const name = document.getElementById('editName').value;
  const beschreibung = document.getElementById('editBeschreibung').value;
  const kochzeit = document.getElementById('editKochzeit').value;
  const zutatenListe = gatherEditZutaten();
  const zubereitung = gatherEditZubereitung();

  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  const index = rezepte.findIndex(r => r.id === id);
  if (index !== -1) {
    rezepte[index] = { id, name, beschreibung, kochzeit, zutatenListe, zubereitung, bild: rezepte[index].bild };
    localStorage.setItem('rezepte', JSON.stringify(rezepte));
    location.reload();
  }

  closeEditModal();
}

function gatherEditZutaten() {
  return Array.from(document.querySelectorAll('#editZutatenContainer .zutatMenge')).map(div => ({
    menge: div.querySelector('.menge').value,
    zutat: div.querySelector('.zutat').value
  }));
}

function gatherEditZubereitung() {
  return Array.from(document.querySelectorAll('#editZubereitungContainer .zubereitungSchritt')).map(div =>
    div.querySelector('.zubereitung').value
  );
}

function fillEditZubereitung(zubereitung) {
  const container = document.getElementById('editZubereitungContainer');
  container.innerHTML = '';
  for (const schritt of zubereitung) {
    const div = createEditZubereitungDiv(schritt);
    container.appendChild(div);
  }
}

function createEditZubereitungDiv(schritt) {
  const div = document.createElement('div');
  div.classList.add('zubereitungSchritt');
  div.innerHTML = `
    <input type="text" value="${schritt}" class="zubereitung" required>
    <button type="button" onclick="removeEditZubereitung(this)">-</button>
  `;
  return div;
}

function fillEditZutaten(zutatenListe) {
  const container = document.getElementById('editZutatenContainer');
  container.innerHTML = '';
  for (const item of zutatenListe) {
    const div = createEditZutatDiv(item);
    container.appendChild(div);
  }
}

function createEditZutatDiv(item) {
  const div = document.createElement('div');
  div.classList.add('zutatMenge');
  div.innerHTML = `
    <input type="text" value="${item.menge}" class="menge" required>
    <input type="text" value="${item.zutat}" class="zutat" required>
    <button type="button" onclick="removeEditZutat(this)">-</button>
  `;
  return div;
}

function addEditZutat() {
  const container = document.getElementById('editZutatenContainer');
  const div = createEditZutatDiv({ menge: '', zutat: '' });
  container.appendChild(div);
}

function removeEditZutat(button) {
  button.parentElement.remove();
}

function addEditZubereitung() {
  const container = document.getElementById('editZubereitungContainer');
  const div = createEditZubereitungDiv('');
  container.appendChild(div);
}

function removeEditZubereitung(button) {
  button.parentElement.remove();
}

function getRezeptById(id) {
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  return rezepte.find(r => r.id === id);
}

function deleteRezept(id) {
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  const updatedRezepte = rezepte.filter(r => r.id !== id);
  localStorage.setItem('rezepte', JSON.stringify(updatedRezepte));
  location.reload();
}
