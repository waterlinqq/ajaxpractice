console.log('-----start------')
var pageViewQty = 8; //每頁顯示的景點數量 
var noDataText = "沒有提供資料"//無資料時顯示的文字


//取得作品資料
var artData =""
function getArtData(){
    console.log('getArtData')
    var xhr = new XMLHttpRequest();
    xhr.open("GET","./data/publicArt.json",true);
    xhr.send(null);
    xhr.onreadystatechange = function(){
        if( xhr.status == 200){
            artData = JSON.parse(xhr.responseText);       
             //檢查LocalStorage中是否有存在最後一筆紀錄（瀏覽器重新整理判斷用） 
            var lastPage = JSON.parse(localStorage.getItem('lastPage'));
            if (lastPage) {
                selectArea(lastPage.areaName, lastPage.pageNo);
            } else {
                selectArea()
            }
        }else{
            document.querySelector(".infoboxs").innerHTML = "<p>資料取得時發生錯誤，請重新整理頁面</p>"
        }
    }
}

//依照地區決定要顯示的資料
function selectArea(areaName, pageNo){
    console.log('selectArea')
     //如果沒傳入頁碼,則頁碼為1,並儲存瀏覽紀錄
    if (!pageNo) {
        pageNo = 1;
        areaName = document.querySelector('.select-area').value;
        setHistory(areaName, pageNo);
    }
    //建立對應的作品資料
    setArtData(areaName, pageNo)
}

//
var nowAreaName = '';
var nowArtData = []
var nowViewDataCnt = 0;
function setArtData(areaName, pageNo){
    console.log('setArtdata')
    if (nowAreaName != areaName) {
        nowAreaName = areaName
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
            if( dataAreaName == nowAreaName){
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
        nowViewDataCnt = nowArtData.length;
    }
    if (!pageNo) {
        pageNo = '1';
    }
    sortArray(nowArtData)
    createArtBoxes(pageNo);
    createPaging(pageNo);
   document.querySelector('.select-area').value = nowAreaName;
}

//依照選擇進行排序
function sortArray(arr){
    console.log('sortArray')
    if(document.querySelector('.select-sort').value === 'hit'){
        arr.sort(function(arr1, arr2){
            return arr1.dataHitRate - arr2.dataHitRate
        })
    }else{
        arr.sort(function(arr1, arr2){
            return arr1.dataYear - arr2.dataYear
        })
    }
}

//組出對應頁碼作品資料
function createArtBoxes(pageNo){
    console.log('createartboxes')
    var infoBoxContainer = ""
    if (pageNo == 1) {
        var pageStart = 0;
        var pageEnd = pageViewQty;
    } else {
        var pageStart = parseInt(pageNo * pageViewQty - pageViewQty);
        var pageEnd = parseInt(pageNo * pageViewQty);
    }
    for(var i = pageStart; i < pageEnd; i++){
        if (i == nowViewDataCnt) {
            break;
        }
        infoBoxContainer +=  
        '<div class="infoboxs-container">'+
        '<a class="info-modal" href="javascript:;" data-artNo="' + nowArtData[i].dataArtNo + '"></a>'+
            '<div class="infoboxs-up">'+
                '<img src="' + nowArtData[i].dataImgUrl + '" alt="" class="info-img">'+
                '<p class="info-name">' + nowArtData[i].dataName+ '</p>'+
                '<p class="info-area">' + nowArtData[i].dataAreaName + '</p>'+
            '</div>'+
            '<div class="infoboxs-down">'+
                '<p class="info-author"><b>作者：</b>&nbsp;' + nowArtData[i].dataAuthor + '</p>'+
                '<p class="info-address"><b>地址：</b>&nbsp;' + nowArtData[i].dataAddress + '</p>'+
            '</div>'+
           
        '</div>'
    };
    var totalResult = '<p class="total">共計'+ nowViewDataCnt +'筆資料</p>'
    document.querySelector(".infoboxs").innerHTML = totalResult+ infoBoxContainer
    //建立modal資料
    setInfoModal() 
}

//組出分頁按鈕
function createPaging(pageNo) {
    console.log('createPaging')
    var page = '';
    //計算分頁數量(當前景點總數/每頁要顯示的景點數量,無條件進位)
    console.log(nowViewDataCnt )
    var pageCnt = Math.ceil(nowViewDataCnt / pageViewQty);
    //if (pageCnt > 1) {
        for (var i = 0; i < pageCnt; i++) {
            var setNo = parseInt(i + 1);
            if (pageNo == setNo) {
                page += '<li class="paging-pages active">' + setNo + '</li>';
            } else {
                page += '<li class="paging-pages">' + setNo + '</li>';
            }
        }
        document.querySelector('.paging').innerHTML = page;
        //綁定分頁按鈕功能
        setPageButton()
        //監聽選擇排序
        listenSelectSort()
    //}
}
//進行作品資料按鈕功能綁定
function setPageButton() {
    console.log('setPageButton')
    var pageEl = document.querySelectorAll('.paging-pages');
    for (var i = 0; i < pageEl.length; i++) {
        pageEl[i].addEventListener('click', function(e) {
            pageNo = e.srcElement.textContent;
            window.scrollTo(0, 300);
            //寫入瀏覽紀錄
            setHistory(nowAreaName, pageNo);
            //建立對應頁碼的景點資料
            createArtBoxes(pageNo); 
            //建立對應頁碼的分頁按鈕
            createPaging(pageNo); 
        }, false);
    }
}
//監聽選擇排序
function listenSelectSort() {
    console.log('istenSelectSort')
    document.querySelector('.select-sort').addEventListener('change', function() {
        var lastPage = JSON.parse(localStorage.getItem('lastPage'));
            if (lastPage) {
                selectArea(lastPage.areaName, lastPage.pageNo);
            } else {
                selectArea()
            }
    }, false);
    
}

//紀錄當前縣市及頁數,並儲存在history及localstorage中
function setHistory(areaName, pageNo) {
    console.log('setHistory')
    var historyData = '{"areaName":"' + areaName + '","pageNo":' + pageNo + '}';
    history.pushState(historyData, '', '');
    localStorage.setItem('lastPage', historyData);
}


//當觸發上一頁時,檢查history.state是否有值
window.onpopstate = function(e) {
    if (e.state) {
        localStorage.setItem('lastPage', e.state);
        var historyData = JSON.parse(e.state);
        //組出對應的景點資料
        setArtData(historyData.areaName, historyData.pageNo);
    } else {
        history.back();
    }
}


///監聽modal關閉按鈕
function listenModalClose(){
    console.log('listenModalClose')
    var modalEle = document.querySelector(".modal")
    modalEle.addEventListener("click",function(e){
        if(e.target.className == "modal" || e.target.classList.contains("close-button")){
            modalEle.style.display = "none";
        }
    })
}
//建立縣市區下拉選框
function createAreaSelect(){
    console.log('createAreaSelect')
    var areaName = ["臺北市","基隆市","新北市","連江縣","宜蘭縣","新竹市","新竹縣","桃園市","苗栗縣","臺中市","彰化縣","南投縣","嘉義市","嘉義縣","雲林縣","臺南市","高雄市","澎湖縣","金門縣","屏東縣","臺東縣","花蓮縣"]
    var selectAreaEle = document.querySelector(".select-area")
    for(var i = 0; i < areaName.length; i++ ){
        selectAreaEle.innerHTML += "<option value='" + areaName[i] + "'>"+areaName[i]+"</option>"
    }
    getArtData()
}
//監聽縣市區下拉選框更動
function listenAreaSelect(){
    console.log('listenareaselect')
    var selectAreaEle = document.querySelector(".select-area")
    selectAreaEle.addEventListener("change",selectArea,false)
}

// 監聽boxes 當點擊時showModal  獲取該資料後修改modal並顯示 
function setInfoModal() {
    console.log('setInfoModal')
    var infoModalEle = document.querySelectorAll('.info-modal');
    for (var i = 0; i < infoModalEle.length; i++) {
        infoModalEle[i].addEventListener('click', function(e) {
            showModal(e.target.getAttribute('data-artNo'));
        }, false);
    }
}

//獲取該資料後修改modal並顯示 
function showModal(artNo){
    console.log('showModal')
    for( var i = 0; i < nowArtData.length; i++){
        if( artNo == nowArtData[i].dataArtNo){
            document.querySelector(".art-name").textContent =  nowArtData[i].dataName;
            document.querySelector(".art-intro").textContent =  nowArtData[i].dataIntro;
            document.querySelector(".art-address").textContent =  nowArtData[i].dataAddress;
            document.querySelector(".art-author").textContent =  nowArtData[i].dataAuthor;
            document.querySelector(".art-year").textContent =  nowArtData[i].dataYear + '年';
            document.querySelector(".art-area-name").textContent =  nowArtData[i].dataAreaName;
            document.querySelector(".modal-body img").setAttribute("src",nowArtData[i].dataImgUrl);
 
            initMap(parseFloat(nowArtData[i].dataLatitude), parseFloat(nowArtData[i].dataLongitude));
            break;
        }
    }
    document.querySelector(".modal").style.display = "block";
    listenModalClose();
} 

//初始化地圖
function initMap(lat,lng) {
    console.log('initmap')
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

createAreaSelect();
listenAreaSelect();
