import _ from "lodash";

export const checkPropsChange = (props, nextProps, keys, equalityChecker = _.isEqual) => {
	const propsToCheck = _.pick(props, keys);
	const nextPropsToCheck = _.pick(nextProps, keys);

	if (_.isFunction(equalityChecker)) {
		return equalityChecker(propsToCheck, nextPropsToCheck);
	}

	return propsToCheck === nextPropsToCheck;
};
