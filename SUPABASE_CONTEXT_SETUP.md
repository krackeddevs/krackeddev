# Supabase Setup Guide

## Environment Variables

To use Supabase in your application, you need to set up the following environment variables:

1. Create a `.env.local` file in the root of your project
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Getting Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** > **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Using Supabase Context

The Supabase context is now available throughout your application. You can use it in any client component:

```tsx
'use client';

import { useSupabase } from '@/app/context/SupabaseContext';

export default function YourComponent() {
  const { user, session, loading, signIn, signUp, signOut } = useSupabase();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
        </div>
      )}
    </div>
  );
}
```

## Available Context Values

- `supabase` - The Supabase client instance
- `user` - The currently authenticated user (or null)
- `session` - The current session (or null)
- `loading` - Boolean indicating if auth state is being loaded
- `signIn(email, password)` - Function to sign in a user
- `signUp(email, password)` - Function to sign up a new user
- `signOut()` - Function to sign out the current user

## Next Steps

1. Set up your Supabase database tables
2. Configure Row Level Security (RLS) policies
3. Start building authenticated features!

