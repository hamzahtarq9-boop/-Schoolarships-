import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import AmbientBackground from '../components/AmbientBackground.jsx';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <AmbientBackground />
      <div>
        <Logo size={120} glow className="mx-auto" />
        <h1 className="mt-6 font-ruqaa text-5xl text-gold">الصفحة غير موجودة</h1>
        <p className="mt-3 text-muted">يبدو أنك ضللت الطريق، والرجوع دائمًا ممكن 🤍</p>
        <Link to="/" className="btn-gold mt-8">العودة للرئيسية</Link>
      </div>
    </main>
  );
}
