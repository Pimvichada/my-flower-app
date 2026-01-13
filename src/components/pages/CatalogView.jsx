import { ArrowLeft, Flower } from 'lucide-react';
import { PREMADE_SETS } from '../../constants/index';

const CatalogView = ({ onBack, onAdd }) => (
  <div className="min-h-screen bg-[#FDFBF7] p-8">
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-8 flex items-center text-[#8A9A7B] font-bold"><ArrowLeft size={18} className="mr-1" /> กลับหน้าแรก</button>
      <h2 className="text-4xl font-serif text-[#5D6D4E] mb-10 text-center">ชุดสำเร็จรูปยอดนิยม</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PREMADE_SETS.map(set => (
          <div key={set.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#F0EAD6] flex flex-col items-center group hover:shadow-xl transition-all">
            <div className="w-32 h-32 bg-[#FEFAE0] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Flower className="text-[#8A9A7B]" size={56} /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{set.name}</h3>
            <p className="text-sm text-gray-400 text-center mb-6">{set.description}</p>
            <div className="mt-auto w-full text-center">
              <div className="font-bold text-2xl text-[#5D6D4E] mb-6">{set.price} บาท</div>
              <button onClick={() => onAdd({...set, snapshot: null, type: 'premade'})} className="w-full py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-md hover:bg-[#6D7D5E] transition-all">เลือกชุดนี้</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CatalogView;
