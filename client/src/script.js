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


document.addEventListener('DOMContentLoaded', function() {
    var formElement = document.querySelector('#form-1');

    if (formElement) {
        handleCancelButton(formElement);
        handleCreateButton(formElement);
    }
});

function handleCreateButton(formElement) {
    var createButton = formElement.querySelector('button[name="submit"][value="create"]');
    if (createButton) {
        createButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log("Create Project button clicked");

            var inputFields = formElement.querySelectorAll('input[name], select[name]');
            var inputValues = {};
            inputFields.forEach(function(input) {
                inputValues[input.name] = input.value;
            });

            console.log("Input values:", inputValues);

            fetch('http://localhost:3000/api/v1/project/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputValues)
            })
            .then(response => response.json())
            .then(data => {
                // Xử lý dữ liệu trả về từ API nếu cần
                console.log('Created project:', data);
            })
            .catch(error => {
                console.error('Error creating project:', error); // validate lỗi
            });
        });
    }
}





document.addEventListener('DOMContentLoaded', function() {
    var groupSelect = document.getElementById('group-select');

    // Gọi API để tải danh sách nhóm
    fetch('http://localhost:3000/api/v1/project/create')
        .then(response => response.json())
        .then(data => {
            // Xử lý dữ liệu trả về và thêm các tùy chọn vào phần tử select
            data.forEach(group => {
                var option = document.createElement('option');
                option.classList.add('text-center');
                option.value = group.id; // Giá trị của tùy chọn
                option.textContent = group.id; // Nội dung của tùy chọn
                groupSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching groups:', error);
        });
});




<<<<<<< HEAD
=======
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
            if (element.status == 'NEW'){
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
            <button class="delete-button ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        </button>
        
            </td>
        `;
            }else{
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
            <button class="delete-button" style="display:none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        </button>
        
            </td>
        `;
            }
             
            dataContainer.appendChild(exportdata);
        });
    })
    .catch(error => {
        // Xử lý lỗi nếu có
        console.error('There was a problem with the fetch operation:', error);
    });
>>>>>>> ea27c76df216d1a749d21a4d8ecb84357e45e794





    
    
    
    
    
    