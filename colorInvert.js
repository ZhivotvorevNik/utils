function colorInvert(color) {

    var colorParts , i, len, colorCode;
    // регулярка для определения rgb/rgba кода цвета
    var rgbReg = /(rgb|rgba)\(.+\)/;
    // регулярка для определения HEX кода цвета
    var hexReg = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})/;

    // массив будет содержать коды, соответствующие [R, G, B]
    colorParts = [];
    
    if (rgbReg.test(color)) {
      colorParts = color.replace(/ /g, '').split('(')[1].split(')')[0].split(',');
    }
    
    if (hexReg.test(color)) {
      colorCode = color.split('#')[1];
      len = colorCode.length;
      for (i = 0; i < 3; i++) {
        colorParts[i] = parseInt(colorCode.slice(i * len/3, i * len/3 + len/3), 16);
      }
    }

    if (1 - (0.299 * colorParts[0] + 0.587 * colorParts[1] + 0.114 * colorParts[2]) / 255 < 0.5) {
      return '#000'
    } else {
      return '#fff'
    }
  };
