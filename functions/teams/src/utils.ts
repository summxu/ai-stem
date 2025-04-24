/**
 * 获取字符串的后6位
 * @param str 输入的字符串
 * @returns 字符串的后6位
 */
export function getLastSixCharacters(str: string): string {
    return str.slice(-6);
}

/**
 * 生成随机字符串4位数字
 * @returns
 */
export function generateRandomString() {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
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