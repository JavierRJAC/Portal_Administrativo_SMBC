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
                option += '<option value="'+v.titulo+'" data-id="'+v.id+'">'+v.titulo+'</option>'  
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
        },
        error: function(result){
            console.log("error");
        }
    });
    
    // Aplicar multiselect
    $('.multi').select2();
    
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
                url: url+'add_ponencia',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido agregado':'Ha ocurrido un error';
                    $('#ponenciasTable').DataTable().ajax.reload();
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
    $('#ponenciasTable').DataTable({
        'ajax':{
                url: url+'ponencias',
                type: 'GET',
                headers: { 'Authorization': key },
            },
        'columns': [
            { 'data': 'fecha' },
            { 'data': 'hora' },
            { 'data': 'tema' },
            { 'data': 'ponentes' },
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
        var data = $('#ponenciasTable').DataTable().row(tr).data();
        let ponentes = data.ponentes.split(', ')
        let fecha = data.fecha.split('/')
        let hora = data.hora.split(':')
        let h =  hora[0];
        let m = hora[1].split(' ')
        $('#mdlEditar #id').text(data.id)
        $('#mdlEditar .txtFecha').val(fecha[2]+'-'+fecha[1]+'-'+fecha[0])
        $('#mdlEditar .txtHora').val(data.hora)
        $('#mdlEditar .txtHora').timepicki({ start_time: [h, m[0], m[1]] })        
        $('#mdlEditar .txtTema').val(data.tema)
        $('#mdlEditar .txtZoom').val(data.enlace)
        $('#mdlEditar .areaTematica option[value="'+data.ods+'"]').attr('selected', 'selected')
        $('#mdlEditar .sPonentes').val(ponentes).trigger('change.select2')  
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
                url: url+'edit_ponencia',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    $('#ponenciasTable').DataTable().ajax.reload();
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
        var data = $('#ponenciasTable').DataTable().row(tr).data();
        var id = data.id;
        
        $.ajax({
            type: 'DELETE',
            url: url+'delete_recurso?id='+id,
            headers: { 'Authorization': key },
            success: function(res){
                
                let msj = (res.data==true)?'El registro ha sido eliminado':(res.data==false)? "El registro no se puede Eliminar": 'Ha ocurrido un error';
                $('#ponenciasTable').DataTable().ajax.reload();
                alerta(msj)
            },
            error: function(){
                alerta('Ha ocurrido un error')
            }
        })
        
    })

    // Cierre de modal
    $("#mdlEditar").on("hidden.bs.modal", function () {
        $('#mdlEditar .areaTematica').children('option').removeAttr('selected')
        $('#mdlEditar .txtHora').val('')
        $('#mdlEditar .txtHora').timepicki('destroy') 
    });
    
    // Usar para agregar también
    datos = (modal) => {       
        let fecha = $(modal+' .txtFecha').val().trim()
        let hora = $(modal+' .txtHora').val().trim()
        let tema = $(modal+' .txtTema').val().trim()
        let enlace = $(modal+' .txtZoom').val().trim()
        let ods = $(modal+' .areaTematica').children('option:selected').attr('data-id')
        let ponentes = $(modal+' .sPonentes option:selected').map(function () {
            return $(this).attr('data-id');
        }).get()
        
        
        let data = {
            "datos":{
                "fecha": fecha,
                "hora": convertirHora(hora),
                "tema": tema,
                "enlace": enlace,
                "fk_area": ods,
                "ponentes": ponentes
            }
        }         

        return data;
    }

    // Convertir hora
    const convertirHora = (hora) => {
        const [time, modifier] = hora.split(' ');        
        let [hours, minutes] = time.split(':'); 
        
        if (hours === '12') {
            hours = '00';
        }
        
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        
        return `${hours}:${minutes}`;
    };    

})