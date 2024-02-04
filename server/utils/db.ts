require('dotenv').config()

import mongoose from "mongoose"

const dbUrl : string = process.env.MONGODB_CONNECTION_STRING || ''

 const connectToDB = async () => {
    try {
        await mongoose.connect(dbUrl).then((data:any) =>{
            console.log(`Database is connected to ${data.connenction.host}`);
            
        });
    } catch (error) {
        console.log("error:",error);
        setTimeout(connectToDB,5000)
    }
}

export default connectToDB;

// export default async function connst(){

// }