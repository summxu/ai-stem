/**
 * 拼音转首字母
 * @param str
 * @returns
 */
export function pinyinToInitials(str: string) {
    return str.replace(/[\u4e00-\u9fa5]/g, (match) => {
        const unicode = match.charCodeAt(0) - 19968;
        return String.fromCharCode(unicode / 26 + 97);
    });
}

/**
 * 生成随机字符串4位数字
 * @returns
 */
export function generateRandomString() {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

/**
 * 数字转大写字母，从0开始
 * @param num
 * @returns
 */
export function numberToLetter(num: number) {
    return String.fromCharCode(65 + num);
}

/**
 * 生成随机8位密码，字母和数字混合
 * @returns
 */
export function generateRandomPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}