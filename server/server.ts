require("dotenv").config();

import { app } from "./app";


app.listen(process.env.PORT , ()=>{
    console.log(`server is connented with ${process.env.PORT}`);
    
})