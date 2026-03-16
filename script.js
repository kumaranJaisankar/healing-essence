document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic',
        });
    }

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.classList.add('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            const isDark = htmlElement.classList.contains('dark');
            
            // Update Icons
            sunIcon.classList.toggle('hidden', isDark);
            moonIcon.classList.toggle('hidden', !isDark);
            
            // Save Preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // --- Success State Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const formContainer = document.getElementById('registration-form-container');
    const successContainer = document.getElementById('success-container');
    
    if (urlParams.get('status') === 'success') {
        // Hide Form, Show Success Card
        if (formContainer) formContainer.style.display = 'none';
        if (successContainer) {
            successContainer.classList.remove('hidden');
            successContainer.classList.add('flex'); // Because it's a flex-col container
            
            // Re-trigger AOS on the success container if needed
            successContainer.setAttribute('data-aos', 'zoom-in');
            if (typeof AOS !== 'undefined') AOS.refresh();
        }
    }

    // --- Razorpay Integration Logic ---
    const paymentForm = document.getElementById('payment-form');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate Razorpay options for a static site
            // In a real app, 'order_id' would come from the backend.
            var options = {
                "key": "rzp_test_mockkey123456", // Enter the Key ID generated from the Dashboard
                "amount": "9900", // Amount is in currency subunits. Default currency is INR. Hence, 9900 means ₹99.
                "currency": "INR",
                "name": "Healing Essence",
                "description": "Virtual Retreat Registration",
                "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=150&q=80",
                "handler": function (response){
                    // Redirect to success page on successful payment
                    console.log("Payment successful ID: " + response.razorpay_payment_id);
                    
                    // Create base URL without query parameters
                    const url = new URL(window.location.href);
                    url.searchParams.set('status', 'success');
                    
                    window.location.href = url.toString();
                },
                "prefill": {
                    "name": paymentForm.querySelector('input[type="text"]').value,
                    "email": paymentForm.querySelector('input[type="email"]').value,
                    "contact": paymentForm.querySelector('input[type="tel"]').value
                },
                "theme": {
                    "color": "#8B5CF6" // Primary purple color
                }
            };
            
            try {
                var rzp1 = new Razorpay(options);
                rzp1.on('payment.failed', function (response){
                    alert("Payment Failed. Reason: " + response.error.description);
                });
                rzp1.open();
            } catch (err) {
                console.error("Razorpay script not loaded or initialization failed.", err);
                alert("Payment gateway error. Please try again later.");
            }
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            const isDark = document.documentElement.classList.contains('dark');
            if (window.scrollY > 20) {
                navbar.classList.add('backdrop-blur-md');
                navbar.style.backgroundColor = isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.4)';
            } else {
                navbar.classList.remove('backdrop-blur-md');
                navbar.style.backgroundColor = 'transparent';
            }
        });
    }

    // --- Bio Expansion Logic ---
    const bioToggle = document.getElementById('bio-toggle');
    const bioWrapper = document.getElementById('facilitator-bio');
    if (bioToggle && bioWrapper) {
        bioToggle.addEventListener('click', () => {
            bioWrapper.classList.toggle('expanded');
            const isExpanded = bioWrapper.classList.contains('expanded');
            bioToggle.querySelector('span:first-child').textContent = isExpanded ? 'Read Less' : 'Read Full Story';
            bioToggle.querySelector('.material-symbols-outlined').style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }

    // --- Certificate Modal Logic ---
    const certificateBtn = document.getElementById('view-certificate');
    const modal = document.getElementById('certificate-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBg = document.getElementById('close-modal-bg');
    const modalContent = document.getElementById('modal-content');

    if (certificateBtn && modal) {
        certificateBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modalContent.classList.replace('scale-95', 'scale-100');
                modalContent.classList.replace('opacity-0', 'opacity-100');
            }, 10);
        });

        const closeModal = () => {
            modalContent.classList.replace('scale-100', 'scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        };

        closeModalBtn.addEventListener('click', closeModal);
        modalBg.addEventListener('click', closeModal);
    }

    // --- Video Testimonial Modal Logic ---
    const videoTriggers = document.querySelectorAll('.video-card-trigger');
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('modal-video-player');
    const closeVideoBtn = document.getElementById('close-video-modal-btn');
    const videoModalBg = document.getElementById('close-video-modal-bg');
    const videoModalContent = document.getElementById('video-modal-content');

    if (videoTriggers.length > 0 && videoModal && videoPlayer) {
        videoTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const videoSrc = trigger.getAttribute('data-video-src');
                videoPlayer.src = videoSrc;
                videoModal.classList.remove('hidden');
                
                setTimeout(() => {
                    videoModalContent.classList.replace('scale-95', 'scale-100');
                    videoModalContent.classList.replace('opacity-0', 'opacity-100');
                    videoPlayer.play();
                }, 10);
            });
        });

        const closeVideoModal = () => {
            videoPlayer.pause();
            videoModalContent.classList.replace('scale-100', 'scale-95');
            videoModalContent.classList.replace('opacity-100', 'opacity-0');
            setTimeout(() => {
                videoModal.classList.add('hidden');
                videoPlayer.src = ""; 
            }, 300);
        };

        closeVideoBtn.addEventListener('click', closeVideoModal);
        videoModalBg.addEventListener('click', closeVideoModal);
    }

    // --- Registration Form Validation ---
    const regForm = document.getElementById('registration-form');
    const regName = document.getElementById('reg-name');
    const regEmail = document.getElementById('reg-email');
    const regPhone = document.getElementById('reg-phone');
    const regSubmit = document.getElementById('reg-submit');

    if (regName && regEmail && regPhone && regSubmit) {
        const validateForm = () => {
            const isNameValid = regName.value.trim().length > 0;
            const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.value);
            const isPhoneValid = regPhone.value.trim().length >= 10;

            if (isNameValid && isEmailValid && isPhoneValid) {
                regSubmit.disabled = false;
            } else {
                regSubmit.disabled = true;
            }
        };

        [regName, regEmail, regPhone].forEach(input => {
            input.addEventListener('input', validateForm);
        });
    }
});
