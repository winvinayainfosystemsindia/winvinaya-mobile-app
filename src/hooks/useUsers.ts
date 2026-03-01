import { useQuery } from '@tanstack/react-query';

interface User {
	id: number;
	name: string;
	email: string;
}

const fetchUsers = async (): Promise<User[]> => {
	const response = await fetch('https://jsonplaceholder.typicode.com/users');
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
};

export const useUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: fetchUsers,
	});
};
