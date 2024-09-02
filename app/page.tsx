import { db } from "@/drizzle/db";
import { sql } from "@vercel/postgres";

const getUsers = async () => {
  return db.query.users.findMany();
};

export default async function Home() {
  const users = await getUsers();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
