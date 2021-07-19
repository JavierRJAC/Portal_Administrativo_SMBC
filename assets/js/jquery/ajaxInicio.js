$(document).ready(()=>{
    // Formulario de login
    $('#btnLogin').click((e) => {
        e.preventDefault()
        let data = datos()
        bloquear('#btnLogin')  
        if(data!==false){
            $.ajax({
                type: 'POST',
                url: url+'login',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    if(res.data==false){
                        alerta('Ingrese las credenciales correctas')
                        activar('#btnLogin')
                    } else {    
                        $.cookie('usr', res.data );
                        window.location.href = "ods.html";
                    }
                },
                error: function(){
                    alerta('Ha ocurrido un error')
                }
            });
        } else {
            alerta('Ingrese su usuario y contraseña')
        }  
    })

    // Bloquear botón para login
    var bloquear = (b)=>{
        $(b).attr('disabled','disabled')
        $(b).val('Accediendo...')
    }

    // Activar botón para login
    var activar = (b)=>{
        $(b).removeAttr('disabled','')
        $(b).val('Iniciar')
    }

    // Captura de datos
    datos = () => {  
        let usuario = $('#txtUsuario').val().trim()
        let password = $('#txtPassword').val().trim()
        
        let data = {
            "datos":{
                "usuario" : usuario,
                "clave" : password 
            }
        } 

        return (usuario=="" || password=="")?false:data
    }
})