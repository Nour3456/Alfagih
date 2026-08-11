// ══ Date of Birth picker ══
flatpickr("#inputDOB", { dateFormat: "d/m/Y" });

// ══ Password toggle ══
function setupPasswordToggle(buttonId, inputId, iconId) {
    const button = document.getElementById(buttonId);
    const input  = document.getElementById(inputId);
    const icon   = document.getElementById(iconId);

    if (button && input && icon) {
        button.addEventListener('click', function () {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('bi-eye-slash');
            icon.classList.toggle('bi-eye');
        });
    }
}

setupPasswordToggle('togglePassword1', 'passwordInput', 'eyeIcon1');
setupPasswordToggle('togglePassword2', 'ConfirmedPass', 'eyeIcon2');

