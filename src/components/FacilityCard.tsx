import React from 'react';
import {
  MapPin,
  Wifi,
  Zap,
  Bed,
  Droplets,
  Shirt,
  Utensils,
  ShieldCheck,
  BellRing,
  Snowflake,
  Tv,
  Car,
  BookOpen,
} from 'lucide-react';
import { Facility } from '../types.ts';

interface FacilityCardProps {
  facility: Facility;
  onClick?: () => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onClick }) => {
  // Map icon names to lucide icons and colors matching the approved reference
  const getIconInfo = () => {
    switch (facility.code) {
      case 'LOCATION':
        return {
          icon: <MapPin className="w-6 h-6 text-[#1B62CD]" />,
          bg: 'bg-[#EBF3FE]',
        };
      case 'WIFI':
        return {
          icon: <Wifi className="w-6 h-6 text-[#1B62CD]" />,
          bg: 'bg-[#EBF3FE]',
        };
      case 'ELECTRICITY':
        return {
          icon: <Zap className="w-6 h-6 text-[#EA4335]" fill="#EA4335" />,
          bg: 'bg-[#FEECEB]',
        };
      case 'CLEAN_ROOMS':
        return {
          icon: <Bed className="w-6 h-6 text-[#1B62CD]" />,
          bg: 'bg-[#EBF3FE]',
        };
      case 'CLEAN_WATER':
        return {
          icon: <Droplets className="w-6 h-6 text-[#1B62CD]" />,
          bg: 'bg-[#EBF3FE]',
        };
      case 'WATER_COOLER':
        return {
          icon: <Snowflake className="w-6 h-6 text-[#1B62CD]" />,
          bg: 'bg-[#EBF3FE]',
        };
      case 'IRON_FACILITY':
        return {
          icon: <Shirt className="w-6 h-6 text-[#1B62CD]" />,
          bg: 'bg-[#EBF3FE]',
        };
      case 'FOOD':
        return {
          icon: <Utensils className="w-6 h-6 text-[#EA4335]" />,
          bg: 'bg-[#FEECEB]',
        };
      case 'SECURITY':
        return {
          icon: <ShieldCheck className="w-6 h-6 text-[#1B62CD]" />,
          bg: 'bg-[#EBF3FE]',
        };
      case 'EMERGENCY':
        return {
          icon: <BellRing className="w-6 h-6 text-[#EA4335]" />,
          bg: 'bg-[#FEECEB]',
        };
      default:
        return {
          icon: <BookOpen className="w-6 h-6 text-[#1B62CD]" />,
          bg: 'bg-[#EBF3FE]',
        };
    }
  };

  const { icon, bg } = getIconInfo();

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div
        className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 shadow-xs`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight group-hover:text-blue-700 transition-colors">
        {facility.name}
      </h3>
      <p className="text-[11px] text-slate-500 line-clamp-1">{facility.highlight}</p>
    </div>
  );
};
