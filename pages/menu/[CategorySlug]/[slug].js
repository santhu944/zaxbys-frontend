import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import { toast } from 'react-toastify';

function MenuItemPage() {
  const [menuItem, setMenuItem] = useState(null);
  const [error, setError] = useState(null); 
  const router = useRouter();
  const { slug, CategorySlug } = router.query;

  const handleOrderClick = () => {
    toast.error('Error: Unable to place order. Please try again later. Functionality will be done in Next Version. Thank You');
  };

  useEffect(() => {
    async function fetchMenuItem() {
      try {
        if (!CategorySlug || !slug) {
          setError('Invalid URL parameters. Functionality will be done in Next Version. Thank You');
          return;
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/${CategorySlug}?filters[$slug][$eq]=/${slug}`;
        const token = process.env.NEXT_PUBLIC_TOKEN;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch menu item data');
        }

        const data = await response.json();
        if (data.data.length > 0) {
          setMenuItem(data.data[0]);
        } else {
          setError('No menu item found');
        }
      } catch (error) {
        setError('Error fetching menu item data');
        console.error('Error fetching menu item data:', error);
      }
    }

    fetchMenuItem();
  }, [slug, CategorySlug]);

  return (
    <div className={styles['centered-container']}>
      {error ? (
        <p>{error}</p>
      ) : menuItem ? (
        <div className={styles.card}>
          <h2>{menuItem.attributes.Title}</h2>
          <p>Price: {menuItem.attributes.Price}</p>
          <p>Calories: {menuItem.attributes.Calories}</p>
          <button className={styles['order-button']} onClick={handleOrderClick}>
            Order
          </button>
        </div>
      ) : (
        <p>Loading menu item...</p>
      )}
    </div>
  );
}

export default MenuItemPage;
