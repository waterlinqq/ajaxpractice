var noDataText = "沒有提供資料"

var artData =""
function getArtData(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","./data/publicArt.json",true);
    xhr.send(null);
    xhr.onreadystatechange = function(){
        if( xhr.status == 0){
            artData = JSON.parse(xhr.responseText);
            selectArea()
        }else{
            document.querySelector(".infoboxs").innerHTML = "<p>資料取得時發生錯誤，請重新整理頁面</p>"
        }
    }
}

function selectArea(areaName){
    
    areaName = document.querySelector(".select-area").selectedOptions[0].text
    setArtData(areaName)
}


var nowArtData = []
function setArtData(areaName){
    nowArtData = []
    for( i = 0; i < artData.length; i++){
        var dataName = artData[i].name || noDataText;
        var dataIntro = artData[i].intro || noDataText;
        var dataAddress = artData[i].address || noDataText;
        var dataAuthor = artData[i].author || noDataText;
        var dataYear = artData[i].buildingYearName || noDataText;
        var dataAreaName = artData[i].cityName || noDataText;
        var dataHitRate = artData[i].hitRate || noDataText;
        var dataArtNo = artData[i].mainTypePk || noDataText;
        var dataLongitude = artData[i].longitude|| noDataText;
        var dataLatitude = artData[i].latitude || noDataText;
        var dataImgUrl = artData[i].representImage || './img/replacePicture.jpg';
        if( dataAreaName == areaName){
            nowArtData.push({
                "dataName": dataName,
                "dataIntro": dataIntro,
                "dataAddress": dataAddress,
                "dataAuthor": dataAuthor,
                "dataYear": dataYear,
                "dataAreaName": dataAreaName,
                "dataHitRate": dataHitRate,
                "dataArtNo": dataArtNo,
                "dataImgUrl": dataImgUrl,
                "dataLongitude": dataLongitude,
                "dataLatitude":　dataLatitude
            })
        }
    }
    createArtBoxes()
}
function showModal(artNo){
    for( var i = 0; i < nowArtData.length; i++){
        if( artNo == nowArtData[i].dataArtNo){
            document.querySelector(".art-name").textContent =  nowArtData[i].dataName;
            document.querySelector(".art-intro").textContent =  nowArtData[i].dataIntro;
            document.querySelector(".art-address").textContent =  nowArtData[i].dataAddress;
            document.querySelector(".art-author").textContent =  nowArtData[i].dataAuthor;
            document.querySelector(".art-year").textContent =  nowArtData[i].dataYear;
            document.querySelector(".art-area-name").textContent =  nowArtData[i].dataAreaName;
            document.querySelector(".modal-body img").setAttribute("src",nowArtData[i].dataImgUrl);
            initMap(parseFloat(nowArtData[i].dataLatitude), parseFloat(nowArtData[i].dataLongitude))
        }
    }
    document.querySelector(".modal").style.display = "block";
} 

function initMap(lat,lng) {
    var location = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('google-map'), {
      zoom: 15,
      center: location
    });
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
  }


function createArtBoxes(){
    var infoBoxContainer = ""
    for(var i = 0; i < nowArtData.length; i++){
        infoBoxContainer +=  
        '<div class="infoboxs-container">'+
            '<div class="infoboxs-up">'+
                '<img src="' + nowArtData[i].dataImgUrl + '" alt="" class="info-img">'+
                '<p class="info-name">' + nowArtData[i].dataName+ '</p>'+
                '<p class="info-area">' + nowArtData[i].dataAreaName + '</p>'+
            '</div>'+
            '<div class="infoboxs-down">'+
                '<p class="info-author"><b>&nbsp;作者：</b>&nbsp;' + nowArtData[i].dataAuthor + '</p>'+
                '<p class="info-address"><b>&nbsp;地址：</b>&nbsp;' + nowArtData[i].dataAddress + '</p>'+
            '</div>'+
            '<a class="info-modal" href="javascript:;" data-artNo="' + nowArtData[i].dataArtNo + '"></a>'+
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
    getArtData()
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
            showModal(e.target.getAttribute('data-artNo'));
        }, false);
    }
}


listenAreaSelect();
listenModalClose();

/*setTimeout(createAreaSelect,5000)*/
createAreaSelect();