* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;document.addEventListener('DOMContentLoaded', function() {
    console.log("Portal Loaded - Login Verification Working");

    // DOM Elements
    const loginOverlay = document.getElementById('loginOverlay');
    const portalContent = document.getElementById('portalContent');
    const loginForm = document.getElementById('loginForm');
    const loginName = document.getElementById('loginName');
    const loginStudentId = document.getElementById('loginStudentId');
    const loginEmail = document.getElementById('loginEmail');
    const rememberCheck = document.getElementById('rememberCheck');
    const loginWarningAlert = document.getElementById('loginWarningAlert');
    const loginWarningMessage = document.getElementById('loginWarningMessage');

    // Helper Functions
    function showWarning(alertEl, msgEl, message) {
        if (msgEl) msgEl.innerHTML = message;
        if (alertEl) {
            alertEl.style.display = 'block';
            setTimeout(() => { if (alertEl) alertEl.style.display = 'none'; }, 5000);
        }
    }

    function hideWarning(alertEl) { 
        if (alertEl) alertEl.style.display = 'none'; 
    }

    function validateEmail(email) { 
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
    }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed; bottom:20px; right:20px; background:${type === 'success' ? '#2e7d32' : '#1976d2'}; color:white; padding:12px 24px; border-radius:40px; z-index:9999; font-weight:500; box-shadow:0 4px 12px rgba(0,0,0,0.2);`;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // MAIN LOGIN VALIDATION FUNCTION - FIXED
    function validateAndShowWarnings() {
        const name = loginName.value.trim();
        const studentId = loginStudentId.value.trim();
        const email = loginEmail.value.trim();
        
        // Reset all validation classes
        loginName.classList.remove('is-invalid', 'is-valid');
        loginStudentId.classList.remove('is-invalid', 'is-valid');
        loginEmail.classList.remove('is-invalid', 'is-valid');
        
        let isValid = true;
        let errors = [];
        
        // Check Name (min 3 characters)
        if (name === "") {
            loginName.classList.add('is-invalid');
            isValid = false;
            errors.push("• Full Name is required");
        } else if (name.length < 3) {
            loginName.classList.add('is-invalid');
            isValid = false;
            errors.push("• Name must be at least 3 characters (you entered " + name.length + ")");
        } else {
            loginName.classList.add('is-valid');
        }
        
        // Check Student ID (min 5 characters)
        if (studentId === "") {
            loginStudentId.classList.add('is-invalid');
            isValid = false;
            errors.push("• Student ID is required");
        } else if (studentId.length < 5) {
            loginStudentId.classList.add('is-invalid');
            isValid = false;
            errors.push("• Student ID must be at least 5 characters (you entered " + studentId.length + ")");
        } else {
            loginStudentId.classList.add('is-valid');
        }
        
        // Check Email
        if (email === "") {
            loginEmail.classList.add('is-invalid');
            isValid = false;
            errors.push("• Email address is required");
        } else if (!validateEmail(email)) {
            loginEmail.classList.add('is-invalid');
            isValid = false;
            errors.push("• Invalid email format. Example: name@domain.com");
        } else {
            loginEmail.classList.add('is-valid');
        }
        
        // Show warning if NOT valid
        if (!isValid) {
            let warningHtml = '<ul style="margin:0; padding-left:20px; margin-bottom:0;">';
            errors.forEach(err => { warningHtml += '<li>' + err + '</li>'; });
            warningHtml += '</ul>';
            showWarning(loginWarningAlert, loginWarningMessage, warningHtml);
            return false;
        } else {
            hideWarning(loginWarningAlert);
            return true;
        }
    }

    // Perform Login - Success function
    function performLogin(name, studentId, email) {
        // Store in session
        sessionStorage.setItem('studentName', name);
        sessionStorage.setItem('studentId', studentId);
        sessionStorage.setItem('studentEmail', email);
        
        // Store in localStorage if remember me is checked
        if (rememberCheck.checked) {
            localStorage.setItem('pbp_student_name', name);
            localStorage.setItem('pbp_student_id', studentId);
            localStorage.setItem('pbp_student_email', email);
        }
        
        // Update dashboard displays
        const studentNameDisplay = document.getElementById('studentNameDisplay');
        const studentIdDisplay = document.getElementById('studentIdDisplay');
        const studentEmailDisplay = document.getElementById('studentEmailDisplay');
        const reqName = document.getElementById('reqName');
        const reqStudentId = document.getElementById('reqStudentId');
        const reqEmail = document.getElementById('reqEmail');
        
        if (studentNameDisplay) studentNameDisplay.innerText = name;
        if (studentIdDisplay) studentIdDisplay.innerText = studentId;
        if (studentEmailDisplay) studentEmailDisplay.innerText = email;
        if (reqName) reqName.value = name;
        if (reqStudentId) reqStudentId.value = studentId;
        if (reqEmail) reqEmail.value = email;
        
        // Hide login overlay and show portal
        loginOverlay.style.display = 'none';
        portalContent.style.display = 'block';
        
        // Set current year in footer
        const yearDisplay = document.getElementById('yearDisplay');
        if (yearDisplay) yearDisplay.innerText = new Date().getFullYear();
        
        showToast("✅ Welcome, " + name + "!", "success");
        
        // Initialize Bootstrap components after login
        setTimeout(() => initBootstrapComponents(), 100);
    }

    // Initialize all Bootstrap JS components
    function initBootstrapComponents() {
        try {
            // Initialize all tooltips
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.forEach(function(tooltipTriggerEl) {
                new bootstrap.Tooltip(tooltipTriggerEl);
            });
            
            // Initialize popover
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.forEach(function(popoverTriggerEl) {
                new bootstrap.Popover(popoverTriggerEl, { trigger: 'click' });
            });
            
            // Initialize carousel
            const carouselElement = document.querySelector('#campusCarousel');
            if (carouselElement) {
                new bootstrap.Carousel(carouselElement, { interval: 4000, wrap: true });
            }
            console.log("Bootstrap components initialized");
        } catch(e) {
            console.log("Bootstrap init error:", e);
        }
    }

    // Check saved login credentials
    function checkSavedLogin() {
        const savedName = localStorage.getItem('pbp_student_name');
        const savedId = localStorage.getItem('pbp_student_id');
        const savedEmail = localStorage.getItem('pbp_student_email');
        if (savedName && savedId && savedEmail) {
            loginName.value = savedName;
            loginStudentId.value = savedId;
            loginEmail.value = savedEmail;
            rememberCheck.checked = true;
            // Auto login with saved credentials
            performLogin(savedName, savedId, savedEmail);
        }
    }

    // LOGIN FORM SUBMIT HANDLER - PREVENTS PAGE REFRESH
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Login form submitted - validating...");
            
            // Run validation
            const isValid = validateAndShowWarnings();
            
            if (isValid) {
                const name = loginName.value.trim();
                const studentId = loginStudentId.value.trim();
                const email = loginEmail.value.trim();
                console.log("Validation passed, logging in...");
                performLogin(name, studentId, email);
            } else {
                console.log("Validation failed");
            }
            
            return false;
        });
    }

    // Real-time validation feedback
    if (loginName) {
        loginName.addEventListener('input', function() {
            const val = this.value.trim();
            if (val.length >= 3) { 
                this.classList.add('is-valid'); 
                this.classList.remove('is-invalid');
                hideWarning(loginWarningAlert);
            } else if (val.length > 0) { 
                this.classList.add('is-invalid'); 
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-valid', 'is-invalid');
            }
        });
    }
    
    if (loginStudentId) {
        loginStudentId.addEventListener('input', function() {
            const val = this.value.trim();
            if (val.length >= 5) { 
                this.classList.add('is-valid'); 
                this.classList.remove('is-invalid');
                hideWarning(loginWarningAlert);
            } else if (val.length > 0) { 
                this.classList.add('is-invalid'); 
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-valid', 'is-invalid');
            }
        });
    }
    
    if (loginEmail) {
        loginEmail.addEventListener('input', function() {
            const val = this.value.trim();
            if (validateEmail(val)) { 
                this.classList.add('is-valid'); 
                this.classList.remove('is-invalid');
                hideWarning(loginWarningAlert);
            } else if (val.length > 0) { 
                this.classList.add('is-invalid'); 
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-valid', 'is-invalid');
            }
        });
    }

    // LOGOUT BUTTON
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.clear();
            localStorage.removeItem('pbp_student_name');
            localStorage.removeItem('pbp_student_id');
            localStorage.removeItem('pbp_student_email');
            
            // Clear form fields
            if (loginName) loginName.value = '';
            if (loginStudentId) loginStudentId.value = '';
            if (loginEmail) loginEmail.value = '';
            
            // Remove validation classes
            if (loginName) loginName.classList.remove('is-valid', 'is-invalid');
            if (loginStudentId) loginStudentId.classList.remove('is-valid', 'is-invalid');
            if (loginEmail) loginEmail.classList.remove('is-valid', 'is-invalid');
            
            if (rememberCheck) rememberCheck.checked = false;
            hideWarning(loginWarningAlert);
            
            // Show login screen
            if (loginOverlay) loginOverlay.style.display = 'flex';
            if (portalContent) portalContent.style.display = 'none';
            
            showToast("🔒 Logged out successfully", "info");
        });
    }

    // NAVIGATION BETWEEN VIEWS
    const navLinks = document.querySelectorAll('.nav-link');
    const views = ['dashboard', 'timetable', 'results', 'services', 'campus'];
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            
            // Hide all views
            views.forEach(v => {
                const el = document.getElementById(v + 'View');
                if (el) el.style.display = 'none';
            });
            
            // Show selected view
            const activeView = document.getElementById(view + 'View');
            if (activeView) activeView.style.display = 'block';
            
            // Update active class on nav links
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // TIMETABLE DATA
    const timetableData = [
        { time: "8:00 - 10:00", mon: "Database Fundamentals", tue: "---", wed: "Network & Data Comm", thu: "---", fri: "Discrete Mathematics" },
        { time: "10:15 - 12:15", mon: "Web Design Tech", tue: "DB Lab", wed: "---", thu: "Network Lab", fri: "---" },
        { time: "2:00 - 4:00", mon: "---", tue: "Web Lab", wed: "Cybersecurity", thu: "Discrete Math", fri: "Co-Curriculum" },
        { time: "4:15 - 6:15", mon: "Islamic Studies", tue: "---", wed: "---", thu: "Web Tutorial", fri: "Counseling" }
    ];
    
    function renderTimetable() {
        const tbody = document.getElementById('timetableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        timetableData.forEach(row => {
            tbody.innerHTML += `<tr>
                <td class="fw-semibold">${row.time}</td>
                <td>${row.mon !== "---" ? `<div class="class-session">${row.mon}</div>` : "—"}</td>
                <td>${row.tue !== "---" ? `<div class="class-session">${row.tue}</div>` : "—"}</td>
                <td>${row.wed !== "---" ? `<div class="class-session">${row.wed}</div>` : "—"}</td>
                <td>${row.thu !== "---" ? `<div class="class-session">${row.thu}</div>` : "—"}</td>
                <td>${row.fri !== "---" ? `<div class="class-session">${row.fri}</div>` : "—"}</td>
            </tr>`;
        });
    }

    // RESULTS DATA
    const resultsData = [
        { code: "DFC20313", name: "Cybersecurity Fundamentals", credits: 3, grade: "A", status: "Passed" },
        { code: "DFK20013", name: "Web Design Technology", credits: 3, grade: "A-", status: "Passed" },
        { code: "DFC20293", name: "Network and Data Communication", credits: 4, grade: "B+", status: "Passed" },
        { code: "DFC20283", name: "Database Fundamentals", credits: 3, grade: "B", status: "Passed" },
        { code: "DBM20153", name: "Discrete Mathematics", credits: 3, grade: "A", status: "Passed" }
    ];
    
    function calculateGPA() {
        let total = 0, credits = 0;
        const gp = { "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0 };
        resultsData.forEach(c => { 
            total += (gp[c.grade] || 2.0) * c.credits; 
            credits += c.credits; 
        });
        return credits > 0 ? (total / credits).toFixed(2) : 0;
    }
    
    function renderResults() {
        const tbody = document.getElementById('resultsBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        resultsData.forEach(c => {
            let gradeClass = '';
            if (c.grade === 'A' || c.grade === 'A-') gradeClass = 'grade-A';
            else if (c.grade === 'B+' || c.grade === 'B') gradeClass = 'grade-B';
            tbody.innerHTML += `<tr>
                <td>${c.code}</td>
                <td>${c.name}</td>
                <td>${c.credits}</td>
                <td class="${gradeClass}">${c.grade}</td>
                <td><span class="badge bg-success">${c.status}</span></td>
            </tr>`;
        });
        const semesterGpa = document.getElementById('semesterGpa');
        const cumulativeCgpa = document.getElementById('cumulativeCgpa');
        if (semesterGpa) semesterGpa.innerText = calculateGPA();
        if (cumulativeCgpa) cumulativeCgpa.innerText = "3.67";
    }

    // SERVICE REQUESTS SYSTEM
    let serviceRequests = [];
    let reqCounter = 0;
    const serviceWarningAlert = document.getElementById('serviceWarningAlert');
    const serviceWarningMessage = document.getElementById('serviceWarningMessage');
    
    function updateRequestsList() {
        const container = document.getElementById('recentRequestsList');
        const countSpan = document.getElementById('requestCount');
        if (!container) return;
        
        if (serviceRequests.length === 0) {
            container.innerHTML = '<p class="text-muted">No requests yet.</p>';
            if (countSpan) countSpan.innerText = '0';
            return;
        }
        
        if (countSpan) countSpan.innerText = serviceRequests.length;
        let html = '<div class="list-group list-group-flush">';
        serviceRequests.slice().reverse().forEach(req => {
            html += `<div class="list-group-item px-0">
                <strong><i class="fas fa-ticket-alt me-1"></i> ${req.type}</strong>
                <br><small class="text-muted">${req.desc.substring(0, 60)}${req.desc.length > 60 ? '...' : ''}</small>
                <br><small class="text-muted"><i class="fas fa-calendar-alt"></i> ${req.date}</small>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }
    
    function addRequest(name, id, email, type, desc) {
        const newRequest = { 
            id: ++reqCounter, 
            name, 
            studentId: id, 
            email, 
            type, 
            desc, 
            date: new Date().toLocaleString() 
        };
        serviceRequests.push(newRequest);
        updateRequestsList();
        showToast("✅ Request submitted! Confirmation sent to " + email, "success");
        
        // Clear description field
        const reqDesc = document.getElementById('reqDesc');
        if (reqDesc) {
            reqDesc.value = '';
            reqDesc.classList.remove('is-valid', 'is-invalid');
        }
    }
    
    // Submit Service Request Button
    const submitServiceBtn = document.getElementById('submitServiceBtn');
    if (submitServiceBtn) {
        submitServiceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const desc = document.getElementById('reqDesc').value.trim();
            const descField = document.getElementById('reqDesc');
            
            if (descField) descField.classList.remove('is-invalid', 'is-valid');
            if (serviceWarningAlert) serviceWarningAlert.style.display = 'none';
            
            if (desc === "") {
                if (descField) descField.classList.add('is-invalid');
                if (serviceWarningAlert && serviceWarningMessage) {
                    showWarning(serviceWarningAlert, serviceWarningMessage, "Please enter a description.");
                }
                return;
            } else if (desc.length < 10) {
                if (descField) descField.classList.add('is-invalid');
                if (serviceWarningAlert && serviceWarningMessage) {
                    showWarning(serviceWarningAlert, serviceWarningMessage, "Description must be at least 10 characters.");
                }
                return;
            } else {
                if (descField) descField.classList.add('is-valid');
            }
            
            const name = document.getElementById('reqName').value;
            const studentId = document.getElementById('reqStudentId').value;
            const email = document.getElementById('reqEmail').value;
            const type = document.getElementById('reqType').value;
            
            // Store pending request and show modal
            window.pendingRequest = { name, studentId, email, type, desc };
            const modal = new bootstrap.Modal(document.getElementById('serviceConfirmModal'));
            modal.show();
        });
    }
    
    // Final Confirm Button in Modal
    const finalServiceConfirm = document.getElementById('finalServiceConfirm');
    if (finalServiceConfirm) {
        finalServiceConfirm.addEventListener('click', function() {
            if (window.pendingRequest) {
                addRequest(
                    window.pendingRequest.name, 
                    window.pendingRequest.studentId, 
                    window.pendingRequest.email, 
                    window.pendingRequest.type, 
                    window.pendingRequest.desc
                );
                window.pendingRequest = null;
            }
            const modal = bootstrap.Modal.getInstance(document.getElementById('serviceConfirmModal'));
            if (modal) modal.hide();
        });
    }
    
    // Refresh Service Stats Button
    const refreshServiceStats = document.getElementById('refreshServiceStats');
    if (refreshServiceStats) {
        refreshServiceStats.addEventListener('click', function() { 
            updateRequestsList(); 
            showToast("📊 Request list refreshed", "info"); 
        });
    }

    // Set class count
    const classCount = document.getElementById('classCount');
    if (classCount) classCount.innerText = "8";
    
    const cgpaDisplay = document.getElementById('cgpaDisplay');
    if (cgpaDisplay) cgpaDisplay.innerText = "3.67";

    // Initialize all data and check saved login
    renderTimetable();
    renderResults();
    checkSavedLogin();
    
    console.log("Ready - Login with any valid name (3+ chars), student ID (5+ chars), valid email format");
});
}

body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9eef3 100%);
    min-height: 100vh;
}

.login-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a2540 0%, #1a5a7a 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.login-card {
    background: white;
    border-radius: 32px;
    padding: 2rem;
    width: 90%;
    max-width: 450px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.3);
}

.btn-login {
    background: #0f3b5c;
    border: none;
    color: white;
    padding: 12px;
    border-radius: 40px;
    font-weight: 700;
    width: 100%;
    transition: 0.3s;
}

/* Carousel Custom Styles */
.carousel-slide-content {
    transition: transform 0.3s ease;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-size: 60% 60%;
    opacity: 0.9;
}

.carousel-control-prev-icon:hover,
.carousel-control-next-icon:hover {
    opacity: 1;
    transform: scale(1.1);
}

.carousel-indicators button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0 5px;
    background-color: #0f3b5c;
    opacity: 0.5;
}

.carousel-indicators button.active {
    opacity: 1;
    background-color: #ffd966;
    transform: scale(1.2);
}

.carousel-item {
    transition: transform 0.6s ease-in-out;
}

/* Responsive carousel adjustments */
@media (max-width: 768px) {
    .carousel-slide-content {
        min-height: 350px !important;
    }
    
    .carousel-slide-content h3 {
        font-size: 1.2rem;
    }
    
    .carousel-slide-content p {
        font-size: 0.85rem;
    }
    
    .carousel-slide-content .fa-4x {
        font-size: 2.5rem;
    }
}
.btn-login:hover { background: #1e5a7d; transform: translateY(-2px); }

.required:after { content: " *"; color: #dc3545; }

.navbar { background: #0a2540 !important; padding: 1rem 0; }
.navbar-brand { font-weight: 700; font-size: 1.5rem; background: linear-gradient(135deg, #FFF, #b8e1fc); -webkit-background-clip: text; background-clip: text; color: transparent !important; }
.nav-link { color: #eef4ff !important; cursor: pointer; }
.nav-link:hover, .nav-link.active { color: #ffd966 !important; }

.welcome-card { background: linear-gradient(135deg, #0f3b5c, #1a5a7a); color: white; border-radius: 20px; }
.stats-chip { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 40px; }

.info-card { background: white; border-radius: 24px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: 0.2s; cursor: pointer; }
.info-card:hover { transform: translateY(-5px); }

.glass-card { background: white; border-radius: 28px; box-shadow: 0 12px 30px rgba(0,0,0,0.08); padding: 1.5rem; }

.btn-primary-glow { background: #0f3b5c; color: white; padding: 12px; border-radius: 40px; font-weight: 600; width: 100%; border: none; }
.btn-primary-glow:hover { background: #1e5a7d; }

.timetable-table th { background: #0f3b5c; color: white; padding: 12px; text-align: center; }
.timetable-table td { text-align: center; padding: 12px; }
.class-session { background: #e8f4f8; border-radius: 12px; padding: 6px 10px; }

.results-table th { background: #f1f5f9; padding: 12px; }
.grade-A { color: #2e7d32; font-weight: bold; }
.grade-B { color: #1976d2; font-weight: bold; }

.form-control, .form-select { border-radius: 16px; border: 1px solid #e2e8f0; padding: 10px 16px; }
.form-control:focus, .form-select:focus { box-shadow: 0 0 0 3px rgba(31,100,130,0.2); border-color: #2c7da0; }

.invalid-feedback { display: none; font-size: 0.75rem; color: #dc3545; margin-top: 5px; }
.form-control.is-invalid ~ .invalid-feedback { display: block; }
.form-control.is-invalid { border-color: #dc3545; }
.form-control.is-valid { border-color: #198754; }

.footer-custom { background: #0a2540; color: #bfd9f0; padding: 2rem 0; margin-top: 3rem; border-radius: 30px 30px 0 0; }

@media (max-width: 768px) {
    .timetable-table td, .timetable-table th { font-size: 0.7rem; padding: 6px; }
    .login-card { padding: 1.5rem; }
}

.alert-danger { animation: shake 0.4s ease; }
@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }

.carousel-item img {
    border-radius: 20px;
}
