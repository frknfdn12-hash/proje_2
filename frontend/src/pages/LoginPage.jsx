import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Brand from "../components/Brand.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("E-posta adresi gereklidir.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }
    if (!password) {
      setError("Şifre gereklidir.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
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
          <h2>Notlarını tek yerde topla</h2>
          <p>
            Güvenli giriş yap, not paneline geç ve tüm notlarını veritabanında sakla.
          </p>
          <ul className="auth-features">
            <li>
              <span className="feature-dot" />
              E-posta ve şifre doğrulaması
            </li>
            <li>
              <span className="feature-dot" />
              Not ekleme ve silme paneli
            </li>
            <li>
              <span className="feature-dot" />
              SQLite veritabanı bağlantısı
            </li>
          </ul>
          <div className="auth-hero-cards">
            <div className="hero-card">
              <span>📝</span>
              <strong>Ders notu</strong>
              <small>Matematik — Ünite 3</small>
            </div>
            <div className="hero-card offset">
              <span>✅</span>
              <strong>Ödev hatırlatıcı</strong>
              <small>Yarın teslim</small>
            </div>
          </div>
        </div>
      </aside>

      <section className="auth-form-side">
        <div className="auth-card auth-card-elevated">
          <div className="auth-card-header">
            <h1>Giriş Yap</h1>
            <p className="subtitle">Hesabına giriş yap ve not paneline yönlendirilir</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

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
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-inline" aria-hidden />
                  Doğrulanıyor…
                </>
              ) : (
                "Giriş Yap → Panel"
              )}
            </button>
          </form>

          <p className="auth-footer">
            Hesabın yok mu? <Link to="/kayit">Kayıt ol</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
