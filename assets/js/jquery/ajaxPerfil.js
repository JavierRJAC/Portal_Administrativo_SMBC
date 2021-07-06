$(document).ready(()=>{
    $('.txtUsuario').val($.cookie('usr'))

    let formEditar = $("#formModPerfil");
    formEditar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();
            let data = datos()  
            $.ajax({
                type: 'POST',
                url: url+'edit_usuario',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    
                    let msj = 'Ha ocurrido un error'
                    if(res.data==true){
                        msj = 'Su perfil ha sido actualizado'
                        $.cookie('usr',data.datos.usuario)
                    }
                    alerta(msj)
                },
                error: function(){
                    alerta('Ha ocurrido un error')
                }
            });
        }
    })

    datos = () => {         
        let data = {
            "datos":{
                "usuario": $('.txtUsuario').val().trim(), 
                "clave":  $('.txtPassword').val().trim()
            }
        }     

        return data;
    }
})