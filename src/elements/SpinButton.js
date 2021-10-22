import omit from 'ramda/src/omit';
import { Gtk } from '../env';
import ControlledWidget from './ControlledWidget';

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

export default class SpinButton extends ControlledWidget {
	get type() {
		return Gtk.SpinButton;
	}

	get controls() {
		return [ 'value' ];
	}

	createInstance(props) {
		const adjustment = createAdjustment(Object.fromEntries(props));

		const appliedProps = [
			// Compiler error on below.
			//...props.filter(([ prop ]) => !adjustmentProps.includes(prop))
			...props,
			[ 'adjustment', adjustment ],
		].filter(([ prop ]) => !adjustmentProps.includes(prop));

		super.createInstance(appliedProps);
	}

	update(changes) {
		adjustmentProps.forEach(adjustmentProp => {
			const valueSet = changes.set.find(([ prop ]) => prop === adjustmentProp);

			if (valueSet) {
				this.adjustment[valueSet[0]] = valueSet[1];
			}
		});

		const appliedSet = changes.set.filter(([ prop ]) => !adjustmentProps.includes(prop));

		super.update({ ...changes, set: appliedSet });
	}
}

