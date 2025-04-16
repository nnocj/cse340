document.addEventListener('DOMContentLoaded', function () {
    const flashDiv = document.querySelector('#flash-div');

    if (flashDiv) {
        // Initially show it
        flashDiv.style.display = "block";

        setInterval(() => {
            // Toggle visibility
            if (flashDiv.style.display === "none") {
                //flashDiv.style.display = "block";
            } else {
                flashDiv.style.display = "none";
            }
        }, 30000); // Toggle every 30 seconds.
    }
});

// Show or hide password
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('change', function () {
  if (this.checked) {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
});