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









    
    
    
    
    
    