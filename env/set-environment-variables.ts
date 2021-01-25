process.env['--foo'] = 'bar';
process.env['SimpleConsoleFormatter.printEnvelopes'] = 'false';

// make error messages displayed within the html report readable
// https://github.com/chalk/chalk#chalksupportscolor
// --no-color
process.env['FORCE_COLOR'] = '0';
