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

// function handleCreateButton(formElement) {
//     var createButton = formElement.querySelector('button[name="submit"][value="create"]');
//     if (createButton) {
//         createButton.addEventListener('click', function(event) {
//             event.preventDefault();
//             console.log("Create Project button clicked");

//             var inputFields = formElement.querySelectorAll('input[name], select[name]');
//             var inputValues = {};
//             inputFields.forEach(function(input) {
//                 inputValues[input.name] = input.value;
//             });

//             console.log("Input values:", inputValues);

//             fetch('http://localhost:3000/api/v1/project/create', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(inputValues)
//             })
//             .then(response => response.json())
//             .then(data => {
//                 // Xử lý dữ liệu trả về từ API nếu cần
//                 console.log('Created project:', data);
                
//             })
//             .catch(error => {
//                 console.log('Error creating project:', error); // validate lỗi
//             });
//         });
//     }
// }

function handleCreateButton(formElement) {
    var createButton = formElement.querySelector('button[name="submit"][value="create"]');
    if (createButton) {
        createButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log("Create Project button clicked");

            // Reset previous error messages
            var formMessages = formElement.querySelectorAll('.form-message');
            formMessages.forEach(function(message) {
                message.textContent = '';
            });

            var inputFields = formElement.querySelectorAll('input[name], select[name]');
            var inputValues = {};
            var isValid = true;

            inputFields.forEach(function(input) {
                inputValues[input.name] = input.value;

                // Perform validation for each field
                if (input.name === 'project_number' && input.value.trim() === '') {
                    displayErrorMessage(input, 'Project Number is required.');
                    addRedBorder(input);
                    isValid = false;
                }
                if (input.name === 'name' && input.value.trim() === '') {
                    displayErrorMessage(input, 'Project Name is required.');
                    addRedBorder(input);
                    isValid = false;
                }
                if (input.name === 'customer' && input.value.trim() === '') {
                    displayErrorMessage(input, 'Customer is required.');
                    addRedBorder(input);
                    isValid = false;
                }    
                if (input.name === 'group_id' && input.value.trim() === '') {
                    displayErrorMessage(input, 'Group is required.');
                    addRedBorder(input);
                    isValid = false;
                }    
                if (input.name === 'members' && input.value.trim() === '') {
                    displayErrorMessage(input, 'Members is required.');
                    addRedBorder(input);
                    isValid = false;
                }
                if (input.name === 'status' && input.value.trim() === '') {
                    displayErrorMessage(input, 'Status is required.');
                    addRedBorder(input);
                    isValid = false;
                }
                if (input.name === 'startDate' && input.value.trim() === '') {
                    addRedBorder(input);
                    displayErrorMessage(input, 'StartDate is required.'); // cần required start date hong đc lớn hơn hiện tại
                    isValid = false;
                }
                if (input.name === 'startDate' && input.value.trim() !== '') {
                    var currentDate = new Date(); // Lấy ngày hiện tại
                    var startDate = new Date(input.value);

                    if (startDate > currentDate) {
                        addRedBorder(input);
                        displayErrorMessage(input, 'StartDate cannot be in the future.');
                        isValid = false;
                    }
                }
                // if (input.name === 'endDate' && input.value.trim() === '') {
                //     addRedBorder(input);
                //     displayErrorMessage(input, 'EndDate required.');
                //     isValid = false;
                // }

                var startDateInput = formElement.querySelector('input[name="startDate"]');
                var endDateInput = formElement.querySelector('input[name="endDate"]');
                    if(startDateInput && endDateInput) {
                        var startDate = new Date(startDateInput.value);
                        var endDate = new Date(endDateInput.value);
    
                        if (startDate > endDate) {
                            addRedBorder(startDateInput);
                            addRedBorder(endDateInput);
                            displayErrorMessage(endDateInput, 'EndDate must be greater than or equal to StartDate.');
                            isValid = false;
                        }
                    }

                // Add similar validation for other fields as needed
            });

            if (isValid) {
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
                    if(data.err === '0'){
                        alert('Create Success!!!');
                    }else{
                        alert(data.mes);
                        location.reload();
                    }
                })
                .catch(error => {
                    console.log('Error creating project:', error); // validate lỗi
                });
            }
        });
    }
}

function displayErrorMessage(input, message) {
    var formGroup = input.closest('.form-group'); // Tìm phần tử gần nhất với lớp 'form-group'
    var formMessage = formGroup.querySelector('.form-message'); // Tìm thẻ span trong phần tử form-group
    formMessage.classList.remove('hidden');
    formMessage.classList.add('block');
    formMessage.textContent = message;
}


function addRedBorder(input) {
    input.classList.add('invalid:border-pink-500');
}

function removeRedBorder(input) {
    input.classList.remove('invalid:border-pink-500');
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



    
    
    
    
    
    