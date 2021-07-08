$(document).ready(()=>{  
    // Acción de agregar
    var formAgregar = $('#formAgregar');
    formAgregar.validetta({
        realTime: true,
        bubblePosition: 'bottom',
        onValid: function(e){
            e.preventDefault();
            let formData = new FormData();
            let img = $('.fileImg').prop('files')[0] 
            let data = datos('#mdlAgregar')         
            formData.append('imagen', img); 
            formData.append('datos', JSON.stringify(data)); 

            $.ajax({
                type: 'POST',
                url: url+'add_ponente',
                data: formData,
                cache: false,
                contentType: false, 
                processData: false,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido agregado':'Ha ocurrido un error';
                    $('#ponentesTable').DataTable().ajax.reload();
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
    $('#ponentesTable').DataTable({
        'ajax':{
                url: url+'ponentes',
                type: 'GET',
                headers: { 'Authorization': key },
            },
        'columns': [
            { 'data': 'nombre' },
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
        var data = $('#ponentesTable').DataTable().row(tr).data();
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
            url: url+'estado_ponente',
            data: data,
            headers: { 'Authorization': key },
            success: function(res){
                let msj = (res.data==true)?'El registro ha cambiado de estado':'Ha ocurrido un error';
                $('#ponentesTable').DataTable().ajax.reload();
                alerta(msj)
            },
            error: function(){
                alerta('Ha ocurrido un error')
            }
        })
    })

    // Acción de editar
    
    $('body').on('click', '.btnEditar', function(){
        var tr = $(this).closest("tr")
        var data = $('#ponentesTable').DataTable().row(tr).data()
        $('#mdlEditar #id').text(data.id)
        $('#mdlEditar .txtNombre').val(data.nombre)
        $('#mdlEditar .txtCargo').val(data.cargo)
        $('#mdlEditar .txtDescripcion').val(data.descripcion)   
        setTimeout(() => {
            $('.imgIcono').attr("src",(data.foto=='')?'assets/images/iconos/noImg.jpg':data.foto)
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
            let img = $('.fileImg').prop('files')[0] 
            let data = datos('#mdlEditar')
            data.push(id)            
            formData.append('imagen', img); 
            formData.append('datos', JSON.stringify(data)); 
            $.ajax({
                type: 'POST',
                url: url+'edit_ponente',
                data: formData,
                cache: false,
                contentType: false, 
                processData: false,
                headers: { 'Authorization': key },
                success: function(res){
                    let msj = (res.data==true)?'El registro ha sido actualizado':'Ha ocurrido un error';
                    $('#ponentesTable').DataTable().ajax.reload();
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
        var data = $('#ponentesTable').DataTable().row(tr).data();
        var id = data.id;
        
        $.ajax({
            type: 'DELETE',
            url: url+'delete_ponente?id='+id,
            headers: { 'Authorization': key },
            success: function(res){
                let msj = (res.data==true)?'El registro ha sido eliminado':(res.data==false)? "El registro no se puede Eliminar": 'Ha ocurrido un error';
                $('#ponentesTable').DataTable().ajax.reload();
                alerta(msj)
            },
            error: function(){
                alerta('Ha ocurrido un error')
            }
        })
        
    })

    // Cierre de modal
    $("#mdlEditar").on("hidden.bs.modal", function () {
        $('.imgIcono').attr("src",'assets/images/iconos/loading.gif')
    });

    // Usar para agregar también
    datos = (modal) => {
        let nombre = $(modal+' .txtNombre').val().trim()
        let cargo = $(modal+' .txtCargo').val().trim()
        let descripcion = $(modal+' .txtDescripcion').val().trim()
        let data = [nombre, cargo, descripcion]

        return data;
    }

})