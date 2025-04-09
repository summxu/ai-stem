// 加载SVG图标工具
export function loadSvgIcon(iconName: string): string {
    try {
        // 动态导入SVG图标
        const iconPath = `../../../assets/icons/${iconName}.svg`;
        // 请注意，在实际使用中可能需要调整路径或使用require
        return `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><use xlink:href="${iconPath}"></use></svg>`;
    } catch (error) {
        console.error(`Failed to load icon: ${iconName}`, error);
        return '';
    }
} 