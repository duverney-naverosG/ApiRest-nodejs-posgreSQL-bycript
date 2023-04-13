import Express  from "express";
import morgan from "morgan";
import { config } from "dotenv";
import productosRouter from "./routers/productos.routes.js";
import facturasRouter from "./routers/facturas.routes.js";
import FacrurasDetallesRouter from "./routers/detalleFactura.routes.js";
import ClientesFactura from "./routers/clientes.routes.js";
import cajerosRouter from "./routers/cajeros.routes.js"
import  loginRouter  from "./routers/login.routes.js";

const app = Express();
config();

//middewale
app.use(morgan('dev'));
app.use(Express.json()); //uso de json 
app.use(Express.urlencoded({extended: false})); //uso de datos de FORM 

app.use('/api', productosRouter);
app.use('/api', facturasRouter);
app.use('/api', FacrurasDetallesRouter);
app.use('/api', ClientesFactura);
app.use('/api', cajerosRouter);
app.use('/api', loginRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`puerto encendido en el puerto ${process.env.PORT} 🪐🛸🚀🌍`);
});
