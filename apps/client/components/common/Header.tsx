import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  return (
    <nav
      className="navbar bg-base-100 bg-accent-content/5 mt-2 mb-4 rounded-md"
      aria-label="Main navigation"
    >
      <Link
        href="/purchase-orders"
        className="btn btn-ghost normal-case text-xl"
        tabIndex={0}
        aria-label="Go to Purchase Orders"
      >
        Purchase Orders
      </Link>
      <Link
        href="/parent-items"
        className="btn btn-ghost normal-case text-xl"
        tabIndex={0}
        aria-label="Go to Item Catalog"
      >
        Item Catalog
      </Link>
    </nav>
  );
};

export default Header;
