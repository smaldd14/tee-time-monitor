import { Client } from 'pg';

export async function getDbClient(env: Env): Promise<Client> {
	const client = new Client({
		connectionString: env.DATABASE_URL,
	});

	await client.connect();
	return client;
}

export async function closeDbClient(client: Client): Promise<void> {
	await client.end();
}
