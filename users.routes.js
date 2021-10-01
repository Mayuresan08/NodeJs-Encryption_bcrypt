const router =require("express").Router()

const mongo = require("../mongo")
//importing bcrypt module
const bcrypt =require("bcrypt")
router.post("/registration",async(req,res)=>{
try{
    const data= await mongo.users.findOne({email:req.body.email})

    console.log(data)

    if(data)  return res.status(400).send({error:"user already exsist"})


    //generating salt 
    const salt=await bcrypt.genSalt()
    console.log(salt)

    //hashing the password with generated salt
    req.body.password= await bcrypt.hash(req.body.password,salt)
    console.log(req.body.password)
    const insertedData=await mongo.users.insertOne(req.body)

    console.log(insertedData)

    res.status(201).send("user registered")

}
catch(err)
{
    console.log("Error in registration",err)
}
})

router.post("/login",async (req,res)=>{
    //Check email exsist
    const user= await mongo.users.findOne({email:req.body.email})
    if(!user) return res.status(400).send({error:"User not found,Please sign up"})

    //check  password using bcrypt.compare()
    const isValid =await bcrypt.compare(req.body.password,user.password)
    console.log(isValid)

    if(!isValid) return res.status(400).send("Incorrect Email/Password")
    else return res.send(`Welcome ${user.name}`)

})

module.exports=router
