export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 py-12 dark:bg-gray-950'>
      <div className='w-full max-w-md space-y-8 px-4'>
        <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-black/50 md:p-8'>
          {children}
        </div>
      </div>
    </div>
  );
}
