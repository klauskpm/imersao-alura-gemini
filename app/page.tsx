import { TransactionTableComponent } from "@/components/transaction-table";
import { db } from "@/drizzle/db";

const getUsers = async () => {
  return db.query.users.findMany();
};

export default async function Home({ searchParams }: { searchParams: { text?: string } }) {
  const users = await getUsers();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TransactionTableComponent />
    </main>
  );
}
