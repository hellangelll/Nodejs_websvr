/**
 * @author Daisy
 */
//截取字符串长度
function interceptString(str, len){
    //length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        strlen = strlen + 1;
        if (strlen > len) {
            return s.substring(0, s.length - 1) + "…";
        }
        s = s + str.charAt(i);
    }
    return s;
}

