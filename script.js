// Initialize Flatpickr for flight-style calendar (responsive)
const isMobile = window.innerWidth <= 768;
flatpickr("#inpDateRange", {
    mode: "range",
    showMonths: isMobile ? 1 : 2, // 1 month on phone, 2 on desktop
    altInput: true,
    altFormat: "d M Y",
    dateFormat: "Y-m-d",
    onChange: function() {
        generateLetters();
    }
});

function formatDate(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Student template handling
function addStudent() {
    const container = document.getElementById('students-container');
    const studentCount = container.querySelectorAll('.student-entry').length + 1;
    
    const div = document.createElement('div');
    div.className = 'student-entry';
    div.innerHTML = `
        <button class="remove-btn" onclick="this.parentElement.remove(); generateLetters();">X</button>
        <div class="form-group">
            <label>Student Name</label>
            <input type="text" class="inpName" placeholder="e.g. Kartik Chauhan">
        </div>
        <div class="form-group">
            <label>Roll No.</label>
            <input type="text" class="inpRoll" placeholder="e.g. A123">
            <div class="error rollError">Must be 1 letter + 3 numbers (e.g., A123).</div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label>SAP ID</label>
            <input type="text" class="inpSap" placeholder="e.g. 60001234567">
            <div class="error sapError">Must be exactly 11 digits.</div>
        </div>
    `;
    container.appendChild(div);
    generateLetters();
}

function generateLetters() {
    // Shared Details
    const dept = document.getElementById('inpDept').value;
    const company = document.getElementById('inpCompany').value;
    const dateRange = document.getElementById('inpDateRange').value;
    
    let start = "", end = "";
    if (dateRange.includes(" to ")) {
        const parts = dateRange.split(" to ");
        start = parts[0];
        end = parts[1];
    } else if (dateRange) {
        start = dateRange;
        end = dateRange;
    }

    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = ''; // Clear previous sheets
    const template = document.getElementById('sheet-template').content;

    // Students
    const studentEntries = document.querySelectorAll('.student-entry');
    let hasError = false;

    studentEntries.forEach((entry) => {
        const nameVal = entry.querySelector('.inpName').value;
        const rollVal = entry.querySelector('.inpRoll').value;
        const sapVal = entry.querySelector('.inpSap').value;

        // Validate Roll
        const rollRegex = /^[a-zA-Z]\d{3}$/;
        const rollErrorNode = entry.querySelector('.rollError');
        if (rollVal && !rollRegex.test(rollVal)) {
            rollErrorNode.style.display = 'block';
            hasError = true;
        } else {
            rollErrorNode.style.display = 'none';
        }

        // Validate SAP
        const sapRegex = /^\d{11}$/;
        const sapErrorNode = entry.querySelector('.sapError');
        if (sapVal && !sapRegex.test(sapVal)) {
            sapErrorNode.style.display = 'block';
            hasError = true;
        } else {
            sapErrorNode.style.display = 'none';
        }

        if (hasError) return;

        // Clone Template
        const clone = document.importNode(template, true);
        
        // Helper to update clone fields
        const updateField = (cloneNode, cssClass, value, defaultText) => {
            const el = cloneNode.querySelector(`.${cssClass}`);
            if (value && value.trim() !== "") {
                el.innerText = value;
                el.classList.remove('placeholder');
                el.classList.add('filled');
            } else {
                el.innerText = defaultText;
                el.classList.add('placeholder');
                el.classList.remove('filled');
            }
        };

        updateField(clone, 'outName', nameVal, '[Name of the student]');
        updateField(clone, 'outRoll', rollVal, '[Roll No.]');
        updateField(clone, 'outSap', sapVal, '[SAP ID]');
        updateField(clone, 'outDept', dept, '[Department]');
        updateField(clone, 'outCompany', company, '[Company Name]');
        updateField(clone, 'outStart', formatDate(start), '[Starting Date]');
        updateField(clone, 'outEnd', formatDate(end), '[Ending Date]');

        previewContainer.appendChild(clone);
    });
    
    // If empty or initial state (no students), just show blank template
    if (previewContainer.innerHTML === '') {
        const clone = document.importNode(template, true);
        previewContainer.appendChild(clone);
    }
}

// Initial render and event listeners
window.onload = () => {
    generateLetters();

    // Auto-update on shared fields changing
    document.getElementById('inpDept').addEventListener('change', generateLetters);
    document.getElementById('inpCompany').addEventListener('input', generateLetters);

    // Auto-update on student fields changing (using event delegation)
    document.getElementById('students-container').addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT') {
            generateLetters();
        }
    });
};
