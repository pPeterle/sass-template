import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    // Handle login logic here
    alert(`Login with ${email}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 bg-base-200 rounded-box shadow-lg flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
      {error && <div className="alert alert-error py-2 px-4 text-sm">{error}</div>}
      <div className="form-control">
        <label className="label" htmlFor="login-email">
          <span className="label-text">Email</span>
        </label>
        <input
          id="login-email"
          type="email"
          className="input input-bordered"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@email.com"
        />
      </div>
      <div className="form-control">
        <label className="label" htmlFor="login-password">
          <span className="label-text">Password</span>
        </label>
        <input
          id="login-password"
          type="password"
          className="input input-bordered"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <button type="submit" className="btn btn-primary mt-2">Login</button>
    </form>
  );
}
