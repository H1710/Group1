// Sử dụng Fetch API để gửi yêu cầu GET đến API và hiển thị dữ liệu
// Fetch data from the API
    let loadComplete = false;
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
                    var startDate = element.start_date.slice(0,10);
                    // console.log(element.start_date)
                    // console.log (startDate)
                    if(element.status === "NEW"){
                        const exportdata = document.createElement('tr');                                                
                            exportdata.innerHTML = `
                            <td class="border-l w-[40px] h-[15px] border-t text-center py-[8px]">
                            <input type="checkbox" name="${element.status}" id="${element.id}">
                            </td>
                            <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.project_number}</td>
                            <td class="border-l border-b w-[250px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.name}</td>
                            <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.status}</td>
                            <td class="border-l border-b w-[150px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.customer}</td>
                            <td class="border-l border-b w-[150px] text-center font-sans text-[14px] font-semibold text-[#666666]">${startDate}</td>
                            <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">
                                <button class="delete-button" id="${element.id}" onclick="handleDeleteButtonClick(${element.id}, '${element.status}')">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" color="#DC143C" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>                  
                                </button>
                            </td>
                            <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">
                                <button class="edit-button" id="${element.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" color="#FF8C00" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>                                              
                                </button>
                            </td>
                        `;                        
                            dataContainer.appendChild(exportdata);                        
                    }else{
                        const exportdata = document.createElement('tr');
                        exportdata.innerHTML = `
                        <td class="border-l w-[40px] h-[15px] border-t text-center  py-[8px]">
                        <input type="checkbox" name="${element.status}" id="${element.id}">
                        </td>
                        <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.project_number}</td>
                        <td class="border-l border-b w-[250px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.name}</td>
                        <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.status}</td>
                        <td class="border-l border-b w-[150px] text-center font-sans text-[14px] font-semibold text-[#666666]">${element.customer}</td>
                        <td class="border-l border-b w-[150px] text-center font-sans text-[14px] font-semibold text-[#666666]">${startDate}</td>
                        <td class="border-l border-b w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666] py-[8px]">
                            <button class="delete-button hidden" id="${element.id}" onclick="handleDeleteButtonClick(${element.id}, ${element.status})">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>                  
                            </button>
                        </td>
                        <td class="border-l border-b border-t w-[100px] text-center font-sans text-[14px] font-semibold text-[#666666]">
                        <button class="edit-button" id="${element.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" color="#FF8C00" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>                                       
                        </button>
                    </td>
                    `;
                        dataContainer.appendChild(exportdata);
                    }
                    loadComplete = true;
                });
                   
                var selectedIds = [];
                var checkboxes = document.querySelectorAll('input[type="checkbox"]');

                // console.log(checkboxes)
                var animationData = document.querySelector('#animation-checkdata');
                animationData.style.display = 'none';
                var checkDataContainer = document.querySelector('#checkdata-container');
                var selectedCountElement = document.createElement('div');
                selectedCountElement.id = 'selectedCount';
                var deleteAllButton = document.createElement('button');
                deleteAllButton.id = 'deleteAllButton';
                // deleteAllButton.style.display = 'none'; // Ẩn nút ban đầu
                // checkDataContainer.style.display = 'none'
                selectedCountElement.textContent = '0 checkboxes selected';
                deleteAllButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>                  
                `;

                checkDataContainer.appendChild(selectedCountElement);
                checkDataContainer.appendChild(deleteAllButton);

                var selectedCount = 0;

                checkboxes.forEach(function (checkbox) {                    
                    checkbox.addEventListener('click', function () {
                        if (checkbox.checked) {
                            selectedCount++;
                            selectedIds.push({ id: checkbox.id, status: checkbox.name });
                        
                        } else {
                            selectedCount--;
                            selectedIds = selectedIds.filter(function (id) {
                                return id !== checkbox.id;
                            });
                            console.log(selectedIds)
                        }

                        selectedCountElement.textContent = `${selectedCount} checkboxes selected`;

                        if (selectedCount > 0) {
                            // deleteAllButton.style.display = 'block';
                            animationData.style.display = 'block';
                        } else {
                            // deleteAllButton.style.display = 'none';
                            animationData.style.display = 'none';
                        }
                    });
                });


                deleteAllButton.addEventListener('click', function () {
                    if (selectedIds.length > 0) {
                        handleDeleteAllClick(selectedIds);
                        // console.log(selectedIds)
                    }
                });




        })
        .catch(error => {
            // Handle errors
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    // Xử lý sự kiện khi nút "Xóa Tất Cả" được nhấp
    // function handleDeleteAllClick(selectedIds) {
    //     if (selectedIds.length === 0 && selectedStatus === null) {
    //         console.log('No projects selected for deletion.');
    //         return;
    //     }
    
    //     // Xác nhận với người dùng trước khi xóa
    //     var confirmation = confirm('Bạn có chắc chắn muốn xóa các dự án đã chọn?');
    //     if (!confirmation) {
    //         return; 
    //     }
        
    //     // Gửi yêu cầu xóa từng dự án dựa trên selectedIds
    //     selectedIds.forEach(function (projectId) {
    //         // Gửi yêu cầu xóa dự án với projectId lên máy chủ
    //         // Sử dụng projectId để xác định dự án cần xóa
    //         console.log('Deleting project with ID:', projectId);
    //         // Đảm bảo xóa thành công trước khi cập nhật giao diện
    //     });
    //     // dataContainer.removeChild(exportdata)
    // }

    function handleDeleteAllClick(selectedIds) {
        if (selectedIds.length === 0) {
            console.log('No projects selected for deletion.');
            return;
        }
    
        // Xác nhận với người dùng trước khi xóa
        var confirmation = confirm('Bạn có chắc chắn muốn xóa các dự án đã chọn?');
        if (!confirmation) {
            return;
        }
    
        // Gửi yêu cầu xóa từng dự án dựa trên selectedIds
            fetch('http://localhost:3000/api/v1/project/delete', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedIds), 
            })
            .then(response => {
                console.log(response.json())
                if (response.ok) {
                    console.log('Deleted project with ID:', selectedIds);
                } else {
                    console.error('Failed to delete project with ID:', selectedIds);
                }
            })
            .catch(error => {
                console.error('Error while sending delete request:', error);
            });
    }
    
    

    function hideContent() {
        const dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = ''; // Xóa tất cả nội dung
    }

    function searchProject() {
            // Thực hiện tìm kiếm dự án ở đây
            if (loadComplete) {
                hideContent(); // Ẩn nội dung
            }
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
                console.log('Search results:', data); //
                if(data === null){
                    alert('List is null');
                }else{
                    const dataContainer = document.getElementById('data-container');
                    const exportThData = document.createElement('tr');
                    exportThData.innerHTML = `
                    <td class="border-l border-b text-center"></td>
                    <td class="border-l border-b text-center">Number</td>
                    <td class="border-l border-b text-center">Name</td>
                    <td class="border-l border-b text-center">Status</td>
                    <td class="border-l border-b text-center">Customer</td>
                    <td class="border-l border-b text-center">Start Date</td>
                    <td class="border-l border-b text-center">Delete</td>
                    `;
                    dataContainer.appendChild(exportThData);  
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" color="#DC143C" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
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
                            <input type="checkbox" name="" id="${element.id}">
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
                }                
            })
            .catch(error => {
                console.error('Error searching for projects:', error);
            });
    }
    window.onload = function () {
        loadData();
        // Các tác vụ khác khi trang được tải
    };
    
    
    function resetSearch() {
        // Clear the search input
        const searchInput = document.getElementById('search-input');
        searchInput.value = '';
        
        // Set the select box back to its default option
        const select = document.getElementById('select');
        select.selectedIndex = 0;
        location.reload();
    }
    

        // update input
    function updateInput() {
        const selectElement = document.getElementById('select');
        const selectedValue = selectElement.value;

        const inputElement = document.getElementById('search-input');
        inputElement.placeholder = `Search by ${selectedValue.replace('_', ' ')}`;
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










   
    
    
    
    
    
    
    

