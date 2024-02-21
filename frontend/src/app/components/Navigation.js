import { useRouter } from 'next/navigation';
import { useContext } from 'react'
import { UserContext } from '../layout';
import Image from "next/image";
import Link from "next/link"

export default function Navigation() {
  const contxt = useContext(UserContext)
  const router = useRouter()
  const handleLogout = () => {
    contxt.auth(null)
    window.location("http://localhost:3000/")
  }
  return (
    <nav>
      <div className="nav-left">
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          className="dark:invert"
          width={100}
          height={24}
          priority
        />
      </div>
      <div className="nav-right">
        <ul>
          {contxt.user ? (
            <>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li onClick={handleLogout} className="lgout">Logout</li>
            </>
          ) : (
            <>
              <li><Link href="/signup">Sign Up</Link></li>
              <li>
                <Link href="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
