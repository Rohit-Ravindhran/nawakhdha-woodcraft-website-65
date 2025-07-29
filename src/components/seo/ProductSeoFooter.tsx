import React from 'react';

interface ProductSeoFooterProps {
  productSlug?: string;
}

const SEO_CONTENT_MAP = {
  'outdoor-swings-bahrain': {
    title: 'Applications & Searches for Outdoor Wooden Swings in Bahrain',
    keywords: [
      ['Outdoor Wooden Swings Bahrain', 'Custom Garden Swings', 'Porch Swings Manufacturer Bahrain', 'Balcony Swings Bahrain', 'Wooden Jhoola for Home Bahrain'],
      ['Swing Sets for Patio', 'Weather-resistant Wooden Swings', 'Outdoor Swing Chairs Bahrain', 'Teak Wood Swings Bahrain', 'Majlis Wooden Swings']
    ],
    tags: ['outdoor swings', 'garden swings', 'teak wood swings', 'patio swings', 'custom swings', 'weatherproof swings', 'balcony jhoola']
  },
  'study-tables-bahrain': {
    title: 'Applications & Searches for Study Tables in Bahrain',
    keywords: [
      ['Custom Study Tables Bahrain', 'Wooden Study Desks', 'Study Tables with Storage Bahrain', 'Office Study Desk Bahrain', 'Ergonomic Study Table Bahrain'],
      ['Wooden Work Tables Bahrain', 'Student Desks Bahrain', 'Kids Study Tables Bahrain', 'Minimalist Study Desks Bahrain', 'Adjustable Study Tables Bahrain']
    ],
    tags: ['study tables', 'custom study desks', 'workstations', 'wooden study furniture', 'ergonomic desks', 'study desks with drawers']
  },
  'tv-cabinets-bahrain': {
    title: 'Applications & Searches for TV Cabinets in Bahrain',
    keywords: [
      ['Wooden TV Cabinets Bahrain', 'Custom TV Units Bahrain', 'Wall Mounted TV Consoles', 'Living Room Entertainment Units Bahrain', 'Wooden Media Units Bahrain'],
      ['TV Stands with Storage Bahrain', 'Modern TV Units Bahrain', 'Classic TV Console Tables', 'Floating TV Cabinets Bahrain', 'Solid Wood TV Units']
    ],
    tags: ['TV cabinets', 'media units', 'entertainment consoles', 'wooden TV stands', 'TV wall units', 'floating TV cabinets']
  },
  'walk-in-closets-bahrain': {
    title: 'Applications & Searches for Walk-in Closets in Bahrain',
    keywords: [
      ['Custom Walk-in Closets Bahrain', 'Modular Closet Systems Bahrain', 'Luxury Wardrobes Bahrain', 'Wooden Closet Organizers', 'Wardrobe Rooms Bahrain'],
      ['Dressing Room Closets Bahrain', 'Closet Shelving Solutions', 'Bespoke Wardrobe Designs Bahrain', 'Closet Storage Solutions Bahrain', 'Sliding Door Closets']
    ],
    tags: ['walk-in closets', 'wardrobe systems', 'luxury closets', 'modular wardrobes', 'closet organizers', 'dressing room wardrobes']
  },
  'wall-cladding-bahrain': {
    title: 'Applications & Searches for Wall Cladding in Bahrain',
    keywords: [
      ['Interior Wall Cladding Bahrain', 'Decorative Wooden Wall Panels', 'Modern Wall Cladding Bahrain', 'Wall Paneling Contractors Bahrain', 'Acoustic Wall Panels Bahrain'],
      ['Veneer Wall Finishes Bahrain', 'Customized Wall Coverings Bahrain', 'Textured Wall Panels Bahrain', '3D Wooden Wall Cladding Bahrain', 'Exterior Wooden Cladding Bahrain']
    ],
    tags: ['wall cladding', 'wooden wall panels', 'decorative wall coverings', 'acoustic panels', 'interior wall finishes']
  },
  'wardrobes': {
    title: 'Applications & Searches for Wardrobes in Bahrain',
    keywords: [
      ['Custom Wardrobes Bahrain', 'Built-in Wardrobe Solutions Bahrain', 'Sliding Door Wardrobes Bahrain', 'Modular Wardrobe Systems Bahrain', 'Luxury Wooden Wardrobes Bahrain'],
      ['Walk-in Wardrobe Units Bahrain', 'Space-saving Wardrobe Designs', 'Mirror-finished Wardrobes Bahrain', 'Customized Bedroom Wardrobes', 'Fitted Wardrobe Furniture Bahrain']
    ],
    tags: ['custom wardrobes', 'built-in wardrobes', 'modular wardrobe systems', 'luxury wardrobes', 'sliding door wardrobes', 'fitted wardrobes']
  },
  'western-doors': {
    title: 'Applications & Searches for Western Design Doors in Bahrain',
    keywords: [
      ['Western Style Wooden Doors Bahrain', 'Rustic Wooden Doors Bahrain', 'Custom Crafted Western Doors', 'Hand-Carved Doors Bahrain', 'Luxury Wooden Doors Bahrain'],
      ['Solid Wood Western Doors', 'Interior Western Design Doors Bahrain', 'Exterior Western Doors Bahrain', 'Farmhouse Style Doors Bahrain', 'Custom Entry Doors Bahrain']
    ],
    tags: ['western design doors', 'rustic wooden doors', 'handcrafted doors', 'solid wood doors', 'luxury wooden doors', 'farmhouse doors']
  },
  'showcases': {
    title: 'Applications & Searches for Showcases & Mealsafes in Bahrain',
    keywords: [
      ['Wooden Mealsafe Cabinets Bahrain', 'Kitchen Showcases Bahrain', 'Custom Display Cabinets Bahrain', 'Glass Door Kitchen Cabinets Bahrain', 'Traditional Bahraini Mealsafe'],
      ['Wooden Showcase Furniture Bahrain', 'Dining Room Showcases Bahrain', 'Wall Mounted Display Units', 'Custom Built Mealsafe Furniture', 'Modern Kitchen Showcases Bahrain']
    ],
    tags: ['mealsafe', 'kitchen showcases', 'display cabinets', 'wooden showcases', 'traditional mealsafe', 'glass door cabinets']
  },
  'book-shelves': {
    title: 'Applications & Searches for Book Shelves in Bahrain',
    keywords: [
      ['Custom Book Shelves Bahrain', 'Wooden Wall-Mounted Bookshelves', 'Bookshelves with Cabinets Bahrain', 'Open Shelf Library Units Bahrain', 'Home Office Bookshelves Bahrain'],
      ['Modular Bookshelf Designs', 'Bookshelves with Glass Doors Bahrain', 'Floor-to-Ceiling Bookcases', 'Rustic Wooden Book Racks', 'Luxury Bookshelves Bahrain']
    ],
    tags: ['custom bookshelves', 'wooden bookcases', 'wall-mounted shelves', 'library units', 'home office shelves', 'luxury bookshelves']
  },
  'kitchen-cabinets': {
    title: 'Applications & Searches for Kitchen Cabinets in Bahrain',
    keywords: [
      ['Custom Kitchen Cabinets Bahrain', 'Modular Kitchen Units Bahrain', 'Wooden Kitchen Cupboards', 'Modern Kitchen Cabinet Designs Bahrain', 'Corian Kitchen Countertops Bahrain'],
      ['Kitchen Storage Solutions Bahrain', 'Cabinets with Glass Doors Bahrain', 'Pantry Cabinets Bahrain', 'Laminated Kitchen Cabinets', 'Custom Made Kitchen Furniture']
    ],
    tags: ['kitchen cabinets', 'modular kitchens', 'Corian kitchen countertops', 'modern kitchen units', 'custom kitchen furniture', 'storage cabinets']
  },
  'modern-design-doors': {
    title: 'Applications & Searches for Modern Design Doors in Bahrain',
    keywords: [
      ['Modern Wooden Doors Bahrain', 'Minimalist Interior Doors Bahrain', 'Contemporary Door Designs Bahrain', 'Custom Flush Doors Bahrain', 'Modern Stile & Rail Doors'],
      ['Designer Wooden Doors Bahrain', 'Luxury Interior Doors Bahrain', 'Custom Carved Doors Bahrain', 'Solid Core Modern Doors', 'Custom Entrance Doors Bahrain']
    ],
    tags: ['modern wooden doors', 'flush doors', 'designer interior doors', 'contemporary doors', 'stile and rail doors', 'luxury wooden doors']
  },
  'parquet-flooring': {
    title: 'Applications & Searches for Parquet Flooring in Bahrain',
    keywords: [
      ['Parquet Wood Flooring Bahrain', 'Engineered Parquet Flooring Bahrain', 'Herringbone Parquet Patterns', 'Custom Wooden Flooring Bahrain', 'Laminate Parquet Floors Bahrain'],
      ['Luxury Parquet Flooring Bahrain', 'Solid Wood Parquet Tiles', 'Classic Parquet Designs Bahrain', 'Chevron Parquet Flooring Bahrain', 'Hardwood Parquet Bahrain']
    ],
    tags: ['parquet flooring', 'wooden flooring', 'herringbone parquet', 'engineered flooring', 'laminate parquet', 'solid wood parquet']
  },
  'patio-furniture': {
    title: 'Applications & Searches for Patio Furniture in Bahrain',
    keywords: [
      ['Custom Patio Furniture Bahrain', 'Outdoor Wooden Furniture Bahrain', 'Weatherproof Patio Sets Bahrain', 'Luxury Garden Furniture Bahrain', 'Wooden Outdoor Sofas Bahrain'],
      ['Teak Patio Chairs Bahrain', 'Outdoor Dining Furniture Bahrain', 'Custom Built Pergolas Bahrain', 'Patio Swing Sets Bahrain', 'Outdoor Loungers Bahrain']
    ],
    tags: ['patio furniture', 'garden furniture', 'outdoor wooden sofas', 'teak patio chairs', 'weatherproof patio sets', 'pergolas bahrain']
  },
  'teapoy': {
    title: 'Applications & Searches for Wooden Teapoys in Bahrain',
    keywords: [
      ['Custom Wooden Teapoys Bahrain', 'Living Room Teapoy Tables Bahrain', 'Modern Center Tables Bahrain', 'Traditional Wooden Teapoys Bahrain', 'Teapoy Coffee Tables Bahrain'],
      ['Glass Top Teapoys Bahrain', 'Designer Wooden Teapoys Bahrain', 'Compact Wooden Tables Bahrain', 'Luxury Living Room Teapoys', 'Carved Wooden Teapoys Bahrain']
    ],
    tags: ['wooden teapoys', 'center tables', 'living room teapoys', 'modern teapoy designs', 'glass top teapoys', 'hand-carved teapoys']
  },
  'wall-partitions': {
    title: 'Applications & Searches for Wall Partitions in Bahrain',
    keywords: [
      ['Custom Wall Partitions Bahrain', 'Wooden Room Dividers Bahrain', 'Decorative Partition Panels Bahrain', 'Office Space Partitioning Bahrain', 'Gypsum Wall Partitions Bahrain'],
      ['Sliding Room Dividers Bahrain', 'Glass Partition Walls Bahrain', 'Laser Cut Partition Panels', 'Open Space Dividers Bahrain', 'Foldable Wall Partitions Bahrain']
    ],
    tags: ['wall partitions', 'wooden room dividers', 'office partitions', 'gypsum partitions', 'decorative panels', 'glass partition walls']
  }
};

export function ProductSeoFooter({ productSlug }: ProductSeoFooterProps) {
  if (!productSlug || !SEO_CONTENT_MAP[productSlug as keyof typeof SEO_CONTENT_MAP]) {
    return null;
  }

  const seoContent = SEO_CONTENT_MAP[productSlug as keyof typeof SEO_CONTENT_MAP];

  return (
    <section className="seo-footer-hidden">
      <h2>{seoContent.title}</h2>
      <div className="keyword-columns">
        {seoContent.keywords.map((column, columnIndex) => (
          <ul key={columnIndex}>
            {column.map((keyword, keywordIndex) => (
              <li key={keywordIndex}>{keyword}</li>
            ))}
          </ul>
        ))}
      </div>
      <h3>Tags</h3>
      <div className="seo-tags">
        {seoContent.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
    </section>
  );
}