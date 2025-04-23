document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#user-table-container");
  
    try {
      const response = (await fetch("/account/api/getAllUserAccountsToAdmin"));
      if (!response.ok) throw new Error("Failed to fetch user accounts");
  
      const accounts = await response.json(); // ✅ convert to usable data
      const tableHTML = await buildManageAllUserAccountsTable(accounts);
      container.innerHTML = tableHTML;

      //activating Edit/Delete buttons
    addAccountActionListeners();
    } catch (err) {
      console.error("Error loading accounts:", err);
      container.innerHTML = "<p>Could not load user accounts.</p>";
    }
  });

  async function handleEditAccount(account_id, account_firstname, account_lastname, account_email, account_type) {
    try {
      const response = await fetch(`/account/api/editUserAccountByAdmin/${account_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ account_firstname, account_lastname, account_email, account_type })
      });
  
      if (!response.ok) throw new Error("Failed to edit user account");
  
      const updatedAccounts = await response.json();
      const container = document.querySelector("#user-table-container");
      container.innerHTML = await buildManageAllUserAccountsTable(updatedAccounts);
      addAccountActionListeners();
    } catch (err) {
      console.error("Error editing account:", err);
    }
  }
  

// set up sunction to Update or edit using an API
function addAccountActionListeners() {
  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", event => {
      const account_id = button.dataset.id;
      const row = button.closest("tr");

      // Get current row data
      const firstname = row.children[0].textContent;
      const lastname = row.children[1].textContent;
      const email = row.children[2].textContent;
      const role = row.children[3].textContent;

      // Fill modal form
      document.querySelector("#edit-id").value = account_id;
      document.querySelector("#edit-firstname").value = firstname;
      document.querySelector("#edit-lastname").value = lastname;
      document.querySelector("#edit-email").value = email;
      document.querySelector("#edit-role").value = role;

      // Show modal
      document.querySelector("#edit-modal").style.display = "flex";
    });
  });

 

    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", () => {
        const account_id = button.dataset.id;
        
        const confirmDelete = confirm("Are you sure you want to delete this account?");
        
        if (confirmDelete) {
          handleDeleteAccount(account_id);
        }
      });
    
  });
}


// set up function to delete using an API  
async function handleDeleteAccount(account_id) {
  try {
    const response = await fetch(`/account/api/deleteUserAccountByAdmin/${account_id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Failed to delete user account");

    const updatedAccounts = await response.json();
    const container = document.querySelector("#user-table-container");
    container.innerHTML = await buildManageAllUserAccountsTable(updatedAccounts);
    addAccountActionListeners(); // rebind buttons
  } catch (err) {
    console.error("Error deleting account:", err);
  }
}


document.querySelector("#edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const account_id = document.querySelector("#edit-id").value;
  const account_firstname = document.querySelector("#edit-firstname").value;
  const account_lastname = document.querySelector("#edit-lastname").value;
  const account_email = document.querySelector("#edit-email").value;
  const account_type = document.querySelector("#edit-role").value;

  await handleEditAccount(account_id, account_firstname, account_lastname, account_email, account_type);

  document.querySelector("#edit-modal").style.display = "none";
});

  
  async function buildManageAllUserAccountsTable(accounts) {
    let rows = accounts.map(account => `
      <tr data-id="${account.account_id}">
        <td>${account.account_firstname}</td>
        <td>${account.account_lastname}</td>
        <td>${account.account_email}</td>
        <td>${account.account_type}</td>
        <td><button class="edit-btn" data-id="${account.account_id}">Edit</button></td>
        <td><button class="delete-btn" data-id="${account.account_id}">Delete</button></td>
      </tr>
    `).join("");
  
    return `
      <table id="accounts-table">
        <thead>
          <tr>
            <td>First Name</td>
            <td>Last Name</td>
            <td>Email</td>
            <td>Role</td>
            <td>🔄</td>
            <td>✖</td>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }
  

  document.querySelector("#close-modal").addEventListener("click", () => {
    document.querySelector("#edit-modal").style.display = "none";
  });
  