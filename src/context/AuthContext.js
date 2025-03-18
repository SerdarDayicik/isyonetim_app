import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Yeni loading state
  const navigate = useNavigate();

  // Token'i çözümleme fonksiyonu
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error("Token çözümleme hatası:", e);
      return null;
    }
  };

  // Token geçerlilik süresini kontrol eden fonksiyon
  const isTokenValid = (token) => {
    const decoded = parseJwt(token);
    if (!decoded) return false;
    const isValid = decoded.exp * 1000 > Date.now();
    console.log("Token geçerlilik kontrolü:", isValid, "(exp:", decoded.exp * 1000, ", now:", Date.now(), ")");
    return isValid;
  };

  // Sayfa yenilendiğinde token kontrolü yap
  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log("Sayfa yüklendi, token:", token);
    if (token) {
      token = token.replace(/^"(.*)"$/, '$1'); // Fazladan tırnak varsa temizle
      if (isTokenValid(token)) {
        const decoded = parseJwt(token);
        setUser({ user_id: decoded.user_id, role: decoded.role });
        console.log("Geçerli token bulundu, kullanıcı setlendi:", decoded);
      } else {
        console.log("Token geçersiz veya süresi dolmuş.");
        logout();
      }
    } else { 
      console.log("Token bulunamadı.");
      logout();
    }
    setLoading(false); // Kontrol tamamlandı, loading bitti
  }, []); // Bağımlılıklar listesi boş olduğundan sadece ilk renderda çalışır.

  // Kullanıcı giriş yapınca
  const login = (jwtToken) => {
    console.log("Giriş token'ı:", jwtToken);
    if (isTokenValid(jwtToken)) {
      const decoded = parseJwt(jwtToken);
      setUser({ user_id: decoded.user_id, role: decoded.role });
      localStorage.setItem("token", jwtToken);
    } else {
      console.error("Girişte geçersiz token!");
      logout();
    }
  };

  // Kullanıcı çıkış yapınca
  const logout = () => {
    console.log("Çıkış yapılıyor...");
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? (
        <div>Loading...</div> // Sayfa yükleniyorsa loading mesajı
      ) : (
        children // Sayfa yüklenmişse, çocuk componentleri göster
      )}
    </AuthContext.Provider>
  );
}
