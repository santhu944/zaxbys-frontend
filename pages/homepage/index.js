import React, { useState, useEffect } from 'react';
import styles from './homepage.module.css';
import Image from 'next/image';
import Video from '../Video/index';

const MenuCards = () => {
  const [menuData, setMenuData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_TOKEN; // Replace with your actual authentication token
    const apiUrl = process.env.NEXT_PUBLIC_HOMEPAGE_MENU; 
    fetch(`${apiUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
        
      })
      .then((data)=>{
        console.log('Menu Data:', data.data);
         setMenuData(data.data)
      })
      .catch((error) => setError(error.message));
  }, []);

  if (error) {
    return <div className="error-message">An error occurred: {error}</div>;
  }

  return (
    <div>
        <Video/>
      <div className={styles.cardContainerCenter}>
        {menuData.map((menuCategory) => (
          <div className={styles.card} key={menuCategory.id}>
            <a
              href={`/menu#Category-${menuCategory.attributes.MenuCategoryName}`} // Replace with the actual link URL
              className={styles.link}
            >
             <img
                src={menuCategory.attributes.MenuCategoryImage.data.attributes.url} // Use the URL with double quotes
                alt={`${menuCategory.attributes.MenuCategoryName} Image`}
                width={500}
                height={356}
              />

              <h2 className={styles.smallFont}>
                {menuCategory.attributes.MenuCategoryName}
              </h2>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCards;
