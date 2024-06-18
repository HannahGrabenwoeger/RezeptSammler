document.addEventListener('DOMContentLoaded', () => {
  loadRezepteFromLocalStorage();
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
      <p>Kochzeit: ${rezept.kochzeit}</p>
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

function deleteRezept(id) {
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  const updatedRezepte = rezepte.filter(r => r.id !== id);
  localStorage.setItem('rezepte', JSON.stringify(updatedRezepte));
  location.reload();
}
