import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      // 👇 Aseguramos que ocupe el 100% del ancho y permita crecer
      style={{ width: "100%", height: "100%", minHeight: "200px" }} 
      className="page-transition-container"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;