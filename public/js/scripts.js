document.addEventListener('DOMContentLoaded', function () {
    const flashDiv = document.querySelector('#flash-div');

    if (flashDiv) {
        // Initially show it
        flashDiv.style.display = "block";

        setInterval(() => {
            // Toggle visibility
            if (flashDiv.style.display === "none") {
                flashDiv.style.display = "block";
            } else {
                flashDiv.style.display = "none";
            }
        }, 30000); // Toggle every 30 seconds.
    }
});
