var func = {
    formatCurrency: function(currency) {
        return currency.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },

    formatUsd: function(currency) {
        return currency.toFixed(2);
    }

}

module.exports = func;