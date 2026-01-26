export default function AccountSettingsPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-mango-red px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
            <span className="font-bold text-xs uppercase text-white">Your Profile</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-mango-dark">Account</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="distressed-card p-6">
            <p className="text-mango-dark font-medium">Account settings coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
