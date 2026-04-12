document.addEventListener('DOMContentLoaded', function() {
    console.log("Portal Loaded - All Bootstrap Components Active");

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
        toast.style.cssText = `position:fixed; bottom:20px; right:20px; background:${type === 'success' ? '#2e7d32' : '#1976d2'}; color:white; padding:12px 24px; border-radius:40px; z-index:9999; font-weight:500; box-shadow:0 4px 12px rgba(0,0,0,0.2);`;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Login Validation
    function validateAndShowWarnings() {
        const name = loginName.value.trim();
        const studentId = loginStudentId.value.trim();
        const email = loginEmail.value.trim();
        
        loginName.classList.remove('is-invalid', 'is-valid');
        loginStudentId.classList.remove('is-invalid', 'is-valid');
        loginEmail.classList.remove('is-invalid', 'is-valid');
        
        let isValid = true;
        let errors = [];
        
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
        
        // Initialize Bootstrap components after login
        initBootstrapComponents();
    }

    // Initialize all Bootstrap JS components
    function initBootstrapComponents() {
        // Initialize all tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // Initialize popover
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl, { trigger: 'click' });
        });
        
        // Initialize carousel
        const carouselElement = document.querySelector('#campusCarousel');
        if (carouselElement) {
            new bootstrap.Carousel(carouselElement, { interval: 4000, wrap: true });
        }
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

    // Login form submit - PREVENT PAGE REFRESH
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (validateAndShowWarnings()) {
                const name = loginName.value.trim();
                const studentId = loginStudentId.value.trim();
                const email = loginEmail.value.trim();
                performLogin(name, studentId, email);
            }
            return false;
        });
    }

    // Real-time validation
    if (loginName) {
        loginName.addEventListener('input', function() {
            if (this.value.trim().length >= 3) { this.classList.add('is-valid'); this.classList.remove('is-invalid'); }
            else if (this.value.trim().length > 0) { this.classList.add('is-invalid'); this.classList.remove('is-valid'); }
        });
    }
    
    if (loginStudentId) {
        loginStudentId.addEventListener('input', function() {
            if (this.value.trim().length >= 5) { this.classList.add('is-valid'); this.classList.remove('is-invalid'); }
            else if (this.value.trim().length > 0) { this.classList.add('is-invalid'); this.classList.remove('is-valid'); }
        });
    }
    
    if (loginEmail) {
        loginEmail.addEventListener('input', function() {
            if (validateEmail(this.value.trim())) { this.classList.add('is-valid'); this.classList.remove('is-invalid'); }
            else if (this.value.trim().length > 0) { this.classList.add('is-invalid'); this.classList.remove('is-valid'); }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.clear();
            localStorage.removeItem('pbp_student_name');
            localStorage.removeItem('pbp_student_id');
            localStorage.removeItem('pbp_student_email');
            if (loginName) loginName.value = '';
            if (loginStudentId) loginStudentId.value = '';
            if (loginEmail) loginEmail.value = '';
            if (loginName) loginName.classList.remove('is-valid', 'is-invalid');
            if (loginStudentId) loginStudentId.classList.remove('is-valid', 'is-invalid');
            if (loginEmail) loginEmail.classList.remove('is-valid', 'is-invalid');
            if (rememberCheck) rememberCheck.checked = false;
            hideWarning(loginWarningAlert);
            if (loginOverlay) loginOverlay.style.display = 'flex';
            if (portalContent) portalContent.style.display = 'none';
            showToast("🔒 Logged
