const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/gpus", {useUnifiedTopology:true, useNewUrlParser:true})
    .then(()=> console.log("Connected to mongodb"))
    .catch(err => console.log("Couldn't connect to mongodb", err));

const gpuSchema = new mongoose.Schema({
    name:String,
    gpu:String,
    clock:[Number],
    memory:Number,
    memtype:String,
    watts:Number
});

const GPU = mongoose.model("GPU", gpuSchema);

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

async function getGpus(res){
    const gpus = await GPU.find();
    console.log(gpus);
    res.send(gpus);
}

app.get('/api/gpus', (req,res)=>{
    getGpus(res);
});

async function getGpu(id, res){
    const gpu = await GPU.findOne({_id:id});
    console.log(gpu);
    res.send(gpu);
}

app.get('/api/gpus/:id', (req,res)=>{
    getGpu(req.params.id, res);
});


async function createGpu(gpu, res){
    const result = await gpu.save();
    console.log(result);
    res.send(gpu);
}

app.post('/api/gpus', (req,res)=>{
    /*const result = validateGpu(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }*/

    console.log("GPU is validated");
    const gpu = new GPU({
        name:req.body.name,
        gpu:req.body.gpu,
        clock:[parseInt(req.body.clock[0]),parseInt(req.body.clock[1])],
        memory:parseInt(req.body.memory),
        memtype:req.body.memtype,
        watts:parseInt(req.body.watts)
    });
    console.log("GPU is created");

    createGpu(gpu, res);
});

function validateGpu(gpu){
    const schema = {
        name:Joi.string().min(3).required(),
        gpu:Joi.string().min(3).required(),
        memtype:Joi.string().min(3).required()
    };

    return Joi.validate(gpu, schema);
}

async function removeGpu(res, id){
    const gpu = await GPU.findByIdAndRemove(id);
    res.send(gpu);
}

app.delete('/api/gpus/:id', (req,res)=>{
    removeGpu(res, req.params.id);
});

async function updateGpu(res, id, name, gpu, clock, memory, memtype, watts){
    const result = await GPU.updateOne({_id:id},{
        $set:{
            name:name,
            gpu:gpu,
            clock:[parseInt(clock[0]),parseInt(clock[1])],
            memory:parseInt(memory),
            memtype:memtype,
            watts:parseInt(watts)
        }
    });
    console.log("After updateGPU result created");

    res.send(result);
}

app.put('/api/gpus/:id', (req,res)=>{
    /*const result = validateGpu(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }*/

    updateGpu(res, req.params.id, req.body.name, req.body.gpu, req.body.clock, req.body.memory, req.body.memtype, req.body.watts);
});

app.listen(3000, ()=>{
    console.log("listening on port 3000");
})