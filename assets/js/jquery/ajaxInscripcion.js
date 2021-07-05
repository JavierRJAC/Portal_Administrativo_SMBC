$(document).ready(()=>{

    var formAgregar = $("#formInscripcion");

    formAgregar.validetta({
        realTime: true,
        onValid: function(e){

            e.preventDefault();

        }
    })

})