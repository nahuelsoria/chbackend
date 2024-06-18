import { Router } from "express";
import { ProductManagerMongo as ProductManager } from "../dao/ProductManagerMongo.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import { productsModelo } from "../dao/models/productsModelo.js";
import { auth } from "../middleware/auth.js";
import { UserManagerMongo as UserManager } from "../dao/UserManagerMongo.js";

export const router = Router();

const c = new CartManager();
const p = new ProductManager();
const u = new UserManager()

router.get("/products", auth , async (req, res) => {
  let cart ={
    _id: req.session.user.cart
}
  //console.log(cart)
  try {
    const { page = 1, limit = 10, sort } = req.query;
    const options = {
      page: Number(page),
      limit: Number(limit),
      lean: true,
    };

    const searchQuery = {};

    if (req.query.category) {
      searchQuery.category = req.query.category;
    }

    if (req.query.title) {
      searchQuery.title = { $regex: req.query.title, $options: "i" };
    }

    if (req.query.stock) {
      const stockNumber = parseInt(req.query.stock);
      if (!isNaN(stockNumber)) {
        searchQuery.stock = stockNumber;
      }
    }

    if (sort === "asc" || sort === "desc") {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const buildLinks = (products) => {
      const { prevPage, nextPage } = products;
      const baseUrl = req.originalUrl.split("?")[0];
      const sortParam = sort ? `&sort=${sort}` : "";

      const prevLink = prevPage
        ? `${baseUrl}?page=${prevPage}${sortParam}`
        : null;
      const nextLink = nextPage
        ? `${baseUrl}?page=${nextPage}${sortParam}`
        : null;

      return {
        prevPage: prevPage ? parseInt(prevPage) : null,
        nextPage: nextPage ? parseInt(nextPage) : null,
        prevLink,
        nextLink,
      };
    };

    const products = await p.getProductsPaginate(searchQuery, options);
    const { prevPage, nextPage, prevLink, nextLink } = buildLinks(products);
    const categories = await productsModelo.distinct("category");

    let requestedPage = parseInt(page);
    if (isNaN(requestedPage)) {
      return res.status(400).json({ error: "Page debe ser un número" });
    }
    if (requestedPage < 1) {
      requestedPage = 1;
    }

    if (requestedPage > products.totalPages) {
      return res
        .status(400)
        .json({ error: "No se encuentra la pagina indicada." });
    }

    return res.render("products", {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      page: parseInt(page),
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
      categories: categories,
      cart,
      user:req.session.user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/cart/:cid", async (req, res) => {
  let { cid } = req.params;
  const c = new CartManager();
  const cart = await c.getCartsById(cid);
  console.log({ cart });
  res.setHeader("Content-Type", "text/html");
  return res.status(200).render("cart", { cart });
});

router.get("/realtimeproducts", (req, res) => {
  const p = new ProductManager();
  const product = p.getProducts();
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("realtimeproducts", { product });
});

router.get("/chat", (req, res) => {
  res.status(200).render("chat");
});

router.get('/register', (req, res)=>{
    res.status(200).render('register')
})

router.get('/login', (req, res)=>{
  res.status(200).render('login')
})

router.get('/profile', auth, (req, res)=>{
  res.status(200).render('profile',{
    user:req.session.user
  })
})

export default router;