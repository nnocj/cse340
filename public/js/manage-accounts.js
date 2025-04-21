'use strict';

// I have learned that the document should be loaded before the script runs
//document.addEventListener("DOMContentLoaded", function () {})
    

function buildAccountsList(data) {
        let accountDisplay = document.querySelector("#acountsDisplay");

        let tableData = `<thead>
                            <tr>
                                <th>Full name</th>  <td>Email</td>  <td>Role</td>  <td>Update</td>  <td>Delete</td>
                            </tr>
                        </thead>
                        <tbody>`;

        data.forEach(function(account) {
            tableData += `<tr>
                            <td>${account.account_firstname} ${account.account_lastname}</td> <td>${account.account_email}</td><  <td>${account.account_type}</td>     <td><a href="/inv/authorizedEditAccount/${account.account_id}" title="Click to update">Update</a></td>    <td><a href="/inv/authorizedDeleteAccount/${account.account_id}</a></td>
                          </tr>`;
                        
        });
        tableData += `</tbody>`
        accountDisplay.innerHTML = tableData;


    }
