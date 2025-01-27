// app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Collaborative Drawing App</h1>
            <p className="text-xl mb-8">Welcome to our collaborative drawing platform. Join now or log in to start drawing together!</p>
            
            <div className="space-x-4">
                <Link href="/signup">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded">Sign Up</button>
                </Link>
                <Link href="/signin">
                    <button className="px-6 py-2 bg-green-500 text-white rounded">Sign In</button>
                </Link>
            </div>
        </div>
    );
}
