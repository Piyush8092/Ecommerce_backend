let contactModel=require('../../models/contactModel');

const createContact=async(req,res)=>{
    try{
let payload=req.body;
let email=req.user.email;
let name=req.user.name;

if( !payload.subject || !payload.message){
    return res.status(400).json({message: 'All fields are required'});
}
const newContact=new contactModel(payload);
newContact.email=email;
newContact.name=name;
const result=await newContact.save();
res.json({message: 'Contact created successfully', status: 200, data: result, success: true, error: false});
    }
    catch(e){
        res.json({message: 'Something went wrong', status: 500, data: e, success: false, error: true});
    }
}

module.exports={createContact};