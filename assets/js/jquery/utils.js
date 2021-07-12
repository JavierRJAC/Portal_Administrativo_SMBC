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
    window.location.href = "index.html";
})

// Validando sesión  
let path =  window.location.pathname
let sPath = path.split( '/' )
let size = sPath.length
let rPath = sPath[size-1]

let sesion = () => {
    let usr = $.cookie('usr')
    if(usr=='false' || typeof usr === 'undefined'){
        window.location.href = "index.html";
    } else{
        $('.loader').fadeOut(1000)
        $('#app').css('display','block')
    }
}  
if(rPath!=='index.html'){
    sesion() 
} 
