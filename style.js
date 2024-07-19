// ここからJavaScriptを記述してください。
const config = {
    parent: document.getElementById("target"),
    url: "https://api.recursionist.io/builder/computers?type=",
    cpu:{
        brand:"#cpuBrand",
        model:"#cpuModel"
    },
    gpu:{
        brand:"#gpuBrand",
        model:"#gpuModel"
    },
    ram:{
        num:"#ramNum",
        brand:"#ramBrand",
        model:"#ramModel"
    },
    storage:{
        type:"#storageType",
        size:"#storageSize",
        brand:"#storageBrand",
        model:"#storageModel"
    }
}

class PC {
    constructor(){
        this.cpuBrand = null;
        this.cpuModel = null;
        this.cpuBenchmark = null;
        this.gpuBrand = null;
        this.gpuModel = null;
        this.gpuBenchmark = null;
        this.ramNum = null;
        this.ramBrand = null;
        this.ramModel = null;
        this.ramBenchmark = null;
        this.storageType = null;
        this.storageSize = null;
        this.storageBrand = null;
        this.storageModel = null;
        this.storageBenchmark = null;
    }

    static addBrandData(parts, selectBrand, pc) {
        switch(parts) {
            case "cpu":
                pc.cpuBrand = selectBrand;
                break;
            case "gpu":
                pc.gpuBrand = selectBrand;
                break;
            case "ram":
                pc.ramBrand = selectBrand;
                break;
            case "hdd":
                pc.storageBrand = selectBrand;
                break;
            case "ssd":
                pc.storageBrand = selectBrand;
                break;
        }
    }
    
    static addModelData(parts, selectModel, pc) {
        switch(parts) {
            case "cpu":
                pc.cpuModel = selectModel;
                break;
            case "gpu":
                pc.gpuModel = selectModel;
                break;
            case "ram":
                pc.ramModel = selectModel;
                break;
            case "hdd":
                pc.storageModel = selectModel;
                break;
            case "ssd":
                pc.storageModel = selectModel;
                break;
        }
    }

    static addBenchmarkData(parts, benchmark, pc) {
        switch(parts) {
            case "cpu":
                pc.cpuBenchmark = benchmark;
                break;
            case "gpu":
                pc.gpuBenchmark = benchmark;
                break;
            case "ram":
                pc.ramBenchmark = benchmark;
                break;
            case "hdd":
                pc.storageBenchmark = benchmark;
                break;
            case "ssd":
                pc.storageBenchmark = benchmark;
                break;
        }
    }

    static addStorageSizeData(selectSize, pc) {
        pc.storageSize = selectSize;
    }

    static getGamingBenchmark(pc) { //->Object
        let cpuScore = pc.cpuBenchmark * 0.25;
        let gpuScore = pc.gpuBenchmark * 0.6;
        let ramScore = pc.ramBenchmark * 0.125;
        let storageWeight = pc.storageType === "SSD" ? 0.1 : 0.025;
        let storageScore = pc.storageBenchmark * storageWeight;
        return parseInt(cpuScore + gpuScore + ramScore + storageScore);
    }

    static getWorkBenchmark(pc) { //->Object
        let cpuScore = pc.cpuBenchmark * 0.6;
        let gpuScore = pc.gpuBenchmark * 0.25;
        let ramScore = pc.ramBenchmark * 0.1;
        let storageScore = pc.storageBenchmark * 0.05;
        return parseInt(cpuScore + gpuScore + ramScore + storageScore);
    }
}

class View {
    static addPCButton(pc){
        const pcButton = document.getElementById("addPC");
        pcButton.addEventListener("click", () =>{
            Controller.clickAddPc(pc);
        });
    }

    static createResultPage(pc, gameScore, workScore, count) {
        const container = document.getElementById("result");
        let div = document.createElement("div");
        div.classList.add("bg-info", "text-white", "m-2", "col-12");
        div.innerHTML = 
        `
            <div class="d-flex justify-content-center align-items-center py-3">
                <h1>Your PC${count}</h1>
            </div>
            <div class="spec__result pl-3">
                <div class="result__cpu mb-4">
                    <h1>CPU</h1>
                    <h5>Brand: ${pc.cpuBrand}</h5>
                    <h5>Model: ${pc.cpuModel}</h5>
                </div>
                <div class="result__gpu mb-4">
                    <h1>GPU</h1>
                    <h5>Brand: ${pc.gpuBrand}</h5>
                    <h5>Model: ${pc.gpuModel}</h5>
                </div>
                <div class="result__ram mb-4">
                    <h1>RAM</h1>
                    <h5>Brand: ${pc.ramBrand}</h5>
                    <h5>Model: ${pc.ramModel}</h5>
                </div>
                <div class="result__storage mb-4">
                    <h1>Storage</h1>
                    <h5>Disk: ${pc.storageType}</h5>
                    <h5>Storage: ${pc.storageSize}</h5>
                    <h5>Brand: ${pc.storageBrand}</h5>
                    <h5>Model: ${pc.storageModel}</h5>
                </div>
            </div>
            <div class="d-flex mb-4 justify-content-around align-items-center">
                <div class="d-flex flex-column flex-sm-row">
                    <h1>Gaming: ${gameScore}%</h1>
                </div>
                <div class="d-flex flex-column flex-sm-row">
                    <h1>Work: ${workScore}%</h1>
                </div>
            </div>
        `;
        container.append(div);
        return container;
    }
}

class Controller{
    static count = 0;

    static startComputer() {
        const pc = new PC();
        View.addPCButton(pc);
        Controller.getAllData(pc);
    }

    static getAllData(pc) {
        const cpuBrandOp = document.querySelector(config.cpu.brand);
        const cpuModelOp = document.querySelector(config.cpu.model);
        const gpuBrandOp = document.querySelector(config.gpu.brand);
        const gpuModelOp = document.querySelector(config.gpu.model);
        const ramBrandOp = document.querySelector(config.ram.brand);
        const ramModelOp = document.querySelector(config.ram.model);
        const storageBrandOp = document.querySelector(config.storage.brand);
        const storageModelOp = document.querySelector(config.storage.model);

        Controller.getBrandData("cpu", cpuBrandOp, cpuModelOp, pc);
        Controller.getBrandData("gpu", gpuBrandOp, gpuModelOp, pc);
        Controller.getRamData(ramBrandOp, ramModelOp, pc);
        Controller.getStorageData(storageBrandOp, storageModelOp, pc);
    }

    static getBrandData(parts, brandOp, modelOp, pc) {
        fetch(config.url + parts).then(response => response.json()).then(data =>{
            let brandData = Controller.getBrand(data);
            let modelData = Controller.getModel(data);
            let benchmarkData = Controller.getBenchmark(data);
            for (let brand in brandData) {
                let option = document.createElement("option");
                option.value = brandData[brand];
                option.innerText = brandData[brand];
                brandOp.append(option);
            }
            brandOp.addEventListener("change", () => {
                Controller.getModelData(parts, brandOp, modelOp, modelData, benchmarkData, pc);
            })
        })
    }

    static getModelData(parts, brandOp, modelOp, modelData, benchmarkData, pc) {
        fetch(config.url + parts).then(response => response.json()).then(data => {
            let selectedBrand = brandOp.value;
            PC.addBrandData(parts, selectedBrand, pc);

            if (parts == "hdd" || parts == "ssd") {
                const storageSizeOp = document.querySelector(config.storage.size);
                let selectedSize = storageSizeOp.value;
                let filteredStorageModel = Controller.filterStorageModel(selectedSize, modelData[selectedBrand]);
                Controller.addOptionList(filteredStorageModel, modelOp);
            } else if (parts == "ram") {
                const ramNumOp = document.querySelector(config.ram.num);
                let selectedNumber = ramNumOp.value;
                let filteredRamModel = Controller.filterRamModel(selectedNumber, modelData[selectedBrand]);
                Controller.addOptionList(filteredRamModel, modelOp);
            } else {
                Controller.addOptionList(modelData[selectedBrand], modelOp);
            }
            modelOp.addEventListener("change", () => {
                let selectedModel = modelOp.value;
                let selectedBenchmark = benchmarkData[selectedModel];
                PC.addModelData(parts, selectedModel, pc);
                PC.addBenchmarkData(parts, selectedBenchmark, pc);
            });
        });
    }

    static getRamData(ramBrandOp, ramModelOp, pc) {
        const ramNumOp = document.querySelector(config.ram.num);
        ramNumOp.addEventListener("change", () => {
            Controller.getBrandData("ram", ramBrandOp, ramModelOp, pc);
        });
    }

    static getStorageData(storageBrandOp, storageModelOp, pc) {
        const storageTypeOp = document.querySelector(config.storage.type);
        const storageSizeOp = document.querySelector(config.storage.size);
        storageTypeOp.addEventListener("change", () => {
            let selectedStorageType = storageTypeOp.value;
            pc.storageType = selectedStorageType;
            if (selectedStorageType == "HDD") {
                Controller.getStorageSizeData("hdd");
                storageSizeOp.addEventListener("change", () => {
                    let selectedSize = storageSizeOp.value;
                    PC.addStorageSizeData(selectedSize, pc);
                    Controller.getBrandData("hdd", storageBrandOp, storageModelOp, pc);
                });
            } else {
                Controller.getStorageSizeData("ssd");
                storageSizeOp.addEventListener("change", () => {
                    let selectedSize = storageSizeOp.value;
                    PC.addStorageSizeData(selectedSize, pc);
                    Controller.getBrandData("ssd", storageBrandOp, storageModelOp, pc);
                });
            }
        });
    }

    static addOptionList(arr, op) {
        if (arr != undefined) {
            arr.forEach(word => {
                let option = document.createElement("option");
                option.value = word;
                option.innerText = word;
                op.append(option);
            });
        }    }

    static getStorageSizeData(type) {
        fetch(config.url + type).then(response => response.json()).then(data => {
            const storageSizeOp = document.querySelector(config.storage.size);
            let storageModelData = Controller.getStorageModel(data);            let storageSizeList = Controller.getStorageSizeList(storageModelData);
            Controller.addOptionList(storageSizeList, storageSizeOp);
        });
    }

    static getStorageSizeList(storageModelData) {        let storageModelList = Object.keys(storageModelData);        let tbList = [];
        let gbList = [];

        storageModelList.forEach(model => {
            if (model.includes("TB")) tbList.push(parseFloat(model.replace("TB", '')));
            else gbList.push(parseFloat(model.replace("GB", '')));
        });

        let sortTb = tbList.sort((a,b) => b - a).map(x => x.toString() + "TB");
        let sortGb = gbList.sort((a,b) => b - a).map(x => x.toString() + "GB");
        return sortTb.concat(sortGb);
    }

    static getBrand(data) {
        let brandData = {};
        for (let i in data) {
            let currentData = data[i];
            if (brandData[currentData.Brand] == undefined) brandData[currentData.Brand] = currentData.Brand;
        }
        return brandData;
    }

    static getModel(data) {
        let modelData = {};
        for (let i in data) {
            let currentData = data[i];
            if (modelData[currentData.Brand] == undefined) {
                modelData[currentData.Brand] = [currentData.Model];
            } else {
                modelData[currentData.Brand].push(currentData.Model);
            }
        }
        return modelData;
    }

    static getBenchmark(data) {
        let benchmarkData = {};
        for (let i in data) {
            let currentData = data[i];
            if (benchmarkData[currentData.Model] == undefined) benchmarkData[currentData.Model] = currentData.Benchmark;
        }
        return benchmarkData;
    }
    
    static getStorageModel(data) {
        let modelData = {};
        for (let i in data) {
            let currentData = Controller.getStorageSizeString(data[i].Model);
            if (modelData[currentData] == undefined) modelData[currentData] = currentData;
        }
        return modelData;
    }

    static getStorageSizeString(storageModel) {
        let storageSize = storageModel.split(' ').filter(word => {
            return word.includes("TB") || word.includes("GB")
        }).join('');
        return storageSize;
    }

    static filterStorageModel(size, storageModelData) {
        let storageModelList = Object.values(storageModelData);
        return storageModelList.filter(word => word.includes(' ' + size));
    }

    static filterRamModel(number, ramModelData) {
        let ramModelList = Object.values(ramModelData);
        return ramModelList.filter(word => word.includes(number + 'x'));
    }

    static clickAddPc(pc) {
        let modelList = [pc.cpuModel, pc.gpuModel, pc.ramModel, pc.storageModel];
        let gamingScore = PC.getGamingBenchmark(pc);
        let workScore = PC.getWorkBenchmark(pc);
        for (let i = 0; i < modelList.length; i++) {
            if (modelList[i] == null) alert("全てのフォームを埋めてください");
        }
        Controller.count++;
        return View.createResultPage(pc, gamingScore, workScore, Controller.count);
    }

}
Controller.startComputer();