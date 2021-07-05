// Credenciales API
var url = 'http://localhost/smbc/public/'
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

