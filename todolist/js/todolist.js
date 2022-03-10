$(function() {

    // 颜色调整
    var lineColor = ['line-gray','line-pink','line-green','line-blue','line-yellow'];
    var bgcColor = ['bgc-gray','bgc-pink','bgc-green','bgc-blue','bgc-blue'];
    var wordColor = ['style-gray','style-pink','style-green','style-blue','style-yellow'];
    //开局默认打开页面
    var pages = '3';
    var flag = false;
    // tab栏切换
    $('.list a').on('click',function(event){
        // 排他原则
        $('.list a').each(function(index,domEle){
            $(domEle).children('div .headuser0').removeClass(lineColor[index]);
            $(domEle).removeClass(bgcColor[index]);
            $(domEle).children('div .word').removeClass(wordColor[index]);
        })
        $(this).children('div .headuser0').addClass(lineColor[$(this).attr('index')]);
        $(this).addClass(bgcColor[$(this).attr('index')]);
        $(this).children('div .word').addClass(wordColor[$(this).attr('index')])
        var num = $(this).attr('index');
        $('.right').children('div').eq(num).siblings('div').css('display','none');
        $('.right').children('div').eq(num).css('display','block');
        if( $(this).attr('index')!='3'){
            $("#title").css('display','none');
        }
        else{
            $("#title").css('display','block');
        }
        load(num);
    })
    // 已经完成
    $('.myclose').on('click',function(){
        if( $(this).siblings('ul').css('display')=='none'){
            $(this).siblings('ul').css('display','block');
            $(this).children('span.glyphicon.glyphicon-chevron-right.fl.icon2').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');

        }
        else{
            $(this).children('span.glyphicon.glyphicon-chevron-down.fl.icon2').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
            $(this).siblings('ul').css('display','none');
    }
    })
    // 1. 按下回车 把完整数据 存储到本地存储里面
    // 存储的数据格式  var todolist = [{title: "xxx", done: false}]
    $("#title").on("keydown", function(event) {
        if (event.keyCode === 13) {
            if ($(this).val() === "") {
                alert("请输入您要的操作");
            } else {
                // 先读取本地存储原来的数据
                var local = getDate();
                // console.log(local);
                // 把local数组进行更新数据 把最新的数据追加给local数组
                local.push({ title: $(this).val(), done: false,important: false,calender:false,lastTime:NaN});
                // 把这个数组local 存储给本地存储
                saveDate(local);
                // 2. toDoList 本地存储数据渲染加载到页面
                for(var i=0;i<4;i++){
                    load(i.toString());
                }
                $(this).val("");
            }
        }
    });


    $("ol, ul").on("click", ".cal", function() {
        // 先获取本地存储
        var data = getDate();
        // console.log(data);
        // 修改数据
        var index = $(this).attr("id");
        // console.log(index);
        $('.jeinpbox').css('display','block');
        $('.login-bg').css('display','block');
        $('.jeinpbox-close').on('click',function(){
            $('.jeinpbox').css('display','none');
            $('.login-bg').css('display','none');
            for(var i=0;i<4;i++){
                load(i.toString());
            }
        });
        
        countDown();
        setInterval(countDown, 1000);
        function countDown() {
            var inputTime = +new Date($('.jeinput').val());
            // var day = document.querySelector('.day');
            // var hour = document.querySelector('.hour');
            // var minute = document.querySelector('.min');
            // var second = document.querySelector('.second');
    
            var nowTime = +new Date(); // 返回的是当前时间总的毫秒数
            var times = (inputTime - nowTime) / 1000; // times是剩余时间总的秒数 
            var d =  parseInt(times / 60 / 60 /24 % 365); //时
            d = d < 10 ? '0' + d : d;
            // day.innerHTML = d;
            var h = parseInt(times / 60 / 60 % 24); //时
            h = h < 10 ? '0' + h : h;
            // hour.innerHTML = h; // 把剩余的小时给 小时黑色盒子
            var m = parseInt(times / 60 % 60); // 分
            m = m < 10 ? '0' + m : m;
            // minute.innerHTML = m;
            var s = parseInt(times % 60); // 当前的秒
            s = s < 10 ? '0' + s : s;
            // second.innerHTML = s;
            $('.distance').html('距离现在'+d+"天"+ h+'小时'+m+'分钟'+s+'秒' );
            return inputTime;
        }
        $('.jeinpbox-button').on('click',function(){
            $('.jeinpbox').css('display','none');
            $('.login-bg').css('display','none');

            data[index].calender=true;
            console.log(countDown());
            data[index].lastTime=countDown();
            saveDate(data);
            for(var i=0;i<4;i++){
                load(i.toString());
            }
        });
        // 重新渲染页面
        load($(this).parents('div').eq(0).attr('index'));
    });
    
    $("ol, ul").on("click", ".impo", function() {
        // 先获取本地存储
        var data = getDate();
        // console.log(data);
        // 修改数据
        var index = $(this).attr("id");
        // console.log(index);
        if(data[index].important==false){
          data[index].important=true;
        }
        else{
            data[index].important=false;
        }
        // 保存到本地存储
        saveDate(data);
        // 重新渲染页面
        load($(this).parents('.holder').attr('index'));
    });
    // 3. toDoList 删除操作     
    $("ol, ul").on("click", "a", function() {
        // alert(11);
        // 先获取本地存储
        var data = getDate();
        // console.log(data);
        // 修改数据
        var index = $(this).attr("id");
        // console.log(index);
        data.splice(index, 1);
        // 保存到本地存储
        saveDate(data);
        // 重新渲染页面
        load($(this).parents('.holder').attr('index'));
    });
    // 4. toDoList 正在进行和已完成选项操作
    $("ol, ul").on("click", "input", function() {
        // alert(11);
        // 先获取本地存储的数据
        var data = getDate();
        // 修改数据
        var index = $(this).siblings("a").attr("id");
        // console.log(index);
        // data[?].done = ?
        data[index].done = $(this).prop("checked");
        // console.log(data);
        // 保存到本地存储
        saveDate(data);
        // 重新渲染页面
        load($(this).parents('.holder').attr('index'));
    });
    // 读取本地存储的数据 
    function getDate() {
        var data = localStorage.getItem("todolist");
        if (data !== null) {
            // 本地存储里面的数据是字符串格式的 但是我们需要的是对象格式的
            return JSON.parse(data);
        } else {
            return [];
        }
    }
    // 保存本地存储数据
    function saveDate(data) {
        localStorage.setItem("todolist", JSON.stringify(data));
    }
    // 渲染加载数据
    var mitodoCount = 0; // 正在进行的个数
    var midoneCount = 0; // 已经完成的个数
    var imtodoCount = 0; // 重要正在进行的个数
    var imdoneCount = 0; // 重要已经完成的个数
    var caltodoCount = 0; // 有计划正在进行的个数
    var caldoneCount = 0; // 有计划已经完成的个数
    function load(pages) {
        console.log('load');
        // 读取本地存储的数据
        var data = getDate();
        // console.log(data);
        // 遍历之前先要清空ol里面的元素内容
        // 遍历这个数据
        switch(pages){
            case '1':
                imtodoCount=0;
                imdoneCount=0;
                $('.right').children('div').eq(pages).find('ul').empty();
                $('.right').children('div').eq(pages).find('ol').empty();
                $.each(data, function(i, n) {
                    if(n.important){
                        if (n.done) {
                            var mynew = $('.right').children('div').eq(pages).find('ul').prepend("<li><input type='checkbox' checked='checked' > <p>" + n.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>");
                            mynew.children('li:first').addClass(lineColor[1]);
                            mynew.children('li:first').addClass('dd-item');
                            mynew.children('li:first').children('p').addClass('dd-handle');
        

                            var im = $('<span></span>');      
                            im.addClass("impo");                   
                           
                            var cal = $('<span></span>');
                            cal.addClass("cal");
                            cal.attr('id',i);
                            cal.addClass("glyphicon glyphicon-calendar");

                            if(n.calender){
                              cal.addClass(wordColor[cal.parents('.holder').attr('index')])
                            }

                            imdoneCount++;                                
                        } else {
                            var mynew =$('.right').children('div').eq(pages).find('ol').prepend("<li><input type='checkbox' > <p>" + n.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>");
                            mynew.children('li:first').addClass(lineColor[1]);
                            mynew.children('li:first').addClass('dd-item');
                            mynew.children('li:first').children('p').addClass('dd-handle');
    

                            var im = $('<span></span>');   
                            im.addClass("impo");   

                            var cal = $('<span></span>');
                            cal.addClass("cal");
                            cal.attr('id',i);
                            cal.addClass("glyphicon glyphicon-calendar");

                            mynew.children('li:first').append(cal);
                            mynew.children('li:first').append(im);

                            if(n.calender){
                                cal.addClass(wordColor[cal.parents('.holder').attr('index')])
                           }
                                                   
                            imtodoCount++;
                        }


                        im.addClass(wordColor[cal.parents('.holder').attr('index')])
                        im.addClass("glyphicon glyphicon-star");
                        im.attr('id',i);
                        
                }
                });
                break;
            case '2':
                caltodoCount=0;
                caldoneCount=0;
            $('.right').children('div').eq(pages).find('ul').empty();
            $('.right').children('div').eq(pages).find('ol').empty();
            $.each(data, function(i, n) {
                if(n.calender){
                    var cal = $('<span></span>');
                    cal.addClass("cal");
                    cal.attr('id',i);
                    cal.addClass("glyphicon glyphicon-calendar");
                    
                    var time = $('<span></span>');
                    time.addClass('tim');
                    time.attr('id',i);
                    time.html();
                    var nowTime = +new Date(); // 返回的是当前时间总的毫秒数
                    var times = (n.lastTime - nowTime) / 1000; // times是剩余时间总的秒数 
                    var d =  parseInt(times / 60 / 60 /24 % 365); //时
                    // d = d < 10 ? '0' + d : d;
                    var h = parseInt(times / 60 / 60 % 24); //时
                    // h = h < 10 ? '0' + h : h;
                    var m = parseInt(times / 60 % 60); // 分
                    // m = m < 10 ? '0' + m : m;
                    var s = parseInt(times % 60); // 当前的秒
                    // s = s < 10 ? '0' + s : s;
                    if(!n.done){
                        if(s>=0&&m>=0&&h>=0&&d>=0){
                            time.html('距离现在'+d+"天"+ h+'小时'+m+'分钟'+s+'秒' );
                            var mynew =$('.right').children('div').eq(pages).find('ol').prepend("<li><input type='checkbox' > <p>" + n.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>");
                            mynew.children('li:first').addClass(lineColor[2]);
                            mynew.children('li:first').addClass('dd-item');
                            mynew.children('li:first').children('p').addClass('dd-handle');
    
                            var im = $('<span></span>');
                            im.addClass("impo");
                            im.attr('id',i);
    
                            mynew.children('li:first').append(im);
                            mynew.children('li:first').append(cal);
                            mynew.children('li:first').append(time);
    
                            if(n.important){
                                im.addClass("glyphicon glyphicon-star");
                                im.addClass(wordColor[cal.parents('.holder').attr('index')]); 
                            }
                            else{
                                im.addClass("glyphicon glyphicon-star-empty");
                            }
                            caltodoCount++;
                        }
                        else{
                            caldoneCount++;
                            time.html('任务已经过期' );
                            var mynew = $('.right').children('div').eq(pages).find('ul').prepend("<li><input type='checkbox' checked='checked' > <p>" + n.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>");
                            mynew.children('li:first').addClass(lineColor[3]);
                            mynew.children('li:first').addClass('dd-item');
                            mynew.children('li:first').children('p').addClass('dd-handle');
                            
                            var im = $('<span></span>');
                            im.addClass("impo");
                            im.attr('id',i);
    
                            mynew.children('li:first').append(im);
                            mynew.children('li:first').append(cal);
                            mynew.children('li:first').append(time);
    
                            if(n.important){
                                im.addClass("glyphicon glyphicon-star");
                                im.addClass(wordColor[cal.parents('.holder').attr('index')]); 
                            }else{
                                im.addClass("glyphicon glyphicon-star-empty");
                            }
                        }
                    }else{
                        caldoneCount++;
                            time.html('任务已经完成' );
                            var mynew = $('.right').children('div').eq(pages).find('ul').prepend("<li><input type='checkbox' checked='checked' > <p>" + n.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>");
                            mynew.children('li:first').addClass(lineColor[2]);
                            mynew.children('li:first').addClass('dd-item');
                            mynew.children('li:first').children('p').addClass('dd-handle');
                            
                            var im = $('<span></span>');
                            im.addClass("impo");
                            im.attr('id',i);
    
                            mynew.children('li:first').append(im);
                            mynew.children('li:first').append(cal);
                            mynew.children('li:first').append(time);
    
                            if(n.important){
                                im.addClass("glyphicon glyphicon-star");
                                im.addClass(wordColor[cal.parents('.holder').attr('index')]); 
                            }else{
                                im.addClass("glyphicon glyphicon-star-empty");
                            }
                    }
                    
                    cal.addClass(wordColor[cal.parents('.holder').attr('index')]); 
                }
            });
            break;
            case '3':
                mitodoCount=0;
                midoneCount=0;
                $('.right').children('div').eq(pages).find('ul').empty();
                $('.right').children('div').eq(pages).find('ol').empty();
                $.each(data, function(i, n) {
                    if (n.done) {
                        var mynew = $('.right').children('div').eq(pages).find('ul').prepend("<li><input type='checkbox' checked='checked' > <p>" + n.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>");
                        mynew.children('li:first').addClass(lineColor[3]);
                        mynew.children('li:first').addClass('dd-item');
                        mynew.children('li:first').children('p').addClass('dd-handle');
                       
                        var im = $('<span></span>');
                        im.addClass("impo");
                        im.attr('id',i);

                        var cal = $('<span></span>');
                        cal.addClass("cal");
                        cal.attr('id',i);
                        cal.addClass("glyphicon glyphicon-calendar");

                        mynew.children('li:first').append(im);
                        mynew.children('li:first').append(cal);

                        if(n.important){
                            im.addClass("glyphicon glyphicon-star");
                            im.addClass(wordColor[cal.parents('.holder').attr('index')]); 
                        }else{
                            im.addClass("glyphicon glyphicon-star-empty");
                        }
                       
                        if(n.calender){
                            cal.addClass(wordColor[cal.parents('.holder').attr('index')])
                        }
                       
                        midoneCount++;
                    } else {
                        var mynew =$('.right').children('div').eq(pages).find('ol').prepend("<li><input type='checkbox' > <p>" + n.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>");
                        mynew.children('li:first').addClass(lineColor[3]);
                        mynew.children('li:first').addClass('dd-item');
                        mynew.children('li:first').children('p').addClass('dd-handle');


                        var im = $('<span></span>');
                        im.addClass("impo");
                        im.attr('id',i);

                        var cal = $('<span></span>');
                        cal.addClass("cal");
                        cal.attr('id',i);
                        cal.addClass("glyphicon glyphicon-calendar");
                        cal.addClass(wordColor[cal.parents('.holder').attr('index')]);

                        mynew.children('li:first').append(im);
                        mynew.children('li:first').append(cal);

                        if(n.important){
                            im.addClass("glyphicon glyphicon-star");
                            im.addClass(wordColor[im.parents('.holder').attr('index')]);
                        }
                        else{
                            im.addClass("glyphicon glyphicon-star-empty");
                        }
                        
                        if(n.calender){
                            cal.addClass(wordColor[cal.parents('.holder').attr('index')]);
                    }
                        mitodoCount++;
                    }
                });
                break;
        }
        $(".imtodocount").text(imtodoCount);
        $(".imdonecount").text(imdoneCount);
        $(".mitodocount").text(mitodoCount);
        $(".midonecount").text(midoneCount);
        $(".caltodocount").text(caltodoCount);
        $(".caldonecount").text(caldoneCount);
    }
    load(pages);

    function rowpage(){
        load('2');
    }
    setInterval(rowpage, 1000);
})

// 密码登录
window.addEventListener('load',function(){
    var login = document.querySelector('.login');
    var mask = document.querySelector('.login-bg');
    var link = document.querySelector('.logina');
    var lobtn = document.querySelector('#loginBtn');
    var username = document.querySelector('#username')
    // var logout = document.querySelector('.logout');
    var remindbox = document.querySelector('#remind');
    var password = document.querySelector('#password');
    // console.log(link);
    var closeBtn = document.querySelector('#closeBtn');
    var  title = document.querySelector('#titlelog');
    var names = document.querySelector('#names');
    var  titles = document.querySelector('#mo');
    var  logins = document.querySelector('.jeinpbox');
    loginOrOut();
    function loginOrOut(){
        if(localStorage.getItem('username')!=null){
            names.innerHTML='欢迎'+localStorage.getItem('username');
            // link.nextElementSibling.style.display='none';    
            // logout.style.display='inline-block';
        }
        else if(sessionStorage.getItem('uname')!=null){
            names.innerHTML='欢迎'+sessionStorage.getItem('uname');
            // link.nextElementSibling.style.display='none';    
            // logout.style.display='inline-block';
        }
    }

    // logout.addEventListener('click',function(){
    //     sessionStorage.removeItem('uname');
    //     // link.nextElementSibling.style.display='inline-block';
    //     logout.style.display='none';
    //     // link.innerHTML='请登录';
    // });

    title.addEventListener('mousedown',function(e){
        var x = e.pageX -login.offsetLeft;
        var y = e.pageY -login.offsetTop;
        document.addEventListener('mousemove',move)
        function move(e){
            login.style.left = e.pageX - x +'px';
            login.style.top = e.pageY - y +'px';
        }
        document.addEventListener('mouseup',function(){
            document.removeEventListener('mousemove',move);
        })
    })

    titles.addEventListener('mousedown',function(e){
        var x = e.pageX -logins.offsetLeft;
        var y = e.pageY -logins.offsetTop;
        document.addEventListener('mousemove',move)
        function move(e){
            logins.style.left = e.pageX - x +'px';
            logins.style.top = e.pageY - y +'px';
        }
        document.addEventListener('mouseup',function(){
            document.removeEventListener('mousemove',move);
        })
    })

    link.addEventListener('click',cover)
    function cover() {
        mask.style.display='block';
        login.style.display='block';
        if(localStorage.getItem('username')!=null){
            username.value=localStorage.getItem('username');
        }
        if(localStorage.getItem('password')!=null){
            password.value=localStorage.getItem('password');
        }
    }
    function uncover() {
        mask.style.display='none';
        login.style.display='none';
    }
    closeBtn.addEventListener('click',uncover)

    lobtn.addEventListener('click',function(){
        sessionStorage.setItem('uname',username.value);
        // link.innerHTML='欢迎'+sessionStorage.getItem('uname');
        mask.style.display='none';
        login.style.display='none';
        if(remindbox.checked){
            localStorage.setItem('username',username.value);
            localStorage.setItem('password',password.value);
        }
        else{
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }
        loginOrOut();
    })
});