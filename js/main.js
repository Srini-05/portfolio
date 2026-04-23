import { initTheme } from './theme.js';
import { initUI } from './ui.js';
import { initCanvas } from './canvas.js';
import { initForm } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initUI();
    initCanvas();
    initForm();
});
