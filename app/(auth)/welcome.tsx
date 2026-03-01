import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
	const theme = useTheme();

	const handleGetStarted = () => {
		// Navigate to the main app (tabs)
		router.replace('/(app)/(tabs)');
	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<Image
						source={require('../../assets/images/winvinaya-logo.png')}
						style={styles.logo}
						resizeMode="contain"
					/>
				</View>

				<View style={styles.textContainer}>
					<Text variant="headlineMedium" style={styles.title}>
						Welcome to Winvinaya
					</Text>
					<Text variant="bodyLarge" style={styles.subtitle}>
						Skilling People with Disabilities for Inclusive Careers.
					</Text>
				</View>

				<View style={styles.footer}>
					<Button
						mode="contained"
						onPress={handleGetStarted}
						style={styles.button}
						contentStyle={styles.buttonContent}
						labelStyle={styles.buttonLabel}
					>
						Get Started
					</Button>

					<Text variant="bodySmall" style={styles.footerText}>
						Empowering Careers, Enriching Lives.
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		padding: 24,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	logoContainer: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	logo: {
		width: width * 0.7,
		height: width * 0.4,
	},
	textContainer: {
		flex: 1,
		alignItems: 'center',
		width: '100%',
	},
	title: {
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 12,
		color: '#005596', // Winvinaya Blue (approximate)
	},
	subtitle: {
		textAlign: 'center',
		opacity: 0.7,
		paddingHorizontal: 12,
	},
	footer: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		width: '100%',
		borderRadius: 8,
		backgroundColor: '#005596',
		marginBottom: 24,
	},
	buttonContent: {
		paddingVertical: 8,
	},
	buttonLabel: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	footerText: {
		opacity: 0.5,
		fontStyle: 'italic',
	},
});
