'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react"

interface Transaction {
  id: number
  title: string
  amount: number
  date: string
}

const initialTransactions: Transaction[] = [
  { id: 1, title: "Salary", amount: 5000, date: "2023-06-01" },
  { id: 2, title: "Rent", amount: -1500, date: "2023-06-02" },
  { id: 3, title: "Groceries", amount: -200, date: "2023-06-03" },
  { id: 4, title: "Freelance Work", amount: 1000, date: "2023-06-04" },
  { id: 5, title: "Utilities", amount: -150, date: "2023-06-05" },
]

export function TransactionTableComponent() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  const totalBalance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)

  const handleAddTransaction = () => {
    // This is a placeholder function. In a real app, you'd open a modal or navigate to a form.
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      title: "New Transaction",
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    }
    setTransactions([...transactions, newTransaction])
  }

  const handleEditTransaction = (id: number) => {
    // Placeholder for edit functionality
    console.log(`Edit transaction ${id}`)
  }

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <DollarSignIcon className="mr-2 h-6 w-6 text-green-500" />
            <span className="text-4xl font-bold">{totalBalance.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Button onClick={handleAddTransaction}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.title}</TableCell>
                  <TableCell>
                    <div className={`flex items-center ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.amount >= 0 ? (
                        <ArrowUpIcon className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="mr-1 h-4 w-4" />
                      )}
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTransaction(transaction.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTransaction(transaction.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}