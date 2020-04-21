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
    let pElem2 = document.createElement("p");
    pElem2.textContent = "Clock Speed(MHz): "+gpu.clock[0]+"/"+gpu.clock[1];
    let pElem3 = document.createElement("p");
    pElem3.textContent = "Memory(gb): "+gpu.memory;
    let pElem4 = document.createElement("p");
    pElem4.textContent = "Memory Type: "+gpu.memtype;
    let pElem5 = document.createElement("p");
    pElem5.textContent = "Watts: "+gpu.watts;
    pElem.append(pElem2);
    pElem.append(pElem3);
    pElem.append(pElem4);
    pElem.append(pElem5);
    h3Elem.append(pElem);
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

window.onload = function(){
    this.displayGpus();
}