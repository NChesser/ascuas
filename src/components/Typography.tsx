import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { Colors, FontSize } from '../theme/colors';

type TypographyVariant =
	| 'display'
	| 'title'
	| 'headline'
	| 'subtitle'
	| 'label'
	| 'body'
	| 'body-sm'
	| 'caption'
	| 'micro'
	| 'overline';

type TypographyTone =
	| 'neutral'
	| 'primary'
	| 'primary-soft'
	| 'warm'
	| 'subtle'
	| 'accent'
	| 'accent-soft'
	| 'muted'
	| 'info'
	| 'info-strong'
	| 'success';

interface TypographyProps extends TextProps {
	variant?: TypographyVariant;
	tone?: TypographyTone;
	children: React.ReactNode;
}

const variantStyles: Record<TypographyVariant, TextStyle> = {
	display: { fontSize: FontSize.display, fontWeight: '700', letterSpacing: -0.5 },
	title: { fontSize: FontSize.title, fontWeight: '700', letterSpacing: -0.3 },
	headline: { fontSize: FontSize.headline, fontWeight: '600' },
	subtitle: { fontSize: FontSize.subtitle, fontWeight: '600' },
	label: { fontSize: FontSize.label, fontWeight: '600' },
	body: { fontSize: FontSize.body, lineHeight: 22 },
	'body-sm': { fontSize: FontSize.bodySm, lineHeight: 20 },
	caption: { fontSize: FontSize.caption },
	micro: { fontSize: FontSize.micro, lineHeight: 14 },
	overline: {
		fontSize: FontSize.caption,
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: 1,
	},
};

const toneColors: Record<TypographyTone, string> = {
	neutral: Colors.gray900,
	primary: Colors.amber900,
	'primary-soft': Colors.amber800,
	warm: Colors.amber700,
	subtle: Colors.amber700,
	accent: Colors.amber600,
	'accent-soft': Colors.amber500,
	muted: Colors.gray500,
	info: Colors.sky600,
	'info-strong': Colors.sky800,
	success: Colors.green600,
};

const defaultToneByVariant: Record<TypographyVariant, TypographyTone> = {
	display: 'primary',
	title: 'primary',
	headline: 'primary',
	subtitle: 'primary',
	label: 'primary',
	body: 'subtle',
	'body-sm': 'subtle',
	caption: 'muted',
	micro: 'muted',
	overline: 'accent',
};

const Typography: React.FC<TypographyProps> = ({
	variant = 'body',
	tone,
	style,
	children,
	...props
}) => {
	const appliedTone = tone ?? defaultToneByVariant[variant];

	return (
		<Text
			style={[
				variantStyles[variant],
				{ color: toneColors[appliedTone] },
				style,
			]}
			{...props}
		>
			{children}
		</Text>
	);
};

export default Typography;
