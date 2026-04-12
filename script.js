document.addEventListener('DOMContentLoaded', function() {
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
