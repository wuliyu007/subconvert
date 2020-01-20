const URLSafeBase64 = require('urlsafe-base64');
let analyseSSR = ssrLink => {
  if (!ssrLink) return null;
  let encodedStr = "";
  if (ssrLink.startsWith('ss://')) {
    return ssProcess(encodedStr);
  } else if (ssrLink.startsWith('ssr://')) {
    return ssrProcess(encodedStr);
  } else {
    return null;
  }
}

let ssrProcess = ssrLink => {
  let host, port, protocol, method, obfs, base64password, password;
  let base64obfsparam, obfsparam, base64protoparam, protoparam, base64remarks, remarks, base64group, group, udpport, uot;
  const encodedStr = ssrLink.replace(/ssr:\/\//, "");
  const decodedStr = URLSafeBase64.decode(encodedStr).toString();
  const requiredParams = decodedStr.split(':');
  if (requiredParams.length != 6) {
    return null;
  }
  host = requiredParams[0];
  port = requiredParams[1];
  protocol = requiredParams[2];
  method = requiredParams[3];
  obfs = requiredParams[4];
  const tempGroup = requiredParams[5].split('/?')
  base64password = tempGroup[0];
  password = URLSafeBase64.decode(base64password).toString();

  if (tempGroup.length > 1) {
    const optionalParams = tempGroup[1];
    optionalParams.split('&').forEach(param => {
      const temp = param.split('=');
      let key = temp[0],
        value;
      if (temp.length > 1) {
        value = temp[1];
      }

      if (value) {
        switch (key) {
          case 'obfsparam':
            base64obfsparam = value;
            obfsparam = URLSafeBase64.decode(base64obfsparam).toString();
            break;
          case 'protoparam':
            base64protoparam = value;
            protoparam = URLSafeBase64.decode(base64protoparam).toString();
            break;
          case 'remarks':
            base64remarks = value;
            remarks = URLSafeBase64.decode(base64remarks).toString();
            break;
          case 'group':
            base64group = value;
            group = URLSafeBase64.decode(base64group).toString();
            break;
          case 'udpport':
            udpport = value;
            break;
          case 'uot':
            uot = value;
            break;
        }
      }
    })
  }

  return {
    type: 'ssr',
    host,
    port,
    protocol,
    method,
    obfs,
    base64password,
    password,
    base64obfsparam,
    obfsparam,
    base64protoparam,
    protoparam,
    base64remarks,
    remarks,
    base64group,
    group,
    udpport,
    uot
  }
}
let ssProcess = ssrLink => {
  let host, port, protocol, method, remarks;

  const encodedStr = ssrLink.replace(/ss:\/\//, "");
  let regexMatch = encodedStr.match(/#(.*?)$/);
  if (regexMatch != null) {
    remarks = decodeURIComponent(regexMatch[1]);
  }
  const decodedStr = URLSafeBase64.decode(encodedStr.split('#')[0]).toString();
  const requiredParams = decodedStr.split('@');
  if (requiredParams.length < 2) {
    return null;
  }
  var encrypt = requiredParams[0].split(':');
  method = encrypt[0];
  password = encrypt[1];
  var addr = requiredParams[1].split(':');
  host = addr[0];
  port = addr[1];
  remarks = requiredParams[2];
  return {
    type: 'ss',
    host,
    port,
    protocol,
    method,
    remarks
  }
}


module.exports = {
  analyseSSR,
  ssrProcess,
  ssProcess
}
