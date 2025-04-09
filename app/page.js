import Link from "next/link";
import Nav from "../components/Nav";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white p-10 rounded-lg shadow-sm space-y-8 mt-[-4rem]">
          <div className="space-y-4">
            <h1 className="text-3xl font-light text-gray-900 text-center">
              Modern<span className="font-medium text-blue-500">Bank</span>
            </h1>
            <p className="text-gray-500 text-center">
              Simple, secure banking for today.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/register"
              className="block w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-md transition-colors duration-200"
            >
              Create Account
            </Link>

            <p className="text-sm text-gray-500 text-center">
              Existing user?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
