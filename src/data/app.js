import express from "express";
import productsRouter from '../routers/products.js'
import cartRouter from '../routers/cart.js'

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter);

app.get('/', (req, res) =>{
  return res.send('Solucion Pre-Entrega 1');
});

app.listen(PORT,() => {
    console.log(`Corriendo aplicacion en el puerto ${PORT}`)
})