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
