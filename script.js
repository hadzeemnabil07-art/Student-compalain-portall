// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loaded - Portal Ready");
    
    // ===== VARIABLES =====
    let submissionCount = 0;
    let studentData = [];
    
    // ===== FUNCTION 1: Validate Form =====
    function validateForm() {
        let name = document.getElementById('studentName').value.trim();
        let regNo = document.getElementById('regNo').value.trim();
        let desc = document.getElementById('complaintDesc').value.trim();
        let isValid = true;
        
        // Reset validation classes
        let nameField = document.getElementById('studentName');
        let regField = document.getElementById('regNo');
        let descField = document.getElementById('complaintDesc');
        
        nameField.classList.remove('is-invalid', 'is-valid');
        regField.classList.remove('is-invalid', 'is-valid');
        descField.classList.remove('is-invalid', 'is-valid');
        
        // Check name
        if (name === "") {
            nameField.classList.add('is-invalid');
            isValid = false;
        } else if (name.length < 3) {
            nameField.classList.add('is-invalid');
            isValid = false;
        } else {
            nameField.classList.add('is-valid');
        }
        
        // Check registration
        if (regNo === "") {
            regField.classList.add('is-invalid');
            isValid = false;
        } else {
            regField.classList.add('is-valid');
        }
        
        // Check description
        if (desc === "") {
            descField.classList.add('is-invalid');
            isValid = false;
        } else {
            descField.classList.add('is-valid');
        }
        
        return isValid;
    }
    
    // ===== FUNCTION 2: Update Counter =====
    function updateCounterDisplay() {
        let displayDiv = document.getElementById('counterDisplay');
        
        if (studentData.length === 0) {
            displayDiv.innerHTML = "No submissions yet.<br>Be the first to submit!";
        } else {
            let message = "<strong>Total Complaints:</strong> " + submissionCount + "<br><br>";
            message += "<strong>Recent submissions:</strong><br>";
            
            for (let i = studentData.length - 1; i >= 0 && i >= studentData.length - 3; i--) {
                message += "📌 " + studentData[i].name + "<br>";
            }
            displayDiv.innerHTML = message;
        }
    }
    
    // ===== FUNCTION 3: Final Submit =====
    function finalSubmit() {
        let name = document.getElementById('studentName').value.trim();
        let regNo = document.getElementById('regNo').value.trim();
        let desc = document.getElementById('complaintDesc').value.trim();
        
        // Check for duplicate
        let duplicateFound = false;
        for (let i = 0; i < studentData.length; i++) {
            if (studentData[i].regNo === regNo) {
                duplicateFound = true;
                break;
            }
        }
        
        if (duplicateFound) {
            alert("⚠️ Warning: This registration number has already submitted a complaint.");
        } else {
            studentData.push({ 
                name: name, 
                regNo: regNo, 
                desc: desc, 
                date: new Date() 
            });
            submissionCount++;
            updateCounterDisplay();
            
            alert("✅ Complaint submitted successfully! Thank you.");
            
            // Reset form
            document.getElementById('studentName').value = '';
            document.getElementById('regNo').value = '';
            document.getElementById('complaintDesc').value = '';
            
            // Remove validation classes
            document.getElementById('studentName').classList.remove('is-valid', 'is-invalid');
            document.getElementById('regNo').classList.remove('is-valid', 'is-invalid');
            document.getElementById('complaintDesc').classList.remove('is-valid', 'is-invalid');
        }
        
        // Close modal
        let modalEl = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
        if (modalEl) modalEl.hide();
    }
    
    // ===== EVENT HANDLING =====
    
    // Submit button
    let submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateForm()) {
                let confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
                confirmModal.show();
            } else {
                alert("❌ Please fill all required fields correctly.\n- Name (min 3 characters)\n- Registration Number\n- Complaint Description");
            }
        });
    }
    
    // Final confirm button
    let finalBtn = document.getElementById('finalConfirmBtn');
    if (finalBtn) {
        finalBtn.addEventListener('click', function() {
            finalSubmit();
        });
    }
    
    // Refresh stats button
    let refreshBtn = document.getElementById('refreshStatsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            updateCounterDisplay();
            alert("System Status: " + submissionCount + " total complaint(s) in system.");
        });
    }
    
    // Initialize Tooltips
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    for (let i = 0; i < tooltipTriggerList.length; i++) {
        new bootstrap.Tooltip(tooltipTriggerList[i]);
    }
    
    // Initialize Popovers
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    for (let i = 0; i < popoverTriggerList.length; i++) {
        new bootstrap.Popover(popoverTriggerList[i]);
    }
    
    updateCounterDisplay();
});