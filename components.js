const headerHTML = `
<header class="custom-header">
    <div class="top-bar d-flex justify-content-end align-items-center">
        <a href="#" class="top-link">Join Us</a>
        <a href="tel:0114560000" class="top-link">0114560000</a>
        <a href="mailto:info@dmf.med.sa" class="top-link">info@dmf.med.sa</a>
    </div>

    <div class="header-main-content d-flex align-items-center justify-content-between">
        <div class="logo-section d-flex align-items-center">
            <img src="./media/origin icon.png" alt="Hospital Logo" class="logo-img">
            <div class="brand-titles">
                <h1 class="brand-ar">مستشفى الدكتور محمد الفقيه</h1>
                <h2 class="brand-en">DR. MOHAMMAD ALFAGIH HOSPITAL</h2>
            </div>
        </div>

        <button class="hamburger-btn d-md-none" id="hamburgerBtn" aria-label="Toggle menu">
            <i class="bi bi-list"></i>
        </button>

        <nav class="custom-navbar">
            <div class="nav-links-wrapper" id="navLinksWrapper">
                <a class="nav-item" href="index.html">Home</a>
                <a class="nav-item" href="index.html#about">About</a>
                <a class="nav-item" href="appointments.html">Appointments</a>
                <a class="nav-item" href="#">Services</a>
                <a class="nav-item" href="#">News</a>
                <a class="nav-item" href="#">Media</a>
                <a class="nav-item" href="contact.html">Contact Us</a>

                <a class="nav-item search-icon-btn" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-search" viewBox="0 0 16 16">
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </a>

                <a class="nav-item lang-switch" href="#">العربية</a>
            </div>
        </nav>
    </div>
</header>
`;

const footerHTML = `
<footer class="custom-footer text-white text-md-start">
    <section class="container d-flex justify-content-between align-items-center py-4 footer-social-border">
        <div class="d-none d-md-block">
            <span class="social-text">Get connected with us on social networks:</span>
        </div>
        <div class="social-icons-wrapper d-flex gap-4">
            <a href="" class="text-white text-decoration-none"><i class="bi bi-instagram"></i></a>
            <a href="" class="text-white text-decoration-none"><i class="bi bi-linkedin"></i></a>
            <a href="" class="text-white text-decoration-none"><i class="bi bi-facebook"></i></a>
            <a href="" class="text-white text-decoration-none"><i class="bi bi-twitter-x"></i></a>
            <a href="" class="text-white text-decoration-none"><i class="bi bi-google"></i></a>
        </div>
    </section>

    <section class="py-5">
        <div class="container">
            <div class="row gy-4 justify-content-between">
                <div class="col-12 col-md-3 d-flex align-items-center justify-content-start">
                    <div class="footer-logo-wrapper">
                        <img src="./media/icon.png" alt="Dr. Mohammad Alfagih Hospital" class="footer-icon img-fluid">
                        <div class="hospital-name-ar">مستشفى الدكتور محمد الفقيه</div>
                        <div class="hospital-name-en">DR. MOHAMMAD ALFAGIH HOSPITAL</div>
                    </div>
                </div>
                <div class="col-6 col-md-2">
                    <h6 class="text-uppercase fw-bold mb-4 col-header">Services</h6>
                    <p class="mb-3"><a href="#!" class="text-white text-decoration-none footer-link">Appointments</a></p>
                    <p class="mb-3"><a href="#!" class="text-white text-decoration-none footer-link">Medications</a></p>
                </div>
                <div class="col-6 col-md-2">
                    <h6 class="text-uppercase fw-bold my-3">USEFUL LINKS</h6>
                    <p class="mb-3"><a href="#!" class="text-white text-decoration-none footer-link">About</a></p>
                    <p class="mb-3"><a href="#!" class="text-white text-decoration-none footer-link">Media</a></p>
                    <p class="mb-3"><a href="#!" class="text-white text-decoration-none footer-link">News</a></p>
                </div>
                <div class="col-12 col-md-3">
                    <h6 class="text-uppercase fw-bold mb-4 col-header">CONTACT</h6>
                    <p class="mb-3 footer-contact-info">0114560000</p>
                    <p class="mb-3 footer-contact-info">info@dmf.med.sa</p>
                </div>
            </div>
        </div>
    </section>

    <div class="container pb-5">
        <div class="copyright-glass-box d-flex flex-column flex-md-row justify-content-between align-items-center px-4 py-3 text-center text-md-start">
            <div class="mb-2 mb-md-0 copyright-text">Copyright © 2025 Alfagih. All rights reserved.</div>
            <div class="d-flex gap-3 privacy-links">
                <a href="#!" class="text-white text-decoration-none">Terms & Conditions</a>
                <a href="#!" class="text-white text-decoration-none">Privacy Policy</a>
            </div>
        </div>
    </div>
</footer>
`;

document.addEventListener("DOMContentLoaded", function () {

    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
        const currentPage = window.location.pathname.split("/").pop();
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach((item) => {
            item.classList.remove("active-home");
            const href = item.getAttribute("href");
            if ((currentPage === "" || currentPage === "index.html") && href === "index.html") {
                item.classList.add("active-home");
            } else if (href === currentPage) {
                item.classList.add("active-home");
            }
        });
        const hamburgerBtn = document.getElementById("hamburgerBtn");
        const navLinksWrapper = document.getElementById("navLinksWrapper");

        if (hamburgerBtn && navLinksWrapper) {
            hamburgerBtn.addEventListener("click", function () {
                const isOpen = navLinksWrapper.classList.toggle("open");
                hamburgerBtn.innerHTML = isOpen
                    ? '<i class="bi bi-x-lg"></i>'
                    : '<i class="bi bi-list"></i>';
            });
            navLinksWrapper.querySelectorAll(".nav-item").forEach(function (link) {
                link.addEventListener("click", function () {
                    navLinksWrapper.classList.remove("open");
                    hamburgerBtn.innerHTML = '<i class="bi bi-list"></i>';
                });
            });
        }
    }

    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    }

});
