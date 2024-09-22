'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon } from "lucide-react"

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
  const [transactions] = useState<Transaction[]>(initialTransactions)

  const totalBalance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)

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
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}