const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

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
const fontItalicInput = document.getElementById('fontItalic');
const displayBackgroundInput = document.getElementById('displayBackground');
const displayTextColorInput = document.getElementById('displayTextColor');

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
    let fontFamily = fontFamilyInput.value;
    const fontWeight = fontWeightInput.value;
    const fontItalic = fontItalicInput.checked;
    
    fontFamily = fontFamily.split(',').map(font => {
        font = font.trim();
        if (font.includes(' ')) {
            return `'${font}'`;
        }
        return font;
    }).join(', ');
    
    display.style.fontFamily = fontFamily;
    display.style.fontWeight = fontWeight;
    display.style.fontStyle = fontItalic ? 'italic' : 'normal';
}

fontFamilyInput.addEventListener('input', updateFont);
fontWeightInput.addEventListener('input', updateFont);
fontItalicInput.addEventListener('change', updateFont);

function updateDisplayColors() {
    const bgColor = displayBackgroundInput.value || 'rgba(0,0,0,0.3)';
    const txtColor = displayTextColorInput.value || '#00d4ff';
    
    display.style.background = bgColor;
    display.style.color = txtColor;
}

displayBackgroundInput.addEventListener('input', updateDisplayColors);
displayTextColorInput.addEventListener('input', updateDisplayColors);

let isFullscreen = false;

document.addEventListener('keydown', function(e) {
    if (e.key === 'F11') {
        e.preventDefault();
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            container.classList.add('fullscreen');
            document.body.classList.add('fullscreen-active');
        } else {
            container.classList.remove('fullscreen');
            document.body.classList.remove('fullscreen-active');
        }
    } else if (e.key === 'Escape') {
        if (isFullscreen) {
            isFullscreen = false;
            container.classList.remove('fullscreen');
            document.body.classList.remove('fullscreen-active');
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
