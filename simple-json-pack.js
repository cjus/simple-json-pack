/**
 * @name SimpleJSONPack - simple json pack
 * @description JSON tool to parse JSON files, remove whitespaces and ensure packed output
 */
class SimpleJSONPack {
  /**
   * @name constructor
   */
  constructor() {
    this._rdict = {};
    this._dict = {};
    this._excludes = [];
    this._stringifiedJSON = '';
  }

  /**
   * @name setExcludes
   * @description set key names to exclude
   * @param {array} list - array of exclusion key names
   * @return {undefined}
   */
  setExcludes(list) {
    this._excludes = list.slice();
  }

  /**
   * @name occurrences
   * @description function that count occurrences of a substring in a string
   * @param {string} string - The string
   * @param {string} subString - The sub string to search for
   * @param {boolean} [allowOverlapping] - Optional. (Default:false)
   * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
   * @return {number} occurence count
   */
  occurrences(string, subString, allowOverlapping) {
    string += '';
    subString += '';
    if (subString.length <= 0) {
      return (string.length + 1);
    }
    let n = 0;
    let pos = 0;
    let step = allowOverlapping ? 1 : subString.length;
    while (true) {
      pos = string.indexOf(subString, pos);
      if (pos >= 0) {
        ++n;
        pos += step;
      } else {
        break;
      }
    }
    return n;
  }

  /**
   * @name traverse
   * @description recursively traverse JavaScript object removing instances of comment keys and values
   * @param {object} obj - js object
   * @return {undefined}
   */
  traverse(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let exclude = (this._excludes.indexOf(key) > -1) ? true : false;
        if (exclude) {
          delete obj[key];
          continue;
        }
        if (this._rdict[key] === undefined) {
          this._rdict[key] = 0;
        } else {
          this._rdict[key]++;
        }
        if (typeof obj[key] === 'string') {
          let count = this.occurrences(this._stringifiedJSON, obj[key]);
          if (count > 1) {
            if (this._rdict[obj[key]] === undefined) {
              this._rdict[obj[key]] = 0;
            } else {
              this._rdict[obj[key]]++;
            }
          }
        }
        if (obj[key] !== null && typeof (obj[key]) === 'object') {
          this.traverse(obj[key]);
        }
      }
    }
  }

  /**
   * @name pack
   * @description compress stringified JSON data
   * @param {string} stringifiedData - stringified JSON
   * @return {string} packed stringified JSON
   */
  pack(stringifiedData) {
    let obj = JSON.parse(stringifiedData);
    this._stringifiedJSON = stringifiedData;

    this.traverse(obj);

    Object.keys(this._rdict).forEach((key) => {
      if (this._rdict[key] <= 0) {
        delete this._rdict[key];
      }
    });

    let data = JSON.stringify(obj);
    let cnt = 0;

    let sorted = Object.keys(this._rdict).sort((a, b) => this._rdict[b] - this._rdict[a]);
    sorted.forEach((key) => {
      let index = (++cnt).toString(16);
      if (key.length > index.length + 1) {
        this._rdict[key] = `_${index}`;
        this._dict[`_${index}`] = key;
        data = data.replace(new RegExp(`"${key}"`, 'g'), `"${this._rdict[key]}"`);
      }
    });
    let newObj = JSON.parse(data);
    newObj._dict = this._dict;
    return JSON.stringify(newObj);
  }

  /**
   * @name unpack
   * @description uncompresses stringified JSON that was compressed with the compress method.
   * @param {string} stringifiedData - stringified JSON
   * @return {string} uncompressed stringified JSON
   */
  unpack(stringifiedData) {
    let strData = stringifiedData;
    let data = JSON.parse(strData);
    if (data._dict) {
      let _dict = Object.assign({}, data._dict);
      delete data._dict;
      strData = JSON.stringify(data);
      Object.keys(_dict).forEach((key) => {
        let searchPattern = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        strData = strData.replace(new RegExp(`"${searchPattern}"`, 'g'), `"${_dict[key]}"`);
      });
    }
    return strData;
  }
}

module.exports = SimpleJSONPack;
