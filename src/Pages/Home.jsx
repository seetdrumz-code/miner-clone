import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-white">

      {/* HERO SECTION */}

      <section className="text-center py-24 px-6">

        <h1 className="text-6xl font-bold text-green-400 mb-6">
          Mine Coins. Earn Rewards.
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-8">
          Join Miner Clone and start earning virtual mining rewards.
          Track your balance, withdraw coins and climb the leaderboard.
        </p>

        <div className="flex justify-center gap-4">

          <Link
            to="/signup"
            className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-xl font-bold"
          >
            Start Mining
          </Link>

          <Link
            to="/about"
            className="border border-green-500 px-8 py-4 rounded-xl"
          >
            Learn More
          </Link>

        </div>

      </section>

      {/* FEATURES */}

      <section className="grid md:grid-cols-3 gap-6 px-6 pb-20">

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

          <h2 className="text-2xl font-bold text-green-400 mb-3">
            ⛏ Smart Mining
          </h2>

          <p className="text-gray-400">
            Mine coins directly from your dashboard and watch your balance grow.
          </p>

        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

          <h2 className="text-2xl font-bold text-green-400 mb-3">
            💰 Withdrawals
          </h2>

          <p className="text-gray-400">
            Submit withdrawal requests and track approval status.
          </p>

        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

          <h2 className="text-2xl font-bold text-green-400 mb-3">
            🛡 Secure Platform
          </h2>

          <p className="text-gray-400">
            Powered by Firebase Authentication and Firestore Database.
          </p>

        </div>

      </section>

      {/* STATS */}

      <section className="bg-zinc-900 py-20 px-6">

        <div className="grid md:grid-cols-3 gap-6 text-center">

          <div>

            <h2 className="text-4xl font-bold text-green-400">
              24/7
            </h2>

            <p className="text-gray-400">
              Mining Availability
            </p>

          </div>

          <div>

            <h2 className="text-4xl font-bold text-green-400">
              Secure
            </h2>

            <p className="text-gray-400">
              Firebase Protection
            </p>

          </div>

          <div>

            <h2 className="text-4xl font-bold text-green-400">
              Fast
            </h2>

            <p className="text-gray-400">
              Real-Time Database
            </p>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="text-center py-24 px-6">

        <h2 className="text-5xl font-bold mb-6">
          Ready To Start Mining?
        </h2>

        <p className="text-gray-400 mb-8">
          Create an account and begin earning coins today.
        </p>

        <Link
          to="/signup"
          className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-xl font-bold"
        >
          Create Account
        </Link>

      </section>

    </div>
  );
}
