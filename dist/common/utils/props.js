import _ from 'lodash';
export var checkPropsChange = function checkPropsChange(props, nextProps, keys) {
  var equalityChecker = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _.isEqual;

  var propsToCheck = _.pick(props, keys);

  var nextPropsToCheck = _.pick(nextProps, keys);

  if (_.isFunction(equalityChecker)) {
    return equalityChecker(propsToCheck, nextPropsToCheck);
  }

  return propsToCheck === nextPropsToCheck;
};