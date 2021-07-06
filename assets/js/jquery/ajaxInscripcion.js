$(document).ready(()=>{
    // Cargar formulario
    $.ajax({
        type: 'get',
        url: url+'inscripcion',
        headers: { 'Authorization': key },
        success: function(res){
            let tab1 = res.data[0]
            $('.txtFechaR').val(tab1.fecha)
            $('.precioR1').val(tab1.precio1)
            $('.precioR2').val(tab1.precio2)
            $('.precioR3').val(tab1.precio3)
            $('.precioR4').val(tab1.precio4)
            let tab2 = res.data[1]
            $('.txtFechaE').val(tab2.fecha)
            $('.precioE1').val(tab2.precio1)
            $('.precioE2').val(tab2.precio2)
            $('.precioE3').val(tab2.precio3)
            $('.precioE4').val(tab2.precio4)
            let tab3 = res.data[2]
            $('.txtBancoR').val(tab3.banco)
            $('.txtCuentaR').val(tab3.cuenta)
            $('.txtNumeroR').val(tab3.numero)
            let tab4 = res.data[3]
            $('.txtBancoN').val(tab4.banco)
            $('.txtCuentaN').val(tab4.cuenta)
            $('.txtNumeroN').val(tab4.numero)
            $('.txtDireccionN').val(tab4.direccion)
            $('.txtCodigoN').val(tab4.codbanco)
            let tab5 = res.data[4]
            $('.txtBancoA').val(tab5.banco)
            $('.txtCuentaA').val(tab5.cuenta)
            $('.txtNumeroA').val(tab5.numero)            
        },
        error: function(){
            alerta('No se puede cargar la información')
        }
    })

    // Enviar formulario
    let formEditar = $("#formInscripcion");
    formEditar.validetta({
        realTime: true,
        onValid: function(e){
            e.preventDefault();
            let data = datos()                      
            $.ajax({
                type: 'POST',
                url: url+'edit_inscripcion',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    alerta(msj)
                },
                error: function(){
                    alerta('Ha ocurrido un error')
                }
            });
        }
    })

    datos = () => {  
        let regular = {
            "fecha": $('.txtFechaR').val().trim(),
            "p1": $('.precioR1').val().trim(),
            "p2": $('.precioR2').val().trim(),
            "p3": $('.precioR3').val().trim(),
            "p4": $('.precioR4').val().trim()
        } 
        
        let evento = {
            "fecha": $('.txtFechaE').val().trim(),
            "p1": $('.precioE1').val().trim(),
            "p2": $('.precioE2').val().trim(),
            "p3": $('.precioE3').val().trim(),
            "p4": $('.precioE4').val().trim()
        } 

        let residentes = {
            "banco": $('.txtBancoR').val().trim(),
            "cuenta": $('.txtCuentaR').val().trim(),
            "numero":  $('.txtNumeroR').val().trim()
        }

        let noResidentes = {
            "banco": $('.txtBancoN').val().trim(),
            "codbanco": $('.txtCodigoN').val().trim(),
            "direccion": $('.txtDireccionN').val().trim(),
            "cuenta": $('.txtCuentaN').val().trim(),
            "numero": $('.txtNumeroN').val().trim()
        }  

        let alterna = {
            "banco": $('.txtBancoA').val().trim(),
            "cuenta": $('.txtCuentaA').val().trim(),
            "numero":  $('.txtNumeroA').val().trim()
        }
        
        let data = {
            "datos":{
                "inscripcion":[
                    regular,
                    evento                    
                ],
                "cuentas":[
                    residentes,
                    noResidentes,
                    alterna
                ]
            }
        }     

        return data;
    }
})