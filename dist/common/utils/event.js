import _ from "lodash";
var EVENT_PREFIX = /^on(.+)$/i;
export var extractEventHandlers = function extractEventHandlers(props) {
  var eventPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EVENT_PREFIX;
  return _.reduce(Object.keys(props), function (res, prop) {
    var cb = props[prop];

    if (eventPrefix.test(prop) && _.isFunction(cb)) {
      var key = prop.replace(eventPrefix, function (match, p) {
        return "on".concat(p);
      });
      res[key] = cb;
    }

    return res;
  }, {});
};
export var getExactEventHandlerName = function getExactEventHandlerName(event) {
  if (!_.isString(event)) {
    return event;
  }

  return event.replace("on", "").toLowerCase();
};