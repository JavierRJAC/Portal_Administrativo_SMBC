$(document).ready(()=>{    
    // Acción de agregar
    var formAgregar = $("#formAgregar");
    formAgregar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();
        }
    })

    //DataTable mostrar objetivos
    $('#odsTable').DataTable({
        "ajax":{
                url: url+"objetivos",
                type: "GET",
                headers: { 'Authorization': key },
            },
        "columns": [
            { "data": "titulo" },
            { "data": "estado" },
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
        $('#id').text(data.id)
        $('#txtTitulo').val(data.titulo)
        $('#txtDescripcion').val(data.descripcion)
        $('#imgIcono').attr('src',data.icono)  
    })

    // Enviar formulario
    var formEditar = $("#formEditar");
    formEditar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();            
            let formData = new FormData();
            let titulo = $('#txtTitulo').val()
            let descripcion = $('#txtDescripcion').val()
            let id = $('#id').text()

            let datos = [titulo, descripcion, id]
            let img = $('#fileIcono').prop("files")[0] 
            console.log(img)
            
            formData.append("imagen", img); 
            formData.append("datos", JSON.stringify(datos)); 

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
                    formEditar.trigger("reset"); 
                    $('#mdlEditar').modal('toggle');
                },
                error: function(){
                    console.log("error");
                }
            });
        }
    })

})