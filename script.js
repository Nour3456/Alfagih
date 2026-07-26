
$(document).ready(function() {
    $('.btn-watch-video').on('click', function(e) {
        e.preventDefault(); 
        
        $('body').addClass('modal-open-fixed');
        $('#customVideoModal').fadeIn(300);    

        $('#popupVideo')[0].play(); 
    });

    function closeModal() {
        $('#customVideoModal').fadeOut(300); 
        $('#popupVideo')[0].pause();         
        $('#popupVideo')[0].currentTime = 0;  
        $('body').removeClass('modal-open-fixed'); 
    }
    $('.custom-modal-close').on('click', closeModal);
    $('#customVideoModal').on('click', function(e) {
        if ($(e.target).hasClass('custom-modal-wrapper') || $(e.target).hasClass('custom-modal-overlay')) {
            closeModal(); 
        }
    });

    $(document).on('keydown', function(e) {

        if (e.key === "Escape") {
            closeModal(); 
        }
    });

});


// ── Hamburger menu for inline header (index.html) ─────────────
document.addEventListener("DOMContentLoaded", function () {
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
});
