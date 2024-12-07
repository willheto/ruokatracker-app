import { memo } from 'react';
import { useController } from 'react-hook-form';
import { Input as UiKittenInput } from '@ui-kitten/components';

export const Input = memo(
	({
		name,
		control,
		required,
		isDisabled,
		placeholder,
		isNumeric,
	}: {
		name: string;
		control: any;
		required: string;
		isDisabled: boolean;
		placeholder?: string;
		isNumeric?: boolean;
	}) => {
		const { field } = useController({ control, defaultValue: '', name, rules: { required: required } });
		return (
			<UiKittenInput
				keyboardType={isNumeric ? 'numeric' : 'default'}
				placeholder={placeholder}
				value={field.value}
				onChangeText={field.onChange}
				disabled={isDisabled}
			/>
		);
	},
);
