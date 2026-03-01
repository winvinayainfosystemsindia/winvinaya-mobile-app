import { Redirect } from 'expo-router';

export default function Index() {
	// In a real app, logic would go here to check if the user is logged in.
	// For now, we always redirect to the Welcome screen as it's the professional landing.
	return <Redirect href="/(auth)/welcome" />;
}
