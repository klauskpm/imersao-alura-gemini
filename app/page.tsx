import { db } from "@/drizzle/db";
import AiClientResponse from "./ai-client-response";
import AiServerResponse from "./ai-server-response";

const getUsers = async () => {
  return db.query.users.findMany();
};

export default async function Home({ searchParams }: { searchParams: { text?: string } }) {
  const users = await getUsers();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AiClientResponse text={searchParams.text} />
      <AiServerResponse text={searchParams.text} />
      <h1 className="text-4xl font-bold">Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            Name: {user.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
