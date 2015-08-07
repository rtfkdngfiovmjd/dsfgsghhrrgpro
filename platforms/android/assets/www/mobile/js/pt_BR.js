// Brazilian Portuguese

jQuery.extend( jQuery.fn.pickadate.defaults, {
    monthsFull: [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ],
    monthsShort: [ 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez' ],
    weekdaysFull: [ 'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado' ],
    weekdaysShort: [ 'dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab' ],
    weekdaysLetter: [ 'D','S','T','Q','Q','S','S'],
    closeOnSelect: true,
    closeOnClear:true,
    today: 'hoje',
    clear: 'limpar',
    close: 'fechar',
    format: 'dd/mm/yyyy',
    formatSubmit: 'dd/mm/yyyy',
    onSet:function(context) {
        
        if (context.select != undefined) {
            this.close();
        };
    }
});

