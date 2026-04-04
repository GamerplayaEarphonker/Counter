const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const renderBtn = document.getElementById('renderBtn');

const modeCountingInput = document.getElementById('modeCounting');
const modeTimerInput = document.getElementById('modeTimer');

const startNumberInput = document.getElementById('startNumber');
const endNumberInput = document.getElementById('endNumber');
const durationInput = document.getElementById('duration');
const easingInInput = document.getElementById('easingIn');
const easingOutInput = document.getElementById('easingOut');
const countdownInput = document.getElementById('countdown');
const secondsInput = document.getElementById('seconds');
const hoursInput = document.getElementById('hours');
const clockInput = document.getElementById('clock');
const completeInput = document.getElementById('complete');
const stopwatchInput = document.getElementById('stopwatch');
const fontFamilyInput = document.getElementById('fontFamily');
const fontWeightInput = document.getElementById('fontWeight');
const fontSizeInput = document.getElementById('fontSize');
const fontItalicInput = document.getElementById('fontItalic');
const displayBackgroundInput = document.getElementById('displayBackground');
const displayBackgroundColorInput = document.getElementById('displayBackgroundColor');
const displayTextColorInput = document.getElementById('displayTextColor');
const displayTextColorColorInput = document.getElementById('displayTextColorColor');
const renderSizeInput = document.getElementById('renderResolution');
const renderAspectInput = document.getElementById('renderAspect');

const countingGroup = document.getElementById('countingGroup');
const timerGroup = document.getElementById('timerGroup');
const container = document.querySelector('.container');

let animationId = null;
let isRunning = false;
let startTime = null;

function easeIn(t) {
    return t * t;
}

function easeOut(t) {
    return 1 - (1 - t) * (1 - t);
}

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function linear(t) {
    return t;
}

function updateFont() {
    const fontFamily = fontFamilyInput.value.trim();
    const fontWeight = fontWeightInput.value;
    const fontSize = fontSizeInput.value;
    const fontItalic = fontItalicInput.checked;
    
    display.style.fontFamily = fontFamily;
    display.style.fontWeight = fontWeight;
    display.style.fontSize = fontSize + 'px';
    display.style.fontStyle = fontItalic ? 'italic' : 'normal';
}

fontFamilyInput.addEventListener('input', updateFont);
fontWeightInput.addEventListener('input', updateFont);
fontSizeInput.addEventListener('input', updateFont);
fontItalicInput.addEventListener('change', updateFont);

function updateDisplayColors() {
    const bgColor = displayBackgroundInput.value;
    const txtColor = displayTextColorInput.value;
    
    displayBackgroundColorInput.value = bgColor;
    displayTextColorColorInput.value = txtColor;
    
    display.style.background = bgColor;
    display.style.color = txtColor;
}

function updateDisplayColorsFromPicker() {
    const bgColor = displayBackgroundColorInput.value;
    const txtColor = displayTextColorColorInput.value;
    
    displayBackgroundInput.value = bgColor;
    displayTextColorInput.value = txtColor;
    
    display.style.background = bgColor;
    display.style.color = txtColor;
}

displayBackgroundInput.addEventListener('input', updateDisplayColors);
displayTextColorInput.addEventListener('input', updateDisplayColors);
displayBackgroundColorInput.addEventListener('input', updateDisplayColorsFromPicker);
displayTextColorColorInput.addEventListener('input', updateDisplayColorsFromPicker);

let isFullscreen = false;

document.addEventListener('keydown', function(e) {
    const target = e.target;
    const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
    
    if (isTyping && !e.altKey && !e.ctrlKey && !e.metaKey) {
        return;
    }
    
    if (e.key === 'F11') {
        e.preventDefault();
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            document.body.classList.add('fullscreen');
        } else {
            document.body.classList.remove('fullscreen');
        }
    } else if (e.key === 'Escape') {
        if (isFullscreen) {
            isFullscreen = false;
            document.body.classList.remove('fullscreen');
        }
    } else if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        if (isRunning) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            isRunning = false;
        } else {
            if (modeCountingInput.checked) {
                startCounting();
            } else {
                startTimer();
            }
        }
    } else if (e.key === 'y' || e.key === 'Y') {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        isRunning = false;
        
        if (modeTimerInput.checked) {
            if (clockInput.checked) {
                const now = new Date();
                let hours = now.getHours();
                const minutes = now.getMinutes();
                const seconds = now.getSeconds();
                
                if (!completeInput.checked) {
                    const ampm = hours >= 12 ? ' PM' : ' AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${ampm}`;
                } else {
                    display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            } else {
                const totalSeconds = parseInt(secondsInput.value) || 0;
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                if (hoursInput.checked && hours > 0) {
                    display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                } else {
                    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            }
        } else {
            display.textContent = startNumberInput.value || "0";
        }
    } else if (e.key === 'r' || e.key === 'R') {
        if (e.altKey) {
            e.preventDefault();
            alert('Render Speed: 60 FPS');
        } else {
            e.preventDefault();
            renderBtn.click();
        }
    }
});

function updateGroupStates() {
    if (modeCountingInput.checked) {
        countingGroup.classList.remove('disabled');
        timerGroup.classList.add('disabled');
    } else {
        countingGroup.classList.add('disabled');
        timerGroup.classList.remove('disabled');
    }
}

modeCountingInput.addEventListener('change', function() {
    if (this.checked) {
        updateGroupStates();
    }
});

modeTimerInput.addEventListener('change', function() {
    if (this.checked) {
        updateGroupStates();
    }
});

function startCounting() {
    if (isRunning) return;
    
    const startNumber = parseInt(startNumberInput.value) || 0;
    const endNumber = parseInt(endNumberInput.value) || 100;
    const duration = parseFloat(durationInput.value) || 5;
    const easingIn = easingInInput.checked;
    const easingOut = easingOutInput.checked;
    const isCountdown = countdownInput.checked;
    
    isRunning = true;
    startTime = performance.now();
    
    let start = isCountdown ? endNumber : startNumber;
    let end = isCountdown ? startNumber : endNumber;
    
    function animate(currentTime) {
        const elapsed = (currentTime - startTime) / 1000;
        let t = Math.min(elapsed / duration, 1);
        
        let easedT;
        if (easingIn && easingOut) {
            easedT = easeInOut(t);
        } else if (easingIn) {
            easedT = easeIn(t);
        } else if (easingOut) {
            easedT = easeOut(t);
        } else {
            easedT = linear(t);
        }
        
        const currentValue = Math.round(start + (end - start) * easedT);
        display.textContent = currentValue;
        
        if (t < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            display.textContent = end;
            isRunning = false;
            animationId = null;
        }
    }
    
    animationId = requestAnimationFrame(animate);
}

function startTimer() {
    if (isRunning) return;
    
    const hoursChecked = hoursInput.checked;
    const clockChecked = clockInput.checked;
    const completeChecked = completeInput.checked;
    const isStopwatch = stopwatchInput.checked;
    const secondsVal = parseInt(secondsInput.value) || 0;
    
    isRunning = true;
    startTime = performance.now();
    
    function updateTimer(currentTime) {
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        let totalSeconds = elapsed;
        
        if (!isStopwatch) {
            totalSeconds = secondsVal - elapsed;
        }
        
        if (!clockChecked && !isStopwatch && totalSeconds < 0) {
            display.textContent = "00:00";
            isRunning = false;
            animationId = null;
            return;
        }
        
        if (!clockChecked && isStopwatch && totalSeconds >= secondsVal) {
            totalSeconds = secondsVal;
            display.textContent = formatTime(totalSeconds, hoursChecked);
            isRunning = false;
            animationId = null;
            return;
        }
        
        let timeString;
        
        if (clockChecked) {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            
            if (!completeChecked) {
                const ampm = hours >= 12 ? ' PM' : ' AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${ampm}`;
            } else {
                timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        } else {
            timeString = formatTime(totalSeconds, hoursChecked);
        }
        
        display.textContent = timeString;
        
        if (isStopwatch && totalSeconds < secondsVal) {
            animationId = requestAnimationFrame(updateTimer);
        } else if (!isStopwatch) {
            animationId = requestAnimationFrame(updateTimer);
        }
    }
    
    function formatTime(totalSecs, withHours) {
        let hours = Math.floor(totalSecs / 3600);
        let minutes = Math.floor((totalSecs % 3600) / 60);
        let seconds = totalSecs % 60;
        
        if (withHours && hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    animationId = requestAnimationFrame(updateTimer);
}

startBtn.addEventListener('click', function() {
    if (modeCountingInput.checked) {
        startCounting();
    } else {
        startTimer();
    }
});

stopBtn.addEventListener('click', function() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    isRunning = false;
});

resetBtn.addEventListener('click', function() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    isRunning = false;
    
    if (modeTimerInput.checked) {
        if (clockInput.checked) {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            
            if (!completeInput.checked) {
                const ampm = hours >= 12 ? ' PM' : ' AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${ampm}`;
            } else {
                display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        } else {
            const totalSeconds = parseInt(secondsInput.value) || 0;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            if (hoursInput.checked && hours > 0) {
                display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    } else {
        display.textContent = startNumberInput.value || "0";
    }
});

updateGroupStates();
updateFont();
updateDisplayColors();

renderBtn.addEventListener('click', async function() {
    const canvas = document.getElementById('renderCanvas');
    const ctx = canvas.getContext('2d');
    
    const resolutionValue = renderSizeInput.value;
    const [resWidth, resHeight] = resolutionValue.split('x').map(Number);
    
    const aspectValue = renderAspectInput.value;
    let width, height;
    
    if (aspectValue === '16x9') {
        width = resWidth;
        height = Math.round(resWidth * 9 / 16);
    } else if (aspectValue === '4x3') {
        width = resWidth;
        height = Math.round(resWidth * 3 / 4);
    } else if (aspectValue === '1x1') {
        width = resWidth;
        height = resWidth;
    } else if (aspectValue === '9x16') {
        width = resWidth;
        height = Math.round(resWidth * 16 / 9);
    } else if (aspectValue === '3x4') {
        width = resWidth;
        height = Math.round(resWidth * 4 / 3);
    } else {
        width = resWidth;
        height = Math.round(resWidth * 9 / 16);
    }
    
    canvas.width = width;
    canvas.height = height;
    
    const stream = canvas.captureStream(60);
    
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/mp4';
        }
    }
    
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
    });
    
    const chunks = [];
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = () => {
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `counting-video.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    const isCounting = modeCountingInput.checked;
    let startTime = performance.now();
    let running = true;
    
    function drawFrame() {
        if (!running) return;
        
        const elapsed = (performance.now() - startTime) / 1000;
        
        let text = '';
        
        if (isCounting) {
            const startNum = parseInt(startNumberInput.value) || 0;
            const endNum = parseInt(endNumberInput.value) || 100;
            const duration = parseFloat(durationInput.value) || 5;
            const easingIn = easingInInput.checked;
            const easingOut = easingOutInput.checked;
            const isCountdown = countdownInput.checked;
            
            let t = Math.min(elapsed / duration, 1);
            let easedT;
            if (easingIn && easingOut) {
                easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            } else if (easingIn) {
                easedT = t * t;
            } else if (easingOut) {
                easedT = 1 - (1 - t) * (1 - t);
            } else {
                easedT = t;
            }
            
            const start = isCountdown ? endNum : startNum;
            const end = isCountdown ? startNum : endNum;
            text = Math.round(start + (end - start) * easedT).toString();
        } else {
            const secondsVal = parseInt(secondsInput.value) || 60;
            const hoursChecked = hoursInput.checked;
            const isStopwatch = stopwatchInput.checked;
            
            let totalSeconds;
            if (isStopwatch) {
                totalSeconds = Math.floor(elapsed);
            } else {
                totalSeconds = Math.max(0, secondsVal - Math.floor(elapsed));
            }
            
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            if (hoursChecked && hours > 0) {
                text = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                text = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }
        
        ctx.fillStyle = displayBackgroundInput.value || '#000000';
        ctx.fillRect(0, 0, width, height);
        
        const fontSize = Math.round(width / 4);
        ctx.font = `${fontWeightInput.value} ${fontSize}px ${fontFamilyInput.value}`;
        ctx.fillStyle = displayTextColorInput.value || '#00d4ff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);
        
        if (elapsed < (isCounting ? parseFloat(durationInput.value) : parseInt(secondsInput.value))) {
            requestAnimationFrame(drawFrame);
        } else {
            running = false;
            mediaRecorder.stop();
        }
    }
    
    renderBtn.disabled = true;
    renderBtn.textContent = 'Rendering...';
    
    mediaRecorder.start();
    drawFrame();
    
    const isCountingMode = modeCountingInput.checked;
    const durationSec = isCountingMode 
        ? parseFloat(durationInput.value) 
        : parseInt(secondsInput.value);
    
    setTimeout(() => {
        renderBtn.disabled = false;
        renderBtn.textContent = 'Render';
    }, durationSec * 1000 + 500);
});
