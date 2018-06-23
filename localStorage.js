/**
 * The Object.assign() method is used to copy the values of all
 * enumerable own properties from one or more source objects to
 * a target object. It will return the target object.
 *
 * 向window.model添加 init / flush 两个枚举属性(函数)
 */
(function() {
    var model = window.model;
    var storage = window.localStorage;
    
    Object.assign(model, {
      //  使用回调函数进行初始化 提取storage中的data(s)到model中去
      //  若data(s)存在，就将model.data(m,执行时的‘内存’)置为该data值 否则将storage的
        // model.TOKEN项置为空并报错
      init: function(callback) {
        var data = storage.getItem(model.TOKEN);
        try {
            // 解析JSON字符串，构造并返回由JSON字符串描述的JavaScript值或对象
          if (data) model.data = JSON.parse(data);
        }
        catch (e) {
          storage.setItem(model.TOKEN, '');
          console.error(e);
        }
  
        if (callback) callback();
      },
      //  将storage中的TOKEN对应的数据设成model.data对应的json值
      //  从model到storage
      flush: function(callback) {
        try {
            //将js对象转换为json字符串 存入storage的TOKEN对应值中
          storage.setItem(model.TOKEN, JSON.stringify(model.data));
        }
        catch (e) {
          console.error(e);
        }
        if (callback) callback();
      }
    });
  })();