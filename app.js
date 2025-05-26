/* ------------ Utility Functions ------------ */

// Creates a DOM element with optional text, class, and attributes
function buildElement(tag, text, className = '', attributes = {}) {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  if (className) el.className = className;
  Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

// Applies selected theme by updating class names
function applyTheme(theme) {
  const elementsToTheme = [
    grid, sliderBg, sliderCcl, resultBckgrd, keypadBckgrd,footer, ...attributionLinks,
    ...allBtns, ...resetBtn, ...equalBtn, ...delBtn
  ];

  // Remove existing theme classes
  elementsToTheme.forEach(el =>
    el.classList.remove('theme1', 'theme2', 'theme3')
  );

  // Apply new theme class
  document.body.className = theme;
  elementsToTheme.forEach(el => el.classList.add(theme));
}

/* ------------ DOM Construction ------------ */

const sectionGrid = document.querySelector('.section-grid');

/* ---- Grid 1: Header and Theme Toggle ---- */
const grid1 = buildElement('div', '', 'grid-1');

// Left title: "calc"
const leftTitle = buildElement('div', 'calc', 'left-title');

// Theme toggle container
const themeToggle = buildElement('div', '', 'theme-toggle');

// Top theme labels (1, 2, 3)
const topLabels = buildElement('div', '', 'top-labels');
['1', '2', '3'].forEach(num => {
  const label = buildElement('label', num);
  label.htmlFor = `theme${num}`;
  topLabels.appendChild(label);
});

// Radio slider + label row
const sliderRow = buildElement('div', '', 'slider-row');
const themeLabel = buildElement('span', 'Theme', 'theme-label');
const sliderWrapper = buildElement('div', '', 'slider-wrapper');

// Create radio inputs for themes
const radioThemes = [1, 2, 3].map(i => {
  const input = document.createElement('input');
  input.type = 'radio';
  input.name = 'theme';
  input.id = `theme${i}`;
  if (i === 1) input.checked = true; // Default theme
  return input;
});

// Slider visuals
const sliderBackgrnd = buildElement('div', '', 'slider-bg');
const sliderCircle = buildElement('div', '', 'slider-circle');
sliderBackgrnd.appendChild(sliderCircle);

// Build slider and attach to DOM
sliderWrapper.append(...radioThemes, sliderBackgrnd);
sliderRow.append(themeLabel, sliderWrapper);
themeToggle.append(topLabels, sliderRow);
grid1.append(leftTitle, themeToggle);

/* ---- Grid 2: Display ---- */
const grid2 = buildElement('div', '', 'grid-2');
const exp = buildElement('div', '', 'expression'); // Stores expression
const calculatedTotal = buildElement('p', '0', 'total'); // Final result
grid2.append(exp, calculatedTotal);

/* ---- Grid 3: Buttons ---- */

// Button configuration
const buttonConfigs = [
  { id: 'btn7', text: '7', class: 'btn numBtn' },
  { id: 'btn8', text: '8', class: 'btn numBtn' },
  { id: 'btn9', text: '9', class: 'btn numBtn' },
  { id: 'delBtn', text: 'DEL', class: 'btn delBtn' },
  { id: 'btn4', text: '4', class: 'btn numBtn' },
  { id: 'btn5', text: '5', class: 'btn numBtn' },
  { id: 'btn6', text: '6', class: 'btn numBtn' },
  { id: 'btnAdd', text: '+', class: 'btn opBtn' },
  { id: 'btn1', text: '1', class: 'btn numBtn' },
  { id: 'btn2', text: '2', class: 'btn numBtn' },
  { id: 'btn3', text: '3', class: 'btn numBtn' },
  { id: 'btnMinus', text: '-', class: 'btn opBtn' },
  { id: 'btnDot', text: '.', class: 'btn numBtn' },
  { id: 'btn0', text: '0', class: 'btn numBtn' },
  { id: 'btnDivide', text: '/', class: 'btn opBtn' },
  { id: 'btnMultiply', text: 'x', class: 'btn opBtn' },
  { id: 'btnReset', text: 'reset', class: 'btn reset' },
  { id: 'btnEqual', text: '=', class: 'btn eqlBtn opBtn' }
];

// Create button elements
const buttons = buttonConfigs.map(({ id, text, class: className }) =>
  buildElement('button', text, className, { id })
);

// Append buttons to grid
const grid3 = buildElement('div', '', 'grid-3');
grid3.append(...buttons);

// Append all grids to main section
sectionGrid.append(grid1, grid2, grid3);

/* ------------ Calculator Logic ------------ */

// Get display elements
const totalDisplay = document.querySelector('.total');
const expressionDisplay = document.querySelector('.expression');

// State variables
let shouldClearDisplay = false;
let justEvaluated = false;

// Handle button clicks
document.addEventListener('click', e => {
  const target = e.target;
  const isNum = target.classList.contains('numBtn');
  const isOp = target.classList.contains('opBtn');
  const id = target.id;

  // Number button clicked
  if (isNum) {
    if (justEvaluated) {
      expressionDisplay.textContent = '';
      totalDisplay.textContent = target.textContent;
      justEvaluated = false;
      shouldClearDisplay = false;
    } else if (shouldClearDisplay) {
      totalDisplay.textContent = target.textContent;
      shouldClearDisplay = false;
    } else {
      totalDisplay.textContent = totalDisplay.textContent === '0'
        ? target.textContent
        : totalDisplay.textContent + target.textContent;
    }
  }

  // Operator button clicked
  if (isOp) {
    expressionDisplay.textContent = justEvaluated
      ? totalDisplay.textContent + target.textContent
      : expressionDisplay.textContent + totalDisplay.textContent + target.textContent;
    justEvaluated = false;
    shouldClearDisplay = true;
  }

  // Equal button clicked
  if (id === 'btnEqual') {
    try {
      const cleanExpr = expressionDisplay.textContent.replace(/x/g, '*');
      expressionDisplay.textContent = cleanExpr;
      const result = eval(expressionDisplay.textContent.replace(/x/g, '*').replace(/=/g, ''));
      totalDisplay.textContent = parseFloat(result.toFixed(13)).toString(); // Limit to 10 decimals
      justEvaluated = true;
    } catch {
      totalDisplay.textContent = 'Error';
    }
    shouldClearDisplay = true;
  }

  // Reset button clicked
  if (id === 'btnReset') {
    expressionDisplay.textContent = '';
    totalDisplay.textContent = '0';
    shouldClearDisplay = false;
  }

  // Delete last digit
  if (id === 'delBtn') {
    const current = totalDisplay.textContent;
    totalDisplay.textContent = current.slice(0, -1) || '0';
  }
});

/* ------------ Theme Logic ------------ */

// Theme inputs
const [theme1Input, theme2Input, theme3Input] = radioThemes;

// Theme-related DOM elements
const grid = document.querySelector('.grid-1');
const sliderBg = document.querySelector('.slider-bg');
const sliderCcl = document.querySelector('.slider-circle');
const resultBckgrd = document.querySelector('.grid-2');
const keypadBckgrd = document.querySelector('.grid-3');
const allBtns = document.querySelectorAll('.btn');
const resetBtn = document.querySelectorAll('.reset');
const equalBtn = document.querySelectorAll('.eqlBtn');
const delBtn = document.querySelectorAll('.delBtn');
const footer = document.querySelector('footer');
const attributionLinks = document.querySelectorAll('.fa');

// Listen for theme change
document.addEventListener('change', () => {
  if (theme1Input.checked) applyTheme('theme1');
  if (theme2Input.checked) applyTheme('theme2');
  if (theme3Input.checked) applyTheme('theme3');
});
