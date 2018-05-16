export default {
    diagramsDot: 5,
    countDotInDay: 8, // every 3 hours (24 / 3)

    forecastProtocol: 'http:',
    forecastUrl: '//api.openweathermap.org/data/2.5/forecast',
    forecastApiId: '60d0f9fb8dd9de9c42ac6c5262cc7ab3',
    forecastMethod: 'get',
    forecastLength: 40, // for free api maxCountForecast === 3*8 === 40
    forecastZipCodeRegExp: /^[0-9]+(,[a-z]{2})?$/i, // `09040`, `09040,us`, `us`

    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ],
    monthsShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    forecastTimeFormat: 'YYYY-MM-DD HH:mm:ss',
    normalPressure: 1013,
    deltaPressure: 40,
};