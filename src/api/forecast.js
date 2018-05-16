import configs from '@/configs'
import axios from 'axios'

export default {
    memoizeRequestUrlSymbol: Symbol('memoizeRequestUrl'),
    requestUrl() {
        return (
            this[this.memoizeRequestUrlSymbol]
            || (
                this[this.memoizeRequestUrlSymbol] = [
                    configs.forecastProtocol,
                    configs.forecastUrl,
                    `?APPID=${configs.forecastApiId}`,
                    `&cnt=${configs.forecastLength}`,
                    `&units=metric`
                ].join('')
            )
        );
    },
    requestForCityName(keyword) {
        return `${this.requestUrl()}&q=${keyword}`;
    },
    requestForZipCode(zipCode) {
        return `${this.requestUrl()}&zip=${zipCode}`;
    },

    fetch(keyword, cb){
        let keywordTrim = String(keyword).trim();
        let requestUrl;

        if (!keywordTrim) {
            return null;
        }

        requestUrl = this[
            (configs.forecastZipCodeRegExp.test(keywordTrim))
                ? 'requestForZipCode'
                : 'requestForCityName'
            ](keywordTrim);

        return axios[configs.forecastMethod](requestUrl);
    }
};
