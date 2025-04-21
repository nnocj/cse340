// these are to ensure that the buttons in the accounts are enable when the document changes in content
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#update-account-general-info-form")
      form.addEventListener("change", function () {
        const updateBtn = document.querySelector("button")
        updateBtn.removeAttribute("disabled")
      }) 
})

  //if the password region is keyed into then the update button will be unlocked.
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#edit-account-password-form");
    const passwordInput = form.querySelector("#account_password");
    const updateBtn = form.querySelector("button[type='submit']");
  
    function toggleButtonState() {
      updateBtn.disabled = passwordInput.value.trim() === "";
    }
 
    toggleButtonState();

    passwordInput.addEventListener("input", toggleButtonState);
  });