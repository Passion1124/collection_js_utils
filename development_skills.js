/**
 * @Description: 开发技巧
 * @author Passion
 * @date 2019/6/4
*/

/*-----------------------------------------------String Skill----------------------------------------------------------------*/
// 时间对比：时间个位数形式需补0
const time1 = "2019-03-31 21:00:00";
const time2 = "2019-05-01 09:00:00";
const overtime = time1 > time2;
// overtime => false

// 格式化金钱
const ThousandNum = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const money = ThousandNum(19941112);
// money => "19,941,112"

// 生成随机ID
const RandomId = len => Math.random().toString(36).substr(3, len);
const id = RandomId(10);
// id => "jg7zpgiqva"

// 生成随机HEX色值
const RandomColor = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0");
const color = RandomColor();
// color => "#f03665"

// 生成星级评分
const StartScore = rate => "★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate);
const start = StartScore(3);
// start => "★★★"

// 操作URL查询参数
const params = new URLSearchParams(location.search.replace(/\?/ig, "")); // location.search = "?name=yajun&sex=female"
params.has("yajun"); // true
params.get("sex"); // "female"

/*-----------------------------------------------Number Skill----------------------------------------------------------------*/
// 取整：代替正数的Math.floor()，代替负数的Math.ceil()
const num1 = ~~ 1.69;
const num2 = 1.69 | 0;
const num3 = 1.69 >> 0;
// num1 num2 num3 => 1 1 1

// 补零

