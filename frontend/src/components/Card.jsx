import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const Card = ({ title, icon: Icon, route, url, color = "blue" }) => {
  
  // Dynamic color mapping for richer visuals
  const colorMap = {
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    green: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    amber: "from-amber-500 to-orange-600 shadow-amber-500/20",
    red: "from-rose-500 to-red-600 shadow-rose-500/20",
  };

  const gradientClass = colorMap[color] || colorMap.blue;

  const CardContent = () => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-md 
      border border-white/40 dark:border-slate-700/60 rounded-3xl p-6 h-full
      shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientClass} opacity-5 rounded-bl-full transition-opacity group-hover:opacity-10`} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradientClass} text-white shadow-lg`}>
            <Icon size={28} strokeWidth={1.5} />
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
            <ArrowUpRight size={18} className="text-slate-500 dark:text-slate-300" />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h2>
         {/* {props?.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{props.description}</p>} */}
  
         {/* {!props.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Tap to view details</p>} */}
        </div>
      </div>
    </motion.div>
  );

  if (route) return <Link to={route} className="block h-full"><CardContent /></Link>;
  if (url) return <a href={url} target="_blank" rel="noreferrer" className="block h-full"><CardContent /></a>;
  return <CardContent />;
};

export default Card;