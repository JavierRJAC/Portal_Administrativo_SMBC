$(document).ready(()=>{

    var formAgregar = $("#formModPerfil");

    formAgregar.validetta({
        realTime: true,
        onValid: function(e){

            e.preventDefault();

        }
    })

})