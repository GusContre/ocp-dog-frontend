(function () {
  const DEFAULT_API_URL = 'http://localhost:5001';
  const configUrl = (window.__APP_CONFIG__ && window.__APP_CONFIG__.FRONTEND_API_URL) || DEFAULT_API_URL;
  const apiBase = configUrl.replace(/\/$/, '');

  const button = document.getElementById('dog-button');
  const image = document.getElementById('dog-image');
  const status = document.getElementById('status');
  const form = document.getElementById('save-form');
  const saveButton = document.getElementById('save-button');
  const nameInput = document.getElementById('dog-name');
  const imageInput = document.getElementById('dog-image-url');
  const saveStatus = document.getElementById('save-status');

  function setLoading(isLoading, message) {
    button.disabled = isLoading;
    status.textContent = message;
  }

  async function fetchDog() {
    setLoading(true, 'Buscando un perro...');

    try {
      const response = await fetch(`${apiBase}/dog`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`La API devolvió ${response.status}`);
      }

      const payload = await response.json();
      if (payload && payload.image) {
        image.src = payload.image;
        image.style.display = 'block';
        image.alt = payload.description || payload.name || 'Perro feliz';
        status.textContent = payload.name ? `Nombre: ${payload.name}` : 'Aquí tienes un nuevo amigo 🐕';
      } else if (payload && payload.name) {
        image.style.display = 'none';
        status.textContent = `Nombre de perro: ${payload.name}`;
      } else if (payload && payload.status === 'empty') {
        image.style.display = 'none';
        status.textContent = 'No hay perros en la base. Inserta uno con el endpoint /save.';
      } else {
        throw new Error('Respuesta inesperada de la API');
      }
    } catch (error) {
      console.error('Error al obtener el perro', error);
      image.style.display = 'none';
      status.textContent = 'No pudimos obtener un perro. Intenta nuevamente.';
    } finally {
      button.disabled = false;
    }
  }

  button.addEventListener('click', fetchDog);

  function setSaveFeedback(message, isError) {
    if (!saveStatus) return;
    saveStatus.textContent = message;
    saveStatus.style.color = isError ? '#d14343' : '#5c6f82';
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!saveButton) {
      return;
    }
    const payload = {
      name: (nameInput?.value || '').trim(),
      image: (imageInput?.value || '').trim(),
    };
    if (!payload.name && !payload.image) {
      setSaveFeedback('Ingresa nombre, imagen o ambos.', true);
      return;
    }

    saveButton.disabled = true;
    setSaveFeedback('Guardando...', false);

    try {
      const response = await fetch(`${apiBase}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const msg = errorPayload.error || `La API devolvió ${response.status}`;
        throw new Error(msg);
      }

      setSaveFeedback('Perro guardado correctamente.', false);
      if (nameInput) nameInput.value = '';
      if (imageInput) imageInput.value = '';
      // Refresca el perro mostrado para ver el nuevo registro.
      fetchDog();
    } catch (error) {
      console.error('Error al guardar el perro', error);
      setSaveFeedback(error.message || 'No pudimos guardar el perro.', true);
    } finally {
      saveButton.disabled = false;
    }
  }

  if (form) {
    form.addEventListener('submit', handleSave);
  }
})();
