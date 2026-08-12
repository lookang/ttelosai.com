// ===== GLOBAL STATE =====
let state = {
    samples: [],
    placements: {},
    selectedCard: null,
    startTime: Date.now(),
    actionCount: 0,
    deviceType: 'unknown',
    results: [],
    currentSeed: Date.now()
};

// ===== SAMPLE DATA =====
// Each sample has: name, category (element/compound/mixture), and educational feedback
const sampleDatabase = [
    // Elements
    { name: 'Oxygen (O₂)', category: 'element', image: 'assets/samples/oxygen.jpg', imageAlt: 'Compressed-gas cylinder used as a safe real-world representation of oxygen', feedback: 'Oxygen is an element - it consists of only one type of atom (oxygen atoms). Even though O₂ is a molecule, it\'s still an element because all atoms are the same type.' },
    { name: 'Iron (Fe)', category: 'element', feedback: 'Iron is an element made of only iron atoms. It\'s a pure substance that cannot be broken down into simpler substances by chemical means.' },
    { name: 'Gold (Au)', category: 'element', image: 'assets/samples/gold.jpg', imageAlt: 'Natural gold nugget in a laboratory watch glass', feedback: 'Gold is an element consisting of only gold atoms. It\'s found on the periodic table and is a pure substance.' },
    { name: 'Carbon (C)', category: 'element', image: 'assets/samples/carbon.jpg', imageAlt: 'Black graphite pieces in a laboratory watch glass', feedback: 'Carbon is an element made up of only carbon atoms. It can exist in different forms (diamond, graphite) but remains the same element.' },
    { name: 'Helium (He)', category: 'element', feedback: 'Helium is an element - a noble gas made of only helium atoms. It\'s chemically inert and exists as single atoms.' },
    { name: 'Copper (Cu)', category: 'element', feedback: 'Copper is an element consisting of only copper atoms. It\'s a metal commonly used in electrical wiring.' },
    { name: 'Nitrogen (N₂)', category: 'element', feedback: 'Nitrogen is an element. Although N₂ is a molecule, it\'s still an element because both atoms are nitrogen atoms.' },
    { name: 'Aluminium (Al)', category: 'element', image: 'assets/samples/aluminium.jpg', imageAlt: 'Reflective aluminium foil showing a metallic surface', feedback: 'Aluminium is an element made of only aluminium atoms. It\'s a lightweight metal used in many applications.' },
    
    // Compounds
    { name: 'Water (H₂O)', category: 'compound', feedback: 'Water is a compound made of hydrogen and oxygen atoms chemically bonded in a fixed ratio (2:1). It has different properties from its constituent elements.' },
    { name: 'Carbon dioxide (CO₂)', category: 'compound', feedback: 'Carbon dioxide is a compound formed when carbon and oxygen atoms bond chemically. It has a fixed composition and unique properties.' },
    { name: 'Table salt (NaCl)', category: 'compound', image: 'assets/samples/table-salt.jpg', imageAlt: 'White sodium chloride crystals in a laboratory dish', feedback: 'Table salt (sodium chloride) is a compound of sodium and chlorine atoms bonded ionically. Its properties differ completely from sodium metal and chlorine gas.' },
    { name: 'Ammonia (NH₃)', category: 'compound', feedback: 'Ammonia is a compound of nitrogen and hydrogen atoms bonded together in a fixed ratio (1:3). It has distinct properties different from its elements.' },
    { name: 'Methane (CH₄)', category: 'compound', image: 'assets/samples/methane.jpg', imageAlt: 'Blue laboratory burner flame showing methane in use', feedback: 'Methane is a compound of carbon and hydrogen atoms chemically bonded. It\'s the simplest hydrocarbon with a fixed composition.' },
    { name: 'Sugar (C₁₂H₂₂O₁₁)', category: 'compound', feedback: 'Sugar (sucrose) is a compound made of carbon, hydrogen, and oxygen atoms bonded in a specific arrangement. It has a definite chemical formula.' },
    { name: 'Sulfuric acid (H₂SO₄)', category: 'compound', image: 'assets/samples/sulfuric-acid.jpg', imageAlt: 'Closed clear reagent bottle standing in a safety tray', feedback: 'Sulfuric acid is a compound containing hydrogen, sulfur, and oxygen atoms chemically bonded in a fixed ratio.' },
    { name: 'Calcium carbonate (CaCO₃)', category: 'compound', feedback: 'Calcium carbonate is a compound of calcium, carbon, and oxygen atoms bonded together. It\'s found in limestone and chalk.' },
    
    // Mixtures
    { name: 'Air', category: 'mixture', feedback: 'Air is a mixture of gases (mainly nitrogen and oxygen) that are physically combined, not chemically bonded. The composition can vary.' },
    { name: 'Sea water', category: 'mixture', feedback: 'Sea water is a mixture of water, salt, and other dissolved substances. The components retain their properties and can be separated physically.' },
    { name: 'Soil', category: 'mixture', feedback: 'Soil is a mixture of minerals, organic matter, water, and air. The components are physically combined and can be separated.' },
    { name: 'Steel', category: 'mixture', feedback: 'Steel is a mixture (alloy) of iron and carbon, sometimes with other elements. The components are physically combined to improve properties.' },
    { name: 'Milk', category: 'mixture', feedback: 'Milk is a mixture of water, proteins, fats, and sugars. The components are physically combined and retain their individual properties.' },
    { name: 'Blood', category: 'mixture', feedback: 'Blood is a mixture of cells, proteins, and other substances suspended in plasma. The components are physically combined, not chemically bonded.' },
    { name: 'Concrete', category: 'mixture', feedback: 'Concrete is a mixture of cement, sand, gravel, and water. The components are physically combined and can be distinguished.' },
    { name: 'Salad', category: 'mixture', image: 'assets/samples/salad.jpg', imageAlt: 'Bowl of salad with visibly different vegetable pieces', feedback: 'A salad is a mixture of various vegetables and ingredients that are physically combined. Each component retains its properties and can be separated.' },
    { name: 'Brass', category: 'mixture', image: 'assets/samples/brass.jpg', imageAlt: 'Warm yellow brass fitting made from a copper-zinc alloy', feedback: 'Brass is a mixture (alloy) of copper and zinc. The metals are physically combined to create a material with different properties.' },
    { name: 'Coffee', category: 'mixture', image: 'assets/samples/coffee.jpg', imageAlt: 'Cup of black coffee', feedback: 'Coffee is a mixture of water and dissolved coffee compounds. The components are physically combined and can be separated by evaporation.' }
];

const curatedSampleNames = [
    'Coffee', 'Oxygen (O₂)', 'Sulfuric acid (H₂SO₄)', 'Table salt (NaCl)',
    'Methane (CH₄)', 'Aluminium (Al)', 'Brass', 'Carbon (C)', 'Salad', 'Gold (Au)'
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    detectDeviceType();
    initializeSamples();
    setupEventListeners();
    logAction('🚀 Interactive loaded', 'System initialized');
});

// ===== DEVICE DETECTION =====
function detectDeviceType() {
    // Detect input method
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    if (hasTouch && hasCoarsePointer) {
        if (window.innerWidth > 1024) {
            state.deviceType = 'IR Touch (Smartboard)';
        } else {
            state.deviceType = 'Capacitive Touch (Tablet/Phone)';
        }
    } else if (hasTouch) {
        state.deviceType = 'Touch Device';
    } else {
        state.deviceType = 'Mouse/Desktop';
    }
    
    document.getElementById('deviceType').textContent = `Device: ${state.deviceType}`;
    logAction('📱 Device detected', state.deviceType);
}

// ===== SAMPLE INITIALIZATION =====
function initializeSamples(seed = null) {
    cleanupTouchDrag();
    if (seed) state.currentSeed = seed;
    
    // Keep one photograph-supported, scientifically balanced set; New Set reshuffles it.
    const curatedSamples = curatedSampleNames.map(name => sampleDatabase.find(sample => sample.name === name));
    state.samples = shuffleArray(curatedSamples, state.currentSeed + 3);
    state.placements = {};
    state.selectedCard = null;
    
    renderSamples();
    clearDropZones();
    hideResults();
}

// Seeded shuffle function
function shuffleArray(array, seed) {
    const arr = [...array];
    let currentSeed = seed;
    
    // Simple seeded random number generator
    const random = () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
    };
    
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr;
}

// ===== RENDER SAMPLES =====
function renderSamples() {
    const container = document.getElementById('sampleCards');
    container.innerHTML = '';
    
    state.samples.forEach((sample, index) => {
        if (!state.placements[index]) {
            const card = createSampleCard(sample, index);
            container.appendChild(card);
        }
    });
}

function createSampleCard(sample, index) {
    const card = document.createElement('div');
    card.className = 'sample-card';
    populateSampleCard(card, sample);
    card.dataset.index = index;
    card.setAttribute('draggable', 'true');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${sample.name}, drag to sort`);
    card.setAttribute('tabindex', '0');
    
    // Mouse events
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    // A movement threshold keeps small IR-screen jitter as a tap.
    card.addEventListener('touchstart', (e) => handleTouchStart(e, card, index), { passive: false });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd, { passive: false });
    card.addEventListener('touchcancel', handleTouchCancel, { passive: false });
    
    // Click event for mouse (tap-to-select alternative)
    card.addEventListener('click', (e) => {
        if (Date.now() < suppressClickUntil) return;
        handleTapSelect(card, index);
    });
    
    // Keyboard support
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTapSelect(card, index);
        }
    });
    
    return card;
}

function populateSampleCard(card, sample) {
    const image = document.createElement('img');
    image.className = 'sample-thumb';
    image.src = sample.image;
    image.alt = sample.imageAlt;
    image.draggable = false;
    const name = document.createElement('span');
    name.className = 'sample-name';
    name.textContent = sample.name;
    card.replaceChildren(image, name);
}

// ===== DRAG AND DROP (MOUSE) =====
function handleDragStart(e) {
    const card = e.target;
    const index = card.dataset.index;
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    
    card.classList.add('dragging');
    suppressClickUntil = Date.now() + 500;
    logAction('🖱️ Drag started', `${state.samples[index].name} (mouse)`);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// ===== TOUCH DRAG AND DROP =====
const TOUCH_DRAG_THRESHOLD = 8;
const TOUCH_DROP_TOLERANCE = 10;
const TOUCH_DEBOUNCE_MS = 50;
let activeTouch = null;
let dragClone = null;
let lastTouchStartAt = 0;
let lastTouchDropAt = 0;
let suppressClickUntil = 0;

function handleTouchStart(e, card, index) {
    if (e.touches.length !== 1) return;
    e.preventDefault();

    const now = Date.now();
    if (now - lastTouchStartAt < TOUCH_DEBOUNCE_MS) return;
    lastTouchStartAt = now;

    cleanupTouchDrag();
    const touch = e.touches[0];
    activeTouch = {
        card,
        index,
        startX: touch.clientX,
        startY: touch.clientY,
        lastX: touch.clientX,
        lastY: touch.clientY,
        dragging: false
    };
    card.setAttribute('data-touch-active', 'true');
}

function handleTouchMove(e) {
    if (!activeTouch || e.touches.length !== 1) return;
    e.preventDefault();

    const touch = e.touches[0];
    activeTouch.lastX = touch.clientX;
    activeTouch.lastY = touch.clientY;
    const distance = Math.hypot(
        touch.clientX - activeTouch.startX,
        touch.clientY - activeTouch.startY
    );

    if (!activeTouch.dragging && distance >= TOUCH_DRAG_THRESHOLD) {
        beginTouchDrag(touch);
    }

    if (activeTouch.dragging) {
        moveTouchClone(touch);
        highlightTouchDropZone(findDropZoneAt(touch.clientX, touch.clientY));
    }
}

function beginTouchDrag(touch) {
    if (!activeTouch || activeTouch.dragging) return;

    const { card, index } = activeTouch;
    activeTouch.dragging = true;
    dragClone = card.cloneNode(true);
    dragClone.removeAttribute('id');
    dragClone.removeAttribute('draggable');
    dragClone.removeAttribute('data-touch-active');
    dragClone.classList.remove('selected', 'dragging');
    dragClone.classList.add('touch-drag-clone');
    dragClone.setAttribute('aria-hidden', 'true');
    dragClone.style.width = `${card.getBoundingClientRect().width}px`;
    document.body.appendChild(dragClone);
    card.classList.add('dragging');
    moveTouchClone(touch);

    logAction('👆 Touch drag started', `${state.samples[index].name} (touch)`);
}

function moveTouchClone(touch) {
    if (!dragClone) return;
    const rect = dragClone.getBoundingClientRect();
    dragClone.style.left = `${touch.clientX - rect.width / 2}px`;
    dragClone.style.top = `${touch.clientY - rect.height / 2}px`;
}

function findDropZoneAt(x, y) {
    const directHit = document.elementFromPoint(x, y);
    const directZone = directHit && directHit.closest('.drop-area');
    if (directZone) return directZone;

    return Array.from(document.querySelectorAll('.drop-area')).find(zone => {
        const rect = zone.getBoundingClientRect();
        return x >= rect.left - TOUCH_DROP_TOLERANCE &&
            x <= rect.right + TOUCH_DROP_TOLERANCE &&
            y >= rect.top - TOUCH_DROP_TOLERANCE &&
            y <= rect.bottom + TOUCH_DROP_TOLERANCE;
    }) || null;
}

function highlightTouchDropZone(activeZone) {
    document.querySelectorAll('.drop-area').forEach(zone => {
        zone.classList.toggle('drag-over', zone === activeZone);
    });
}

function handleTouchEnd(e) {
    if (!activeTouch) return;
    e.preventDefault();

    const gesture = activeTouch;
    const touch = e.changedTouches[0];
    const dropZone = gesture.dragging ? findDropZoneAt(touch.clientX, touch.clientY) : null;
    const endElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const endedOnCard = Boolean(endElement && gesture.card.contains(endElement));
    suppressClickUntil = Date.now() + 500;
    cleanupTouchDrag();

    if (gesture.dragging && dropZone && Date.now() - lastTouchDropAt >= TOUCH_DEBOUNCE_MS) {
        lastTouchDropAt = Date.now();
        placeSample(gesture.index, dropZone.dataset.category, 'touch');
    } else if (!gesture.dragging && endedOnCard) {
        handleTapSelect(gesture.card, gesture.index);
    } else if (gesture.dragging) {
        logAction('Touch drag cancelled', `${state.samples[gesture.index].name} returned to samples`);
    }
}

function handleTouchCancel(e) {
    if (!activeTouch) return;
    e.preventDefault();
    const index = activeTouch.index;
    cleanupTouchDrag();
    suppressClickUntil = Date.now() + 500;
    logAction('Touch drag cancelled', `${state.samples[index].name} returned to samples`);
}

function cleanupTouchDrag() {
    if (dragClone && dragClone.isConnected) dragClone.remove();
    dragClone = null;
    if (activeTouch && activeTouch.card) {
        activeTouch.card.classList.remove('dragging');
        activeTouch.card.removeAttribute('data-touch-active');
    }
    highlightTouchDropZone(null);
    activeTouch = null;
}

// ===== TAP-TO-SELECT AND PLACE =====
function handleTapSelect(card, index) {
    // If a card is already selected
    if (state.selectedCard !== null) {
        // Deselect if same card
        if (state.selectedCard === index) {
            card.classList.remove('selected');
            state.selectedCard = null;
            logAction('❌ Card deselected', state.samples[index].name);
            return;
        }
        
        // Otherwise, deselect previous
        document.querySelectorAll('.sample-card').forEach(c => c.classList.remove('selected'));
    }
    
    // Select this card
    state.selectedCard = index;
    card.classList.add('selected');
    logAction('✅ Card selected', `${state.samples[index].name} (tap to place in category)`);
}

// ===== DROP ZONE SETUP =====
function setupEventListeners() {
    window.addEventListener('blur', cleanupTouchDrag);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cleanupTouchDrag();
    });

    // Drop zones for drag-and-drop
    document.querySelectorAll('.drop-area').forEach(zone => {
        // Mouse drag-and-drop
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            zone.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const index = parseInt(e.dataTransfer.getData('text/plain'));
            const category = zone.dataset.category;
            placeSample(index, category, 'mouse');
        });
        
        // Touch/click for tap-to-place
        zone.addEventListener('click', (e) => {
            if (state.selectedCard !== null && !e.target.closest('.sample-card')) {
                const category = zone.dataset.category;
                placeSample(state.selectedCard, category, 'tap');
                
                // Deselect
                document.querySelectorAll('.sample-card').forEach(c => c.classList.remove('selected'));
                state.selectedCard = null;
            }
        });
    });
    
    // Control buttons
    document.getElementById('checkBtn').addEventListener('click', checkAnswers);
    document.getElementById('resetBtn').addEventListener('click', resetActivity);
    document.getElementById('newSetBtn').addEventListener('click', () => {
        state.currentSeed = Date.now();
        initializeSamples();
        logAction('🔄 Samples reshuffled', `Same 10 evidence samples; seed: ${state.currentSeed}`);
    });
    document.getElementById('toggleAnalyticsBtn').addEventListener('click', toggleAnalytics);
    document.getElementById('clearAnalytics').addEventListener('click', clearAnalytics);
    
    // Title toggle
    document.getElementById('toggleTitle').addEventListener('click', toggleTitle);
    
    // Read aloud
    document.getElementById('readAloudBtn').addEventListener('click', toggleReadAloud);
    
    // CSV download
    document.getElementById('downloadCSV').addEventListener('click', downloadCSV);
    
    // Feedback tooltip close
    document.getElementById('closeFeedback').addEventListener('click', closeFeedback);
    
    // Close tooltip when clicking outside
    document.getElementById('feedbackTooltip').addEventListener('click', (e) => {
        if (e.target.id === 'feedbackTooltip') {
            closeFeedback();
        }
    });
}

// ===== PLACE SAMPLE =====
function placeSample(index, category, method) {
    const sample = state.samples[index];
    
    // Store placement
    state.placements[index] = category;
    
    // Move card to drop zone
    const card = document.querySelector(`.sample-card[data-index="${index}"]`);
    if (card) card.remove();
    
    const dropZone = document.querySelector(`.drop-area[data-category="${category}"]`);
    const newCard = document.createElement('div');
    newCard.className = 'sample-card';
    populateSampleCard(newCard, sample);
    newCard.dataset.index = index;
    newCard.style.cursor = 'default';
    
    dropZone.appendChild(newCard);
    
    logAction('📥 Sample placed', `${sample.name} → ${category} (${method})`);
    
    // Show immediate feedback tooltip
    showFeedbackTooltip(sample, category);
}

// ===== FEEDBACK TOOLTIP =====
function showFeedbackTooltip(sample, placedCategory) {
    const tooltip = document.getElementById('feedbackTooltip');
    const content = document.getElementById('feedbackContent');
    
    const isCorrect = sample.category === placedCategory;
    
    let html = `<h4>${isCorrect ? '✅ Correct!' : '❌ Not quite...'}</h4>`;
    html += `<p><strong>${sample.name}</strong></p>`;
    
    if (isCorrect) {
        html += `<p>${sample.feedback}</p>`;
    } else {
        html += `<p>This is actually a <strong>${sample.category}</strong>, not a ${placedCategory}.</p>`;
        html += `<p><em>Hint:</em> ${sample.feedback}</p>`;
    }
    
    content.innerHTML = html;
    tooltip.style.display = 'block';
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (tooltip.style.display === 'block') {
            closeFeedback();
        }
    }, 8000);
}

function closeFeedback() {
    document.getElementById('feedbackTooltip').style.display = 'none';
}

// ===== CHECK ANSWERS =====
function checkAnswers() {
    if (Object.keys(state.placements).length === 0) {
        alert('Please place at least one sample before checking answers.');
        return;
    }
    
    let correct = 0;
    let total = state.samples.length;
    
    // Clear previous results
    state.results = [];
    
    state.samples.forEach((sample, index) => {
        const placed = state.placements[index];
        const isCorrect = placed === sample.category;
        
        if (placed) {
            if (isCorrect) correct++;
            
            // Visual feedback on cards
            const card = document.querySelector(`.drop-area[data-category="${placed}"] .sample-card[data-index="${index}"]`);
            if (card) {
                card.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
            
            // Log result
            const timestamp = new Date().toLocaleTimeString();
            state.results.push({
                sample: sample.name,
                userAnswer: placed,
                correctAnswer: sample.category,
                result: isCorrect ? 'Correct' : 'Incorrect',
                timestamp
            });
            
            logAction(
                isCorrect ? '✅ Correct answer' : '❌ Incorrect answer',
                `${sample.name}: placed in ${placed}, correct: ${sample.category}`
            );
        }
    });
    
    // Update results table
    updateResultsTable();
    
    // Show results panel
    const resultsPanel = document.getElementById('resultsPanel');
    const placed = Object.keys(state.placements).length;
    const percentage = Math.round((correct / placed) * 100);
    
    let scoreClass = 'poor';
    if (percentage === 100) scoreClass = 'perfect';
    else if (percentage >= 70) scoreClass = 'partial';
    
    resultsPanel.innerHTML = `
        <h3>Results</h3>
        <div class="score-display ${scoreClass}">
            ${correct} / ${placed} correct (${percentage}%)
        </div>
        <p>${placed < total ? `You placed ${placed} out of ${total} samples.` : 'All samples sorted!'}</p>
    `;
    resultsPanel.style.display = 'block';
    
    logAction('📊 Answers checked', `Score: ${correct}/${placed} (${percentage}%)`);
}

// ===== UPDATE RESULTS TABLE =====
function updateResultsTable() {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    state.results.forEach(result => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${result.sample}</td>
            <td>${result.userAnswer}</td>
            <td>${result.correctAnswer}</td>
            <td class="${result.result === 'Correct' ? 'result-correct' : 'result-incorrect'}">${result.result}</td>
            <td>${result.timestamp}</td>
        `;
    });
}

// ===== CSV DOWNLOAD =====
function downloadCSV() {
    if (state.results.length === 0) {
        alert('No results to download. Please check your answers first.');
        return;
    }
    
    // Create CSV content
    let csv = 'Sample,Your Answer,Correct Answer,Result,Timestamp\n';
    
    state.results.forEach(result => {
        csv += `"${result.sample}","${result.userAnswer}","${result.correctAnswer}","${result.result}","${result.timestamp}"\n`;
    });
    
    // Create download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `element-compound-mixture-results-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logAction('📥 CSV downloaded', `${state.results.length} results exported`);
}

// ===== RESET ACTIVITY =====
function resetActivity() {
    cleanupTouchDrag();
    // Clear placements but keep same samples
    state.placements = {};
    state.selectedCard = null;
    
    renderSamples();
    clearDropZones();
    hideResults();
    
    logAction('🔄 Activity reset', 'All placements cleared');
}

function clearDropZones() {
    document.querySelectorAll('.drop-area').forEach(zone => {
        zone.innerHTML = '';
    });
}

function hideResults() {
    document.getElementById('resultsPanel').style.display = 'none';
}

// ===== ANALYTICS =====
function logAction(action, details) {
    state.actionCount++;
    
    const elapsed = ((Date.now() - state.startTime) / 1000).toFixed(1);
    const timestamp = `t=${elapsed}s`;
    
    const log = document.getElementById('analyticsLog');
    const entry = document.createElement('div');
    entry.className = 'log-entry action';
    
    if (action.includes('✅')) entry.classList.add('correct');
    if (action.includes('❌')) entry.classList.add('incorrect');
    
    entry.innerHTML = `
        <span class="log-timestamp">[${timestamp}]</span>
        <strong>${action}</strong>: ${details}
    `;
    
    log.insertBefore(entry, log.firstChild);
    
    // Update counter
    document.getElementById('interactionCount').textContent = `Actions: ${state.actionCount}`;

    // SLS xAPI integration is deliberately gated. Direct file previews remain offline.
    const parameters = new URLSearchParams(window.location.search);
    if (parameters.get('endpoint') && parameters.get('auth') && window.storeState) {
        try {
            window.storeState({
                activity: 'matter-a1-element-compound-mixture',
                action,
                details,
                relativeTime: timestamp,
                actionCount: state.actionCount,
                selectedSample: state.selectedCard === null ? null : state.samples[state.selectedCard]?.name,
                placements: state.placements,
                results: state.results
            });
        } catch (error) {
            // Never let analytics interrupt a learner's activity.
        }
    }
}

function toggleAnalytics() {
    const panel = document.getElementById('analyticsPanel');
    const btn = document.getElementById('toggleAnalyticsBtn');
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        btn.textContent = 'Hide Analytics';
    } else {
        panel.style.display = 'none';
        btn.textContent = 'Show Analytics';
    }
    
    logAction('📊 Analytics toggled', panel.style.display === 'none' ? 'hidden' : 'shown');
}

function clearAnalytics() {
    document.getElementById('analyticsLog').innerHTML = '';
    state.actionCount = 0;
    state.startTime = Date.now();
    document.getElementById('interactionCount').textContent = 'Actions: 0';
    
    logAction('🗑️ Analytics cleared', 'Log reset');
}

// ===== TITLE TOGGLE =====
function toggleTitle() {
    const titleBar = document.getElementById('titleBar');
    const btn = document.getElementById('toggleTitle');
    
    titleBar.classList.toggle('collapsed');
    btn.textContent = titleBar.classList.contains('collapsed') ? '▼' : '▲';
    btn.setAttribute('aria-label', titleBar.classList.contains('collapsed') ? 'Show title' : 'Hide title');
}

// ===== READ ALOUD =====
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

function toggleReadAloud() {
    const text = document.getElementById('instructionText').textContent;
    const controls = document.getElementById('speechControls');
    
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        controls.style.display = 'none';
        return;
    }
    
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = parseFloat(document.getElementById('rateControl').value);
    currentUtterance.pitch = parseFloat(document.getElementById('pitchControl').value);
    
    // Update on slider change
    document.getElementById('rateControl').addEventListener('input', (e) => {
        if (currentUtterance) currentUtterance.rate = parseFloat(e.target.value);
    });
    
    document.getElementById('pitchControl').addEventListener('input', (e) => {
        if (currentUtterance) currentUtterance.pitch = parseFloat(e.target.value);
    });
    
    currentUtterance.onend = () => {
        controls.style.display = 'none';
    };
    
    speechSynthesis.speak(currentUtterance);
    controls.style.display = 'flex';
    
    logAction('🔊 Read aloud', 'Instructions read');
}

// ===== RESPONSIVE HEIGHT ADJUSTMENT =====
// Adjust container height based on context (iframe vs new tab)
function adjustHeight() {
    const container = document.getElementById('mainContainer');
    
    if (window.self !== window.top) {
        // In iframe
        container.style.minHeight = '450px';
    } else {
        // In new tab
        container.style.minHeight = '90vh';
    }
}

window.addEventListener('load', adjustHeight);
window.addEventListener('resize', adjustHeight);

// When embedded in the tender page, grow the frame to the full activity height.
// This prevents a second vertical scrollbar inside the Activity A1 panel.
function announceEmbeddedHeight() {
    if (window.parent === window) return;
    const height = Math.ceil(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    window.parent.postMessage({ type: 'matter-a1-height', height }, '*');
}

window.addEventListener('load', announceEmbeddedHeight);
window.addEventListener('resize', announceEmbeddedHeight);
if (window.ResizeObserver) {
    new ResizeObserver(announceEmbeddedHeight).observe(document.documentElement);
}
