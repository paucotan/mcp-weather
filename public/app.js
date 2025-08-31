// Minimal client-side script to fetch weather and render results
(function () {
  const form = document.getElementById('cityForm');
  const cityInput = document.getElementById('city');
  const resultBox = document.getElementById('result');
  const unitsSelect = document.getElementById('units');

  function show(html, isError) {
    resultBox.style.display = 'block';
    resultBox.innerHTML = html;
    resultBox.classList.toggle('error', !!isError);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    show('Fetching weather for <strong>' + city.replace(/</g, '&lt;') + '</strong>…');

    try {
      const url = new URL('/weather', window.location.origin);
      url.searchParams.set('city', city);
      const units = (unitsSelect.value || 'metric');
      if (units === 'imperial') url.searchParams.set('units', 'imperial');
      const resp = await fetch(url);
      const text = await resp.text();
      let data; try { data = JSON.parse(text); } catch { data = text; }

      if (!resp.ok) {
        const hint = (data && data.hint) ? '<div class="muted">Hint: ' + data.hint + '</div>' : '';
        show(
          '<div class="error"><strong>Error ' + resp.status + '</strong></div>' +
          '<pre>' + (typeof data === 'string' ? data : JSON.stringify(data, null, 2)) + '</pre>' +
          hint,
          true
        );
        return;
      }

      const summary = (d) => {
        const isMetric = (d.units || 'metric') === 'metric';
        const tempVal = (typeof d.temp === 'number') ? d.temp : (typeof d.tempC === 'number' ? d.tempC : null);
        const tempUnit = isMetric ? '°C' : '°F';
        const windStr = isMetric
          ? ((d.windKph ?? 'n/a') + ' km/h')
          : ((d.windMph ?? 'n/a') + ' mph');
        return (
          '<div class="headline"><strong>' + (d.city ?? 'Unknown city') + (d.country ? ', ' + d.country : '') + '</strong></div>' +
          '<div class="temp">' + (d.description ?? 'n/a') + ' — ' + (tempVal ?? '?') + tempUnit + '</div>' +
          '<div>Humidity: ' + (d.humidity ?? 'n/a') + '% · Wind: ' + windStr + '</div>'
        );
      };

      const pretty = (typeof data === 'string') ? data : JSON.stringify(data, null, 2);
      show(summary(data) + '<pre>' + pretty + '</pre>');
    } catch (err) {
      show('<div class="error"><strong>Client error:</strong> ' + String(err) + '</div>', true);
    }
  });
})();
