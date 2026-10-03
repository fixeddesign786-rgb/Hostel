import React, { useState } from 'react';
import { GalleryItem } from '../types.ts';
import { Image, X, Maximize2, Filter } from 'lucide-react';

interface GalleryProps {
  gallery: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['ALL', 'Exterior', 'Rooms', 'Food', 'Study Area', 'Common Area', 'Facilities', 'Location'];

  const filteredItems =
    selectedCategory === 'ALL'
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-200">
          <Image className="w-3.5 h-3.5 text-emerald-600" />
          <span>REAL HOSTEL PHOTOGRAPHY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F284B] tracking-tight">
          Campus &amp; Facilities Gallery
        </h1>
        <p className="text-sm text-slate-600">
          Explore real photographs of our rooms, study lounges, dining mess, building exterior, and
          facilities.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              selectedCategory === cat
                ? 'bg-[#0F284B] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Photos' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/30">
                {item.category}
              </span>
              <h3 className="text-sm font-bold mt-1.5">{item.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-1">{item.description}</p>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-2 rounded-full text-white">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-16/9 bg-black">
              <img
                src={activeItem.image_url}
                alt={activeItem.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 text-white bg-[#0B192C]">
              <span className="text-xs font-bold text-emerald-400">{activeItem.category}</span>
              <h3 className="text-lg font-bold mt-1">{activeItem.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{activeItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
