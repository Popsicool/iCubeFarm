import Image from "next/image";
import Link from 'next/link';


export default function Footer(){
    const currentYear = new Date().getFullYear();
    return <footer>
        <footer>
            <p>Copywrite {currentYear}. All rights reserved</p>
        </footer>
    </footer>
}
