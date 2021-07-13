$(document).ready(()=>{   
    // Acción de agregar
    var formAgregar = $('#formAgregar');
    formAgregar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();
            
            let formData = new FormData();
            let img = $('.fileImagen').prop('files')[0] 
            let data = datos('#mdlAgregar')         
            formData.append('imagen', img); 
            formData.append('datos', JSON.stringify(data)); 

            $.ajax({
                type: 'POST',
                url: url+'add_noticia',
                data: formData,
                cache: false,
                contentType: false, 
                processData: false,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido agregado':'Ha ocurrido un error';
                    $('#noticiasTable').DataTable().ajax.reload();
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
    $('#noticiasTable').DataTable({
        "scrollX": true,
        'ajax':{
                url: url+'noticias',
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
        var data = $('#noticiasTable').DataTable().row(tr).data();
        $('#mdlEditar #id').text(data.id)
        $('#mdlEditar .txtTitulo').val(data.titulo)
        $('#mdlEditar .txtContenido').val(data.contenido.replace(/<br>/gi,"\n"))
        setTimeout(() => {
            $('.imgAfiche').attr("src",(data.afiche=='')?'assets/images/iconos/noImg.jpg':data.afiche)
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
            let img = $('.fileImagen').prop('files')[0] 
            let data = datos('#mdlEditar')
            data.push(id)            
            formData.append('imagen', img); 
            formData.append('datos', JSON.stringify(data)); 

            $.ajax({
                type: 'POST',
                url: url+'edit_noticia',
                data: formData,
                cache: false,
                contentType: false, 
                processData: false,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    $('#noticiasTable').DataTable().ajax.reload();
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
        var data = $('#noticiasTable').DataTable().row(tr).data();
        var id = data.id;
        
        $.ajax({
            type: 'DELETE',
            url: url+'delete_publicacion?id='+id,
            headers: { 'Authorization': key },
            success: function(res){
                let msj = (res.data==true)?'El registro ha sido eliminado':(res.data==false)? "El registro no se puede Eliminar": 'Ha ocurrido un error';
                $('#noticiasTable').DataTable().ajax.reload();
                alerta(msj)
            },
            error: function(){
                alerta('Ha ocurrido un error')
            }
        })
        
    })

    // Cierre de modal
    $("#mdlEditar").on("hidden.bs.modal", function () {
        $('.imgAfiche').attr("src",'assets/images/iconos/loading.gif')
    });

    $("#mdlAgregar").on("hidden.bs.modal", function () {
        formAgregar.trigger('reset'); 
    });

    // Usar para agregar también
    datos = (modal) => {
        let titulo = $(modal+' .txtTitulo').val().trim()
        let contenido = $(modal+' .txtContenido').val().trim()
        contenido = contenido.replace(/\n/g, "<br>")
        let data = [titulo, contenido]

        return data;
    }

})