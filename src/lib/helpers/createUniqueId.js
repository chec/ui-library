import _uniqueId from 'lodash.uniqueid';

// generates unique id concating id, name, value
export default (name, value, defaultName = '') => () => _uniqueId(`${name || defaultName}_${value}_`);
