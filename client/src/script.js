function submitValue(option){
    var formElement = document.querySelector('#form-1');
    if(formElement){
        formElement.onsubmit = function(e){
        e.preventDefault();
        if(typeof option.onSubmit === 'function'){
            var enableInput = formElement.querySelectorAll('[name]:not([disabled])');
            var formValue = Array.from(enableInput).reduce(function(values, input){
                return (values[input.name] = input.value) && values;
            }, {});
            option.onSubmit(formValue);
        }
    }
}
}

submitValue({
    form: '#form-1',
    onSubmit: function(data){
        console.log(data);
    }
});