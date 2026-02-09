  function parseNum(el, fallback = 0) {
      const v = parseFloat(el.value);
      return isNaN(v) ? fallback : v;
    }

    function updateSla() {
      const customerSla = parseNum(document.getElementById('customerSla'));
      const defaultSla = parseNum(document.getElementById('defaultSla'));
      const failsafeSla = parseNum(document.getElementById('failsafeSla'));

      let allowed = 0;
      if (customerSla > 0) allowed = customerSla;
      else if (defaultSla > 0) allowed = defaultSla;
      else allowed = failsafeSla;

      const D = parseNum(document.getElementById('expectedDuration'));
      const theta = parseNum(document.getElementById('grace'));
      const W = parseNum(document.getElementById('weight'), 1);
      const E = parseNum(document.getElementById('elapsedDays'));
      const severity = parseNum(document.getElementById('severity'), 1);

      // Delay vectors
      const penalties = Array.from(document.querySelectorAll('.delay-penalty'));
      const toggles = Array.from(document.querySelectorAll('.delay-toggle'));
      let delayRisk = 0;
      for (let i = 0; i < penalties.length; i++) {
        if (toggles[i].checked) {
          delayRisk += parseNum(penalties[i]);
        }
      }

      const timeRisk = allowed > 0 ? E / allowed : 0;
      const denom = D + theta;
      const stageRisk = denom > 0 ? (E / denom) * W * severity : 0;
      const total = timeRisk + stageRisk + delayRisk;

      document.getElementById('allowedSlaDisplay').textContent =
        allowed > 0 ? allowed.toFixed(1) : '–';
      document.getElementById('timeRiskDisplay').textContent =
        timeRisk ? timeRisk.toFixed(2) : '0.00';
      document.getElementById('stageRiskDisplay').textContent =
        stageRisk ? stageRisk.toFixed(2) : '0.00';
      document.getElementById('delayRiskDisplay').textContent =
        delayRisk ? delayRisk.toFixed(2) : '0.00';
      document.getElementById('totalScoreDisplay').textContent =
        total ? total.toFixed(2) : '0.00';

      const pill = document.getElementById('statusPill');
      const text = document.getElementById('statusText');
      pill.style.display = 'inline-flex';
      pill.classList.remove('status-green', 'status-yellow', 'status-red');

      if (total < 1.0) {
        pill.classList.add('status-green');
        text.textContent = 'On Track';
      } else if (total < 1.2) {
        pill.classList.add('status-yellow');
        text.textContent = 'At Risk';
      } else {
        pill.classList.add('status-red');
        text.textContent = 'Breach Likely';
      }
    }

    document.addEventListener('input', updateSla);
    document.addEventListener('DOMContentLoaded', updateSla);
