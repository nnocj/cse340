document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#user-table-container");
  
    try {
      const response = (await fetch("/account/api/getAllUserAccounts"));
      if (!response.ok) throw new Error("Failed to fetch user accounts");
  
      const accounts = await response.json(); // ✅ convert to usable data
      const tableHTML = await buildManageAllUserAccountsTable(accounts);
      container.innerHTML = tableHTML;
    } catch (err) {
      console.error("Error loading accounts:", err);
      container.innerHTML = "<p>Could not load user accounts.</p>";
    }
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
  