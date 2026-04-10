document.addEventListener('DOMContentLoaded', function() {
    console.log("Portal Loaded - Warnings Working");

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

    function hideWarning(alertEl) { if (alertEl) alertEl.style.display = 'none'; }

    function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed; bottom:20px; right:20px; background:${type === 'success' ? '#2e7d32' : '#1976d2'}; color:white; padding:12px 24px; border-radius:40px; z-index:9999; font-weight:500;`;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // LOGIN VALIDATION WITH WARNINGS - THIS IS THE KEY PART
    function validateAndShowWarnings() {
        const name = loginName.value.trim();
        const studentId = loginStudentId.value.trim();
        const email = loginEmail.value.trim();
        
        // Reset classes
        loginName.classList.remove('is-invalid', 'is-valid');
        loginStudentId.classList.remove('is-invalid', 'is-valid');
        loginEmail.classList.remove('is-invalid', 'is-valid');
        
        let isValid = true;
        let errors = [];
        
        // Check Name
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
        
        // Check Student ID
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
            let warningHtml = '<ul style="margin:0; padding-left:20px;">';
            errors.forEach(err => { warningHtml += '<li>' + err + '</li>'; });
            warningHtml += '</ul>';
            showWarning(loginWarningAlert, loginWarningMessage, warningHtml);
        } else {
            hideWarning(loginWarningAlert);
        }
        
        return isValid;
    }

    // Perform Login
    function performLogin(name, studentId, email) {
        sessionStorage.setItem('studentName', name);
        sessionStorage.setItem('studentId', studentId);
        sessionStorage.setItem('studentEmail', email);
        
        if (rememberCheck.checked) {
            localStorage.setItem('pbp_student_name', name);
            localStorage.setItem('pbp_student_id', studentId);
            localStorage.setItem('pbp_student_email', email);
        }
        
        document.getElementById('studentNameDisplay').innerText = name;
        document.getElementById('studentIdDisplay').innerText = studentId;
        document.getElementById('studentEmailDisplay').innerText = email;
        
        document.getElementById('reqName').value = name;
        document.getElementById('reqStudentId').value = studentId;
        document.getElementById('reqEmail').value = email;
        
        loginOverlay.style.display = 'none';
        portalContent.style.display = 'block';
        showToast("✅ Welcome, " + name + "!", "success");
    }

    // Check saved login
    function checkSavedLogin() {
        const savedName = localStorage.getItem('pbp_student_name');
        const savedId = localStorage.getItem('pbp_student_id');
        const savedEmail = localStorage.getItem('pbp_student_email');
        if (savedName && savedId && savedEmail) {
            loginName.value = savedName;
            loginStudentId.value = savedId;
            loginEmail.value = savedEmail;
            performLogin(savedName, savedId, savedEmail);
        }
    }

    // Login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Login attempted - validating...");
            if (validateAndShowWarnings()) {
                const name = loginName.value.trim();
                const studentId = loginStudentId.value.trim();
                const email = loginEmail.value.trim();
                performLogin(name, studentId, email);
            } else {
                console.log("Validation failed - showing warnings");
            }
        });
    }

    // Real-time validation (optional - shows feedback as you type)
    loginName.addEventListener('input', function() {
        if (this.value.trim().length >= 3) {
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        } else if (this.value.trim().length > 0) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        }
    });
    
    loginStudentId.addEventListener('input', function() {
        if (this.value.trim().length >= 5) {
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        } else if (this.value.trim().length > 0) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        }
    });
    
    loginEmail.addEventListener('input', function() {
        if (validateEmail(this.value.trim())) {
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        } else if (this.value.trim().length > 0) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        }
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        sessionStorage.clear();
        localStorage.removeItem('pbp_student_name');
        localStorage.removeItem('pbp_student_id');
        localStorage.removeItem('pbp_student_email');
        loginName.value = '';
        loginStudentId.value = '';
        loginEmail.value = '';
        loginName.classList.remove('is-valid', 'is-invalid');
        loginStudentId.classList.remove('is-valid', 'is-invalid');
        loginEmail.classList.remove('is-valid', 'is-invalid');
        rememberCheck.checked = false;
        hideWarning(loginWarningAlert);
        loginOverlay.style.display = 'flex';
        portalContent.style.display = 'none';
        showToast("🔒 Logged out", "info");
    });

    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const views = ['dashboard', 'timetable', 'results', 'services'];
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            views.forEach(v => {
                const el = document.getElementById(v + 'View');
                if (el) el.style.display = v === view ? 'block' : 'none';
            });
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Timetable Data
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
            tbody.innerHTML += `<tr><td class="fw-semibold">${row.time}</td><td>${row.mon !== "---" ? `<div class="class-session">${row.mon}</div>` : "—"}</td><td>${row.tue !== "---" ? `<div class="class-session">${row.tue}</div>` : "—"}</td><td>${row.wed !== "---" ? `<div class="class-session">${row.wed}</div>` : "—"}</td><td>${row.thu !== "---" ? `<div class="class-session">${row.thu}</div>` : "—"}</td><td>${row.fri !== "---" ? `<div class="class-session">${row.fri}</div>` : "—"}</td></tr>`;
        });
    }

    // Results Data
    const resultsData = [
        { code: "DFC20313", name: "Cybersecurity Fundamentals", credits: 3, grade: "A", status: "Passed" },
        { code: "DFK20013", name: "Web Design Technology", credits: 3, grade: "A-", status: "Passed" },
        { code: "DFC20293", name: "Network and Data Communication", credits: 4, grade: "B+", status: "Passed" },
        { code: "DFC20283", name: "Database Fundamentals", credits: 3, grade: "B", status: "Passed" },
        { code: "DBM20153", name: "Discrete Mathematics", credits: 3, grade: "A", status: "Passed" }
    ];
    
    function calculateGPA() {
        let total = 0, credits = 0;
        const gp = { "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0 };
        resultsData.forEach(c => { total += (gp[c.grade] || 2.0) * c.credits; credits += c.credits; });
        return credits > 0 ? (total / credits).toFixed(2) : 0;
    }
    
    function renderResults() {
        const tbody = document.getElementById('resultsBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        resultsData.forEach(c => {
            tbody.innerHTML += `<tr><td>${c.code}</td><td>${c.name}</td><td>${c.credits}</td><td class="grade-${c.grade.charAt(0)}">${c.grade}</td><td><span class="badge bg-success">${c.status}</span></td></tr>`;
        });
        document.getElementById('semesterGpa').innerText = calculateGPA();
        document.getElementById('cumulativeCgpa').innerText = "3.67";
    }

    // Service Requests
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
        let html = '<ul class="list-unstyled">';
        serviceRequests.slice().reverse().forEach(req => {
            html += `<li class="mb-2 pb-2 border-bottom"><strong>${req.type}</strong><br><small>${req.name} (${req.studentId})</small><br><small class="text-muted">${req.desc.substring(0, 50)}...</small></li>`;
        });
        html += '</ul>';
        container.innerHTML = html;
    }
    
    function addRequest(name, id, email, type, desc) {
        serviceRequests.push({ id: ++reqCounter, name, studentId: id, email, type, desc, date: new Date().toLocaleString() });
        updateRequestsList();
        showToast("✅ Request submitted! Confirmation sent to " + email, "success");
    }
    
    document.getElementById('submitServiceBtn')?.addEventListener('click', function() {
        const desc = document.getElementById('reqDesc').value.trim();
        const descField = document.getElementById('reqDesc');
        descField.classList.remove('is-invalid', 'is-valid');
        
        if (desc === "") {
            descField.classList.add('is-invalid');
            if (serviceWarningAlert && serviceWarningMessage) {
                showWarning(serviceWarningAlert, serviceWarningMessage, "Please enter a description.");
            }
            return;
        } else if (desc.length < 10) {
            descField.classList.add('is-invalid');
            showWarning(serviceWarningAlert, serviceWarningMessage, "Description must be at least 10 characters.");
            return;
        } else {
            descField.classList.add('is-valid');
            hideWarning(serviceWarningAlert);
        }
        
        const name = document.getElementById('reqName').value;
        const studentId = document.getElementById('reqStudentId').value;
        const email = document.getElementById('reqEmail').value;
        const type = document.getElementById('reqType').value;
        
        window.pendingRequest = { name, studentId, email, type, desc };
        new bootstrap.Modal(document.getElementById('serviceConfirmModal')).show();
    });
    
    document.getElementById('finalServiceConfirm')?.addEventListener('click', function() {
        if (window.pendingRequest) {
            addRequest(window.pendingRequest.name, window.pendingRequest.studentId, window.pendingRequest.email, window.pendingRequest.type, window.pendingRequest.desc);
            document.getElementById('reqDesc').value = '';
            document.getElementById('reqDesc').classList.remove('is-valid', 'is-invalid');
            window.pendingRequest = null;
        }
        bootstrap.Modal.getInstance(document.getElementById('serviceConfirmModal'))?.hide();
    });
    
    document.getElementById('refreshServiceStats')?.addEventListener('click', function() { updateRequestsList(); showToast("📊 Refreshed", "info"); });

    // Initialize
    renderTimetable();
    renderResults();
    document.getElementById('classCount').innerText = timetableData.length * 2;
    checkSavedLogin();
    console.log("Ready - Warnings will appear for wrong input!");
});
