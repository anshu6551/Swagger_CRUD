require('dotenv').config()
const mongoose=require('mongoose');


const DbCon=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Database connected')
    } catch (error) {
        console.log(error)
    }
}


module.exports=DbCon