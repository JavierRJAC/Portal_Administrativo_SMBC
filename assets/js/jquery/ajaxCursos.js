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
                url: url+'add_curso',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido agregado':'Ha ocurrido un error';
                    $('#cursosTable').DataTable().ajax.reload();
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
    $('#cursosTable').DataTable({
        "scrollX": true,
        'ajax':{
                url: url+'cursos',
                type: 'GET',
                headers: { 'Authorization': key },
            },
        'columns': [
            { 'data': 'fecha' },
            { 'data': 'titulo' },
            { 'data': 'encargados' },
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
        var data = $('#cursosTable').DataTable().row(tr).data();
        let fecha = data.fecha.split('/')
        let hora = data.hora.split(':')
        let h =  hora[0];
        let m = hora[1].split(' ')
        $('#mdlEditar #id').text(data.id)
        $('#mdlEditar .txtFecha').val(fecha[2]+'-'+fecha[1]+'-'+fecha[0])
        $('#mdlEditar .txtHora').val(data.hora)
        $('#mdlEditar .txtHora').timepicki({ start_time: [h, m[0], m[1]] })   
        $('#mdlEditar .txtTitulo').val(data.titulo)
        $('#mdlEditar .txtZoom').val(data.enlace)
        $('#mdlEditar .txtCorreo').val(data.correo)
        $('#mdlEditar .txtDescripcion').val(data.descripcion)
        $('#mdlEditar .txtEncargados').val(data.encargados)
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
            bloquear('#mdlEditar')

            $.ajax({
                type: 'POST',
                url: url+'edit_curso',
                data: data,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    $('#cursosTable').DataTable().ajax.reload();
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
        var data = $('#cursosTable').DataTable().row(tr).data();
        var id = data.id;
        
        $.ajax({
            type: 'DELETE',
            url: url+'delete_curso?id='+id,
            headers: { 'Authorization': key },
            success: function(res){
                
                let msj = (res.data==true)?'El registro ha sido eliminado':(res.data==false)? "El registro no se puede Eliminar": 'Ha ocurrido un error';
                $('#cursosTable').DataTable().ajax.reload();
                alerta(msj)
            },
            error: function(){
                alerta('Ha ocurrido un error')
            }
        })
        
    })

    // Cierre de modal
    $("#mdlEditar").on("hidden.bs.modal", function () {
        formEditar.trigger('reset'); 
    });

    $("#mdlAgregar").on("hidden.bs.modal", function () {
        formAgregar.trigger('reset'); 
    });


     
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
        let fecha = $(modal+' .txtFecha').val().trim()
        let hora = $(modal+' .txtHora').val().trim()
        let titulo = $(modal+' .txtTitulo').val().trim()
        let descripcion = $(modal+' .txtDescripcion').val().trim()
        let correo = $(modal+' .txtCorreo').val().trim()
        let enlace = $(modal+' .txtZoom').val().trim()
        let encargados = $(modal+' .txtEncargados').val().trim()
        
        
        let data = {
            "datos":{
                "fecha": fecha,
                "hora": convertirHora(hora),
                "titulo": titulo,
                "descripcion": descripcion,
                "encargados": encargados,
                "correo": correo,
                "enlace": enlace,
                
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



});