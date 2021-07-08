// Credenciales API
// var url = 'http://localhost/smbc/public/'
var url = 'https://smycode.com/smbc/public/'
var key = 'YWRtaW5TTUJDOlNNQkMyMDIx'

// Función para alertas
function alerta(message){
    Toastify({
        text: message,
        duration: 3000,
        close:true,
        gravity:"top",
        position: "center",
        backgroundColor: "#04a4d5",
    }).showToast();
}

// Cerrar sesión
$('#btnSalir').click((e)=>{
    e.preventDefault()
    $.cookie('usr', false);
    window.location.href = "login.html";
})

// Validando sesión  
let path =  window.location.pathname
let sesion = () => {
    let usr = $.cookie('usr')
    if(usr=='false' || typeof usr === 'undefined'){
        window.location.href = "login.html";
    } else{
        $('.loader').fadeOut(1500)
        $('#app').fadeIn()
    }
}  
if(path!=='/login.html'){
    sesion() 
}
