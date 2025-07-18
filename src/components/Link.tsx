import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, children, ...props }) => {
  const isExternalLink = to.startsWith('http');
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isExternalLink && to.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(to);
      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth',
        });
      }
    }
    
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <a 
      href={to} 
      {...props} 
      onClick={handleClick}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
};