import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Brand from "../components/Brand.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Ad soyad gereklidir.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/panel");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-split">
      <aside className="auth-hero" aria-hidden="true">
        <div className="auth-hero-inner">
          <Brand />
          <h2>Ücretsiz hesap oluştur</h2>
          <p>Kayıt olduktan sonra doğrudan not paneline yönlendirilirsin.</p>
          <ul className="auth-features">
            <li>
              <span className="feature-dot" />
              Hızlı kayıt
            </li>
            <li>
              <span className="feature-dot" />
              Kişisel not alanı
            </li>
            <li>
              <span className="feature-dot" />
              Veritabanında kalıcı saklama
            </li>
          </ul>
        </div>
      </aside>

      <section className="auth-form-side">
        <div className="auth-card auth-card-elevated">
          <div className="auth-card-header">
            <h1>Kayıt Ol</h1>
            <p className="subtitle">Yeni hesap oluştur ve panele geç</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Ad Soyad</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Ahmet Yılmaz"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="ornek@okul.edu.tr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
              {submitting ? "Kaydediliyor…" : "Kayıt Ol → Panel"}
            </button>
          </form>

          <p className="auth-footer">
            Zaten hesabın var mı? <Link to="/giris">Giriş yap</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
