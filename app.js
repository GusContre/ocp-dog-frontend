(function () {
  const DEFAULT_API_URL = 'http://localhost:5001';
  const configUrl = (window.__APP_CONFIG__ && window.__APP_CONFIG__.FRONTEND_API_URL) || DEFAULT_API_URL;
  const apiBase = configUrl.replace(/\/$/, '');

  const button = document.getElementById('dog-button');
  const image = document.getElementById('dog-image');
  const status = document.getElementById('status');

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
})();
