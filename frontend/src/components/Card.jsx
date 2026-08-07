import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Card = ({ title, icon: Icon, route, url }) => {
  const content = (
    <div className="group relative bg-white dark:bg-[#11322f] p-3 sm:p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-transparent transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-center gap-3 cursor-pointer overflow-hidden min-h-[90px]">
      
      {/* Decorative background element on hover */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-brand-mint/10 dark:bg-[#0d2522]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-multiply dark:mix-blend-normal blur-2xl"></div>

      {/* Icon Container */}
      <div className="relative flex-shrink-0 flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-brand-mint/10 dark:bg-[#0d2522] text-brand-teal dark:text-brand-mint transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon size={22} strokeWidth={2.5} />
      </div>
      
      {/* Text Content */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h2 className="text-xs sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-teal dark:group-hover:text-brand-mint transition-colors duration-300 leading-tight">
          {title}
        </h2>
      </div>

      {/* Action Chevron - hidden on mobile */}
      <div className="hidden sm:flex flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-brand-teal dark:group-hover:text-brand-mint group-hover:translate-x-1 transition-all duration-300">
        <ArrowRight size={20} strokeWidth={2.5} />
      </div>
    </div>
  );

  if (route) {
    return <Link to={route} className="block">{content}</Link>;
  } else if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  } else {
    return content;
  }
};

export default Card;
