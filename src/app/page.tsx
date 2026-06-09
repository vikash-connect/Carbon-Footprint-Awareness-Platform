import DashboardClient from '@/components/DashboardClient';
import { connectToDatabase } from '@/lib/db';
import { Footprint } from '@/lib/models/Footprint';

export default async function CarbonPlatform() {
  const mockUserId = "user_123";

  // Pre-fetch data securely on the server to reduce JS payload on the client
  try {
    await connectToDatabase();
  } catch (e) {
    console.error("Database connection issue during server render:", e);
  }
  
  let rawHistory = [];
  try {
    rawHistory = await Footprint.find({ userId: mockUserId })
      .select('travel foodType energyUse date -_id')
      .sort({ date: -1 })
      .limit(1)
      .lean();
  } catch (e) {
    console.error("Failed to fetch initial data:", e);
  }

  const initialData = JSON.parse(JSON.stringify(rawHistory[0] || null));

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-emerald-800 tracking-tight">EcoTrack</h1>
        <p className="text-slate-600 mt-1">Your personal footprint awareness platform.</p>
      </header>
      <DashboardClient userId={mockUserId} />
    </main>
  );
}
