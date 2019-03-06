var noDataText = "沒有提供資料"

var siteData =""
function getSiteData(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","./data/site.json",true);
    xhr.send(null);
    xhr.onreadystatechange = function(){
        if( xhr.status == 0){
            siteData = JSON.parse(xhr.responseText);
            selectArea("基隆市")
        }else{
            document.querySelector(".infoboxs").innerHTML = "<p>資料取得時發生錯誤，請重新整理頁面</p>"
        }
    }
}

function selectArea(areaName){
    
    areaName = document.querySelector(".select-area").selectedOptions[0].text
    setSiteData(areaName)
}


var nowSiteData = []
function setSiteData(areaName){
    nowSiteData = []
    for( i = 0; i < siteData.length; i++){
        var dataName = siteData[i].name || noDataText;
        var dataType = siteData[i].typeName || noDataText;
        var dataAddress = siteData[i].address || noDataText;
        var dataLevel = siteData[i].level || noDataText;
        var dataHeadCity = siteData[i].headCityName || noDataText;
        var dataAreaName = siteData[i].cityName || noDataText;
        var dataRegisterDate = siteData[i].registerDateValue || noDataText;
        var dataSiteNo = siteData[i].mainTypePk || noDataText;
        var dataImgUrl = "https://data.boch.gov.tw/old_upload/_upload/Assets_new/archeology/5206/photo/CE02%E6%96%B0%E5%8C%97%E5%B8%82%E5%8D%81%E4%B8%89%E8%A1%8C%E9%81%BA%E5%9D%80(1).JPG"
        if( dataAreaName == areaName){
            nowSiteData.push({
                "dataName": dataName,
                "dataType": dataType,
                "dataAddress": dataAddress,
                "dataLevel": dataLevel,
                "dataHeadCity": dataHeadCity,
                "dataAreaName": dataAreaName,
                "dataRegisterDate": dataRegisterDate,
                "dataSiteNo": dataSiteNo,
                "dataImgUrl": dataImgUrl
            })
        }
    }
    createView()
}
function showModal(siteNo){
    for( var i = 0; i < nowSiteData.length; i++){
        if( siteNo == nowSiteData[i].dataSiteNo){
            document.querySelector(".site-name").textContent =  nowSiteData[i].dataName;
            document.querySelector(".site-type").textContent =  nowSiteData[i].dataType;
            document.querySelector(".site-address").textContent =  nowSiteData[i].dataAddress;
            document.querySelector(".site-level").textContent =  nowSiteData[i].dataLevel;
            document.querySelector(".site-headcity").textContent =  nowSiteData[i].dataHeadCity;
            document.querySelector(".site-area-name").textContent =  nowSiteData[i].dataAreaName;
            document.querySelector(".site-register-date").textContent =  nowSiteData[i].dataRegisterDate;
            document.querySelector(".modal-body img").setAttribute("src",nowSiteData[i].dataImgUrl);
        }
    }
    document.querySelector(".modal").style.display = "block";
} 


function createView(){
    var infoBoxContainer = ""
    for(var i = 0; i < nowSiteData.length; i++){
        infoBoxContainer +=  
        '<div class="infoboxs-container">'+
            '<div class="infoboxs-up">'+
                '<img src="' + nowSiteData[i].dataImgUrl + '" alt="" class="info-img">'+
                '<p class="info-name">' + nowSiteData[i].dataName+ '</p>'+
                '<p class="info-area">' + nowSiteData[i].dataAreaName + '</p>'+
            '</div>'+
            '<div class="infoboxs-down">'+
                '<p class="info-address"><b>地址:</b>' + nowSiteData[i].dataAddress + '</p>'+
                '<p class="info-type"><b>類別:</b>' + nowSiteData[i].dataType + '</p>'+
            '</div>'+
            '<a class="info-modal" href="javascript:;" data-siteNo="' + nowSiteData[i].dataSiteNo + '"></a>'+
        '</div>'
    };
    document.querySelector(".infoboxs").innerHTML = infoBoxContainer
    setInfoModal() 
}

function listenModalClose(){
    var modalEle = document.querySelector(".modal")
    modalEle.addEventListener("click",function(e){
        if(e.target.className == "modal" || e.target.classList.contains("close-button")){
            modalEle.style.display = "none";
        }
    })
}
function createAreaSelect(){
    var areaName = ["臺北市","基隆市","新北市","連江縣","宜蘭縣","新竹市","新竹縣","桃園市","苗栗縣","臺中市","彰化縣","南投縣","嘉義市","嘉義縣","雲林縣","臺南市","高雄市","澎湖縣","金門縣","屏東縣","臺東縣","花蓮縣"]
    var selectAreaEle = document.querySelector(".select-area")
    for(var i = 0; i < areaName.length; i++ ){
        selectAreaEle.innerHTML += "<option value='" + areaName[i] + "'>"+areaName[i]+"</option>"
    }
    //繼續默認顯示 但先獲取撈資料
    getSiteData()
}
//監聽選框 如有更動 執行
function listenAreaSelect(){
    var selectAreaEle = document.querySelector(".select-area")
    selectAreaEle.addEventListener("change",selectArea,false)
}

function setInfoModal() {
    var infoModalEle = document.querySelectorAll('.info-modal');
    for (var i = 0; i < infoModalEle.length; i++) {
        infoModalEle[i].addEventListener('click', function(e) {
            showModal(e.target.getAttribute('data-siteNo'));
        }, false);
    }
}
listenAreaSelect()
listenModalClose();
createAreaSelect();