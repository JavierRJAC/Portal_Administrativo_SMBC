$(document).ready(()=>{
    $('.txtUsuario').val($.cookie('usr'))

    let formEditar = $("#formModPerfil");
    formEditar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();
            let data = datos()  
            bloquear('#formModPerfil')
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
                    activar('#formModPerfil')
                },
                error: function(){
                    alerta('Ha ocurrido un error')
                }
            });
        }
    })

    // Bloquear botón para guardar
    var bloquear = (form)=>{
        let b = $(form+' .btn-formularios')
        b.attr('disabled','disabled')
        b.val('Guardando...')
    }

    // Activar botón para guardar
    var activar = (form)=>{
        let b = $(form+' .btn-formularios')
        b.removeAttr('disabled','')
        b.val('Guardar')
    }

    // Captura de datos
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