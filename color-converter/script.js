document.addEventListener('DOMContentLoaded', () => {
    const preview = document.getElementById('color-preview');
    const hexInput = document.getElementById('hex-input');
    const rInput = document.getElementById('rgb-r');
    const gInput = document.getElementById('rgb-g');
    const bInput = document.getElementById('rgb-b');
    const hInput = document.getElementById('hsl-h');
    const sInput = document.getElementById('hsl-s');
    const lInput = document.getElementById('hsl-l');

    let isUpdating = false;

    function updateAll(source) {
        if (isUpdating) return;
        isUpdating = true;

        let r, g, b;

        if (source === 'hex') {
            const hex = hexInput.value;
            if (/^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex)) {
                let fullHex = hex.startsWith('#') ? hex.slice(1) : hex;
                if (fullHex.length === 3) {
                    fullHex = fullHex.split('').map(char => char + char).join('');
                }
                const bigint = parseInt(fullHex, 16);
                r = (bigint >> 16) & 255;
                g = (bigint >> 8) & 255;
                b = bigint & 255;
                updateRgbInputs(r, g, b);
                updateHslInputs(rgbToHsl(r, g, b));
            }
        } else if (source === 'rgb') {
            r = parseInt(rInput.value) || 0;
            g = parseInt(gInput.value) || 0;
            b = parseInt(bInput.value) || 0;
            hexInput.value = rgbToHex(r, g, b);
            updateHslInputs(rgbToHsl(r, g, b));
        } else if (source === 'hsl') {
            const h = parseInt(hInput.value) || 0;
            const s = parseInt(sInput.value) || 0;
            const l = parseInt(lInput.value) || 0;
            const rgb = hslToRgb(h, s, l);
            r = rgb.r; g = rgb.g; b = rgb.b;
            updateRgbInputs(r, g, b);
            hexInput.value = rgbToHex(r, g, b);
        }

        if (r !== undefined) {
            preview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }

        isUpdating = false;
    }

    function updateRgbInputs(r, g, b) {
        rInput.value = r;
        gInput.value = g;
        bInput.value = b;
    }

    function updateHslInputs({ h, s, l }) {
        hInput.value = h;
        sInput.value = s;
        lInput.value = l;
    }

    // --- Event Listeners ---
    hexInput.addEventListener('input', () => updateAll('hex'));
    [rInput, gInput, bInput].forEach(input => input.addEventListener('input', () => updateAll('rgb')));
    [hInput, sInput, lInput].forEach(input => input.addEventListener('input', () => updateAll('hsl')));

    // --- Conversion Formulas ---
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }
});

// 설명 펼치기/접기 기능
const toggleBtn = document.getElementById('toggleDescriptionBtn');
const descriptionContent = document.getElementById('descriptionContent');

if (toggleBtn && descriptionContent) {
    toggleBtn.addEventListener('click', () => {
        const isHidden = descriptionContent.classList.toggle('hidden');
        
        if (isHidden) {
            toggleBtn.innerHTML = '📖 색상 코드 변환기 설명 및 정보 보기 ▼';
        } else {
            toggleBtn.innerHTML = '📖 색상 코드 변환기 설명 및 정보 숨기기 ▲';
        }
    });
}