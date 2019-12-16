//取倒计时（天时分秒）
function getTimeLeft(datetimeTo) {
  // 计算目标与现在时间差（毫秒）
  let _datetimeTo = datetimeTo
  let format = _datetimeTo.replace(/-/g, '/')
  let time1 = new Date(format).getTime();
  let time2 = new Date().getTime();
  let mss = time1 - time2;

  // 将时间差（毫秒）格式为：天时分秒
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = this.timeAdd0(parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString());
  let minutes = this.timeAdd0(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString());
  let seconds = this.timeAdd0(parseInt((mss % (1000 * 60)) / 1000).toString());

  // return days + "天" + hours + "小时" + minutes + "分" + seconds + "秒"
  // return days + ":" + hours + ":" + minutes + ":" + seconds
  return hours + ":" + minutes + ":" + seconds
}

function getTimeRight(datetimeTo) {
  // 计算目标与现在时间差（毫秒）
  let _datetimeTo = datetimeTo
  let format = _datetimeTo.replace(/-/g, '/')
  let time1 = new Date(format).getTime();
  let time2 = new Date().getTime();
  let mss = time1 - time2;

  // 将时间差（毫秒）格式为：天时分秒
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = this.timeAdd0(parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString());
  let minutes = this.timeAdd0(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString());
  let seconds = this.timeAdd0(parseInt((mss % (1000 * 60)) / 1000).toString());

  // return days + ":" + hours + ":" + minutes + ":" + seconds
  return hours + ":" + minutes + ":" + seconds
}

function timeAdd0(str) {
  if (str.length <= 1) {
    str = '0' + str;
  }
  return str
}
module.exports = {
  getTimeLeft: getTimeLeft,
  getTimeRight: getTimeRight,
  timeAdd0: timeAdd0
}