$(document).ready(()=>{  
    // Acción de agregar
    var formAgregar = $('#formAgregar');
    formAgregar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();
        }
    })

    // DataTable mostrar objetivos
    $('#odsTable').DataTable({
        'ajax':{
                url: url+'objetivos',
                type: 'GET',
                headers: { 'Authorization': key },
            },
        'columns': [
            { 'data': 'titulo' },
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

    // Acción de editar
    $('body').on('click', '.btnEditar', function(){
        var tr = $(this).closest("tr");
        var data = $('#odsTable').DataTable().row(tr).data();
        $('#mdlEditar #id').text(data.id)
        $('#mdlEditar .txtTitulo').val(data.titulo)
        $('#mdlEditar .txtDescripcion').val(data.descripcion)
        setTimeout(() => {
            $('.imgIcono').attr("src",(data.icono=='')?'assets/images/iconos/noImg.jpg':data.icono)
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
            let img = $('.fileIcono').prop('files')[0] 
            let data = datos('#mdlEditar')
            data.push(id)            
            formData.append('imagen', img); 
            formData.append('datos', JSON.stringify(data)); 

            $.ajax({
                type: 'POST',
                url: url+'edit_objetivo',
                data: formData,
                cache: false,
                contentType: false, 
                processData: false,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    $('#odsTable').DataTable().ajax.reload();
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

    // Cierre de modal
    $("#mdlEditar").on("hidden.bs.modal", function () {
        $('.imgIcono').attr("src",'assets/images/iconos/loading.gif')
    });

    // Usar para agregar también
    datos = (modal) => {
        let titulo = $(modal+' .txtTitulo').val().trim()
        let descripcion = $(modal+' .txtDescripcion').val().trim()
        let data = [titulo, descripcion]

        return data;
    }

})