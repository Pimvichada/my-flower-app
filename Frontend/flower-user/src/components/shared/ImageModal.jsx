import { X } from 'lucide-react';

const ImageModal = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print" onClick={onClose}>
      <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-10">
          <X size={20} className="text-gray-800" />
        </button>
        <img src={src} alt="Enlarged view" className="w-full h-auto" />
        <div className="p-4 bg-[#FDFBF7] text-center border-t">
          <p className="text-[#8A9A7B] font-bold text-sm">Flower For You 24 - Bouquet View</p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
