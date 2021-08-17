$(document).ready(()=>{
    // Acción de agregar
    var formAgregar = $('#formAgregar');
    formAgregar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();         
            let formData = new FormData();
            let img = $('#mdlAgregar .fileLogo').prop('files')[0] 
            let data = datos('#mdlAgregar')      
            formData.append('imagen', img); 
            formData.append('datos', JSON.stringify(data)); 
            
            bloquear('#mdlAgregar')

            $.ajax({
                type: 'POST',
                url: url+'add_logo',
                data: formData,
                cache: false,
                contentType: false, 
                processData: false,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido agregado':'Ha ocurrido un error';
                    $('#logosTable').DataTable().ajax.reload();
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


    // DataTable mostrar registro Logos
    $('#logosTable').DataTable({
        "scrollX":true,
        'ajax':{
                url: url+'logos',
                type: 'GET',
                headers: { 'Authorization': key },
            },
        'columns': [
            { 'data': 'categoria' },
            { 'data': 'titulo' },
            {
                render: function (data, type, row) {
                    return '<div class="dropdown" >'+
                                '<button class="btn btn-success dropdown-toggle me-1" type="button"'+
                                    'id="dropdownMenuButton2" data-bs-toggle="dropdown"'+
                                    'aria-haspopup="true" aria-expanded="false">'+
                                    'Acciones'+
                                '</button>'+
                                '<div class="dropdown-menu"  aria-labelledby="dropdownMenuButton2">'+
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
        var data = $('#logosTable').DataTable().row(tr).data();       
        $('#mdlEditar #id').text(data.id)
        $('#mdlEditar .txtTitulo').val(data.titulo)
        let categoria = (data.categoria == "Patrocinador")? "0": "1";
        $('#mdlEditar .sCategoria option[value="'+categoria+'"]').attr('selected', 'selected')
        setTimeout(() => {
            $('.imgLogo').attr("src",(data.logo=='')?'assets/images/iconos/noImg.jpg':data.logo)
        }, 1000)
    })


    // Enviar formulario
    var formEditar = $('#formEditar');
    formEditar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();            
            let formData = new FormData();
            let id = $('#id').text()
            let img = $('#mdlEditar .fileLogo').prop('files')[0] 
            let data = datos('#mdlEditar')
            data.push(id)            
            formData.append('imagen', img); 
            formData.append('datos', JSON.stringify(data));  

            bloquear('#mdlEditar')

            $.ajax({
                type: 'POST',
                url: url+'edit_logo',
                data: formData,
                cache: false,
                contentType: false, 
                processData: false,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    $('#logosTable').DataTable().ajax.reload();
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
        var data = $('#logosTable').DataTable().row(tr).data();
        var id = data.id;
        
        $.ajax({
            type: 'DELETE',
            url: url+'delete_logo?id='+id,
            headers: { 'Authorization': key },
            success: function(res){
                let msj = (res.data==true)?'El registro ha sido eliminado':(res.data==false)? "El registro no se puede Eliminar": 'Ha ocurrido un error';
                $('#logosTable').DataTable().ajax.reload();
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

    // Cierre de modal
    $("#mdlEditar").on("hidden.bs.modal", function () {
        $('.imgLogo').attr("src",'assets/images/iconos/loading.gif')
        formEditar.trigger('reset'); 
    });

    $("#mdlAgregar").on("hidden.bs.modal", function () {
        formAgregar.trigger('reset'); 
    });

    // Usar para agregar también
    datos = (modal) => {
        let titulo = $(modal+' .txtTitulo').val().trim()
        let categoria = $(modal+' .sCategoria').children('option:selected').val().trim()
        let data = [titulo, categoria]

        return data;
    }


})