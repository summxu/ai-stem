const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// 创建目标目录
const targetDir = path.join(__dirname, 'src', 'assets', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`创建目录: ${targetDir}`);
}

// 需要扫描的文件扩展名
const extensions = ['.scss', '.tsx'];
// 需要排除的目录
const excludeDirs = ['node_modules'];
// 匹配URL的正则表达式
const urlRegex = /(https:\/\/lanhu[^\s'")\]]+)/g;
// 已下载的URL映射表
const downloadedUrls = new Map();

// 递归扫描目录
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    // 如果是目录且不在排除列表中，则递归扫描
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        scanDirectory(fullPath);
      }
      continue;
    }
    
    // 检查文件扩展名
    const ext = path.extname(fullPath).toLowerCase();
    if (extensions.includes(ext)) {
      processFile(fullPath);
    }
  }
}

// 处理单个文件
function processFile(filePath) {
  console.log(`正在处理文件: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  
  // 查找所有匹配的URL
  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1];
    downloadFile(url, filePath);
  }
}

// 下载文件
function downloadFile(url, sourceFile) {
  // 如果已经下载过这个URL，则跳过
  if (downloadedUrls.has(url)) {
    console.log(`已跳过重复URL: ${url}`);
    return;
  }
  
  // 生成文件名 (使用URL的哈希值作为文件名)
  const hash = crypto.createHash('md5').update(url).digest('hex');
  const fileName = `${hash}.png`;
  const filePath = path.join(targetDir, fileName);
  
  console.log(`正在下载: ${url} -> ${filePath}`);
  
  // 标记为已下载
  downloadedUrls.set(url, filePath);
  
  // 创建写入流
  const fileStream = fs.createWriteStream(filePath);
  
  // 下载文件
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`下载失败: ${url}, 状态码: ${response.statusCode}`);
      fs.unlinkSync(filePath); // 删除空文件
      return;
    }
    
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`下载完成: ${url}`);
      
      // 更新源文件中的URL引用
      updateFileReference(sourceFile, url, fileName);
    });
  }).on('error', (err) => {
    fs.unlinkSync(filePath); // 删除空文件
    console.error(`下载出错: ${url}, 错误: ${err.message}`);
  });
}

// 更新文件中的URL引用
function updateFileReference(filePath, url, fileName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 替换URL为本地路径
    const relativePath = path.relative(path.dirname(filePath), targetDir)
      .replace(/\\/g, '/'); // 确保路径分隔符是正斜杠
    
    const newPath = `${relativePath}/${fileName}`;
    content = content.replace(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`已更新文件引用: ${filePath}`);
  } catch (err) {
    console.error(`更新文件引用失败: ${filePath}, 错误: ${err.message}`);
  }
}

// 开始扫描
console.log('开始扫描项目文件...');
scanDirectory(path.join(__dirname, 'src'));
console.log('扫描完成!');