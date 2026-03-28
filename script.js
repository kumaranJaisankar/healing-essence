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
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const city = document.getElementById('reg-city').value;
            
            // Add click animation effect
            const btn = document.getElementById('reg-submit');
            btn.classList.add('scale-95', 'opacity-80');
            btn.innerHTML = '<span>Processing...</span><span class="animate-spin material-symbols-outlined text-sm">progress_activity</span>';

            // Construct Razorpay URL with dynamic parameters
            // Format: https://pages.razorpay.com/pl_QfQlTWyBxzmJ7t/view?email=user@example.com&phone=9876543210&name=Kumaran%20J&city=hydrabad
            const baseUrl = "https://pages.razorpay.com/pl_QfQlTWyBxzmJ7t/view";
            const params = new URLSearchParams({
                email: email,
                phone: phone,
                name: name,
                city: city
            });
            
            const redirectUrl = `${baseUrl}?${params.toString()}`;
            
            // Redirect after a brief animation delay
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 600);
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
    const regCity = document.getElementById('reg-city');
    const regSubmit = document.getElementById('reg-submit');

    if (regName && regEmail && regPhone && regCity && regSubmit) {
        const validateForm = () => {
            const isNameValid = regName.value.trim().length > 0;
            const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.value);
            const isPhoneValid = regPhone.value.trim().length >= 10;
            const isCityValid = regCity.value.trim().length > 0;

            if (isNameValid && isEmailValid && isPhoneValid && isCityValid) {
                regSubmit.disabled = false;
            } else {
                regSubmit.disabled = true;
            }
        };

        [regName, regEmail, regPhone, regCity].forEach(input => {
            input.addEventListener('input', validateForm);
        });
    }

    // --- Floating CTA Scroll Visibility ---
    const floatingCTA = document.getElementById('floating-cta');
    if (floatingCTA) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            const scrollBottom = scrollTotal - scrollPos;

            // Show after 400px but hide if we are within 100px of the bottom
            if (scrollPos > 400 && scrollBottom > 100) {
                floatingCTA.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
            } else {
                floatingCTA.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
            }
        });
    }
});
