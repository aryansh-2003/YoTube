import React from 'react';

const Loader = () => {
  // 1. Define the Keyframes as a string to inject via <style>
  const keyframes = `
    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes roundness {
      0% { filter: contrast(15); }
      20% { filter: contrast(3); }
      40% { filter: contrast(3); }
      60% { filter: contrast(15); }
      100% { filter: contrast(15); }
    }
    @keyframes colorize {
      0% { filter: hue-rotate(0deg); }
      20% { filter: hue-rotate(-30deg); }
      40% { filter: hue-rotate(-60deg); }
      60% { filter: hue-rotate(-90deg); }
      80% { filter: hue-rotate(-45deg); }
      100% { filter: hue-rotate(0deg); }
    }
  `;

  // 2. Define CSS Variables and Main Container Styles
  const loaderContainerStyle = {
    // CSS Variables defined locally
    '--color-one': '#ffbf48',
    '--color-two': '#be4a1d',
    '--color-three': '#ffbf4780',
    '--color-four': '#bf4a1d80',
    '--color-five': '#ffbf4740',
    '--time-animation': '2s',
    '--size': '1',
    
    // .loader styles
    position: 'relative',
    width: '100px', // Explicit width needed to contain the absolute children correctly
    height: '100px',
    borderRadius: '50%',
    transform: 'scale(var(--size))',
    boxShadow: '0 0 25px 0 var(--color-three), 0 20px 50px 0 var(--color-four)',
    animation: 'colorize calc(var(--time-animation) * 3) ease-in-out infinite',
  };

  // 3. Replicate .loader::before
  const loaderBeforeStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    borderTop: 'solid 1px var(--color-one)',
    borderBottom: 'solid 1px var(--color-two)',
    background: 'linear-gradient(180deg, var(--color-five), var(--color-four))',
    boxShadow: 'inset 0 10px 10px 0 var(--color-three), inset 0 -10px 10px 0 var(--color-four)',
    zIndex: 0, // Ensure it sits behind if necessary, though DOM order handles this mostly
  };

  // 4. Styles for the SVG and Mask
  const svgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2, // svg sits on top logically to define the mask
    pointerEvents: 'none', // Good practice so it doesn't block clicks
  };

  const maskIdStyle = {
    filter: 'contrast(15)',
    animation: 'roundness calc(var(--time-animation) / 2) linear infinite',
  };

  // 5. Polygon Styles (Mapping nth-child logic)
  // Shared style for all polygons
  const basePolyStyle = {
    filter: 'blur(7px)',
  };

  // Individual styles corresponding to nth-child(1) through nth-child(7)
  const poly1 = { ...basePolyStyle, transformOrigin: '75% 25%', transform: 'rotate(90deg)' };
  const poly2 = { ...basePolyStyle, transformOrigin: '50% 50%', animation: 'rotation var(--time-animation) linear infinite reverse' };
  const poly3 = { ...basePolyStyle, transformOrigin: '50% 60%', animation: 'rotation var(--time-animation) linear infinite', animationDelay: 'calc(var(--time-animation) / -3)' };
  const poly4 = { ...basePolyStyle, transformOrigin: '40% 40%', animation: 'rotation var(--time-animation) linear infinite reverse' };
  const poly5 = { ...basePolyStyle, transformOrigin: '40% 40%', animation: 'rotation var(--time-animation) linear infinite reverse', animationDelay: 'calc(var(--time-animation) / -2)' };
  const poly6 = { ...basePolyStyle, transformOrigin: '60% 40%', animation: 'rotation var(--time-animation) linear infinite' };
  const poly7 = { ...basePolyStyle, transformOrigin: '60% 40%', animation: 'rotation var(--time-animation) linear infinite', animationDelay: 'calc(var(--time-animation) / -1.5)' };

  // 6. The Box Style
  const boxStyle = {
    width: '100px',
    height: '100px',
    background: 'linear-gradient(180deg, var(--color-one) 30%, var(--color-two) 70%)',
    mask: 'url(#clipping)',
    WebkitMask: 'url(#clipping)', // For Safari/Chrome compatibility
    position: 'relative',
    zIndex: 1,
  };

  return (
    <div className="loader" style={loaderContainerStyle}>
      {/* Inject Keyframes */}
      <style>{keyframes}</style>

      {/* Replicated ::before element */}
      <div style={loaderBeforeStyle}></div>

      <svg width="100" height="100" viewBox="0 0 100 100" style={svgStyle}>
        <defs>
          <mask id="clipping" style={maskIdStyle}>
            <polygon points="0,0 100,0 100,100 0,100" fill="black" style={poly1}></polygon>
            <polygon points="25,25 75,25 50,75" fill="white" style={poly2}></polygon>
            <polygon points="50,25 75,75 25,75" fill="white" style={poly3}></polygon>
            <polygon points="35,35 65,35 50,65" fill="white" style={poly4}></polygon>
            <polygon points="35,35 65,35 50,65" fill="white" style={poly5}></polygon>
            <polygon points="35,35 65,35 50,65" fill="white" style={poly6}></polygon>
            <polygon points="35,35 65,35 50,65" fill="white" style={poly7}></polygon>
          </mask>
        </defs>
      </svg>
      
      <div className="box" style={boxStyle}></div>
    </div>
  );
};

export default Loader;