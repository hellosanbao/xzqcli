const program = require('commander');
const path = require('path')
const fs = require('fs');

const config = {
  root: process.cwd(),
}

class BeantechCli {
  constructor() {
    this.root = config.root
    this.__init()
  }
  async __init() {
    program.version('0.1.0', '-v, --version', '查看当前版本');

    program.option('-h, --help', '帮助手册');

    program.command('file [file-path]').description('输出目录下所有文件').action(this.oupuptAllFile.bind(this));

    program.command('export [file-path]').description('生成index.js文件，然后将当前目录下所有js通过index.js导出').action(this.creatAndExportAllJsModule.bind(this));
    program.parse(process.argv);
  }
  // 输出目录下所有文件
  oupuptAllFile(file_path, otherParams) {
    file_path = path.join(this.root,file_path)
    //判断当前目录是否存在
    let exists = fs.existsSync(file_path)
    if (exists) {
      //拿到该目录下所有的文件
      let fileArr = this.getAllFile(file_path)
      fileArr.forEach((f) => {
        console.log(f)
      })
    } else {
      console.log(`${file_path}目录不存在`)
    }
  }
  // 生成index.js文件，然后将当前目录下所有js通过index.js导出
  creatAndExportAllJsModule(file_path, otherParams) {
    file_path = path.join(this.root,file_path)
    //判断当前目录是否存在
    let exists = fs.existsSync(file_path)
    if (exists) {
      //拿到该目录下所有的js文件
      let fileArr = this.getAllFile(file_path).filter((f=>{
        return path.extname(f) === '.js'
      }))
      let indexPath = path.join(file_path,'index.js')
      let existsIndex = fs.existsSync(indexPath)
      if(!existsIndex){
        fs.writeFileSync(indexPath,this.getIndexString(fileArr,file_path),'utf-8')
      }
    } else {
      console.log(`${file_path}目录不存在`)
    }
  }
  //获取index文件内容
  getIndexString(fileArr,baseDir){
    let str = ''
    fileArr.forEach(file=>{
      let filePa = file.replace(path.join(baseDir),'')
      filePa = filePa.startsWith('/')?filePa:`/${filePa}`
      str += `export * from '.${filePa}'; \n`
    })
    return str
  }
  //获取目录下所有的文件
  getAllFile(dir) {
    let res = fs.readdirSync(dir)
    let ful = res.reduce((total, cur) => {
      cur = path.join(dir, cur)
      let stat = fs.statSync(cur)
      if (stat.isDirectory()) {
        total = total.concat(this.getAllFile(cur))
      } else {
        total.push(cur)
      }
      return total
    }, [])
    return ful

  }
}
new BeantechCli()









