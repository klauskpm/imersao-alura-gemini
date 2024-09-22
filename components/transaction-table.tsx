'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, MoreHorizontalIcon, PlusIcon, FilterIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: number
  title: string
  amount: number
  datetime: string
}

const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [
    { id: 1, title: "Salary", amount: 5000, datetime: "2024-06-01T09:00" },
    { id: 2, title: "Rent", amount: -1500, datetime: "2024-07-02T10:30" },
    { id: 3, title: "Groceries", amount: -200, datetime: "2024-08-03T14:15" },
    { id: 4, title: "Freelance Work", amount: 1000, datetime: "2024-08-04T16:45" },
    { id: 5, title: "Utilities", amount: -150, datetime: "2024-09-05T11:20" },
  ]

  return transactions.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
}

export function TransactionTableComponent() {
  const [transactions, setTransactions] = useState<Transaction[]>(generateTransactions())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState({
    amount: 'all',
    type: 'all',
    period: 'current_month',
  })
  const [showFilters, setShowFilters] = useState(false)

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.datetime)
      const now = new Date()
      const periodStart = new Date()

      switch (filters.period) {
        case 'current_month':
          periodStart.setDate(1)
          break
        case 'last_30_days':
          periodStart.setDate(now.getDate() - 30)
          break
        case 'last_60_days':
          periodStart.setDate(now.getDate() - 60)
          break
        case 'last_90_days':
          periodStart.setDate(now.getDate() - 90)
          break
        default:
          periodStart.setFullYear(periodStart.getFullYear() - 100) // Show all if 'all' is selected
      }

      const amountCondition = 
        filters.amount === 'all' ? true :
        filters.amount === 'under_100' ? Math.abs(transaction.amount) < 100 :
        filters.amount === '100_to_1000' ? Math.abs(transaction.amount) >= 100 && Math.abs(transaction.amount) < 1000 :
        Math.abs(transaction.amount) >= 1000

      const typeCondition = 
        filters.type === 'all' ? true :
        filters.type === 'income' ? transaction.amount > 0 :
        transaction.amount < 0

      return amountCondition && typeCondition && transactionDate >= periodStart && transactionDate <= now
    })
  }, [transactions, filters])

  const totalBalance = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

  const handleOpenDialog = (transaction: Transaction | null = null) => {
    setCurrentTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCurrentTransaction(null)
    setIsDialogOpen(false)
  }

  const handleSubmitTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newTransaction: Transaction = {
      id: currentTransaction?.id || transactions.length + 1,
      title: formData.get('title') as string,
      amount: parseFloat(formData.get('amount') as string),
      datetime: formData.get('datetime') as string,
    }

    if (currentTransaction) {
      setTransactions(transactions.map(t => t.id === currentTransaction.id ? newTransaction : t))
    } else {
      setTransactions([...transactions, newTransaction])
    }

    handleCloseDialog()
  }

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id))
  }

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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

      <div className="mb-6">
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[150px]">
                <Select value={filters.amount} onValueChange={(value) => handleFilterChange('amount', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Amounts</SelectItem>
                    <SelectItem value="under_100">Under $100</SelectItem>
                    <SelectItem value="100_to_1000">$100 - $1000</SelectItem>
                    <SelectItem value="over_1000">Over $1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <Select value={filters.period} onValueChange={(value) => handleFilterChange('period', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_month">Current Month</SelectItem>
                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    <SelectItem value="last_60_days">Last 60 Days</SelectItem>
                    <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentTransaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitTransaction}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={currentTransaction?.title}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      defaultValue={currentTransaction?.amount}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="datetime" className="text-right">
                      Date & Time
                    </Label>
                    <Input
                      id="datetime"
                      name="datetime"
                      type="datetime-local"
                      defaultValue={currentTransaction?.datetime}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{currentTransaction ? 'Update' : 'Add'} Transaction</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
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
                  <TableCell>{formatDateTime(transaction.datetime)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(transaction)}>
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