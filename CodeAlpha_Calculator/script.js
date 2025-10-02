const display = document.getElementById('display');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');

let current = '';
let operator = '';
let operand = '';
let resetNext = false;
let activeOperator = null;
let isDarkTheme = false;

function formatNumber(num) {
    if (num === 'Error') return num;
    const n = parseFloat(num);
    if (isNaN(n)) return '0';
    
    // Handle very large numbers
    if (Math.abs(n) >= 1e9) {
        return n.toExponential(2);
    }
    
    // Convert to string and limit length
    let str = n.toString();
    if (str.length > 9) {
        if (str.includes('.')) {
            str = n.toPrecision(6);
        } else {
            str = n.toExponential(2);
        }
    }
    
    return str;
}

function updateDisplay(value) {
    display.textContent = formatNumber(value || '0');
}

function calculate(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);
    
    if (isNaN(a) || isNaN(b)) return 'Error';
    
    let result;
    switch (op) {
        case 'add': result = a + b; break;
        case 'subtract': result = a - b; break;
        case 'multiply': result = a * b; break;
        case 'divide': 
            if (b === 0) return 'Error';
            result = a / b; 
            break;
        default: result = b;
    }
    
    // Handle overflow/underflow
    if (!isFinite(result)) return 'Error';
    return result;
}

function handleNumber(num) {
    if (resetNext) {
        current = '';
        resetNext = false;
    }
    if (num === '.' && current.includes('.')) return;
    if (current.length >= 12) return; // Limit input length
    
    current += num;
    updateDisplay(current);
}

function handleOperator(op) {
    // Clear previous active operator
    if (activeOperator) {
        activeOperator.classList.remove('active');
    }
    
    // Set new active operator
    const operatorBtn = document.querySelector(`[data-action="${op}"]`);
    if (operatorBtn) {
        operatorBtn.classList.add('active');
        activeOperator = operatorBtn;
    }
    
    if (current === '' && operand === '') return;
    
    if (operand !== '' && operator !== '' && current !== '') {
        let result = calculate(operand, current, operator);
        if (result === 'Error') {
            handleClear();
            updateDisplay('Error');
            return;
        }
        operand = result.toString();
        updateDisplay(operand);
    } else if (current !== '') {
        operand = current;
    }
    
    operator = op;
    current = '';
}

function handleEquals() {
    // Clear active operator
    if (activeOperator) {
        activeOperator.classList.remove('active');
        activeOperator = null;
    }
    
    if (operator && operand !== '' && current !== '') {
        let result = calculate(operand, current, operator);
        updateDisplay(result);
        
        operand = result === 'Error' ? '' : result.toString();
        current = '';
        operator = '';
        resetNext = true;
    }
}

function handleClear() {
    current = '';
    operator = '';
    operand = '';
    resetNext = false;
    
    // Clear active operator
    if (activeOperator) {
        activeOperator.classList.remove('active');
        activeOperator = null;
    }
    
    updateDisplay('0');
    
    // Change AC to C when there's something to clear
    const clearBtn = document.querySelector('[data-action="clear"]');
    clearBtn.textContent = 'AC';
}

function handleBackspace() {
    if (resetNext) return;
    current = current.slice(0, -1);
    updateDisplay(current || '0');
}

function handlePlusMinus() {
    const value = parseFloat(current || display.textContent) || 0;
    const result = -value;
    current = result.toString();
    updateDisplay(current);
    resetNext = false;
}

function handlePercent() {
    const value = parseFloat(current || display.textContent) || 0;
    const result = value / 100;
    current = result.toString();
    updateDisplay(current);
    resetNext = true;
}

function updateClearButton() {
    const clearBtn = document.querySelector('[data-action="clear"]');
    if (current !== '' || operand !== '') {
        clearBtn.textContent = 'C';
    } else {
        clearBtn.textContent = 'AC';
    }
}

// Event listeners
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.number !== undefined) {
            handleNumber(btn.dataset.number);
            updateClearButton();
        } else if (btn.dataset.action) {
            switch (btn.dataset.action) {
                case 'add': handleOperator('add'); break;
                case 'subtract': handleOperator('subtract'); break;
                case 'multiply': handleOperator('multiply'); break;
                case 'divide': handleOperator('divide'); break;
                case 'equals': handleEquals(); break;
                case 'clear': handleClear(); break;
                case 'backspace': handleBackspace(); break;
                case 'plus-minus': handlePlusMinus(); break;
                case 'percent': handlePercent(); break;
            }
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        handleNumber(e.key);
        updateClearButton();
    } else if (e.key === '+') {
        handleOperator('add');
    } else if (e.key === '-') {
        handleOperator('subtract');
    } else if (e.key === '*' || e.key === 'x') {
        handleOperator('multiply');
    } else if (e.key === '/' || e.key === '÷') {
        handleOperator('divide');
    } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
    } else if (e.key === 'Backspace') {
        handleBackspace();
        updateClearButton();
    } else if (e.key === '%') {
        handlePercent();
    }
});

// Theme toggle functionality
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    const body = document.body;
    const calculator = document.querySelector('.calculator');
    const displayEl = document.querySelector('.display');
    const themeToggleEl = document.querySelector('.theme-toggle');
    const numberBtns = document.querySelectorAll('.number-btn');
    const functionBtns = document.querySelectorAll('.function-btn');
    
    if (isDarkTheme) {
        // Dark theme
        body.style.background = '#000';
        calculator.style.background = '#000';
        calculator.style.boxShadow = 'none';
        displayEl.style.background = 'transparent';
        displayEl.style.color = '#fff';
        displayEl.style.border = 'none';
        displayEl.style.boxShadow = 'none';
        themeToggleEl.style.background = 'rgba(255, 255, 255, 0.1)';
        themeToggleEl.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        themeIcon.textContent = '☀️';
        
        // Update button colors for dark theme
        numberBtns.forEach(btn => {
            btn.style.background = '#333';
            btn.style.color = '#fff';
        });
        functionBtns.forEach(btn => {
            btn.style.background = '#a6a6a6';
            btn.style.color = '#000';
        });
    } else {
        // Light theme
        body.style.background = '#1a1a1a';
        calculator.style.background = '#fff';
        calculator.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        displayEl.style.background = '#f8f9fa';
        displayEl.style.color = '#000';
        displayEl.style.border = '2px solid #e9ecef';
        displayEl.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.05)';
        themeToggleEl.style.background = 'rgba(0, 0, 0, 0.1)';
        themeToggleEl.style.border = '1px solid #e9ecef';
        themeIcon.textContent = '🌙';
        
        // Update button colors for light theme
        numberBtns.forEach(btn => {
            btn.style.background = '#e5e5e7';
            btn.style.color = '#000';
        });
        functionBtns.forEach(btn => {
            btn.style.background = '#d1d1d6';
            btn.style.color = '#000';
        });
    }
}

// Add event listener for theme toggle
themeToggle.addEventListener('click', toggleTheme);