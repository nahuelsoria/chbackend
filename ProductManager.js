class ProductManager {
    static counter = 0;
    
    constructor() {
        this.products = [];
        this.path = './data/products.json';
    }

    addProduct(code, title, thumbnail, stock, price, description) {
        if (!code || !title || !thumbnail || !stock || !price || !description){
            return "Falta rellenar al menos uno de los campos."
        }
        if (this.products.some(product => product.code == code)){
            console.log("Codigo repetido")
            return "El codigo se encuentra repetido."
        }
        this.products.push({
            code,
            title,
            thumbnail,
            stock,
            price,
            description,
            id: ProductManager.counter++
        })
        console.log("Producto cargado correctamente.")
        return "Producto cargado correctamente."
    }

    getProducts() {
        return this.products
    }

    getProductById(id) {
        let encontrado = this.products.find(product => product.id == id);
        if (!encontrado) {
            return "Not found"
        } else {
            return encontrado;
        }
    }
}

const producto = new ProductManager()

console.log("1) ", producto.getProducts()); //1) Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
producto.addProduct("abc123",'producto prueba', 'sin imagen','25','200', 'Este es un producto prueba'); //2) Agrega producto al arreglo si no existe. El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
console.log("3) ", producto.getProducts()); //3) Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado.
producto.addProduct("abc123",'producto prueba', 'sin imagen','25','200', 'Este es un producto prueba'); //4) Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
console.log("5) ", producto.getProductById(0))// 5) Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo.
console.log("6) ", producto.getProductById(1))// 6) Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo.