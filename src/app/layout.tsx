import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameHub - Форум для геймеров",
  description: "Сообщество для обсуждения игр и поиска единомышленников",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ru">
      <body className={`${inter.className}`}>
        <nav className="navbar">
          <div className="container">
            <div className="navbar-content">
              <Link href="/" className="navbar-logo">
                🎮 GameHub
              </Link>
              
              <div className="navbar-links">
                <Link href="/">Главная</Link>
                <Link href="/posts">Форум</Link>
                <Link href="/posts/new">Создать пост</Link>
                
                {session ? (
                  <>
                    <Link href="/profile" className="profile-link">
                      <span className="avatar-small">
                        {session.user?.name?.[0]?.toUpperCase()}
                      </span>
                      Профиль
                    </Link>
                    <Link href="/api/auth/signout" className="logout-link">
                      Выйти
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="login-link">
                      Войти
                    </Link>
                    <Link href="/auth/register" className="register-link">
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main>
          {children}
        </main>

        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">🎮 GameHub</div>
              <p className="footer-text">Сообщество геймеров © 2024</p>
              <div className="footer-links">
                <Link href="/about">О нас</Link>
                <Link href="/rules">Правила</Link>
                <Link href="/contact">Контакты</Link>
                <Link href="/privacy">Конфиденциальность</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}