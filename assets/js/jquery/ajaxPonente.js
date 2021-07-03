$(document).ready(()=>{
    
        var formAgregar = $("#formAgregar");
    
        formAgregar.validetta({
            realTime: true,
            onValid: function(e){
    
                e.preventDefault();
    
            }
        })
    
    })