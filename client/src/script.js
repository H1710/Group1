function handleCancelButton(formElement) {
    var cancelButton = formElement.querySelector('button[name="submit"][value="cancel"]');
    if (cancelButton) {
        cancelButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log("Cancel button clicked");

            
            var inputFields = formElement.querySelectorAll('input[name]');
            inputFields.forEach(function(input) {
                input.value = ''; 
            });
        });
    }
}

function handleCreateButton(formElement) {
    var createButton = formElement.querySelector('button[name="submit"][value="create"]');
    if (createButton) {
        createButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log("Create Project button clicked");


            var inputFields = formElement.querySelectorAll('input[name]');
            var inputValues = {};
            inputFields.forEach(function(input) {
                inputValues[input.name] = input.value;
            });

            console.log("Input values:", inputValues);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var formElement = document.querySelector('#form-1');
    if (formElement) {
        handleCancelButton(formElement);
        handleCreateButton(formElement);
    }
});




// Sử dụng Fetch API để gửi yêu cầu GET đến API và hiển thị dữ liệu
fetch('http://localhost:3000/api/v1/project/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Dữ liệu từ API sẽ ở biến data
        const dataContainer = document.getElementById('data-container');
        data.map(element => {
            const exportdata = document.createElement('tr');
            exportdata.innerHTML = `
            <td class="border-l w-[40px] h-[15px] border-t text-center">
                <input type="checkbox" name="" id="checkbox-1" onclick="toggleDeleteIcon('checkbox-1')">
            </td>
            <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.project_number}</td>
            <td class="border-l border-b w-[550px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.name}</td>
            <td class="border-l border-b w-[200px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.status}</td>
            <td class="border-l border-b w-[350px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.customer}</td>
            <td class="border-l border-b w-[150px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.start_date}</td>
            <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">
                <button class="delete-button" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    </svg>
                </button>
            </td>
        `;
            dataContainer.appendChild(exportdata);
        });
    })
    .catch(error => {
        // Xử lý lỗi nếu có
        console.error('There was a problem with the fetch operation:', error);
    });



    function searchProject() {
        const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
        const select = document.getElementById('select');
        const selectedOption = select.options[select.selectedIndex].id;
        
        console.log(selectedOption + ': ' + searchInput)
    }

    function resetSearch() {
        // Clear the search results
        document.getElementById('search-input').value = '';
    }

        // update input
    function updateInput() {
        const selectElement = document.getElementById('select');
        const selectedValue = selectElement.value;

        const inputElement = document.getElementById('search-input');
        inputElement.placeholder = `Search by ${selectedValue.replace('_', ' ')}`;
    }


    //icon delete
    function toggleDeleteIcon(checkboxId) {
        const checkbox = document.getElementById(checkboxId);
        const deleteButton = checkbox.closest('td').querySelector('.delete-button');
    
        if (checkbox.checked) {
            deleteButton.style.display = 'block';
        } else {
            deleteButton.style.display = 'none';
        }
    }
    
    
    
    
    
    