async function displayGpus(){
    let response = await fetch('api/gpus/');
    let gpusJSON = await response.json();
    let gpusDiv = document.getElementById("gpu-list");
    gpusDiv.innerHTML = "";

    for(i in gpusJSON){
        let gpu = gpusJSON[i];
        gpusDiv.append(getGpuItem(gpu));
    }
}

function getGpuItem(gpu){
    let gpuSection = document.createElement("section");
    gpuSection.classList.add("gpu");
    let aTitle = document.createElement("a");
    aTitle.setAttribute("data-id", gpu._id);
    aTitle.href = "#";
    aTitle.onclick = showGpuDetails;
    let h3Elem = document.createElement("h3");
    h3Elem.textContent = gpu.name;
    let pElem = document.createElement("p");
    pElem.textContent = "GPU: "+gpu.gpu;
    pElem.classList.add("dropdown");
    let pElem2 = document.createElement("p");
    pElem2.textContent = "Clock Speed(MHz): "+gpu.clock[0]+"/"+gpu.clock[1];
    pElem2.classList.add("dropdown");
    let pElem3 = document.createElement("p");
    pElem3.textContent = "Memory(gb): "+gpu.memory;
    pElem3.classList.add("dropdown");
    let pElem4 = document.createElement("p");
    pElem4.textContent = "Memory Type: "+gpu.memtype;
    pElem4.classList.add("dropdown");
    let pElem5 = document.createElement("p");
    pElem5.textContent = "Watts: "+gpu.watts;
    pElem5.classList.add("dropdown");

    let divElem = document.createElement("div");
    divElem.style.width = "200px";
    divElem.style.height = "100px";
    divElem.style.color = "lightgrey";
    gpuSection.append(divElem);

    h3Elem.append(pElem);
    h3Elem.append(pElem2);
    h3Elem.append(pElem3);
    h3Elem.append(pElem4);
    h3Elem.append(pElem5);
    aTitle.append(h3Elem);
    gpuSection.append(aTitle);

    return gpuSection;
}

async function showGpuDetails(){
    let id = this.getAttribute("data-id");
    let response = await fetch(`/api/gpus/${id}`);

    if(response.status != 200){
        console.log("Error receiving gpu");
        return;
    }

    let gpu = await response.json();
    document.getElementById("gpu-id").textContent = gpu._id;
    document.getElementById("txt-name").value = gpu.name;
    document.getElementById("txt-gpu").value = gpu.gpu;
    document.getElementById("txt-clock").value = gpu.clock[0]+"/"+gpu.clock[1];
    document.getElementById("txt-memory").value = gpu.memory;
    document.getElementById("txt-memtype").value = gpu.memtype;
    document.getElementById("txt-watts").value = gpu.watts;
}

async function addGpu(){
    let gpuName = document.getElementById("txt-add-name").value;
    let gpuGpu = document.getElementById("txt-add-gpu").value;
    let gpuMemory = document.getElementById("txt-add-memory").value;
    let gpuMemType = document.getElementById("txt-add-memtype").value;
    let gpuWatts = document.getElementById("txt-add-watts").value;

    //parse clock speeds into array
    let gpuClocks = document.getElementById("txt-add-clock").value;
    let clocks = gpuClocks.split("/");

    let gpu = {"name":gpuName,"gpu":gpuGpu,"clock":[clocks[0],clocks[1]],"memory":gpuMemory,"memtype":gpuMemType,"watts":gpuWatts};

    let response = await fetch('/api/gpus',{
        method:"POST",
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        },
        body:JSON.stringify(gpu)
    });

    if(response.status != 200){
        console.log("Error posting data");
        return;
    }

    let result = await response.json();
    console.log(result);
    displayGpus();
}


async function deleteGpu(){
    let gpuId = document.getElementById("gpu-id").textContent;

    let response = await fetch(`/api/gpus/${gpuId}`,{
        method:'DELETE',
        headers:{
            "content-Type":"application/json;charset=utf-8",
        },
    });

    if(response.status != 200){
        console.log("Error deleting");
        return;
    }

    let result = await response.json();
    displayGpus();
}

async function editGpu(){
    let gpuId = document.getElementById("gpu-id").textContent;
    let gpuName = document.getElementById("txt-name").value;
    let gpuGpu = document.getElementById("txt-gpu").value;
    let gpuMemory = document.getElementById("txt-memory").value;
    let gpuMemType = document.getElementById("txt-memtype").value;
    let gpuWatts = document.getElementById("txt-watts").value;

    //parse clock speeds into array
    let gpuClocks = document.getElementById("txt-clock").value;
    let clocks = gpuClocks.split("/");

    let gpu = {"name":gpuName,"gpu":gpuGpu,"clock":[clocks[0],clocks[1]],"memory":gpuMemory,"memtype":gpuMemType,"watts":gpuWatts};

    let response = await fetch(`/api/gpus/${gpuId}`,{
        method:"PUT",
        headers:{
            "content-Type":"application/json;charset=utf-8",
        },
        body:JSON.stringify(gpu)
    });

    if(response.status != 200){
        console.log("Error updating gpu");
        return;
    }

    let result = await response.json();
    displayGpus();
}

function toggleDetails(){
    let container = document.getElementById("gpu-details");
    if (container.classList.contains("hidden")) {
        container.classList.remove("hidden");
    } else {
        container.classList.add("hidden");
    }
}
function toggleAdd(){
    let container = document.getElementById("add-gpu");
    if (container.classList.contains("hidden")) {
        container.classList.remove("hidden");
    } else {
        container.classList.add("hidden");
    }
}

window.onload = function(){
    this.displayGpus();

    let addBtn = document.getElementById("btn-add-gpu");
    addBtn.onclick = addGpu;

    let deleteBtn = document.getElementById("btn-delete-gpu");
    deleteBtn.onclick = deleteGpu;

    let editBtn = document.getElementById("btn-edit-gpu");
    editBtn.onclick = editGpu;

    let toggleDetailsBtn = document.getElementById("btn-show-details");
    let toggleAddBtn = document.getElementById("btn-show-add");
    toggleDetailsBtn.onclick = toggleDetails;
    toggleAddBtn.onclick = toggleAdd;
}