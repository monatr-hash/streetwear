import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4">
        <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-zinc-50">
          Log In
        </h1>
        <AuthForm mode="login" />
      </main>
    </>
  );
}
