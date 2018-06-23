var $_ = function(sel) {
    return document.querySelector(sel);
  };
var $_All = function(sel) {
    return document.querySelectorAll(sel);
};
var makeArray = function(likeArray) {
    var array = [];
    for (var i = 0; i < likeArray.length; ++i) {
      array.push(likeArray[i]);
    }
    return array;
};
var typeIn = false;

function update(){
    model.flush();
    var data = model.data;
    var activeCount =0;
    var todoList = $_('#todo-list');
    todoList.innerHTML = '';

    var dataItemLength = model.data.items.length;
    //��model.data�е����ݵ�ÿһ�� {msg:'', completed: false}�½�liԪ��
    data.items.forEach(function(itemData, index) {
        if (!itemData.completed) activeCount++;
          var content=itemData.msg;
          var isDone = itemData.completed;

          var newDiv = document.createElement('div');
          newDiv.classList.add('listItem');
          if (model.data.filter == 'completed'){
               newDiv.style.display = 'none';
           }
          newDiv.addEventListener('swipeLeft', function(){
                data.items.splice(index, 1);
                $(this).animate('leftOut', 500, 'ease-out', ()=>{
                    model.data.items.splice(index, 1);
                    $_('#todo-list').removeChild(this);
                    update();
                });
               
          },false);
          newDiv.addEventListener('swipeRight', function(){
            data.items.splice(index, 1);
                $(this).animate('rightOut', 500, 'ease-out', ()=>{
                    model.data.items.splice(index, 1);
                    $_('#todo-list').removeChild(this);
                    update();
                });
          },false);
          newDiv.addEventListener('swipeUp', function(){
            data.items.splice(index, 1);
            $_('#todo-list').removeChild(this);  
            update();
          },false)
          var itemToggle = document.createElement('div');
          itemToggle.classList.add('done');
          if (isDone){
              itemToggle.classList.add('isdone');
          }
          itemToggle.addEventListener('tap', function(){
              itemData.completed = !itemData.completed;
              update();
          }, false);
      
          newDiv.appendChild(itemToggle);

          var newText = document.createElement('p');
          
          if (isDone){
              newText.classList.add('Done');
          }
          newText.textContent = content;

          /**����text <p>���� �޸��¼����� */
          newText.addEventListener('longTap', function (event) {
              var target = event.target;
              var newInput = document.createElement('input');
              newInput.setAttribute('type', "text");
              newInput.classList.add('todo');
              newInput.value = event.target.textContent;
              for (var i = 0; i < target.parentNode.childNodes.length - 1; i++){
                 target.parentNode.childNodes[i].style.display = 'none';
                }
            target.parentNode.childNodes[i].textContent = "";
            
            newInput.addEventListener('keyup', function(e){
                if (e.keyCode == 13) {
                    if (newInput.value != '') {
                        itemData.msg = newInput.value;
                    }
                    newInput.blur();
                    update();
                }
            });
            /**
             * ȡ������  �ָ��б���ʾ
             */
            newInput.addEventListener('blur', function(e){
                target.parentNode.removeChild(newInput);
                for (var i = 0; i < target.parentNode.childNodes.length - 1; i++){
                    target.parentNode.childNodes[i].style.display = 'flex';
                }
                target.parentNode.childNodes[i].textContent = "";
                e.preventDefault();
            }, { once: true }, false);
            target.parentNode.insertBefore(newInput, target);
            newInput.focus();
          })
          newText.addEventListener('tap', function (e) {
              itemData.completed = !itemData.completed;
              update();
          })

          newDiv.appendChild(newText);

          if (typeIn && model.data.filter != 'completed' && index == data.items.length -1){
            typeIn = false;
            $(newDiv).animate('in', 500)
          }
          $_('#todo-list').insertBefore(newDiv, $_('#todo-list').childNodes[0]);
        });
          var newTodo = $('.new-todo');
          newTodo.value = data.msg;

    if (dataItemLength && activeCount < dataItemLength){
        $_('#clear-completed').style.visibility = 'visible';
    }
    else{
        $_('#clear-completed').style.visibility = 'hidden';
    }
    model.flush();
    $_('#leftItems').textContent = activeCount == 0 ? 'no item to do': activeCount + ' item' + (activeCount == 1 ? '' : 's') +  ' left';
    document.getElementById(model.data.filter).classList.add('select');
    doFilter(model.data.filter);
}


window.onload = function() {
    /**
     * ��ʼ������ ��new-todo clear-completed ��Ԫ������¼�����
     */
    model.init(function() {
        var data = model.data;
        var newTodo = $_('#new-todo');
        newTodo.addEventListener('keyup', function() {
        data.msg = newTodo.value;
        });
        newTodo.addEventListener('change', function() {
        model.flush();
        });
        /**
         * ����new todo
         */
        newTodo.addEventListener('keyup', function(ev) {
        if (ev.keyCode != 13) return; // Enter

        if (data.msg == '') {
            console.warn('input msg is empty');
            return;
        }
        data.items.push({msg: data.msg, completed: false});
        data.msg = '';
        console.log("L1");
        typeIn = true;
        update();
        newTodo.value = data.msg;
        }, false);

        //clear-completed tap�¼�,ɾ�������������Ŀ
    $_('#clear-completed').addEventListener('tap', function () {  
        var itemList = $_All('.listItem p');
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i].classList.contains('Done')) {
                    $_('#todo-list').removeChild(itemList[i].parentNode);
                    /**����model�����еĶ�Ӧ��Ŀ  λ����õ���itemList�е�λ�÷����Ӧ */
                    model.data.items.splice(itemList.length - i - 1, 1);
                }
            }
            update();
        },false);

        // toggle-all tap�¼� �ı���������״̬
        var toggleAll = $_('#toggle-all');
            toggleAll.addEventListener('tap', function() {
                var completed = toggleAll.checked;
                data.items.forEach(function(itemData) {
                itemData.completed = completed;
            });
            update();
        }, false);

        // #filterList tap�¼� �л�������
        $_("#filterList").addEventListener('tap', function (e) {          
            if (e.target && e.target.nodeName.toLowerCase() == 'li') {
                for (var i = 0; i < 3; i++) {
                    if ($_All('li')[i].classList.contains('select')) {
                        $_All('li')[i].classList.remove('select');
                    }
                }
                e.target.classList.add('select');
                model.data.filter = e.target.id;
                model.flush();
                update();
                doFilter(e.target.id);
            }
        }, false);

        /**
         * filterList swipte*** �¼�  �л�������
         */
        $_("#filterList").addEventListener('swipeRight', function () {
            var curFilter = $_('.select');
            curFilter.classList.remove('select');

            if (model.data.filter == 'all') {
                $_('#active').classList.add('select');
                model.data.filter = 'active';
                model.flush();
                update();
                doFilter(model.data.filter);
            }
            else if (model.data.filter == 'active') {
                    $_('#completed').classList.add('select');
                    model.data.filter = 'completed';
                    model.flush();
                    update();
                    doFilter(model.data.filter);
            }
            else {
                $_('#all').classList.add('select');
                model.data.filter = 'all';
                model.flush();
                update();
                doFilter(model.data.filter);
            }
        }, false);
        $_("#filterList").addEventListener('swipeLeft', function () {
            var curFilter = $_('.select');
            curFilter.classList.remove('select');

            if (model.data.filter == 'all') {
                $_('#completed').classList.add('select');
                model.data.filter = 'completed';            
                model.flush();
                update();
                doFilter(model.data.filter);
            }
            else if (model.data.filter == 'active') {                
                $_('#all').classList.add('select');
                model.data.filter = 'all';                
                model.flush();
                update();
                doFilter(model.data.filter);
            }
            else {                
                $_('#active').classList.add('select');
                model.data.filter = 'active';
                model.flush();
                update();
                doFilter(model.data.filter);
            }
            
        }, false);
        
        // ˫��ʣ����Ŀ��ʾ ����active��Ŀ
        $_('#leftItems').addEventListener('doubleTap', function() {
            for (var i = 0; i < 3; i++) {
                if ($_All('li')[i].classList.contains('select')) {
                    $_All('li')[i].classList.remove('select');
                }
            }
            $_('#active').classList.add('select');
            model.data.filter = 'active';
            model.flush();
            update();
            doFilter(model.data.filter);
        }, false)

        /**
         * ����activeCount ����leftItems��ʾ
         */

        var activeCount =0;
        model.data.items.forEach(function(itemData, index) {
            if (!itemData.completed) activeCount++;
            });
        $_('#leftItems').textContent = (activeCount || 'No') + (activeCount > 1 ? ' items' : ' item') + ' left';
        update();
    });
}

/**
 * 
 * @param {*} filter 
 * ����ѡ���filterģʽ �����б�չʾ����
 */
function doFilter(filter){
    var items = $_All('.listItem');
    var itemText = $_All('.listItem p');
    if (filter == 'completed'){
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = 'none';
            if (itemText[i].classList.contains('Done')) {
                items[i].style.display = 'flex';
            }
        }
    }
    else if (filter == 'active'){
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = 'none';
            if (!itemText[i].classList.contains('Done')) {
                items[i].style.display = 'flex';
            }
        }
    }
    else if (filter == 'all'){
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = 'flex';
        }
    }
}
