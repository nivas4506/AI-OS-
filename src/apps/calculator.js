// ============================================
// App: Calculator
// ============================================

export function createCalculator(container) {
    let expression = '';
    let result = '0';
    let newNumber = true;

    const buttons = [
        ['C', '⌫', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['±', '0', '.', '='],
    ];

    container.innerHTML = `
    <div class="app-calculator">
      <div class="calc-display">
        <div class="calc-expression" id="calc-expr"></div>
        <div class="calc-result" id="calc-result">0</div>
      </div>
      <div class="calc-buttons">
        ${buttons.map(row => row.map(btn => {
        let cls = 'calc-btn';
        if (['÷', '×', '-', '+'].includes(btn)) cls += ' operator';
        else if (btn === '=') cls += ' equals';
        else if (['C', '⌫', '%', '±'].includes(btn)) cls += ' func';
        return `<div class="${cls}" data-btn="${btn}">${btn}</div>`;
    }).join('')).join('')}
      </div>
    </div>
  `;

    const resultEl = container.querySelector('#calc-result');
    const exprEl = container.querySelector('#calc-expr');

    container.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', () => handleInput(btn.dataset.btn));
    });

    function handleInput(val) {
        switch (val) {
            case 'C':
                expression = ''; result = '0'; newNumber = true;
                break;
            case '⌫':
                if (result.length > 1) result = result.slice(0, -1);
                else result = '0';
                break;
            case '±':
                if (result !== '0') result = result.startsWith('-') ? result.slice(1) : '-' + result;
                break;
            case '%':
                result = String(parseFloat(result) / 100);
                break;
            case '=':
                try {
                    const evalExpr = (expression + result)
                        .replace(/×/g, '*').replace(/÷/g, '/');
                    const evalResult = Function('"use strict"; return (' + evalExpr + ')')();
                    exprEl.textContent = expression + result + ' =';
                    result = String(Math.round(evalResult * 1e10) / 1e10);
                    expression = '';
                    newNumber = true;
                } catch { result = 'Error'; newNumber = true; }
                break;
            case '+': case '-': case '×': case '÷':
                expression += result + ' ' + val + ' ';
                newNumber = true;
                break;
            case '.':
                if (!result.includes('.')) result += '.';
                newNumber = false;
                break;
            default: // digit
                if (newNumber) { result = val; newNumber = false; }
                else result += val;
        }
        resultEl.textContent = result;
        if (!['=', 'C'].includes(val)) exprEl.textContent = expression;
    }
}
