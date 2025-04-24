/**
 * 去掉邮箱后缀
 * @param email 邮箱
 * @returns 去掉后缀的邮箱
 */
export function removeEmailSuffix(email: string): string {
    return email.split('@')[0];
}