"use client";

export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
  const colors = [
    { name: 'Pink', value: '#F11D75' },
    { name: 'Teal', value: '#16C7A8' },
    { name: 'Blue', value: '#3A8DFF' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Lime', value: '#45E06F' },
    { name: 'Amber', value: '#FFB020' },
    { name: 'Red', value: '#FF5C5C' },
    { name: 'Cyan', value: '#22D3EE' },
  ];
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Categories
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Organize your time
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ background: 'var(--cta-pink)' }}
          >
            Add Category
          </button>
        </div>
        
        <div 
          className="rounded-lg p-8"
          style={{ background: 'var(--bg-surface)' }}
        >
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            Pick colors that read well on dark. You can change anytime.
          </p>
          
          {/* Color Palette Display */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {colors.map((color) => (
              <div key={color.name} className="text-center">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2 cursor-pointer hover:scale-110 transition-transform"
                  style={{ background: color.value }}
                />
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
