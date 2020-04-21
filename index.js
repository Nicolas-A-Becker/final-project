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

app.listen(3000, ()=>{
    console.log("listening on port 3000");
})