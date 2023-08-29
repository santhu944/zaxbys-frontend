import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  const token = process.env.NEXT_PUBLIC_TOKEN;
  const apiUrl = process.env.NEXT_PUBLIC_HOMEPAGE_MENU; 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.data);
        setError(null); // Clear any previous errors
      } catch (error) {
        setError('Error fetching categories'); // Set error message
        console.error('Error fetching categories:', error);
      }
    };

    if (token) {
      fetchCategories();
    } else {
      setError('Token is missing');
    }
  }, [token]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNextCategory = () => {
    setStartIndex((prevIndex) => prevIndex + 4);
  };

  const handlePrevCategory = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 4, 0));
  };

  const displayedCategories = categories.slice(startIndex, startIndex + 4);

  return (
  
   
    <nav className={styles.navbar}>
      <div className={`${styles.menuIcon} ${isMenuOpen ? styles.open : ''}`} onClick={toggleMenu}>
        <div className={styles.icon}></div>
        <div className={styles.icon}></div>
        <div className={styles.icon}></div>
      </div>
      <ul className={`${styles.menu} ${isMenuOpen ? styles.open : ''}`}>
        {error ? (
          <li>Error: {error}</li>
        ) : (
          displayedCategories.map((category) => (
            <li key={category.id}>
              <Link href={`/menu#Category-${category.attributes.MenuCategoryName}`}>
                {category.attributes.MenuCategoryName}
                
              </Link>
            </li>
            
          ))

        )}
      </ul>
      <div className={styles.paginationArrows}>
        {startIndex > 0 && (
          <span className={styles.arrow} onClick={handlePrevCategory}>
            &#8592;
          </span>
        )}
        {startIndex + 4 < categories.length && (
          <span className={styles.arrow} onClick={handleNextCategory}>
            &#8594;
          </span>
        )}
      </div>
      
    </nav>
  );
};

export default Navbar;
