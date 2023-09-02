// Sử dụng Fetch API để gửi yêu cầu GET đến API và hiển thị dữ liệu
// Fetch data from the API
    loadData();
    function loadData(){
        fetch('http://localhost:3000/api/v1/project/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
            // Data is an array, proceed with mapping and displaying
            const dataContainer = document.getElementById('data-container');
            data.map(element => {
                if(element.status === "NEW"){
                    const exportdata = document.createElement('tr');
                    exportdata.innerHTML = `
                    <td class="border-l w-[40px] h-[15px] border-t text-center">
                    <input type="checkbox" name="" id="${element.id}">
                    </td>
                    <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.project_number}</td>
                    <td class="border-l border-b w-[550px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.name}</td>
                    <td class="border-l border-b w-[200px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.status}</td>
                    <td class="border-l border-b w-[350px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.customer}</td>
                    <td class="border-l border-b w-[150px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.start_date}</td>
                    <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">
                        <button class="delete-button" id="${element.id}" onclick="handleDeleteButtonClick(${element.id}, '${element.status}')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>                  
                        </button>
                    </td>
                `;
                    dataContainer.appendChild(exportdata);
                }else{
                    const exportdata = document.createElement('tr');
                    exportdata.innerHTML = `
                    <td class="border-l w-[40px] h-[15px] border-t text-center">
                    <input type="checkbox" name="" id="${element.id}" onclick="toggleDeleteIcon(${element.id})">
                    </td>
                    <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.project_number}</td>
                    <td class="border-l border-b w-[550px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.name}</td>
                    <td class="border-l border-b w-[200px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.status}</td>
                    <td class="border-l border-b w-[350px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.customer}</td>
                    <td class="border-l border-b w-[150px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.start_date}</td>
                    <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">
                        <button class="delete-button hidden" id="${element.id}" onclick="handleDeleteButtonClick(${element.id}, ${element.status})">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>                  
                        </button>
                    </td>
                `;
                    dataContainer.appendChild(exportdata);
                }
            });
    })
    .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
    });
    }



    // function searchProject() {
    //     const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    //     const select = document.getElementById('select');
    //     const selectedOption = select.options[select.selectedIndex].id;

    //     var querySearch = selectedOption + ': ' + searchInput
    //     console.log(querySearch)
    
    //     // Tạo dữ liệu yêu cầu
    //     const requestData = {
    //         // query: searchInput,
    //         query: searchInput,
    //         searchBy: selectedOption
    //     };
    
    //     // Gửi yêu cầu tìm kiếm bằng phương thức POST
    //     fetch('http://localhost:3000/api/v1/project/search?${selectedOption}=${searchInput}', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(requestData)
            
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         // Xử lý dữ liệu kết quả tìm kiếm ở đây
    //         console.log(JSON.stringify(requestData)),
    //         console.log('Search results:', data);
    //     })
    //     .catch(error => {
    //         console.error('Error searching for projects:', error);
    //     });
    // }


    function searchProject() {
        const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
        const select = document.getElementById('select');
        
        const selectedOption = select.options[select.selectedIndex].id;
        // const selectOut = select.options[select].id;

    
        // Construct the query string
        const queryString = `${selectedOption}=${searchInput}`;
        
        // Tạo dữ liệu yêu cầu
        const requestData = {
            value: searchInput,
            searchBy: selectedOption
        };
        console.log(requestData);
    
        // Gửi yêu cầu tìm kiếm bằng phương thức POST
        fetch(`http://localhost:3000/api/v1/project/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            // Xử lý dữ liệu kết quả tìm kiếm ở đây
            console.log('Search results:', data);
        })
        .catch(error => {
            console.error('Error searching for projects:', error);
        });
    }
    
    
    function resetSearch() {
        // Clear the search input
        const searchInput = document.getElementById('search-input');
        searchInput.value = '';
        
        // Set the select box back to its default option
        const select = document.getElementById('select');
        select.selectedIndex = 0;
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
            deleteButton.classList.remove = 'hidden';
            deleteButton.classList.add = 'block';
        } else {
            deleteButton.classList.remove = 'hidden';
            deleteButton.classList.add = 'block';
        }
    }


// Function to handle delete button click
function handleDeleteButtonClick(id, status) {
    // Find the corresponding row elements for this id
    const idElement = document.getElementById(id);
    
    console.log(id)
    console.log(status)
    console.log(idElement)

    if (status === 'NEW') {
        // Send a DELETE request to the specified URL
        fetch(`http://localhost:3000/api/v1/project/delete/${id}/${status}`, {
            method: 'GET',
        })
            .then(response => {
                if (response) {
                    // Handle success
                    console.log(`Dự án có id ${id} đã được xóa thành công.`);
                    // Remove the row from the table or update UI as needed
                    // For example, you can use 
                    // idElement.parentElement.remove();
                    location.reload();
                } else {
                    // Handle error
                    console.error(`Lỗi khi xóa dự án có id ${id} + 1111111.`);
                }
            })
            .catch(error => {
                console.error(`Lỗi khi xóa dự án có id ${id}:`, error);
            });
    } else {
        console.log(`Dự án có id ${id} không thể xóa vì trạng thái không phải 'NEW'.`);
    }
}










   
    
    
    
    
    
    
    

