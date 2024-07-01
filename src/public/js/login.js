const login = async(e) =>{
    e.preventDefault()
    let [email, password] = new FormData(document.getElementById("login-form")).values()
    //console.log(email, password)
    let body = {email, password}

    let respuesta = await fetch("/api/sessions/login", {
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    } )

    let datos = respuesta
    //console.log({datos})
    if(respuesta.ok){
        window.location.href="/profile"
    }else{
        window.location.href="/login?error=Error al validar"
    }
}