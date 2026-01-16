import f1 from '../assets/f1/basicf1.png';
import f1_red from '../assets/f1/f1_red.png';
import f1_orange from '../assets/f1/f1_orange.png';
import f1_blue from '../assets/f1/f1_blue.png'; 
import f1_purple from '../assets/f1/f1_purple.png';
import f1_pink from '../assets/f1/f1_pink.png';
import f1_white from '../assets/f1/f1_white.png';
import f1_yellow from '../assets/f1/f1_yellow.png';

import f2 from '../assets/f2/basicf2.png';
import f2_red from '../assets/f2/f2_red.png';
import f2_orange from '../assets/f2/f2_orange.png';
import f2_blue from '../assets/f2/f2_blue.png';     
import f2_purple from '../assets/f2/f2_purple.png';
import f2_pink from '../assets/f2/f2_pink.png';
import f2_white from '../assets/f2/f2_white.png';
import f2_yellow from '../assets/f2/f2_yellow.png';


// --- Pricing Constants ---
export const SHIPPING_FEE = 50;
export const BASE_FLOWERS_COUNT = 5;
export const BASE_PRICE = 69;
export const ADDITIONAL_FLOWER_PRICE = 10;


export const FLOWER_TYPES1 = [
  { 
    id: 'f1', 
    name: 'f1',
    // เก็บรูปแยกตามรหัสสี (Hex Code)
    colors: {
      '#9E9E9E': { name: 'สีเริ่มต้น', img: f1 },
      '#CC3333': { name: 'แดงพาสเทล', img: f1_red },
      '#FF8C00': { name: 'ส้มพีช', img: f1_orange },
      '#66CCFF': { name: 'ฟ้าสดใส', img: f1_blue },
      '#BDB2FF': { name: 'ม่วงลาเวนเดอร์', img: f1_purple },
      '#FFC6FF': { name: 'ชมพูหวาน', img: f1_pink },
      '#FFFFFF': { name: 'ขาวบริสุทธิ์', img: f1_white },
      '	#FFFF00': { name: 'เหลือง', img: f1_yellow },
      // basicf1.png
    }
  },
  { 
    id: 'f2', 
    name: 'Tulip',
   colors: {
    '#9E9E9E': { name: 'สีเริ่มต้น', img: f2 },
      '#CC3333': { name: 'แดงพาสเทล', img: f2_red },
      '#FF8C00': { name: 'ส้มพีช', img: f2_orange },
      '#66CCFF': { name: 'ฟ้าสดใส', img: f2_blue },
      '#BDB2FF': { name: 'ม่วงลาเวนเดอร์', img: f2_purple },
      '#FFC6FF': { name: 'ชมพูหวาน', img: f2_pink },
      '#FFFFFF': { name: 'ขาวบริสุทธิ์', img: f2_white },
      '	#FFFF00': { name: 'เหลือง', img: f2_yellow },
       // basicf2.png
    }
  }
];

// --- Flower Types ---
export const FLOWER_TYPES2 = [
  { id: 'f1', name: 'f1' ,color: '#9E9E9E', img: f1},
  { id: 'f2', name: 'Tulip', color: '#9E9E9E',  img: f2, },
  { id: 'f3', name: 'Tulip', color: '#FFCDD2',  img: f2, },
  { id: 'f4', name: 'Tulip', color: '#FFCDD2',  img: f2, },
];

export const FLOWER_TYPES = [
  { id: 'f1', name: 'Daisy', color: '#FFF9C4', svg: 'M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z M12 12c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4z M12 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z M12 12c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4z' },
  { id: 'f2', name: 'Tulip', color: '#FFCDD2', svg: 'M12 21c-3.3 0-6-2.7-6-6 0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6z' },
  { id: 'f3', name: 'Rose', color: '#F8BBD0', svg: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z' },
  { id: 'f4', name: 'Lavender', color: '#E1BEE7', svg: 'M12 2v20M9 7l3 3 3-3M9 12l3 3 3-3' },
  { id: 'f5', name: 'Sunflower', color: '	#FFFF00', svg: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' }
];

// --- Color Options ---
export const COLOR_NAMES = { 
  '#9E9E9E': 'สีเริ่มต้น' ,
  '#CC3333': 'แดงพาสเทล', 
  '#FF8C00': 'ส้มพีช', 
  '	#FFFF00': 'เหลืองนวล', 
  '#66CCFF': 'ฟ้าสดใส', 
  '#BDB2FF': 'ม่วงลาเวนเดอร์', 
  '#FFC6FF': 'ชมพูหวาน', 
  '#FFFFFF': 'ขาวบริสุทธิ์',
////////
};


// export const COLOR_OPTIONS = { 
//   '#9E9E9E': { name: 'สีเริ่มต้น', img: '/images/colors/default.png' },
//   '#FFADAD': { name: 'แดงพาสเทล', img: '/images/colors/pastel-red.png' },
//   '#FFD6A5': { name: 'ส้มพีช', img: '/images/colors/peach-orange.png' },
 
// };


export const RIBBON_COLOR_NAMES = {
  '#FFB7B2': 'ชมพูพีช',
  '#B2CEFE': 'ฟ้าอ่อน',
  '#B2F2BB': 'เขียวมิ้นท์',
  '#FFFFD1': 'เหลืองครีม',
  '#E2F0CB': 'เขียวพาสเทล',
  '#FFDAC1': 'ส้มพาสเทล',
};

export const RING_COLOR_NAMES = {
  '#C0C0C0': 'เงิน',
  '#FFD700': 'ทอง',
  '#B87333': 'ทองแดง',
  '#000000': 'ดำ',
};


export const COLORS = Object.keys(COLOR_NAMES);
export const RIBBON_COLORS = ['#FFB7B2', '#B2CEFE', '#B2F2BB', '#FFFFD1', '#E2F0CB', '#FFDAC1'];
export const RING_COLORS = ['#C0C0C0', '#FFD700', '#B87333', '#000000'];

// --- Premade Sets ---
export const PREMADE_SETS = [
  { id: 'p1', name: 'Sweet Pastel Set', price: 129, description: '8 ดอกไม้ พร้อมโบว์ชมพู', items: 8 },
  { id: 'p2', name: 'Sunlight Garden', price: 99, description: '6 ดอกไม้ พร้อมโบว์เหลือง', items: 6 },
  { id: 'p3', name: 'Ocean Breeze', price: 109, description: '7 ดอกไม้ พร้อมโบว์ฟ้า', items: 7 },
];

