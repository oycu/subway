import Mock from 'mockjs'

const Random = Mock.Random

const User = [
  {
    rurl: /\/api\/register/,
    rtype: 'post',
    callback: (options) => {
      const url = options.url
      const type = options.type
      const body = options.body
      console.log('url = ', url)
      console.log('type = ', type)
      console.log('body = ', body)
      return {
        success: true,
        message: '',
        data: {
          rows: [
            {
              a: 1,
            },
            {
              a: 2,
            },
            {
              a: 3,
            },
          ],
          total: 10,
        },
      }
    },
  },
  {
    rurl: '/api/login',
    rtype: 'post',
    template: {
      success: true,
      message: '',
      data: {
        // basic
        'boolean': Random.boolean(), // 返回一个随机的布尔值。
        'natural': Random.natural(1, 100), // 返回一个随机的自然数（大于等于 0 的整数）
        'integer': Random.integer(1, 100), // 生成1到100之间的整数
        'float': Random.float(0, 100, 0, 5), // 生成0到100之间的浮点数,小数点后尾数为0到5位
        'character': Random.character(), // 生成随机字符,可加参数定义规则
        'string': Random.string('壹贰叁肆伍陆柒捌玖拾', 3, 5), // 返回一个随机字符串。
        'range': Random.range(0, 10, 2), // 生成一个随机数组

        // date
        'time': Random.time('HH:mm:ss'), // 获取一个随机时间
        'datetime': Random.datetime(), // 返回一个随机的日期和时间字符串。
        'now': Random.now(), // 返回当前的日期和时间字符串。

        // image
        'image': Random.image('200x100', '#00405d', '#FFF', 'Mock.js'), // 生成一个随机的图片地址。
        'dataImage': Random.dataImage(Random.size, 'hello'), // 生成一段随机的 Base64 图片编码。

        // color
        'color': Random.color(), // 随机生成一个有吸引力的颜色，格式为 '#RRGGBB'。
        'hex': Random.hex(), // 随机生成一个有吸引力的颜色，格式为 '#RRGGBB'。
        'rgb': Random.rgb(), // 随机生成一个有吸引力的颜色，格式为 'rgb(r, g, b)'。
        'rgba': Random.rgba(), // 随机生成一个有吸引力的颜色，格式为 'rgba(r, g, b, a)'。
        'hsl': Random.hsl(), // 随机生成一个有吸引力的颜色，格式为 'hsl(h, s, l)'。

        // text
        'paragraph': Random.paragraph(3, 7), // 随机生成一段文本。
        'cparagraph': Random.cparagraph(1, 3), // 随机生成一段中文文本。
        'sentence': Random.sentence(1, 3), // 随机生成一个句子，第一个单词的首字母大写。
        'csentence': Random.csentence(1, 3), // 随机生成一段中文文本。
        'word': Random.word(1, 3), // 随机生成一个单词。
        'cword': Random.cword('零一二三四五六七八九十', 10, 15), // 生成中文10到15个
        'title': Random.title(3, 5), // 随机生成一句标题，其中每个单词的首字母大写。
        'ctitle': Random.ctitle(3, 7), // 随机生成一句中文标题。

        // name
        'first': Random.first(), // 随机生成一个常见的英文名。
        'last': Random.last(), // 随机生成一个常见的英文姓。
        'name': Random.name(), // 随机生成一个常见的英文姓名。
        'cfirst': Random.cfirst(), // 随机生成一个常见的中文名。
        'clast': Random.clast(), // 随机生成一个常见的中文姓。
        'cname': Random.cname(), // 随机生成一个常见的中文姓名。

        // web
        'url': Random.url('http', 'baidu.com'), // 随机生成一个 URL。
        'protocol': Random.protocol(), // 随机生成一个 URL 协议
        'domain': Random.domain(), // 随机生成一个域名。
        'tld': Random.tld(), // 随机生成一个顶级域名
        'email': Random.email('qq.com'), // 随机生成一个邮箱
        'ip': Random.ip(), // 随机生成一个 IP 地址。

        // address
        'region': Random.region(), // 随机生成一个（中国）大区。
        'province': Random.province(), // 随机生成一个（中国）省（或直辖市、自治区、特别行政区）
        'city': Random.city(true), // 布尔值。指示是否生成所属的省。
        'county': Random.county(true), // 随机生成一个（中国）县。
        'zip': Random.zip(), // 随机生成一个邮政编码（六位数字）
        'address': Random.province(), // 生成地址

        // helper
        'capitalize': Random.capitalize('hello'), // 把字符串的第一个字母转换为大写。
        'upper': Random.upper('hello'), // 把字符串转换为大写。
        'lower': Random.lower('HELLO'), // 把字符串转换为小写。
        'pick': Random.pick([
          'a', 'e', 'i', 'o', 'u',
        ]), // 从数组中随机选取一个元素，并返回。
        'shuffle': Random.shuffle([
          'a', 'e', 'i', 'o', 'u',
        ]), // 打乱数组中元素的顺序，并返回。

        // miscellaneous
        'guid': Random.guid(), // 随机生成一个 GUID。
        'id': Random.id(), // 随机生成一个 18 位身份证。
        'increment': Random.increment(2), // 生成一个全局的自增整数。自增为2
      },
    },
  },
]

export default User
