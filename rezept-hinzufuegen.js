document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('rezeptForm').addEventListener('submit', function(event) {
    event.preventDefault();
    saveRezept();
  });
});

function addZutat(button) {
  const container = document.getElementById('zutatenContainer');
  const div = document.createElement('div');
  div.classList.add('zutatMenge');
  div.innerHTML = `
    <input type="text" placeholder="Menge" class="menge" required>
    <input type="text" placeholder="Zutat" class="zutat" required>
    <button type="button" onclick="addZutat(this)">+</button>
    <button type="button" onclick="removeZutat(this)">-</button>
  `;
  container.appendChild(div);

  button.style.display = 'none';
}

function removeZutat(button) {
  const container = button.parentElement.parentElement;
  button.parentElement.remove();

  const letzteZeile = container.children[container.children.length - 1];
  const addButton = letzteZeile.querySelector('button[type="button"]');
  addButton.style.display = 'inline-block';
}

function addZubereitungSchritt(button) {
  const container = document.getElementById('zubereitungContainer');
  const div = document.createElement('div');
  const stepCount = container.children.length + 1;
  div.classList.add('zubereitungSchritt');
  div.innerHTML = `
    <span>${stepCount}.</span>
    <input type="text" class="zubereitung" required>
    <button type="button" onclick="addZubereitungSchritt(this)">+</button>
    <button type="button" onclick="removeZubereitungSchritt(this)">-</button>
  `;
  container.appendChild(div);

  button.style.display = 'none';
}

function removeZubereitungSchritt(button) {
  const container = document.getElementById('zubereitungContainer');
  button.parentElement.remove();

  const zubereitungSchritte = container.querySelectorAll('.zubereitungSchritt');
  zubereitungSchritte.forEach((div, index) => {
    div.querySelector('span').textContent = `${index + 1}.`;
  });

  if (zubereitungSchritte.length > 0) {
    const letzteZeile = zubereitungSchritte[zubereitungSchritte.length - 1];
    const addButton = letzteZeile.querySelector('button[type="button"]');
    addButton.style.display = 'inline-block';
  }
}

function saveRezept() {
  const name = document.getElementById('name').value;
  const beschreibung = document.getElementById('beschreibung').value;
  const kochzeit = document.getElementById('kochzeit').value;
  const zutatenListe = [];

  document.querySelectorAll('#zutatenContainer .zutatMenge').forEach(div => {
    const menge = div.querySelector('.menge').value;
    const zutat = div.querySelector('.zutat').value;
    zutatenListe.push({menge, zutat});
  });

  const zubereitung = [];
  document.querySelectorAll('#zubereitungContainer .zubereitung').forEach(input => {
    zubereitung.push(input.value);
  });

  const zubereitungMitNummerierung = zubereitung.map((schritt, index) => `${index + 1}. ${schritt}`);

  const bildInput = document.getElementById('bild');
  if (bildInput.files && bildInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const neuesRezept = {
        id: Date.now(),
        name: name,
        beschreibung: beschreibung,
        kochzeit: kochzeit,
        zutatenListe: zutatenListe,
        zubereitung: zubereitungMitNummerierung, // Hier verwenden Sie die nummerierten Zubereitungsschritte
        bild: e.target.result
      };

      let rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
      rezepte.push(neuesRezept);
      localStorage.setItem('rezepte', JSON.stringify(rezepte));
      alert('Rezept erfolgreich hinzugefügt!');
      document.getElementById('rezeptForm').reset();
    };
    reader.readAsDataURL(bildInput.files[0]);
  } else {
    alert('Bitte ein Bild hochladen.');
  }
}
