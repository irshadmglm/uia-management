import { FaWhatsapp, FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa';

const icons = [
  { icon: <FaWhatsapp />, link: 'https://wa.me/' },
  { icon: <FaFacebookF />, link: 'https://facebook.com/' },
  { icon: <FaYoutube />, link: 'https://youtube.com/' },
  { icon: <FaInstagram />, link: 'https://instagram.com/' },
];

export default function SocialIcons() {
  return (
    <div className="flex justify-center items-center gap-2 p-4">
      {icons.map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 bg-white text-black rounded-full flex justify-center items-center shadow-md hover:scale-110 transition duration-300"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
