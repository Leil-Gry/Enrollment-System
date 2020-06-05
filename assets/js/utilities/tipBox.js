function ShowTip(tip, type) {
  var $tip = $('#tip');
  if ($tip.length === 0) {
  // 设置样式，也可以定义在css文件中
    $tip = $('<span id="tip" style="width:50%;position:fixed;top:50px;left: 50%;z-index:9999;height: 50px;padding: 0 20px;line-height: 50px;"></span>');
    $('body').append($tip);
  }
  $tip.stop(true).prop('class', 'alert alert-' + type).text(tip).css('margin-left', -$tip.outerWidth() / 2).fadeIn(200).delay(2000).fadeOut(200);
}
