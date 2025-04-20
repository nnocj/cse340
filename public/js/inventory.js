'use strict';
// I have learned that the document should be loaded before the script runs
document.addEventListener("DOMContentLoaded", function () {
    let classificationList = document.querySelector("#classificationList");

    if (!classificationList) {
        console.error("Classification list dropdown not found.");
        return;
    }

    classificationList.addEventListener("change", function () {
        let classification_id = classificationList.value;
        console.log(`Classification ID: ${classification_id}`);

        let ClassIdUrl = `/inv/authorizedGetInventory/${classification_id}`;

        fetch(ClassIdUrl)
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(function(data) {
                console.log(data);
                buildInventoryList(data);
            })
            .catch(function(error){
                console.log("There was a big problem: ", error.message);
            });
    });

    function buildInventoryList(data) {
        let inventoryDisplay = document.querySelector("#inventoryDisplay");

        let tableData = `<thead>
                            <tr>
                                <th>Vehicle Name</th>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                        </thead>
                        <tbody>`;

        data.forEach(function(vehicle) {
            tableData += `<tr>
                            <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
                            <td><a href="/inv/authorizedEditInventory/${vehicle.inv_id}" title="Click to update">Modify</a></td>
                            <td><a href="/inv/authorizedDeleteInventory/${vehicle.inv_id}" title="Click to update">Delete</a></td>
                          </tr>`;
                        
        });

        tableData += `</tbody>`;
        inventoryDisplay.innerHTML = tableData;
    }
});
