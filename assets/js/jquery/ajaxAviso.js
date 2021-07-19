$(document).ready(()=>{     
    // Acción de agregar
    var formAgregar = $('#formAgregar');
    formAgregar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();
            
            let data = datos('#mdlAgregar')
            bloquear('#mdlAgregar')
            
            $.ajax({
                type: 'POST',
                url: url+'add_aviso',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    $('#avisosTable').DataTable().ajax.reload();
                    alerta(msj)
                    formAgregar.trigger('reset'); 
                    $('#mdlAgregar').modal('toggle');
                    activar('#mdlAgregar')
                },
                error: function(){
                    alerta('Ha ocurrido un error')
                }
            });
        }
    })

    // DataTable mostrar objetivos
    $('#avisosTable').DataTable({
        "scrollX": true,
        'ajax':{
                url: url+'avisos',
                type: 'GET',
                headers: { 'Authorization': key },
            },
        'columns': [
            { 'data': 'titulo' },
            {
                render: function (data, type, row) {
                    return '<div class="dropdown">'+
                                '<button class="btn btn-success dropdown-toggle me-1" type="button"'+
                                    'id="dropdownMenuButton2" data-bs-toggle="dropdown"'+
                                    'aria-haspopup="true" aria-expanded="false">'+
                                    'Acciones'+
                                '</button>'+
                                '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton2">'+
                                    '<a class="dropdown-item btnEditar" href="#" data-bs-toggle="modal" data-bs-target="#mdlEditar">Editar</a>'+
                                    '<a class="dropdown-item btnEliminar" href="#">Eliminar</a>'+
                                '</div>'+
                            '</div>';
                }
            }
        ]
    });

    // Acción de editar
    $('body').on('click', '.btnEditar', function(){
        var tr = $(this).closest("tr");
        var data = $('#avisosTable').DataTable().row(tr).data();
        $('#mdlEditar #id').text(data.id)
        $('#mdlEditar .txtTituloFechas').val(data.titulo)      
        $('#mdlEditar .txtContenido').val(data.contenido)  
    })

    $("#mdlEditar").on("hidden.bs.modal", function () {
        formEditar.trigger('reset'); 
    });

    $("#mdlAgregar").on("hidden.bs.modal", function () {
        formAgregar.trigger('reset'); 
    });

    // Enviar formulario
    var formEditar = $('#formEditar');
    formEditar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();            
            let id = $('#id').text()
            let data = datos('#mdlEditar')
            data.datos['id'] = id 
            bloquear('#mdlEditar')
            console.log(data)
            
            $.ajax({
                type: 'POST',
                url: url+'edit_aviso',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    $('#avisosTable').DataTable().ajax.reload();
                    alerta(msj)
                    formEditar.trigger('reset'); 
                    $('#mdlEditar').modal('toggle');
                    activar('#mdlEditar')
                },
                error: function(){
                    alerta('Ha ocurrido un error')
                }
            });
        }
    })

     // Eliminar registro
    $('body').on('click', '.btnEliminar', function(){
        var tr = $(this).closest("tr");
        var data = $('#avisosTable').DataTable().row(tr).data();
        var id = data.id;
        
        $.ajax({
            type: 'DELETE',
            url: url+'delete_publicacion?id='+id,
            headers: { 'Authorization': key },
            success: function(res){
                let msj = (res.data==true)?'El registro ha sido eliminado':(res.data==false)? "El registro no se puede Eliminar": 'Ha ocurrido un error';
                $('#avisosTable').DataTable().ajax.reload();
                alerta(msj)
            },
            error: function(){
                alerta('Ha ocurrido un error')
            }
        })
        
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
    datos = (modal) => {       
        let fechas = $(modal+' .txtTituloFechas').val().trim()
        let contenido = $(modal+' .txtContenido').val().trim()
        
        let data = {
            "datos":{
                "titulo": fechas,
                "aviso": contenido
            }
        }

        return data;
    }

})