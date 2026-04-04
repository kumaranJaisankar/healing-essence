// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');

if (menuToggle && navMenu && navOverlay) {
    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);
}

// Sticky Header Logic
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// FAQ Accordion Interactivity
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        // Toggle active class
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Form Handling with Google Forms API
const forms = ['hero-form', 'final-form'];

forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // REPLACE THESE WITH YOUR ACTUAL GOOGLE FORM DETAILS
        const FORM_ID = "1FAIpQLSe9FP0-zV1XohWe1cNhPSwRD4IV8RkhA0EUhO0W4Q-etlKpUA"; 
        const formURL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

        // Map your form field names to Google Form entry IDs
        const fieldMapping = {
            name: "entry.275015023",
            phone: "entry.168975585",
            email: "entry.844216893",
            city: "entry.1076646279"
        };

        const formData = new FormData();
        const phoneInput = form.querySelector('[name="phone"]');
        const phoneVal = phoneInput.value.replace('+91 ', '').trim();
        const phoneRegex = /^[6-9]\d{9}$/; // Basic Indian mobile number check

        if (!phoneRegex.test(phoneVal)) {
            alert("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
            phoneInput.focus();
            return;
        }

        Object.keys(fieldMapping).forEach(field => {
            // Find input by name within the current form
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                formData.append(fieldMapping[field], input.value);
            }
        });

        // Visual feedback
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>Submitting...</span>";

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        })
        .then(() => {
            form.reset();
            submitBtn.innerHTML = "<span>Success! Sent</span>";
            submitBtn.style.backgroundColor = "#10b981";
            
            // Show Success Modal
            const modal = document.getElementById('success-modal');
            if (modal) {
                modal.classList.add('active');
            }

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.backgroundColor = "";
            }, 3000);
        })
        .catch((error) => {
            console.error("Error!", error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = "<span>Error. Try Again</span>";
            submitBtn.style.backgroundColor = "#ef4444";
        });
    });
});

// Modal Close Logic
const successModal = document.getElementById('success-modal');
const modalCloseBtn = document.querySelector('.modal-close');

if (successModal && modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    // Close on click outside content
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
}

// Phone Number Pre-fill Logic
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('focus', () => {
        if (input.value === '+91 ') {
            // Keep it
        } else if (input.value === '') {
            input.value = '+91 ';
        }
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
