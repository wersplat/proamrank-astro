import { useState } from 'react';
import * as Sentry from '@sentry/astro';

export default function SentryTestComponent() {
  const [count, setCount] = useState(0);

  const throwReactError = () => {
    // This will be caught by React Error Boundary and Sentry
    throw new Error('[Sentry Test] React component error - state was: ' + count);
  };

  const throwEventHandlerError = () => {
    throw new Error('[Sentry Test] React event handler error');
  };

  const captureManualError = () => {
    Sentry.captureException(
      new Error('[Sentry Test] Manually captured error from React component'),
      {
        tags: {
          component: 'SentryTestComponent',
          test: 'manual-capture'
        },
        extra: {
          currentCount: count,
          timestamp: new Date().toISOString()
        }
      }
    );
    alert('✅ Error captured! Check Sentry dashboard.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-4">
      <h3 className="text-xl font-semibold mb-4 text-purple-600">
        🔮 React Component Error Test
      </h3>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">Counter state: {count}</p>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Increment Counter
          </button>
        </div>

        <div className="grid gap-3">
          <button
            onClick={throwEventHandlerError}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            Throw Error in Event Handler
          </button>

          <button
            onClick={throwReactError}
            className="w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
          >
            Throw Error in Render (with state)
          </button>

          <button
            onClick={captureManualError}
            className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Manually Capture Error
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          These errors will be captured by Sentry with full React component context,
          including component stack traces and state information.
        </p>
      </div>
    </div>
  );
}

