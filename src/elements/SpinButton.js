import omit from 'ramda/src/omit';
import { Gtk } from '../env';
import { createControlledWidget } from '../lib';

const adjustmentProps = [ 'lower', 'upper', 'pageIncrement', 'stepIncrement' ];

function omitAdjustmentProps(props) {
	return omit(adjustmentProps, props);
}

function createAdjustment(adjustment) {
	return new Gtk.Adjustment({
		lower: adjustment.lower || 0,
		upper: adjustment.upper || 999999,
		pageIncrement: 1,
		stepIncrement: adjustment.stepIncrement || 1,
		value: adjustment.value,
	});
}

const SpinButton = (props) => {
	const adjustment = createAdjustment(props);

	const appliedProps = {
		...omitAdjustmentProps(props),
		adjustment,
	};

	const {
		type,
		instance,
		appendChild,
		insertBefore,
		removeChild,
		show,
		update,
	} = createControlledWidget(Gtk.SpinButton, appliedProps, [
		[ 'value', 'onValueChanged' ],
	]);

	const appliedUpdate = (element, changes) => {
		adjustmentProps.forEach(adjustmentProp => {
			const valueSet = changes.set.find(([ prop ]) => prop === adjustmentProp);

			if (valueSet) {
				element.adjustment[valueSet[0]] = valueSet[1];
			}
		});

		const appliedSet = changes.set.filter(([ prop ]) => !adjustmentProps.includes(prop));

		update(element, { ...changes, set: appliedSet });
	};

	return {
		type,
		instance,
		appendChild,
		insertBefore,
		removeChild,
		show,
		update: appliedUpdate,
	};
};

export default SpinButton;

