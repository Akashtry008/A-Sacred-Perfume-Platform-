import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Universal Link component for VedaPavitra Vite platform.
 * Fully replaces next/link by accepting both `href` and `to` attributes
 * and delegating to React Router's Link.
 */
export default function Link({ href, to, children, ...props }) {
  const destination = to || href || '/';
  
  // If destination is an external URL, render standard <a>
  if (typeof destination === 'string' && (destination.startsWith('http://') || destination.startsWith('https://') || destination.startsWith('mailto:') || destination.startsWith('tel:'))) {
    return (
      <a href={destination} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={destination} {...props}>
      {children}
    </RouterLink>
  );
}
