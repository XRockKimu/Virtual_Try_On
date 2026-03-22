import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/virtual-tryon', name: 'Virtual Try-On' },
    { path: '/size-suggestion', name: 'Size Suggestion' },
    { path: '/body-measurements', name: 'Body Measurements' }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-900">
              CATURA
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center rounded-lg ${
                  location.pathname === link.path 
                    ? 'text-brand-700 bg-brand-50' 
                    : 'text-gray-500 hover:text-brand-600 hover:bg-gray-50'
                }`}
              >
                <span>{link.name}</span>
                
                {/* Active indicator dot */}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-600" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
