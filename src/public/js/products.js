const comprar=async(pid)=>{
    let inputCarrito=document.getElementById("carrito")
    let cid = inputCarrito.value
    //console.log(`Codigo producto: ${pid}, Codigo carrito: ${cid}`)

    let respuesta=await fetch(`/api/carts/${cid}/product/${pid}`,{
        method: "post"
    })
    if(respuesta.status===200){
        let datos=await respuesta.json()    
        //console.log(datos)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeSortSelect();
});

function initializeSortSelect() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function (event) {
            const selectedOption = event.target.value;
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('sort', selectedOption);
            window.location.href = currentUrl.toString();
        });
    }
}