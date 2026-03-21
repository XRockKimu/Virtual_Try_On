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
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold text-gray-800">
              CATURA
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-6 py-2 font-medium transition-colors duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <span>{link.name}</span>
                
                {/* Active underline */}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
