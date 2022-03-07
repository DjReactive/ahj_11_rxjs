export default class AppFunc {
  static getFormatedDate(date) {
    const nDate = new Date(date);
    return `${AppFunc.formatDateNumber(nDate.getDate())}`
    + `.${AppFunc.formatDateNumber(nDate.getMonth() + 1)}`
    + `.${AppFunc.formatDateNumber(nDate.getFullYear())}`
    + ` ${AppFunc.formatDateNumber(nDate.getHours())}`
    + `:${AppFunc.formatDateNumber(nDate.getMinutes())}`;
  }

  static formatDateNumber(number) {
    return String(number).padStart(2, '0');
  }
}
