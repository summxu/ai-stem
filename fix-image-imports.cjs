const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// 图片扩展名
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

// 查找所有 TSX 文件
async function findTsxFiles(dir, excludeDirs = ['node_modules']) {
  const files = [];
  
  async function scan(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          await scan(fullPath);
        }
      } else if (entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dir);
  return files;
}

// 处理单个文件
async function processFile(filePath) {
  console.log(`处理文件: ${filePath}`);
  
  let content = await readFile(filePath, 'utf8');
  let modified = false;
  
  // 查找所有图片引用
  const imgSrcRegex = /<img[^>]*src=\s*{?\s*['"]([^'"]*\.(?:png|jpg|jpeg|gif|svg|webp))['"](?:\s*\})?[^>]*>/g;
  const imgMatches = [...content.matchAll(imgSrcRegex)];
  
  // 已添加的导入
  const imports = new Map();
  
  // 处理每个图片引用
  for (const match of imgMatches) {
    const [fullMatch, imgPath] = match;
    
    // 检查是否是相对路径且是图片文件
    if (imgPath.startsWith('../') || imgPath.startsWith('./') || imgPath.startsWith('../../')) {
      const ext = path.extname(imgPath).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        // 生成导入变量名
        const baseName = path.basename(imgPath, ext);
        let importName = baseName
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/^[0-9]/, '_$&');
        
        // 确保变量名唯一
        if (imports.has(importName)) {
          let counter = 1;
          while (imports.has(`${importName}${counter}`)) {
            counter++;
          }
          importName = `${importName}${counter}`;
        }
        
        // 保存导入信息
        imports.set(importName, { path: imgPath, original: fullMatch });
        modified = true;
      }
    }
  }
  
  // 如果有需要修改的图片引用
  if (modified) {
    // 添加导入语句
    const importStatements = Array.from(imports.entries())
      .map(([name, { path }]) => `import ${name} from '${path}';`)
      .join('\n');
    
    // 替换图片引用
    let newContent = content;
    for (const [name, { original, path }] of imports.entries()) {
      newContent = newContent.replace(
        original,
        original.replace(`'${path}'`, `{${name}}`).replace(`"${path}"`, `{${name}}`)
      );
    }
    
    // 在文件开头添加导入语句
    const importIndex = newContent.indexOf('import');
    if (importIndex !== -1) {
      // 找到最后一个导入语句
      const importLines = newContent.split('\n');
      let lastImportLine = 0;
      
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].trim().startsWith('import ') && !importLines[i].includes('//')) {
          lastImportLine = i;
        }
      }
      
      importLines.splice(lastImportLine + 1, 0, importStatements);
      newContent = importLines.join('\n');
    } else {
      newContent = importStatements + '\n' + newContent;
    }
    
    // 写入修改后的文件
    await writeFile(filePath, newContent, 'utf8');
    console.log(`已修改文件: ${filePath}`);
    return true;
  }
  
  return false;
}

// 主函数
async function main() {
  try {
    const rootDir = process.cwd();
    console.log(`扫描目录: ${rootDir}`);
    
    const tsxFiles = await findTsxFiles(rootDir);
    console.log(`找到 ${tsxFiles.length} 个 TSX 文件`);
    
    let modifiedCount = 0;
    
    for (const file of tsxFiles) {
      const modified = await processFile(file);
      if (modified) {
        modifiedCount++;
      }
    }
    
    console.log(`完成! 共修改了 ${modifiedCount} 个文件`);
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main();