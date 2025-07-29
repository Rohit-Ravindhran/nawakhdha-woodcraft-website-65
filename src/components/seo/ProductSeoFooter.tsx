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