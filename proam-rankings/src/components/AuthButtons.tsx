import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/astro/react';

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton mode="redirect" redirectUrl="/sign-in">
          <button className="px-1.5 py-0.5 text-xs font-medium bg-patriot-red-600 hover:bg-patriot-red-700 text-white rounded transition focus:outline-none focus:ring-2 focus:ring-patriot-red-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-patriot-blue-900 whitespace-nowrap">
            Log In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}

