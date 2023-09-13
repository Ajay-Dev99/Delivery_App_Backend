const http = require("http")
const app = require("./app")

const server = http.createServer(app)

const port = process.env.PORT_NUMBER 

server.listen(port,(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log(`Server starts on port ${port}`);
    }
})