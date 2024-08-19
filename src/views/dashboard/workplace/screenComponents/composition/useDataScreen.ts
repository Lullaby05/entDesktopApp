// 获取随机整数
export const getRandomInt = (max: number, min: number = 1) => {
  return Math.floor(Math.random() * max + min);
};

// 从数组对象中获取指定name的数据
export const getArrByName = (arr: any[], name: string[]) => {
  return arr.filter((item: any) => name.includes(item.name));
};

// 根据name获取当前的对象数据
export const getCurrentByName = (arr: any[], name: string) => {
  return (
    arr.find((item: any) => item.name === name) || {
      count: 0,
      percent: 0.0,
    }
  );
};

export const getArrByNameFuzzy = (arr: any[], name: string) => {
  return arr.filter((item: any) => item.name.includes(name));
};

// 根据fontSize动态计算实际宽度，由于屏幕适配的问题
export const findFontSize = (currentSize: number): number => {
  let fontSize = 12;
  const documentFontSize = Number(
    document.documentElement.style.fontSize.slice(0, -2)
  );
  fontSize = (currentSize / 14) * documentFontSize;
  return fontSize;
};

export function extension(chart: any, triggerAxis: string = 'xAxis') {
  // 注意这里，是以X轴显示内容过长为例，如果是y轴的话，需要把params.componentType == 'xAxis'改为yAxis
  // 判断是否创建过div框,如果创建过就不再创建了
  // 该div用来盛放文本显示内容的，方便对其悬浮位置进行处理
  var elementDiv: any = document.getElementById('extension');
  if (!elementDiv) {
    var div = document.createElement('div');
    div.setAttribute('id', 'extension');
    div.style.display = 'block';
    document.querySelector('html')!.appendChild(div);
  }
  chart.on('mouseover', function (params: any) {
    if (params.componentType == triggerAxis) {
      var elementDiv: any = document.querySelector('#extension');
      //设置悬浮文本的位置以及样式
      var elementStyle =
        'position: absolute;z-index: 99999;color: #fff;font-size: 12px;padding: 5px;display: inline;border-radius: 4px;background-color: #303133;box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 8px';
      elementDiv!.style.cssText = elementStyle;
      elementDiv!.innerHTML = params.value;
      document.querySelector('html')!.onmousemove = function (event) {
        var elementDiv: any = document.querySelector('#extension');
        var xx = event.pageX - 10;
        var yy = event.pageY + 15;
        elementDiv!.style!.top = yy + 'px';
        elementDiv!.style!.left = xx + 'px';
      };
    }
  });
  chart.on('mouseout', function (params: any) {
    //注意这里，我是以X轴显示内容过长为例，如果是y轴的话，需要改为yAxis
    if (params.componentType == triggerAxis) {
      var elementDiv: any = document.querySelector('#extension');

      elementDiv!.style!.cssText = 'display:none';
    }
  });
}
