import { useState, useEffect } from 'react';
import { $userStore } from '@clerk/astro/client';
import { useSyncExternalStore } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function ClerkFDWTest() {
  const user = useSyncExternalStore($userStore.listen, $userStore.get, $userStore.get);
  const [fdwData, setFdwData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setFdwData(null);
      return;
    }

    const fetchFDWData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get Supabase client - using import.meta.env for client-side
        const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
        const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing Supabase environment variables');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Try to query the Clerk FDW table
        // Common names: clerk_users, clerk.users, or a view wrapping the FDW
        // Adjust the table name based on your actual FDW setup
        const { data, error: queryError } = await supabase
          .from('clerk_users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (queryError) {
          // If clerk_users doesn't exist, try alternative names
          const altQueries = [
            supabase.from('clerk.users').select('*').eq('id', user.id).maybeSingle(),
            supabase.rpc('get_clerk_user', { user_id: user.id }),
          ];

          let found = false;
          for (const altQuery of altQueries) {
            try {
              const result = await altQuery;
              if (result.data && !result.error) {
                setFdwData(result.data);
                found = true;
                break;
              }
            } catch (e) {
              // Continue to next query
            }
          }

          if (!found) {
            throw queryError;
          }
        } else {
          setFdwData(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch FDW data');
        console.error('FDW Test Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFDWData();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-500/30 p-4 rounded-lg">
        <p className="text-yellow-700 dark:text-yellow-300">
          Please sign in to test the Clerk FDW connection.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-patriot-blue-900/50 p-6 rounded-xl border border-gray-200 dark:border-white/20">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Clerk FDW Test
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Clerk User ID:
          </h4>
          <code className="block bg-gray-100 dark:bg-patriot-blue-800 p-2 rounded text-sm">
            {user.id}
          </code>
        </div>

        {loading && (
          <div className="text-gray-600 dark:text-neutral-400">
            Loading FDW data...
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 p-4 rounded-lg">
            <p className="text-red-700 dark:text-red-300 font-medium mb-2">
              Error:
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            <p className="text-red-600 dark:text-red-400 text-xs mt-2">
              Note: The FDW table/view name may need to be adjusted. Common names:
              clerk_users, clerk.users, or a custom view name.
            </p>
          </div>
        )}

        {fdwData && !loading && (
          <div>
            <h4 className="font-medium text-gray-700 dark:text-neutral-300 mb-2">
              FDW Data Retrieved:
            </h4>
            <pre className="bg-gray-100 dark:bg-patriot-blue-800 p-4 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(fdwData, null, 2)}
            </pre>
          </div>
        )}

        {!fdwData && !loading && !error && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 p-4 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              No FDW data found. This could mean:
            </p>
            <ul className="list-disc list-inside text-blue-600 dark:text-blue-400 text-xs mt-2 space-y-1">
              <li>The FDW table/view name needs to be configured</li>
              <li>The user hasn't been synced to the FDW yet</li>
              <li>The FDW connection needs to be verified in Supabase</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

