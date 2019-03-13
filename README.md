# Public Art 公共藝術景觀

[[demo]](https://waterlinqq.github.io/ajaxpractice/)

查詢台灣各縣市的公共藝術景觀資料，模仿對象是參考[guahsu](https://github.com/guahsu)所做的[台北旅遊景點](https://github.com/guahsu/JavaScript-TravelMap)，景觀資料來源為政府資料開放平臺。


### 應用技術點 
* JavaScript
  * 使用XMLHttpRequest 擷取資料實現AJAX
  * history.pushState 添加頁面記錄，達成切頁效果
  * 串接GoogleMap API 動態顯示每個景觀的地理位置
  * 添加排序功能 將選取的資料依選擇排序並展示
----
* CSS
  * RWD響應式設計
  * 文字溢出省略號 
  * img object-fit 
----
* HTML
  * LocalStorage 存儲頁面記錄，不因重整或關閉瀏覽器而消失
  * modal模態框使用