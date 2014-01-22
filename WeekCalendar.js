/**
 * Created by cwwu on 13-11-29.
 * email:wchaowu@163.com
 */
var configCalendar = {
    prevYearText:"向前翻 1 年&#13快捷键：←",
    showYearText:"点击此处选择年份",
    nextYearText:"向后翻 1 年&#13快捷键：→",
    weekPageUp:"向上周翻&#13快捷键：↑",
    weekPageDown:"向下翻&#13快捷键：↓",
    nextWeek:"下一周",
    returnNextWeek:"下一周&#13快捷键：N",
    thisWeek:"本  周",
    returnThisWeek:"本  周&#13快捷键：T",
    hiddenCalendar:"关 闭&#13快捷键：Esc",
    closeText:"关 闭",
    weekText:"周"
}

function WeekCalendar() // 初始化日历的设置
{
	var _that = this;
	this.regInfo = configCalendar.closeText;
	this.daysMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	this.weekObj  = new Array(8);
	this.weekArray = new Array();
	this.objExport = null;
	this.objHidExport = null;
	this.eventSrc = null;
	this.weeknum = null;
    _that.toDayWeeknum = null;
	this.weekcount = null;
	this.thisYear = new Date().getFullYear();
	this.thisMonth = new Date().getMonth();
	this.thisDay = new Date().getDate();
	this.today = new Date(parseInt(this.thisYear), parseInt(this.thisMonth),parseInt(this.thisDay), 0, 0, 0, 0); // 今天(d/m/yyyy)
    this.yearFall = 20; // 定义年下拉框的年差值
    this.weekshow_beginNum =null;
    this.weekshow_endNum =null; //显示列表结束周数
    this.weekColor = "#DAFFFF";    //今天在周历上的标示背景色
   var _iframe =  document.createElement("iframe");
    _iframe.style.cssText= "width: 178px; height: 210px;overflow: hidden;";
    _iframe.src = "about:blank";
    _iframe.scrolling = "no";
	var _calendar = document.createElement("div"); // 日历的层
    _calendar.style.cssText = "position: absolute; z-index: 9999; width: 180px; height: 216px; display: none;border:#C5D9E8 solid 1px";
    this.calendar = _calendar;
    this.iframe = _iframe;
    _that.calendar.appendChild(_iframe);
    document.body.appendChild(_calendar);
    this.iframeDocument = (_iframe.contentWindow || _iframe).document;
    this.getObjectById=function (id) {
        if (document.all)
            return (eval("document.all." + id));
        return (eval(id));
    };
    this.addEvent = function( obj, type, fn ) {
        if(!obj){
            return;
        }
        if (obj.addEventListener)
            obj.addEventListener( type, fn, false );
        else if (obj.attachEvent) {
            obj["e"+type+fn] = fn;
            obj.attachEvent( "on"+type, function() {
                obj["e"+type+fn].call(obj, window.event);
            } );
        }
    };
    this.removeEvent = function( obj, type, fn ) {
        if(!obj){
            return;
        }
        if (obj.removeEventListener)
            obj.removeEventListener( type, fn, false );
        else if (obj.detachEvent) {
            obj.detachEvent(  "on" +type, obj["e"+type+fn] );
            obj["e"+type+fn] = null;
        }
    };
    this.writeIframe = function () {
        var strIframe = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=GBK'><style type='text/css'>"
            + "*{font-size: 12px;}"
            + ".weekList{line-height:24px;cursor:default;}"
            + ".td_year{line-height:22px; cursor:default;background-color:#EEEEEE;}"
            + ".btn{background-color:#EEEEEE; line-height:22px; cursor: pointer;}</style></head>"
            + "<body onselectstart='return false' style='margin: 0px'><form name='form_'>";

        strIframe += "<select name='tmpYearSelect' id='_tmpYearSelect'  style='z-index:1;position:absolute;top:3;left:63;display:none'></select>";
        strIframe += "<table id='top_t' width='100%' border='0' cellspacing='1' cellpadding='0'><tr align='center'>"
            + "<td width='40' class='btn' onMouseOver=\"this.style.backgroundColor='#76D7DC'\" onMouseOut=\"this.style.backgroundColor=''\" title='"+configCalendar.prevYearText+"'  id='_prevY'><img id='_parent_prevY' src='left.gif' width='5' height='9'/></td>"
            + "<td class='td_year' onMouseOver=\"this.style.backgroundColor='#EEEEEE'\" onMouseOut=\"this.style.backgroundColor=''\" id='_funYearSelect' title='"+configCalendar.showYearText+"'>&nbsp;</td>"
            + "<td width='40' onMouseOver=\"this.style.backgroundColor='#76D7DC'\" onMouseOut=\"this.style.backgroundColor=''\" class='btn' title='"+configCalendar.nextYearText+"' id='_nextY'><img id='_parent_nextY' src='right.gif' width='5' height='9' /></td></tr></table>";
        strIframe += "<table id='main_t' width='100%' border='0' cellspacing='0' cellpadding='0'> "
            + "<tr><td  id='_weekPageUp' title='"+configCalendar.weekPageUp+"' style='background:url(up.gif) no-repeat center; height: 12px;'></td></tr>";
        for (var x = 0; x < 6; x++) {
            strIframe += "<tr><td class='weekList' week='weekLi" + x	+ "'>&nbsp;</td></tr>"
        }
        strIframe += "<tr><td  id='_weekPageDown' title='"+configCalendar.weekPageUp+"' style=' background: url(down.gif) no-repeat center;height: 12px;'></td></tr></table>";
        strIframe += "<table id='bottom_t' width='100%' border='0' cellspacing='1' cellpadding='0' align='center'><tr align='center'>"
            + "<td class='btn' title='"+configCalendar.returnNextWeek+"' id='_returnNextWeek' onMouseOver=\"this.style.backgroundColor='#76D7DC'\" onMouseOut=\"this.style.backgroundColor=''\" width='60'>"+configCalendar.nextWeek+"</td><td class='btn' title='"+configCalendar.returnThisWeek+"' id=\"_returnThisWeek\" onMouseOver=\"this.style.backgroundColor='#76D7DC'\" onMouseOut=\"this.style.backgroundColor=''\" >"+configCalendar.thisWeek+"</td>"
            + "<td class='btn' title='"+configCalendar.hiddenCalendar+"' onMouseOver=\"this.style.backgroundColor='#76D7DC'\" onMouseOut=\"this.style.backgroundColor=''\"  width='60' id='_hiddenCalendar'>"+configCalendar.closeText+"</td></tr></table></form></body></html>";
            with(_that.iframeDocument){
                writeln(strIframe);
                  close();
               }
           var b = _that.iframeDocument;
            _that.weekObj = b.getElementById("main_t").getElementsByTagName("td");
            for (var i = 1; i < 7; i++) {
                _that.weekObj[i].onmouseover =_that.weekMouseOver;
                _that.weekObj[i].onmouseout =_that.weekMouseOut;
                _that.weekObj[i].onclick = _that.returnDate;
            }
        var tmpYearSelect = b.getElementById("_tmpYearSelect");
        _that.addEvent(b.body, "click", function (e) {
            e = e || window.event;
            e = e.target || e.srcElement;
            if ((e = e.id && e.id.replace("_parent","").substring(1), _that[e])) _that[e]();
        });
        _that.addEvent(tmpYearSelect, "blur", function () {
            _that.hiddenSelect(tmpYearSelect);

        });
        _that.addEvent(tmpYearSelect, "change", function () {
            _that.thisYear =tmpYearSelect.value||tmpYearSelect.options[0].text;
            _that.hiddenSelect(tmpYearSelect);
            _that.writeCalendar();
        });

        _that.addEvent(b,"keydown",function (a){
            switch(a.keyCode){
                case 27 : _that.hiddenCalendar(); break;
                case 37 : _that.prevY(); break;
                case 38 : _that.weekPageUp();  break;
                case 39 : _that.nextY();   break;
                case 40 :  _that.weekPageDown(); break;
                case 84 : _that.returnThisWeek(); break;
                case 78 : _that.returnNextWeek(); break;
            }
            window.event.keyCode = 0; window.event.returnValue= false;
        });

    };

   this.GetNextNumDate = function (nowDate_,num_){
        var y_ = nowDate_.getFullYear();
        var m_ = nowDate_.getMonth();
        var d_ = nowDate_.getDate();

        var ry_,rm_,rd_;  //返回结果的年月日
        var num = num_ + d_;
        ry_ = y_,rm_=m_;rd_=d_;
        if(num >_that.daysMonth[m_]){
            if((m_+1) > 11){  //当月份大于11时
                rm_ = m_+1-12;
                ry_ = y_+1;
            }else{
                rm_ = m_+1;
            }
            rd_ = num - _that.daysMonth[m_];
        }else{
            //当日期推移的日期未超过本月时
            rd_ = num_ + d_;
        }

        return new Date(parseInt(ry_),parseInt(rm_),parseInt(rd_),0,0,0);
    };
    // 往前翻 Year
   this.prevY = function () {
        _that.thisDay = 1;
       _that.thisYear--;
       _that.writeCalendar();
    };
    // 往后翻 Year
    this.nextY = function () {
        _that.thisDay = 1;
        _that.thisYear++;
        _that.writeCalendar();
    };

    this.hiddenSelect = function (e) {
        for (var i = e.options.length; i > -1; i--)
            e.options.remove(i);
        e.style.display = "none";
    };

    this.hiddenCalendar = function () {
        _that.calendar.style.display = "none";
    };
    this.showCalendar = function (){
        _that.calendar.style.display = "block";
    };
    // 日期自动补零程序
    this.appendZero = function (n) {
        return (("00" + n).substr(("00" + n).length - 2));
    };

// String.prototype.trim(){return this.replace(/(^\s*)|(\s*$)/g,"");}
// 年份的下拉框
    this.funYearSelect = function ()
    {
        var n = _that.yearFall;
        var e = _that.iframeDocument.getElementById("_tmpYearSelect");
        var y = isNaN(parseInt(_that.thisYear, 10)) ? new Date()
            .getFullYear() : parseInt(_that.thisYear);
        y = (y <= 1000) ? 1000 : ((y >= 9999) ? 9999 : y);
        var min = (y - n >= 1000) ? y - n : 1000;
        var max = (y + n <= 9999) ? y + n : 9999;
        min = (max == 9999) ? max - n * 2 : min;
        max = (min == 1000) ? min + n * 2 : max;
        for (var i = min; i <= max; i++)
            e.options.add(new Option(i + "年", i+""));
        e.style.display = "";
        e.value = y;
        e.focus();
    };
   this.returnNextWeek=function (){
        if(_that.weeknum == 52) return;
        if (_that.objExport) {
            var returnValue,returnShowValue;
            returnShowValue =_that.weekArray[_that.weeknum].toString();
            returnValue = returnShowValue.substr(1,2);

            //	_that.objHidExport.value = returnValue;
            _that.objExport.value = returnShowValue;
            _that.hiddenCalendar();
        }
    };
    this.returnThisWeek = function (){

        if (_that.objExport) {
            var returnValue,returnShowValue;

            _that.thisYear   = new Date().getFullYear();
            _that.thisMonth  = new Date().getMonth()+ 1;
            _that.thisDay    = new Date().getDate();
            _that.writeCalendar()
            returnShowValue =_that.weekArray[_that.toDayWeeknum].toString();
            returnValue = returnShowValue.substr(1,2);
            _that.objExport.value = returnShowValue;
            _that.hiddenCalendar();
        }
    };
    this.weekMouseOver =  function () {
        this.style.backgroundColor = "#DAF3F5";

    };
    this.weekMouseOut = function () {
        this.style.backgroundColor = '';
    };

    this.returnDate =  function () // 根据日期格式等返回用户选定的日期
    {
        if (_that.objExport) {
            var returnValue,returnShowValue;
            returnShowValue =this.innerText.toString();
            returnValue = returnShowValue.substr(1,2);
            _that.objExport.value = returnShowValue;
            _that.hiddenCalendar();
        }
    };
   this.writeCalendar = function () //对日历显示的数据的处理程序
    {
        var yearFirstDate,yearFirstWeekDay,yearDayCount;
        var weekStartDate,weekEndDate;
        var y = _that.thisYear;
        var m = _that.thisMonth;
        var d = _that.thisDay;
        //alert(y +"  "+ m+"   "+d);
        if (!(y<=9999 && y >= 1000 && parseInt(m, 10)>0 && parseInt(m, 10)<13 && parseInt(d, 10)>0)){
            _that.thisYear   = new Date().getFullYear();
            _that.thisMonth  = new Date().getMonth()+ 1;
            _that.thisDay    = new Date().getDate();
            y = _that.thisYear;
            m = _that.thisMonth;
            d = _that.thisDay;

        }
        _that.daysMonth[1] = (0==y%4 && (y%100!=0 || y%400==0)) ? 29 : 28;//闰年二月为29天
        _that.iframeDocument.getElementById("_funYearSelect").innerText  = y +" 年";
        // 获取一年的天数
        yearDayCount =_that.daysMonth[1]==28 ? 365 : 366;
        yearFirstDate=new Date(parseInt(_that.thisYear),0,1,0,0,0,0)// 获取一年的第一天
        yearFirstWeekDay=yearFirstDate.getDay()// 获取第一天为星期几

        _that.weekcount = 1;
        _that.weeknum = 0;
        var n =0;
        while(n<yearDayCount){
            //考虑第一周各种情况
            if(_that.weekcount ==1){
                if(yearFirstWeekDay ==0 || yearFirstWeekDay >4){
                    if(yearFirstWeekDay ==0){ //当为星期天时
                        weekStartDate = _that.GetNextNumDate(yearFirstDate,1);
                        n = n+7;
                    }else{//当为星期五或星期六时
                        weekStartDate =_that.GetNextNumDate(yearFirstDate,8-yearFirstWeekDay);
                        n = n+7-yearFirstWeekDay;
                    }
                }else{//当为星期一至星期四时
                    weekStartDate = _that.GetNextNumDate(yearFirstDate,-(yearFirstWeekDay-1));
                    n = n+(7-yearFirstWeekDay);
                }
            }else{
                weekStartDate = _that.GetNextNumDate(weekEndDate,1);
                n = n+7;
            }

            weekEndDate = _that.GetNextNumDate(weekStartDate,6);

            //获得当前周数
            if((weekStartDate <= _that.today)&&(weekEndDate >= _that.today)){
                _that.weeknum = _that.weekcount;
                _that.toDayWeeknum = _that.weekcount;
            }

            //考虑最后一周时，判断是否超过4天
            if(n - yearDayCount >=4){
                break;
            }

            var startMonth = parseInt(weekStartDate.getMonth())+1;
            var start_m = startMonth >=10 ? startMonth : "0"+startMonth;
            var start_d = weekStartDate.getDate() >=10 ? weekStartDate.getDate() : "0"+weekStartDate.getDate();
            var endMonth = parseInt(weekEndDate.getMonth())+1;
            var end_m = endMonth >=10 ? endMonth : "0"+endMonth;
            var end_d = weekEndDate.getDate() >=10 ? weekEndDate.getDate() : "0"+weekEndDate.getDate();
            var w = _that.weekcount >=10 ? _that.weekcount :"0"+_that.weekcount;
            _that.weekArray[_that.weekcount-1] = w.toString()+"周"+weekStartDate.getFullYear()+"年("+start_m.toString()+"-"+start_d.toString()+"至"+end_m+"-"+end_d+")";

            if(n >=yearDayCount){

                break;
            }
            _that.weekcount++;
        }
        //显示周数
        if(_that.weeknum <=6){
            for(var a=1;a<7; a++){
                _that.weekObj[a].innerText    = _that.weekArray[a];
                if(a==_that.weeknum-1){
                    _that.weekObj[a].bgColor =_that.weekColor;
                }else{
                    _that.weekObj[a].bgColor ='';
                }
            }
            _that.weekshow_beginNum =1;
            _that.weekshow_endNum =6;
            _that.weekObj[0].style.cursor = "default";
            _that.weekObj[7].style.cursor = "pointer";

        }else if(_that.weeknum ==_that.weekcount){
            for(var a=_that.weekcount-6,b=1;b<7; a++,b++){
                _that.weekObj[b].innerText  = _that.weekArray[a];
                if(a==_that.weeknum-1){
                    _that.weekObj[b].bgColor =_that.weekColor;
                }else{
                    _that.weekObj[b].bgColor ='';
                }
            }
            _that.weekshow_beginNum =_that.weekcount-6+1;
            _that.weekshow_endNum =_that.weekcount;
            _that.weekObj[0].style.cursor = "pointer";
            _that.weekObj[7].style.cursor = "default";
        }else{
            for(var a=_that.weeknum-5,b=1;b<7; a++,b++){
                _that.weekObj[b].innerText    = _that.weekArray[a];
                if(a==_that.weeknum-1){
                    _that.weekObj[b].bgColor =_that.weekColor;
                }else{
                    _that.weekObj[b].bgColor ='';
                }
            }
            _that.weekshow_beginNum =_that.weeknum-4;
            _that.weekshow_endNum =_that.weeknum+1;
            _that.weekObj[0].style.cursor = "pointer";
            _that.weekObj[7].style.cursor = "pointer";
        }
    };
//向上翻
   this.weekPageUp= function (){
        var num =_that.weekshow_beginNum;
        if(_that.weekshow_beginNum==1){
            return;
        }
        if(num -6 <1){ //当第一页
            for(var a=num,b=1;b<7; a--,b++){
                if(b>a){
                    _that.weekObj[b].innerText =' ';
                    _that.weekObj[b].onclick = function(){return false;};
                }else{
                    _that.weekObj[b].innerText = _that.weekArray[b];
                }
                _that.weekObj[b].bgColor ="";
            }
            _that.weekshow_beginNum = 1;
            _that.weekshow_endNum = num-1;
        }else{
            for(var a=num-6-1,b=1;b<7; a++,b++){
                _that.weekObj[b].innerText = _that.weekArray[a];
                _that.weekObj[b].bgColor ="";
            }
            _that.weekshow_beginNum = num-6;
            _that.weekshow_endNum = num-1;
        }
    };
//周数向下翻
    this.weekPageDown= function (){
        var num =_that.weekshow_endNum;

        if(num ==_that.weekcount){
            return;
        }
        if(num+6 > _that.weekcount){ //当最后一页
            for(var a=num,b=1;b<7; a++,b++){
                if(a >= _that.weekcount){
                    _that.weekObj[b].innerText =' ';
                    _that.weekObj[b].onclick = function(){return false;};
                }else{
                    _that.weekObj[b].innerText = _that.weekArray[a];
                }
                _that.weekObj[b].bgColor ="";

            }
            _that.weekshow_beginNum=num+1;
            _that.weekshow_endNum = _that.weekcount;
        }else{
            for(var a=num,b=1;b<7; a++,b++){
                _that.weekObj[b].innerText    = _that.weekArray[a]||" ";
                _that.weekObj[b].bgColor ="";

            }
            _that.weekshow_beginNum=num+1;
            _that.weekshow_endNum = num+6;
        }
    };
    this.setPosition =  function (e) {
        var o = _that.calendar.style;
        var t = e.offsetTop, h = e.clientHeight, l = e.offsetLeft, p = e.type;
        //alert(e.offsetTop + " " + e.clientHeight + " " + e.offsetLeft + "  "	+ e.type);
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }
        o.display = "";
        this.iframeDocument.body.focus();
        var cw = _that.calendar.clientWidth, ch = _that.calendar.clientHeight;
        var dw = document.body.clientWidth, dl = document.body.scrollLeft, dt = document.body.scrollTop;
        if (document.body.clientHeight + dt - t - h >= ch)
            o.top = (p == "image") ? t + h : t + h + 6;
        else
            o.top = (t - dt < ch) ? ((p == "image") ? t + h : t + h + 6) : t - ch;
        if (dw + dl - l >= cw)
            o.left = l;
        else
            o.left = (dw >= cw) ? dw - cw + dl : dl;
    };
    this.initCalendar = function (obj) // 主调函数
    {
        if(typeof(obj) == "string"){
            obj = _that.getObjectById(obj);
        }
        var e  = obj;
        _that.eventSrc = e;
        _that.objExport = e;
        _that.writeIframe();
        _that.setPosition(e);
        _that.writeCalendar();
      _that.addEvent(document,"click", function (){
            if(_that.eventSrc != window.event.srcElement)_that.hiddenCalendar();
        });
        _that.addEvent(window,"resize", function(){
           _that.setPosition(_that.objExport);
        });
        _that.addEvent(obj,"click",function (){

            _that.writeCalendar();
            _that.showCalendar();
            var e = window.event||event;
            if (e && e.stopPropagation) {
                //因此它支持W3C的stopPropagation()方法
                e.stopPropagation();
            }
            else {
                //否则，我们需要使用IE的方式来取消事件冒泡�
                window.event.cancelBubble = true;
                return false;
            }
        });
        _that.hiddenCalendar();

    }

}



