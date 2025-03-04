import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-16">ARAMIZA KATILIN</h1>
      <p className="text-gray-400 text-center mb-16 max-w-lg">
        Topluluğumuza katılarak yeni fırsatlar keşfedin, değerli bağlantılar kurun ve birlikte büyüyün.
      </p>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4">Giriş Yap</h2>
        <input
          type="email"
          placeholder="E-posta Adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded"
          required
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2"
          />
          <label className="text-sm text-gray-400">Beni hatırla</label>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded">
          Giriş Yap
        </button>
        <p className="text-center text-sm text-gray-400 mt-4">
          Hesabınız yok mu? <a href="/register" className="text-blue-500">Kayıt olun</a>
        </p>
      </form>
    </div>
  );
}
