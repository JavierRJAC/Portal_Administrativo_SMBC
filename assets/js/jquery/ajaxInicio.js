$(document).ready(()=>{
    // Formulario de login
    $('#btnLogin').click((e) => {
        e.preventDefault()
        let data = datos()  
        if(data!==false){
            $.ajax({
                type: 'POST',
                url: url+'login',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    if(res.data==false){
                        alerta('Ingrese las credenciales correctas')
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