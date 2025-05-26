/**
 * 表单验证组合式函数
 * @returns 验证方法
 */
export function useValidator() {
  /**
   * 通用项目验证方法
   * @param {Array} items - 待验证数组
   * @param {Array} rules - 验证规则
   * @param {string} itemName - 项目名称(如"项目"/"指标")
   * @returns {Object} {valid: boolean, error?: {index: number, message: string}}
   */
  const validateItems = (items, rules, itemName) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      for (const rule of rules) {
        const value = item[rule.key];
        if (!value || String(value).trim() === "") {
          return {
            valid: false,
            error: {
              index: i + 1,
              message: `第 ${i + 1} 个${itemName}：${rule.message}`,
            },
          };
        }
      }
    }
    return { valid: true };
  };
  /**
   * 验证对象字段是否为空（排除空格影响）
   * @param {Object} obj - 待验证对象
   * @param {Array} fields - 需要验证的字段数组
   * @param {Object} [messages] - 可选，自定义错误消息 {fieldName: '错误消息'}
   * @returns {Object} {valid: boolean, error?: {field: string, message: string}}
   */
  const validateObject = (obj, fields, messages = {}) => {
    for (const field of fields) {
      const value = obj[field];
      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        return {
          valid: false,
          error: {
            field,
            message: messages[field] || `字段 ${field} 不能为空`,
          },
        };
      }
    }
    return { valid: true };
  };
  return {
    validateItems,
    validateObject,
  };
}
