
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Frown } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
      <div className="rounded-full bg-primary/10 p-6 text-primary">
        <Frown className="h-16 w-16" />
      </div>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Oops! The page you're looking for doesn't seem to exist.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go back to Dashboard</Link>
      </Button>
    </div>
  )
}
