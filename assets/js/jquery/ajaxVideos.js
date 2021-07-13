$(document).ready(()=>{     
    // Llenar select de áreas temáticas
    $.ajax({
        type: 'GET',
        url: url+'objetivos',                      
        headers: {'Authorization': key},
        success: function(result){
            var ponentes = result.data
            var option = '';
            $.each(ponentes, function(k,v){
                option += '<option value="'+v.id+'">'+v.titulo+'</option>'  
            })
            $('.areaTematica').append(option)
        },
        error: function(result){
            console.log("error");
        }
    });
    // Llenar multiselect de ponentes
    $.ajax({
        type: 'GET',
        url: url+'ponentes',                      
        headers: {'Authorization': key},
        success: function(result){
            var ponentes = result.data
            var option = '';
            $.each(ponentes, function(k,v){
                option += '<option value="'+v.nombre+'" data-id="'+v.id+'">'+v.nombre+'</option>'  
            })
            $('.multi').append(option)
            $('.multi').select2()
        },
        error: function(result){
            console.log("error");
        }
    });
    
    // Aplicar multiselect
    // $('.multi').select2();
    
    // Acción de agregar
    var formAgregar = $('#formAgregar');
    formAgregar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();
            let data = datos('#mdlAgregar')         
            $.ajax({
                type: 'POST',
                url: url+'add_video',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido agregado':'Ha ocurrido un error';
                    $('#videosTable').DataTable().ajax.reload();
                    alerta(msj)
                    formAgregar.trigger('reset'); 
                    $('#mdlAgregar').modal('toggle');
                },
                error: function(){
                    alerta('Ha ocurrido un error')
                }
            });
        }
    })

    // DataTable mostrar objetivos
    $('#videosTable').DataTable({
        "scrollX": true,
        'ajax':{
                url: url+'videos',
                type: 'GET',
                headers: { 'Authorization': key },
            },
        'columns': [
            { 'data': 'tema' },
            { 'data': 'ods' },
            { 'data': 'estado' },
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
                                    '<a class="dropdown-item btnEstado" href="#">'+((row.estado=="Visible")?"Ocultar":"Hacer visible")+'</a>'+
                                    '<a class="dropdown-item btnEliminar" href="#">Eliminar</a>'+
                                '</div>'+
                            '</div>';
                }
            }
        ]
    });
    
    
    // Acción de estado
    $('body').on('click', '.btnEstado', function(){
        var tr = $(this).closest("tr");
        var data = $('#videosTable').DataTable().row(tr).data();
        var id = data.id;
        var estado = (data.estado === "Visible")? 1: 0;
        

        //Objeto
        var data = {
            "datos":{
                "id":id,
                "estado": estado
            }
        }        

        $.ajax({
            type: 'POST',
            url: url+'estado_video',
            data: data,
            headers: { 'Authorization': key },
            success: function(res){
                let msj = (res.data==true)?'El registro ha cambiado de estado':'Ha ocurrido un error';
                $('#videosTable').DataTable().ajax.reload();
                alerta(msj)
            },
            error: function(){
                alerta('Ha ocurrido un error')
            }
        })
    })

    // Cambio del select de área temática
    $('.areaTematica').change(function (e) {
        let id = $(e.target).val();
        $('.areaTematica').children('option').removeAttr('selected')
        $('.areaTematica option[value="'+id+'"]').attr('selected','selected')
    });

    // Acción de editar
    $('body').on('click', '.btnEditar', function(){
        var tr = $(this).closest("tr");
        var data = $('#videosTable').DataTable().row(tr).data();
        let ponentes = data.ponentes.split(', '); 
        $('#mdlEditar #id').text(data.id)
        $('#mdlEditar .txtTema').val(data.tema)
        $('#mdlEditar .areaTematica option[value="'+data.fk_area+'"]').attr('selected','selected')
        $('#mdlEditar .sPonentes').val(ponentes).trigger('change.select2')         
        setTimeout(() => {
            $('.iVideo').prop('src',data.enlace)
        }, 3000)
    })

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

            $.ajax({
                type: 'POST',
                url: url+'edit_video',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    $('#videosTable').DataTable().ajax.reload();
                    alerta(msj)
                    formEditar.trigger('reset'); 
                    $('#mdlEditar').modal('toggle');
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
        var data = $('#videosTable').DataTable().row(tr).data();
        var id = data.id;
        
        $.ajax({
            type: 'DELETE',
            url: url+'delete_recurso?id='+id,
            headers: { 'Authorization': key },
            success: function(res){                
                let msj = (res.data==true)?'El registro ha sido eliminado':(res.data==false)? "El registro no se puede Eliminar": 'Ha ocurrido un error';
                $('#videosTable').DataTable().ajax.reload();
                alerta(msj)
            },
            error: function(){
                alerta('Ha ocurrido un error')
            }
        })
        
    })

    // Cierre de modales
    $("#mdlEditar").on("hidden.bs.modal", function () {
        $('.iVideo').attr("src",'')
        $('.areaTematica').children('option').removeAttr('selected')
    });

    $("#mdlAgregar").on("hidden.bs.modal", function () {
        formAgregar.trigger('reset'); 
        $(".areaTematica").children('option').prop("selected",false);        
        $('.multi').select2('destroy').val('').select2();
    });

    // Usar para agregar también
    datos = (modal) => {       
        let tema = $(modal+' .txtTema').val().trim()
        let ods = $(modal+' .areaTematica').children('option:selected').val()
        let ponentes = $(modal+' .sPonentes option:selected').map(function () {
            return $(this).attr('data-id');
        }).get()
        let enlace = $(modal+' .txtEnlace').val().trim()
        
        let data = {
            "datos":{
                "tema": tema,
                "enlace": enlace,
                "fk_area": ods,
                "ponentes": ponentes
            }
        }

        return data;
    }

})