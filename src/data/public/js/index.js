let nombre = prompt("Ingrese un nombre:")
document.title=nombre
const socket=io()

socket.on("saludo", texto =>{
    console.log(texto)
    if(nombre){
    socket.emit("id", nombre)
}
})