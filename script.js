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

function openDoctorModal(card) {

    const name      = card.dataset.name;
    const specialty = card.dataset.specialty;
    const gender    = card.dataset.gender;
    const exp       = card.dataset.experience;
    const patients  = card.dataset.patients;
    const rating    = parseInt(card.dataset.rating);
    const about     = card.dataset.about;
    const services  = card.dataset.services.split(',');
    const location  = card.dataset.location;
    const img       = card.dataset.img;
    document.getElementById('modal-name').textContent       = name;
    document.getElementById('modal-specialty').textContent  = specialty;
    document.getElementById('modal-spec-badge').textContent = specialty;
    document.getElementById('modal-exp').textContent        = exp;
    document.getElementById('modal-gender').textContent     = gender;
    document.getElementById('modal-about').textContent      = about;
    document.getElementById('modal-location').textContent   = location;
    document.getElementById('modal-doctor-img').src         = img;

    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<i class="bi ${i <= rating ? 'bi-star-fill' : 'bi-star'}" style="color: ${i <= rating ? '#f59e0b' : '#d1d5db'};"></i>`;
    }
    document.getElementById('modal-stars').innerHTML = starsHTML;

    let servicesHTML = '';
    services.forEach(service => {
        servicesHTML += `
            <div class="modal-service-item">
                <i class="bi bi-check-circle-fill"></i>
                <span>${service.trim()}</span>
            </div>
        `;
    });
    document.getElementById('modal-services').innerHTML = servicesHTML;

    document.getElementById('doctor-modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeDoctorModal(event) {
    if (event && event.target !== document.getElementById('doctor-modal-overlay')) return;

    document.getElementById('doctor-modal-overlay').classList.remove('active');
    document.body.style.overflow = ''; 
}

function goToAppointments() {
    window.location.href = 'appointments.html';
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.getElementById('doctor-modal-overlay').classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.getElementById('doctor-search').addEventListener('input', function () {
    const searchText = this.value.toLowerCase();

    document.querySelectorAll('.doctor-card').forEach(function (card) {
        const name = card.querySelector('h5').textContent.toLowerCase();

        if (name.includes(searchText)) {
            card.closest('.col-12').style.display = '';
        } else {
            card.closest('.col-12').style.display = 'none';
        }
    });
});