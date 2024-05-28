Swal.fire({
    title:"Identifiquese",
    input:"email",
    text:"Ingrese su email",
    inputValidator: (value)=>{
        return !value && "Debe ingresar un nombre...!!!"
    },
    allowOutsideClick:false
}).then(datos=>{
    let email=datos.value
    
    let inputMensaje=document.getElementById("message")
    let divMensajes=document.getElementById("messages")
    inputMensaje.focus()

    const socket = io();
    
    socket.emit("id", email)

    socket.on("nuevoUsuario", email=>{
        Swal.fire({
            text:`${email} se ha conectado...`,
            toast:true,
            position: "top-right"
        })
    })

    socket.on("saleUsuario", email =>{
        divMensajes.innerHTML+=`<span> class="message"> <strong> ${email} </strong> ha salido del chat :( </span>`
        divMensajes.scrollTop=divMensajes.scrollHeight
    })

    socket.on("nuevoMensaje", (email, message) =>{
        divMensajes.innerHTML+=`<div class="message"><strong>${email}</strong> dice <i> ${message} </i></div> <hr>`
        divMensajes.scrollTop=divMensajes.scrollHeight
    })

    socket.on("mensajesPrevios", messages =>{
        messages.forEach(m=>{
            divMensajes.innerHTML+=`<div class="message"><strong>${m.email}</strong> dice <i> ${m.message} </i> </div> <hr>`
            divMensajes.scrollTop=divMensajes.scrollHeight
        })
    })
    
    inputMensaje.addEventListener("keyup", e=>{
        e.preventDefault()

        //console.log(e, e.target.value)
        if(e.code === "Enter" && e.target.value.trim().length >0){
            socket.emit("mensaje", email, e.target.value.trim())
            e.target.value="";
            e.target.focus()
        }
    })
})