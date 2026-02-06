import Link from "next/link";
import Image from "next/image";
import "./Home.css";

export default function Home() {
    return (
        <div className="main-container">
            <div className="main-background">
                <div className="glow-effect glow-1"></div>
                <div className="glow-effect glow-2"></div>
                <div className="glow-effect glow-3"></div>
            </div>

            <div className="nav-container">
                <nav className="nav-content">
                    <div className="logo-wrapper">
                        <div className="logo-icon">
                            <Image
                                src="/fox.png"
                                alt="GameHub Logo"
                                width={24}
                                height={24}
                                className="logo-image"
                            />
                        </div>
                        <span className="logo-text">GameHub</span>
                    </div>

                    <div className="nav-links">
                        <Link
                            href="/auth/login"
                            className="nav-btn nav-login"
                        >
                            Вход
                        </Link>
                        <Link
                            href="/auth/register"
                            className="nav-btn nav-register"
                        >
                            Регистрация
                        </Link>
                    </div>
                </nav>
            </div>

            <main className="main-content">
                <section className="hero-section">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            <span className="title-main">GameHub</span>
                            <span className="title-gradient">Игровой портал нового поколения</span>
                        </h1>

                        <p className="hero-description">
                            Крупнейшая платформа для геймеров: обзоры, стримы, новости и сообщество.
                            Ваш главный источник всего, что связано с играми.
                        </p>

                        <div className="stats-container">
                            <div className="stat-card">
                                <div className="stat-icon">🎮</div>
                                <div className="stat-content">
                                    <div className="stat-number">10K+</div>
                                    <div className="stat-label">Игр в каталоге</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <div className="stat-number">500K+</div>
                                    <div className="stat-label">Геймеров</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-panel">
                        <div className="panel-container">
                            <div className="panel-badge">
                                <Image
                                    src="/fox.png"
                                    alt="GameHub Logo"
                                    width={32}
                                    height={32}
                                />
                            </div>

                            <div className="panel-header">
                                <h3 className="panel-title">Присоединяйтесь к GameHub</h3>
                                <p className="panel-subtitle">
                                    Станьте частью крупнейшего игрового сообщества
                                </p>
                            </div>

                            <div className="auth-options">
                                <Link
                                    href="/auth/login"
                                    className="auth-option auth-login"
                                >
                                    <div className="option-title">Вход</div>
                                    <div className="option-subtitle">В аккаунт</div>
                                </Link>

                                <Link
                                    href="/auth/register"
                                    className="auth-option auth-register"
                                >
                                    <div className="option-title">Регистрация</div>
                                    <div className="option-subtitle">Создать аккаунт</div>
                                </Link>
                            </div>

                            <div className="social-divider">
                                Или используйте социальные сети
                            </div>
                        </div>
                    </div>
                </section>

                <section className="features-section">
                    <h2 className="features-title">Почему выбирают GameHub?</h2>
                    
                    <div className="features-grid">
                        {[
                            { 
                                category: "Игровые обзоры", 
                                title: "Экспертные обзоры", 
                                desc: "Подробные анализы игр от профессиональных геймеров и критиков" 
                            },
                            { 
                                category: "Статистика", 
                                title: "Точная статистика", 
                                desc: "Отслеживайте свои достижения, время в играх и прогресс" 
                            },
                            { 
                                category: "Сообщество", 
                                title: "Активное сообщество", 
                                desc: "Общайтесь, делитесь скриншотами и находите команду для игр" 
                            }
                        ].map((feature, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-category">{feature.category}</div>
                                <h4 className="feature-name">{feature.title}</h4>
                                <p className="feature-desc">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}