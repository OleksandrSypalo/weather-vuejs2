import configs from '@/configs'

export default {
    formatting(date){
        let hours = date.getHours();
        let minutes = date.getMinutes();

        return `${this.doubletNumber(hours)}:${this.doubletNumber(minutes)}`;
    },
    doubletNumber(number){
        let string = String(number);

        return (string.length === 1 ? '0' : '') + string;
    },
    fixedToDec(number, toFixedLength){
        return (Math.round(number * 10) / 10).toFixed(toFixedLength || 0);
    },
    createEmptyArray(length){
        return new Array(+length);
    },
    replaceDate(date){
        let dateArr = date.split('-');

        return `${dateArr[2]} ${configs.monthShort[+dateArr[1] - 1]}`;
    }
};
